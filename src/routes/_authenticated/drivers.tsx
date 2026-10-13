import { createFileRoute } from "@tanstack/react-router";
import { DataPage, inr } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/drivers")({
  head: () => ({ meta: [{ title: "Drivers — LogiTrack" }] }),
  component: () => (
    <DataPage table="drivers" title="Drivers" sub="Ratings, trips, safety and earnings."
      makeId={() => `DR-${Date.now().toString().slice(-5)}`}
      statusOptions={["Online", "On Trip", "Offline"]}
      columns={[{ key: "name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "rating", label: "Rating", format: (v) => `★ ${v}` }, { key: "trips", label: "Trips" }, { key: "safety", label: "Safety" }, { key: "vehicle", label: "Vehicle" }, { key: "location", label: "Location" }, { key: "earnings", label: "Earnings", format: inr }, { key: "status", label: "Status" }]}
      fields={[{ key: "name", label: "Name", required: true }, { key: "phone", label: "Phone" }, { key: "license", label: "License" }, { key: "vehicle", label: "Vehicle" }, { key: "location", label: "Location" }]}
    />
  ),
});
