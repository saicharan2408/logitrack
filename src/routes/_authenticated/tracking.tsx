import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { useTable } from "@/hooks/use-table";
import { PageHeader } from "@/components/app/data-page";
import { StatusBadge } from "@/components/app/status-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tracking")({
  head: () => ({ meta: [{ title: "Live Tracking — LogiTrack" }] }),
  component: Tracking,
});

const IndiaMap = lazy(() => import("@/components/app/india-map"));

function Tracking() {
  const { data: shipments = [] } = useTable("shipments");
  const active = shipments.filter((s) => ["In Transit", "Delayed"].includes(s.status));
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div>
      <PageHeader title="Live tracking" sub="Shipments on the road right now." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-2 shadow-card lg:col-span-2">
          <ClientOnly fallback={<div className="h-[520px] animate-pulse rounded-lg bg-muted" />}>
            <Suspense fallback={<div className="h-[520px] animate-pulse rounded-lg bg-muted" />}>
              <IndiaMap shipments={active} selected={sel} onSelect={(id) => setSel(sel === id ? null : id)} />
            </Suspense>
          </ClientOnly>
        </div>
        <div className="space-y-2">
          {active.length === 0 && <p className="text-sm text-muted-foreground">No shipments on the road.</p>}
          {active.map((s) => (
            <button key={s.id} onClick={() => setSel(sel === s.id ? null : s.id)} className={cn("w-full rounded-xl border bg-card p-4 text-left shadow-card", sel === s.id && "ring-2 ring-primary")}>
              <div className="flex justify-between"><span className="font-medium">{s.id}</span><StatusBadge value={s.status} /></div>
              <div className="mt-1 text-sm text-muted-foreground">{s.pickup} → {s.destination} · ETA {s.eta}</div>
              <div className="text-xs text-muted-foreground">{s.driver} · {s.vehicle}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
