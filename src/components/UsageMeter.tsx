import { cn } from "@/lib/utils";
import { formatLimit, isUnlimited, QUOTA_LABEL, type QuotaKey } from "@/lib/plans";
import { usePlan } from "@/lib/use-plan";

export function UsageMeter({ quota, className }: { quota: QuotaKey; className?: string }) {
  const { plan, usage, percentUsed } = usePlan();
  const used = usage[quota] ?? 0;
  const limit = plan.limits[quota];
  const pct = percentUsed(quota);
  const tone =
    pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{QUOTA_LABEL[quota]}</span>
        <span className="font-medium tabular-nums">
          {formatLimit(quota, used)}
          <span className="text-muted-foreground">
            {" / "}
            {formatLimit(quota, limit)}
          </span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full transition-all", tone)}
          style={{ width: isUnlimited(limit) ? "8%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}
