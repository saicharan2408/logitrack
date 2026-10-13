import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/warehouses")({
  head: () => ({ meta: [{ title: "Warehouses — LogiTrack" }] }),
  component: () => (
    <DataPage table="warehouses" title="Warehouses" sub="Capacity and flow across every hub."
      makeId={() => `WH-${Date.now().toString().slice(-4)}`}
      above={(rows) => (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((w) => (
            <div key={String(w.id)} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="font-semibold">{String(w.name)}</div>
              <div className="text-xs text-muted-foreground">{String(w.city)}</div>
              <div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${w.capacity_used}%` }} /></div>
              <div className="mt-1 text-xs text-muted-foreground">{String(w.capacity_used)}% used</div>
            </div>
          ))}
        </div>
      )}
      columns={[{ key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "capacity_used", label: "Used", format: (v) => `${v}%` }, { key: "incoming", label: "Incoming" }, { key: "outgoing", label: "Outgoing" }, { key: "skus", label: "SKUs" }]}
      fields={[{ key: "name", label: "Name", required: true }, { key: "city", label: "City", required: true }, { key: "capacity_used", label: "Capacity used %", type: "number" }, { key: "skus", label: "SKUs", type: "number" }]}
    />
  ),
});
