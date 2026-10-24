import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "./run-id";

const MODEL = "openai/gpt-6-astra";
const TABLES = ["shipments", "vehicles", "drivers", "warehouses", "inventory", "maintenance", "fuel_logs", "invoices"] as const;

function json(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
}

function userClient(token: string) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const INSTRUCTIONS = `You are LogiTrack Copilot, the AI assistant inside LogiTrack, a logistics and fleet management platform for an Indian company (prices in ₹ INR).
You answer ANY question the user asks — logistics, business, general knowledge, coding, writing, math, anything — helpfully and accurately.
When a question concerns the company's shipments, vehicles, drivers, warehouses, inventory, maintenance, fuel or invoices, ALWAYS call the query_data tool first to read live data rather than guessing. You may also create shipments and update shipment or vehicle statuses with the provided tools when the user asks.
Today's date is ${new Date().toISOString().slice(0, 10)}. Use markdown (tables, lists) for clear answers. Be concise.`;

export async function handleChat(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json(401, "Please sign in to use the assistant.");
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return json(500, "AI is not configured.");

  const sb = userClient(token);
  const { data: auth, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !auth.user) return json(401, "Your session has expired. Please sign in again.");
  const userId = auth.user.id;

  const body = (await request.json()) as { messages?: UIMessage[]; threadId?: string };
  const messages = body.messages ?? [];
  const threadId = body.threadId;
  if (!threadId || messages.length === 0) return json(400, "Missing conversation.");

  const { data: thread } = await sb.from("chat_threads").select("id,title").eq("id", threadId).maybeSingle();
  if (!thread) return json(404, "Conversation not found.");

  const last = messages[messages.length - 1]!;
  if (last.role === "user") {
    const { error } = await sb
      .from("chat_messages")
      .upsert({ thread_id: threadId, user_id: userId, sdk_id: last.id, role: "user", parts: last.parts as never }, { onConflict: "thread_id,sdk_id" });
    if (error) console.error("save user message failed", error);
    if (thread.title === "New chat") {
      const text = last.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
      await sb.from("chat_threads").update({ title: text.slice(0, 60) || "New chat" }).eq("id", threadId);
    }
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const tools = {
    query_data: tool({
      description: "Read live company data from a table. Optionally filter by one column equal/contains a value.",
      inputSchema: z.object({
        table: z.enum(TABLES),
        filter_column: z.string().nullable().describe("Column to filter on, or null"),
        filter_value: z.string().nullable().describe("Value to match (case-insensitive contains), or null"),
      }),
      execute: async ({ table, filter_column, filter_value }) => {
        let q = sb.from(table).select("*").limit(200);
        if (filter_column && filter_value) q = q.ilike(filter_column, `%${filter_value}%`);
        const { data, error } = await q;
        if (error) return { error: error.message };
        return { count: data.length, rows: data };
      },
    }),
    create_shipment: tool({
      description: "Create a new shipment.",
      inputSchema: z.object({
        customer: z.string(),
        pickup: z.string(),
        destination: z.string(),
        price: z.number(),
        weight: z.string().nullable(),
        priority: z.enum(["Standard", "Express"]),
      }),
      execute: async (input) => {
        const id = `LT-${Date.now().toString().slice(-8)}`;
        const { data, error } = await sb.from("shipments").insert({ id, ...input, weight: input.weight ?? undefined, status: "Pending", eta: "—" }).select().single();
        return error ? { error: error.message } : { created: data };
      },
    }),
    update_status: tool({
      description: "Update the status of a shipment (Pending, In Transit, Delivered, Delayed, Cancelled) or a vehicle (Available, On Trip, Maintenance, Offline).",
      inputSchema: z.object({ kind: z.enum(["shipment", "vehicle"]), id: z.string(), status: z.string() }),
      execute: async ({ kind, id, status }) => {
        const res =
          kind === "shipment"
            ? await sb.from("shipments").update({ status }).eq("id", id).select()
            : await sb.from("vehicles").update({ status }).or(`id.eq.${id},number.eq.${id}`).select();
        if (res.error) return { error: res.error.message };
        return res.data.length ? { updated: res.data } : { error: "No matching record" };
      },
    }),
  };

  const result = streamText({
    model: provider.responses(MODEL) as never,
    instructions: INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(50),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    onFinish: async ({ responseMessage }) => {
      const { error } = await sb.from("chat_messages").upsert(
        { thread_id: threadId, user_id: userId, sdk_id: responseMessage.id, role: "assistant", parts: responseMessage.parts as never },
        { onConflict: "thread_id,sdk_id" },
      );
      if (error) console.error("save assistant message failed", error);
      await sb.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
    },
    onError: (error) => {
      const e = error as { statusCode?: number; message?: string };
      if (e?.statusCode === 429) return "The assistant is busy right now. Please try again in a moment.";
      if (e?.statusCode === 402) return "AI credits have run out. Add credits in your workspace billing settings.";
      console.error(error);
      return e?.message ?? "Something went wrong.";
    },
  });
  return withLovableAiGatewayRunIdHeader(response, runIdFetch);
}
