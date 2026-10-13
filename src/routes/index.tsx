import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, MapPin, Truck, BarChart3, Warehouse, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LogiTrack — Real-time logistics & fleet management" },
      { name: "description", content: "Run shipments, fleet, drivers and warehouses from one live dashboard, with an AI copilot that knows your data." },
      { property: "og:title", content: "LogiTrack — Real-time logistics & fleet management" },
      { property: "og:description", content: "Live shipments, fleet and warehouses with an AI copilot." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: MapPin, title: "Live tracking", d: "See every vehicle and shipment move across India in real time." },
  { icon: Truck, title: "Fleet & drivers", d: "Fuel, maintenance, safety scores and trips in one place." },
  { icon: Warehouse, title: "Warehouses", d: "Capacity, inventory and stock alerts across every hub." },
  { icon: BarChart3, title: "Analytics", d: "Revenue, efficiency and performance on live dashboards." },
  { icon: Bot, title: "AI Assistant", d: "Ask anything — it reads your live data and can act on it." },
  { icon: ShieldCheck, title: "Secure by default", d: "Private accounts, per-user chat history and access control." },
];

const PLANS = [
  { name: "Starter", price: "₹4,999", f: ["Up to 10 vehicles", "Live tracking", "Email support"] },
  { name: "Growth", price: "₹14,999", f: ["Up to 50 vehicles", "AI Assistant", "Advanced analytics", "Priority support"], popular: true },
  { name: "Enterprise", price: "Custom", f: ["Unlimited fleet", "Dedicated manager", "Custom integrations"] },
];

function Landing() {
  return (
    <div>
      <header className="bg-hero text-sidebar-accent-foreground">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 font-display text-lg font-bold"><img src={logo} alt="" className="size-8" /> LogiTrack</div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" className="text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Link to="/login">Sign in</Link></Button>
            <Button asChild className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"><Link to="/signup">Get started</Link></Button>
          </div>
        </nav>
        <div className="mx-auto max-w-6xl px-6 pb-28 pt-16 md:pt-24">
          <span className="rounded-full border border-sidebar-border px-3 py-1 text-xs text-sidebar-foreground">Built for Indian logistics teams</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Every truck, every parcel, <span className="text-sidebar-primary">live.</span></h1>
          <p className="mt-5 max-w-xl text-lg text-sidebar-foreground">Manage shipments, fleet, drivers and warehouses from one dashboard — with an AI copilot that answers anything in seconds.</p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"><Link to="/signup">Start free <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-sidebar-border bg-transparent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Link to="/login">Sign in</Link></Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">Everything your operation needs</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-card">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-bold">Simple plans that scale with you</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-xl border bg-card p-6 shadow-card ${p.popular ? "border-primary ring-2 ring-primary" : ""}`}>
              <div className="font-semibold">{p.name}</div>
              <div className="mt-2 font-display text-3xl font-bold">{p.price}<span className="text-sm font-normal text-muted-foreground">{p.price !== "Custom" && " /month"}</span></div>
              <ul className="mt-5 space-y-2 text-sm">{p.f.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 text-success" />{f}</li>)}</ul>
              <Button asChild className="mt-6 w-full" variant={p.popular ? "default" : "outline"}><Link to="/signup">Choose {p.name}</Link></Button>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 LogiTrack</footer>
    </div>
  );
}
