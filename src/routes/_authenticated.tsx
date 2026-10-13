import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Truck, Users, MapPin, Warehouse, Boxes, Wrench, Fuel, CreditCard, BarChart3, Bot, Bell, LifeBuoy, Settings, LogOut, Menu,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTable } from "@/hooks/use-table";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/shipments", label: "Shipments", icon: Package },
  { to: "/tracking", label: "Live Tracking", icon: MapPin },
  { to: "/fleet", label: "Fleet", icon: Truck },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/warehouses", label: "Warehouses", icon: Warehouse },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/fuel", label: "Fuel", icon: Fuel },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { data: notes = [] } = useTable("notifications");
  const unread = notes.filter((n) => n.unread).length;

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);
  useEffect(() => setOpen(false), [path]);

  if (loading || !user) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="flex min-h-screen">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 -translate-x-full bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", open && "translate-x-0")}>
        <Link to="/dashboard" className="flex items-center gap-2 px-5 py-5">
          <img src={logo} alt="" className="size-8" />
          <span className="font-display text-lg font-bold text-sidebar-accent-foreground">LogiTrack</span>
        </Link>
        <nav className="space-y-0.5 overflow-y-auto px-3 pb-24" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {NAV.map((n) => {
            const active = path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground")}>
                <n.icon className="size-4" />
                {n.label}
                {n.to === "/notifications" && unread > 0 && <span className="ml-auto rounded-full bg-destructive px-1.5 text-xs text-destructive-foreground">{unread}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-sidebar-border p-3">
          <div className="truncate px-2 text-xs">{user.email}</div>
          <button onClick={() => supabase.auth.signOut()} className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-sidebar-accent">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-5" /></button>
          <span className="font-display font-bold">LogiTrack</span>
        </header>
        <main className={cn("mx-auto max-w-7xl p-4 md:p-8", path.startsWith("/assistant") && "max-w-none p-0 md:p-0")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
