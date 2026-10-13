import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/hooks/use-table";
import { PageHeader } from "@/components/app/data-page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — LogiTrack" }] }),
  component: Notifications,
});

function Notifications() {
  const { data = [] } = useTable("notifications");
  const markAll = () => supabase.from("notifications").update({ unread: false }).eq("unread", true);
  return (
    <div>
      <PageHeader title="Notifications"><Button variant="outline" onClick={markAll}><Check className="size-4" /> Mark all read</Button></PageHeader>
      <div className="space-y-2">
        {data.length === 0 && <p className="text-muted-foreground">You're all caught up.</p>}
        {data.map((n) => (
          <button key={n.id} onClick={() => supabase.from("notifications").update({ unread: false }).eq("id", n.id)} className={cn("flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left shadow-card", n.unread && "border-primary")}>
            <Bell className={cn("size-4", n.unread ? "text-primary" : "text-muted-foreground")} />
            <span className="flex-1">{n.text}</span>
            <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString("en-IN")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
