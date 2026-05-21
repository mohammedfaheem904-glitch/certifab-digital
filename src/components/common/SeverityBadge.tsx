import type { RecSeverity } from "@/lib/recommendations";

const map: Record<RecSeverity, { cls: string; label: string }> = {
  critical: { cls: "border-destructive/40 bg-destructive/10 text-destructive", label: "Critical" },
  warning: { cls: "border-warning/40 bg-warning/10 text-warning", label: "Warning" },
  info: { cls: "border-info/40 bg-info/10 text-info", label: "Info" },
  ok: { cls: "border-success/40 bg-success/10 text-success", label: "OK" },
};

/** Compact severity chip used in list rows and tiles. */
export function SeverityBadge({
  level,
  label,
  className = "",
}: {
  level: RecSeverity;
  label?: string;
  className?: string;
}) {
  const m = map[level];
  return (
    <span
      className={`inline-flex items-center text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${m.cls} ${className}`}
    >
      {label ?? m.label}
    </span>
  );
}
