import { createFileRoute } from "@tanstack/react-router";
import { DataPage, StatCard, inr } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/fuel")({
  head: () => ({ meta: [{ title: "Fuel — LogiTrack" }] }),
  component: () => (
    <DataPage table="fuel_logs" title="Fuel logs" sub="Every refill, every rupee."
      above={(rows) => (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total spend" value={inr(rows.reduce((a, r) => a + Number(r.cost), 0))} />
          <StatCard label="Litres" value={rows.reduce((a, r) => a + Number(r.litres), 0).toFixed(0)} />
          <StatCard label="Refills" value={rows.length} />
        </div>
      )}
      columns={[{ key: "log_date", label: "Date" }, { key: "vehicle", label: "Vehicle" }, { key: "litres", label: "Litres" }, { key: "cost", label: "Cost", format: inr }, { key: "station", label: "Station" }]}
      fields={[{ key: "vehicle", label: "Vehicle", required: true }, { key: "litres", label: "Litres", type: "number", required: true }, { key: "cost", label: "Cost (₹)", type: "number", required: true }, { key: "station", label: "Station" }, { key: "log_date", label: "Date", type: "date" }]}
    />
  ),
});
