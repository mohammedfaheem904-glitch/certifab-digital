import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Accepted: "bg-success/15 text-success border-success/30",
  Active: "bg-success/15 text-success border-success/30",
  Approved: "bg-success/15 text-success border-success/30",
  Operational: "bg-success/15 text-success border-success/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Expired: "bg-destructive/15 text-destructive border-destructive/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Repair: "bg-warning/15 text-warning border-warning/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Review: "bg-warning/15 text-warning border-warning/30",
  Maintenance: "bg-warning/15 text-warning border-warning/30",
  "Calibration Due": "bg-warning/15 text-warning border-warning/30",
  "Expiring Soon": "bg-warning/15 text-warning border-warning/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Draft: "bg-muted text-muted-foreground border-border",
  Low: "bg-info/15 text-info border-info/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        map[status] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
