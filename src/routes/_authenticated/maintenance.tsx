import { createFileRoute } from "@tanstack/react-router";
import { DataPage, inr } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — LogiTrack" }] }),
  component: () => (
    <DataPage table="maintenance" title="Maintenance" sub="Service schedule for every vehicle."
      statusOptions={["Upcoming", "Overdue", "Completed"]}
      columns={[{ key: "vehicle", label: "Vehicle" }, { key: "model", label: "Model" }, { key: "type", label: "Service" }, { key: "due", label: "Due" }, { key: "status", label: "Status" }, { key: "cost", label: "Cost", format: inr }]}
      fields={[{ key: "vehicle", label: "Vehicle", required: true }, { key: "model", label: "Model" }, { key: "type", label: "Service", type: "select", options: ["Oil Change", "Brake Service", "Tyre Rotation", "General Inspection", "AC Service", "Engine Tune-up"], required: true }, { key: "due", label: "Due date", type: "date", required: true }, { key: "cost", label: "Cost (₹)", type: "number" }]}
    />
  ),
});
