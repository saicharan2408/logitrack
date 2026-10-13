import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  Delivered: "bg-success/15 text-success", Available: "bg-success/15 text-success", Online: "bg-success/15 text-success",
  Paid: "bg-success/15 text-success", Completed: "bg-success/15 text-success", "In Stock": "bg-success/15 text-success", Resolved: "bg-success/15 text-success",
  "In Transit": "bg-info/15 text-info", "On Trip": "bg-info/15 text-info", Open: "bg-info/15 text-info", Express: "bg-accent/25 text-accent-foreground",
  Pending: "bg-warning/20 text-accent-foreground", Upcoming: "bg-warning/20 text-accent-foreground", Unpaid: "bg-warning/20 text-accent-foreground", "Low Stock": "bg-warning/20 text-accent-foreground",
  Delayed: "bg-caution/15 text-caution", Maintenance: "bg-caution/15 text-caution", Overstock: "bg-caution/15 text-caution",
  Cancelled: "bg-destructive/15 text-destructive", Overdue: "bg-destructive/15 text-destructive", Offline: "bg-muted text-muted-foreground",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", tone[value] ?? "bg-muted text-muted-foreground")}>
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}
