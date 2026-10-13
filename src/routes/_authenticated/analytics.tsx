import { createFileRoute } from "@tanstack/react-router";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { useTable } from "@/hooks/use-table";
import { PageHeader, StatCard, inr } from "@/components/app/data-page";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — LogiTrack" }] }),
  component: Analytics,
});

function Analytics() {
  const { data: s = [] } = useTable("shipments");
  const { data: d = [] } = useTable("drivers");
  const { data: m = [] } = useTable("maintenance");
  const { data: f = [] } = useTable("fuel_logs");
  const delivered = s.filter((x) => x.status === "Delivered").length;
  const byDate = Object.entries(s.reduce<Record<string, number>>((a, x) => ({ ...a, [x.ship_date]: (a[x.ship_date] ?? 0) + x.price }), {})).sort().map(([date, value]) => ({ date: date.slice(5), value }));
  const expenses = m.reduce((a, x) => a + (x.cost ?? 0), 0) + f.reduce((a, x) => a + x.cost, 0);
  return (
    <div>
      <PageHeader title="Analytics" sub="Revenue, efficiency and performance." />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="On-time delivery" value={`${s.length ? Math.round((delivered / s.length) * 100) : 0}%`} />
        <StatCard label="Delayed" value={s.filter((x) => x.status === "Delayed").length} />
        <StatCard label="Expenses" value={inr(expenses)} hint="Fuel + maintenance" />
        <StatCard label="Avg driver rating" value={d.length ? (d.reduce((a, x) => a + Number(x.rating), 0) / d.length).toFixed(1) : "—"} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-semibold">Revenue by day</h3>
          <ResponsiveContainer width="100%" height={260}><LineChart data={byDate}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="date" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v) => inr(v)} /><Line dataKey="value" stroke="var(--chart-1)" strokeWidth={2} /></LineChart></ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-semibold">Driver trips</h3>
          <ResponsiveContainer width="100%" height={260}><BarChart data={d.map((x) => ({ name: x.name.split(" ")[0], trips: x.trips }))}><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="trips" fill="var(--chart-2)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
