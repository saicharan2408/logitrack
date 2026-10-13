import { createFileRoute } from "@tanstack/react-router";
import { DataPage, StatCard, inr } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({ meta: [{ title: "Billing — LogiTrack" }] }),
  component: () => (
    <DataPage table="invoices" title="Invoices" sub="Customer billing and collections."
      makeId={() => `INV-${Date.now().toString().slice(-5)}`}
      statusOptions={["Unpaid", "Paid", "Overdue"]}
      above={(rows) => (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Collected" value={inr(rows.filter((r) => r.status === "Paid").reduce((a, r) => a + Number(r.amount), 0))} />
          <StatCard label="Outstanding" value={inr(rows.filter((r) => r.status === "Unpaid").reduce((a, r) => a + Number(r.amount), 0))} />
          <StatCard label="Overdue" value={inr(rows.filter((r) => r.status === "Overdue").reduce((a, r) => a + Number(r.amount), 0))} />
        </div>
      )}
      columns={[{ key: "id", label: "Invoice" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount", format: inr }, { key: "due", label: "Due" }, { key: "status", label: "Status" }]}
      fields={[{ key: "customer", label: "Customer", required: true }, { key: "amount", label: "Amount (₹)", type: "number", required: true }, { key: "due", label: "Due date", type: "date", required: true }]}
    />
  ),
});
