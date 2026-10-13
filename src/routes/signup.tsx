import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/app/auth-form";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — LogiTrack" }, { name: "description", content: "Start managing your fleet with LogiTrack." }, { property: "og:title", content: "Create account — LogiTrack" }, { property: "og:description", content: "Start with LogiTrack." }] }),
  component: () => <AuthForm mode="signup" />,
});
