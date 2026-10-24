import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage, type ToolUIPart } from "ai";
import logo from "@/assets/logo-mark.png";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
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

  const submit = (e: React.FormEvent | React.KeyboardEvent) => {
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

  const suggestions = ["Which shipments are delayed?", "Show vehicles due for service", "Top drivers by rating", "Unpaid invoices this month"];
  const ask = (text: string) => { if (!busy) sendMessage({ text }); };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-muted/30">
      <div className="flex items-center justify-between border-b bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="size-9 rounded-full border bg-background p-1" />
          <div>
            <h1 className="text-sm font-semibold leading-tight">LogiTrack Assistant</h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`size-2 rounded-full ${busy ? "animate-pulse bg-primary" : "bg-primary/60"}`} />
              {busy ? "Typing…" : "Online · live fleet data"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={newChat}><Plus /> New chat</Button>
      </div>
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-5 px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <img src={logo} alt="" className="size-14 rounded-2xl border bg-card p-2 shadow-sm" />
              <div>
                <h2 className="text-lg font-semibold">How can I help with operations today?</h2>
                <p className="text-sm text-muted-foreground">I can look up and update shipments, vehicles, drivers, inventory and invoices.</p>
              </div>
              <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {suggestions.map((q) => (
                  <button key={q} onClick={() => ask(q)} className="rounded-xl border bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-accent">{q}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                {isUser ? (
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">You</div>
                ) : (
                  <img src={logo} alt="" className="size-8 shrink-0 rounded-full border bg-card p-1" />
                )}
                <Message from={m.role} className="max-w-[80%]">
                  <MessageContent
                    className={isUser
                      ? "!rounded-2xl !rounded-br-sm !bg-primary !px-4 !py-2.5 !text-primary-foreground shadow-sm"
                      : "rounded-2xl rounded-bl-sm border bg-card px-4 py-2.5 shadow-sm"}
                  >
                    {m.parts.map((p, i) => {
                      if (p.type === "text") return isUser
                        ? <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                        : <MessageResponse key={i}>{p.text}</MessageResponse>;
                      if (p.type.startsWith("tool-")) {
                        const t = p as ToolUIPart;
                        return (
                          <Tool key={i} defaultOpen={false} className="mb-0">
                            <ToolHeader type={t.type} state={t.state} />
                            <ToolContent>
                              <ToolInput input={t.input} />
                              <ToolOutput output={t.output} errorText={t.errorText} />
                            </ToolContent>
                          </Tool>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              </div>
            );
          })}
          {status === "submitted" && (
            <div className="flex items-end gap-2">
              <img src={logo} alt="" className="size-8 rounded-full border bg-card p-1" />
              <div className="flex gap-1 rounded-2xl rounded-bl-sm border bg-card px-4 py-3.5">
                {[0, 150, 300].map((d) => <span key={d} className="size-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />)}
              </div>
            </div>
          )}
          {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <form onSubmit={submit} className="mx-auto w-full max-w-3xl px-4 pb-4">
        <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(e); } }}
            rows={1}
            placeholder="Message the assistant…  (Enter to send, Shift+Enter for new line)"
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          <Button type="submit" size="icon" className="shrink-0 rounded-xl" disabled={busy || !input.trim()} aria-label="Send"><Send /></Button>
        </div>
      </form>
    </div>
  );
}
