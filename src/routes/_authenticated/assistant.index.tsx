import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/assistant/")({
  head: () => ({ meta: [{ title: "AI Assistant — LogiTrack" }] }),
  component: AssistantHome,
});

function AssistantHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const started = useRef(false);
  useEffect(() => {
    if (!user || started.current) return;
    started.current = true;
    (async () => {
      const { data } = await supabase.from("chat_threads").select("id").order("updated_at", { ascending: false }).limit(1);
      let id = data?.[0]?.id;
      if (!id) {
        const { data: t } = await supabase.from("chat_threads").insert({ user_id: user.id }).select("id").single();
        id = t?.id;
      }
      if (id) navigate({ to: "/assistant/$threadId", params: { threadId: id }, replace: true });
    })();
  }, [user, navigate]);
  return <div className="grid h-screen place-items-center text-muted-foreground">Opening assistant…</div>;
}
