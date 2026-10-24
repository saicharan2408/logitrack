import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";

export const Route = createFileRoute("/_authenticated/assistant/$threadId")({
  head: () => ({ meta: [{ title: "AI Assistant — LogiTrack" }] }),
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    setInitial(null);
    supabase
      .from("chat_messages")
      .select("sdk_id,role,parts")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .then(({ data }) =>
        setInitial((data ?? []).map((m) => ({ id: m.sdk_id, role: m.role as UIMessage["role"], parts: m.parts as UIMessage["parts"] }))),
      );
  }, [threadId]);

  if (!initial) return <div className="grid h-full place-items-center text-muted-foreground">Loading conversation…</div>;
  return <Chat key={threadId} threadId={threadId} initial={initial} />;
}

function Chat({ threadId, initial }: { threadId: string; initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        body: { threadId },
      }),
    [threadId],
  );
  const { messages, sendMessage, status, error } = useChat({ id: threadId, messages: initial, transport });
  const busy = status === "submitted" || status === "streaming";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  const newChat = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase.from("chat_threads").insert({ user_id: u.user.id }).select("id").single();
    if (data) window.location.assign(`/assistant/${data.id}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="font-semibold">AI Assistant</h1>
        <Button variant="outline" size="sm" onClick={newChat}><Plus /> New chat</Button>
      </div>
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground">Ask about shipments, vehicles, drivers, inventory or invoices.</p>
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts.map((p, i) =>
                  p.type === "text" ? <MessageResponse key={i}>{p.text}</MessageResponse> : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <p className="text-sm text-muted-foreground">Thinking…</p>}
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <form onSubmit={submit} className="flex gap-2 border-t p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the assistant…"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <Button type="submit" disabled={busy || !input.trim()}><Send /> Send</Button>
      </form>
      <Link to="/dashboard" className="sr-only">Back</Link>
    </div>
  );
}
