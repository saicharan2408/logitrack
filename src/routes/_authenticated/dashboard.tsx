import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Truck, Users, IndianRupee, Bot } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useTable } from "@/hooks/use-table";
import { PageHeader, StatCard, inr } from "@/components/app/data-page";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LogiTrack" }] }),
  component: Dashboard,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Dashboard() {
  const { data: shipments = [] } = useTable("shipments");
  const { data: vehicles = [] } = useTable("vehicles");
  const { data: drivers = [] } = useTable("drivers");
  const revenue = shipments.filter((s) => s.status !== "Cancelled").reduce((a, s) => a + s.price, 0);
  const byStatus = ["Pending", "In Transit", "Delivered", "Delayed", "Cancelled"].map((name) => ({ name, value: shipments.filter((s) => s.status === name).length }));
  const byCity = Object.entries(shipments.reduce<Record<string, number>>((a, s) => ({ ...a, [s.destination]: (a[s.destination] ?? 0) + s.price }), {})).map(([city, value]) => ({ city, value }));

  return (
    <div>
      <PageHeader title="Dashboard" sub="Your operation at a glance — updates live.">
        <Button asChild><Link to="/assistant"><Bot className="size-4" /> Ask the assistant</Link></Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active shipments" value={shipments.filter((s) => ["In Transit", "Pending", "Delayed"].includes(s.status)).length} hint={`${shipments.length} total`} icon={Package} />
        <StatCard label="Revenue" value={inr(revenue)} hint="Excludes cancelled" icon={IndianRupee} />
        <StatCard label="Vehicles on trip" value={`${vehicles.filter((v) => v.status === "On Trip").length}/${vehicles.length}`} icon={Truck} />
        <StatCard label="Drivers online" value={drivers.filter((d) => d.status !== "Offline").length} icon={Users} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-semibold">Revenue by destination</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCity}><XAxis dataKey="city" fontSize={12} /><YAxis fontSize={12} /><Tooltip formatter={(v) => inr(v)} /><Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 font-semibold">Shipment status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={byStatus} dataKey="value" innerRadius={50} outerRadius={80}>{byStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-2">{byStatus.map((s) => <span key={s.name} className="text-xs">{s.name}: <b>{s.value}</b></span>)}</div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between p-5"><h3 className="font-semibold">Recent shipments</h3><Link to="/shipments" className="text-sm text-primary">View all</Link></div>
        <table className="w-full text-sm">
          <tbody>
            {shipments.slice(0, 6).map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-5 py-3 font-medium">{s.id}</td><td>{s.customer}</td><td className="text-muted-foreground">{s.pickup} → {s.destination}</td><td><StatusBadge value={s.status} /></td><td className="pr-5 text-right">{inr(s.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
