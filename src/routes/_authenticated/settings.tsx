import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/app/data-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — LogiTrack" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState<string>((user?.user_metadata?.full_name as string) ?? "");
  const [pw, setPw] = useState("");
  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" sub={user?.email ?? ""} />
      <div className="space-y-6 rounded-xl border bg-card p-5 shadow-card">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full name</label>
          <div className="flex gap-2"><Input value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={async () => { const { error } = await supabase.auth.updateUser({ data: { full_name: name } }); error ? toast.error(error.message) : toast.success("Saved"); }}>Save</Button></div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">New password</label>
          <div className="flex gap-2"><Input type="password" minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} />
            <Button onClick={async () => { const { error } = await supabase.auth.updateUser({ password: pw }); if (error) toast.error(error.message); else { toast.success("Password updated"); setPw(""); } }}>Update</Button></div>
        </div>
      </div>
    </div>
  );
}
