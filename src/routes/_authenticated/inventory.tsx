import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/components/app/data-page";
import { StatusBadge } from "@/components/app/status-badge";

const stock = (q: number) => (q < 10 ? "Low Stock" : q > 3200 ? "Overstock" : "In Stock");
export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({ meta: [{ title: "Inventory — LogiTrack" }] }),
  component: () => (
    <DataPage table="inventory" title="Inventory" sub="Stock levels across warehouses." idKey="sku"
      makeId={() => `SKU-${Date.now().toString().slice(-5)}`}
      columns={[{ key: "sku", label: "SKU" }, { key: "name", label: "Item" }, { key: "qty", label: "Qty" }, { key: "weight", label: "Unit weight" }, { key: "location", label: "Warehouse" }, { key: "stock", label: "Stock", format: (_v, r) => <StatusBadge value={stock(Number(r.qty))} /> }]}
      fields={[{ key: "name", label: "Item", required: true }, { key: "qty", label: "Quantity", type: "number", required: true }, { key: "weight", label: "Unit weight" }, { key: "location", label: "Warehouse" }]}
    />
  ),
});
