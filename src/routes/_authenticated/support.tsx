import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTable } from "@/hooks/use-table";
import { PageHeader } from "@/components/app/data-page";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Support — LogiTrack" }] }),
  component: Support,
});

function Support() {
  const { user } = useAuth();
  const { data = [] } = useTable("support_tickets");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject, message });
    if (error) return toast.error(error.message);
    toast.success("Ticket submitted");
    setSubject(""); setMessage("");
  };
  return (
    <div>
      <PageHeader title="Support" sub="Raise a ticket and track it here." />
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={send} className="space-y-3 rounded-xl border bg-card p-5 shadow-card">
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <Textarea placeholder="Describe the issue" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
          <Button>Submit ticket</Button>
        </form>
        <div className="space-y-2">
          {data.length === 0 && <p className="text-muted-foreground">No tickets yet.</p>}
          {data.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex justify-between"><span className="font-medium">{t.subject}</span><StatusBadge value={t.status} /></div>
              <p className="mt-1 text-sm text-muted-foreground">{t.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
