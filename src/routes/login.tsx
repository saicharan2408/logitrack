import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthForm } from "@/components/app/auth-form";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — LogiTrack" }, { name: "description", content: "Sign in to your LogiTrack account." }, { property: "og:title", content: "Sign in — LogiTrack" }, { property: "og:description", content: "Sign in to LogiTrack." }] }),
  component: Login,
});

function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate({ to: "/dashboard" }); }, [user, navigate]);
  return <AuthForm mode="login" />;
}
