import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/fleet")({
  head: () => ({ meta: [{ title: "Fleet — LogiTrack" }] }),
  component: () => (
    <DataPage table="vehicles" title="Vehicles" sub="Your fleet, its fuel and its health."
      makeId={() => `VH-${Date.now().toString().slice(-5)}`}
      statusOptions={["Available", "On Trip", "Maintenance", "Offline"]}
      columns={[{ key: "number", label: "Number" }, { key: "model", label: "Model" }, { key: "type", label: "Type" }, { key: "driver", label: "Driver" }, { key: "capacity", label: "Capacity" }, { key: "fuel", label: "Fuel", format: (v) => `${v}%` }, { key: "location", label: "Location" }, { key: "status", label: "Status" }, { key: "odometer", label: "Odometer", format: (v) => `${Number(v).toLocaleString("en-IN")} km` }]}
      fields={[{ key: "number", label: "Registration", required: true }, { key: "model", label: "Model", required: true }, { key: "type", label: "Type", type: "select", options: ["Mini Truck", "LCV", "Pickup"] }, { key: "driver", label: "Driver" }, { key: "capacity", label: "Capacity" }, { key: "location", label: "Location" }, { key: "fuel", label: "Fuel %", type: "number" }]}
    />
  ),
});
