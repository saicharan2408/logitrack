import { useMemo, useState, type ReactNode } from "react";
import { Plus, Search, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTable, type TableName } from "@/hooks/use-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from "./status-badge";

export type Column = { key: string; label: string; badge?: boolean; format?: (v: unknown, row: Record<string, unknown>) => ReactNode };
export type Field = { key: string; label: string; type?: "text" | "number" | "date" | "select"; options?: string[]; required?: boolean };

export const inr = (v: unknown) => `₹${Number(v ?? 0).toLocaleString("en-IN")}`;

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

export function DataPage({
  table, title, sub, columns, fields, idKey = "id", makeId, statusOptions, orderBy, above,
}: {
  table: TableName; title: string; sub?: string; columns: Column[]; fields?: Field[]; idKey?: string;
  makeId?: () => string; statusOptions?: string[]; orderBy?: string; above?: (rows: Record<string, unknown>[]) => ReactNode;
}) {
  const { data = [], isLoading, error } = useTable(table, orderBy);
  const rows = data as unknown as Record<string, unknown>[];
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => rows.filter((r) => (status === "All" || r.status === status) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))),
    [rows, q, status],
  );

  const save = async () => {
    const payload: Record<string, unknown> = {};
    for (const f of fields ?? []) {
      const v = form[f.key];
      if (f.required && !v) return toast.error(`${f.label} is required`);
      if (v !== undefined && v !== "") payload[f.key] = f.type === "number" ? Number(v) : v;
    }
    if (makeId) payload[idKey] = makeId();
    const { error } = await supabase.from(table).insert(payload as never);
    if (error) return toast.error(error.message);
    toast.success(`${title.replace(/s$/, "")} added`);
    setOpen(false);
    setForm({});
  };

  const updateStatus = async (row: Record<string, unknown>, value: string) => {
    const { error } = await supabase.from(table).update({ status: value } as never).eq(idKey as never, row[idKey] as never);
    if (error) toast.error(error.message);
  };

  const remove = async (row: Record<string, unknown>) => {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from(table).delete().eq(idKey as never, row[idKey] as never);
    if (error) toast.error(error.message);
  };

  const exportCsv = () => {
    const head = columns.map((c) => c.label).join(",");
    const body = filtered.map((r) => columns.map((c) => JSON.stringify(r[c.key] ?? "")).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([head + "\n" + body], { type: "text/csv" }));
    a.download = `${table}.csv`;
    a.click();
  };

  return (
    <div>
      <PageHeader title={title} sub={sub}>
        <Button variant="outline" onClick={exportCsv}><Download className="size-4" /> Export</Button>
        {fields && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> Add</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New {title.replace(/s$/, "").toLowerCase()}</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((f) => (
                  <label key={f.key} className="grid gap-1 text-sm">
                    <span className="font-medium">{f.label}</span>
                    {f.type === "select" ? (
                      <select className="h-9 rounded-md border bg-background px-2" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                        <option value="">Select…</option>
                        {f.options?.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <Input type={f.type ?? "text"} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                    )}
                  </label>
                ))}
              </div>
              <Button onClick={save} className="mt-2">Save</Button>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {above?.(rows)}

      <div className="rounded-xl border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b p-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {statusOptions && (
            <div className="flex flex-wrap gap-1">
              {["All", ...statusOptions].map((s) => (
                <Button key={s} size="sm" variant={status === s ? "default" : "ghost"} onClick={() => setStatus(s)}>{s}</Button>
              ))}
            </div>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} records · live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>)}<th /></tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="p-6 text-muted-foreground" colSpan={99}>Loading…</td></tr>}
              {error && <tr><td className="p-6 text-destructive" colSpan={99}>{(error as Error).message}</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td className="p-6 text-muted-foreground" colSpan={99}>Nothing here yet.</td></tr>}
              {filtered.map((r) => (
                <tr key={String(r[idKey])} className="border-t hover:bg-muted/40">
                  {columns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-4 py-3">
                      {c.key === "status" && statusOptions ? (
                        <select className="cursor-pointer appearance-none bg-transparent" value={String(r.status)} onChange={(e) => updateStatus(r, e.target.value)} aria-label="Change status">
                          {statusOptions.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : null}
                      {c.key === "status" && statusOptions ? <span className="ml-1"><StatusBadge value={String(r.status)} /></span>
                        : c.badge ? <StatusBadge value={String(r[c.key] ?? "")} />
                        : c.format ? c.format(r[c.key], r) : String(r[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-2"><Button size="icon" variant="ghost" onClick={() => remove(r)} aria-label="Delete"><Trash2 className="size-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: ReactNode; hint?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        {Icon && <Icon className="size-4 text-primary" />}
      </div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
