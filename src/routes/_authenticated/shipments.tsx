import { createFileRoute } from "@tanstack/react-router";
import { DataPage, inr } from "@/components/app/data-page";

const CITIES = ["Delhi", "Mumbai", "Pune", "Hyderabad", "Vijayawada", "Visakhapatnam", "Chennai", "Bengaluru"];
export const Route = createFileRoute("/_authenticated/shipments")({
  head: () => ({ meta: [{ title: "Shipments — LogiTrack" }] }),
  component: () => (
    <DataPage table="shipments" title="Shipments" sub="Create, track and update every consignment."
      makeId={() => `LT-${Date.now().toString().slice(-8)}`}
      statusOptions={["Pending", "In Transit", "Delivered", "Delayed", "Cancelled"]}
      columns={[{ key: "id", label: "ID" }, { key: "customer", label: "Customer" }, { key: "pickup", label: "From" }, { key: "destination", label: "To" }, { key: "driver", label: "Driver" }, { key: "status", label: "Status" }, { key: "eta", label: "ETA" }, { key: "priority", label: "Priority", badge: true }, { key: "price", label: "Price", format: inr }]}
      fields={[{ key: "customer", label: "Customer", required: true }, { key: "pickup", label: "Pickup", type: "select", options: CITIES, required: true }, { key: "destination", label: "Destination", type: "select", options: CITIES, required: true }, { key: "driver", label: "Driver" }, { key: "vehicle", label: "Vehicle number" }, { key: "weight", label: "Weight" }, { key: "price", label: "Price (₹)", type: "number", required: true }, { key: "priority", label: "Priority", type: "select", options: ["Standard", "Express"] }, { key: "eta", label: "ETA" }]}
    />
  ),
});
