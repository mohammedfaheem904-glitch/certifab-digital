import { Link } from "@tanstack/react-router";
import { useCompanyRows } from "@/lib/use-company-rows";
import { WeldStatusBadge } from "@/components/welds/WeldStatusBadge";

/**
 * Workflow stage distribution + bottleneck heatmap for production welds.
 * Reads the same `workflow_status` enum the weld state machine writes.
 */
export function WorkflowBottlenecks() {
  const welds = useCompanyRows<{ id: string; workflow_status: string | null }>("welds");
  const rows = welds.data ?? [];
  const total = rows.length;

  const stages = [
    "Draft", "Pending Validation", "Awaiting Inspection",
    "NCR Open", "Ready for Release", "Approved", "Released",
    "Rejected", "Blocked",
  ];
  const counts = stages.map((s) => ({
    stage: s,
    count: rows.filter((r) => (r.workflow_status ?? "Draft") === s).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <ul className="space-y-2">
      {counts.map(({ stage, count }) => {
        const pct = total ? (count / total) * 100 : 0;
        return (
          <li key={stage}>
            <Link
              to="/app/welds"
              search={{ workflow: stage } as any}
              className="group block rounded-md hover:bg-muted/40 px-2 py-1.5"
            >
              <div className="flex items-center justify-between gap-3">
                <WeldStatusBadge status={stage} />
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary/60 group-hover:bg-primary transition-all"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-right text-xs tabular-nums">
                  <span className="font-medium">{count}</span>
                  <span className="text-muted-foreground"> · {pct.toFixed(0)}%</span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
      {total === 0 && (
        <li className="text-center text-sm text-muted-foreground py-6">
          No welds yet — workflow distribution will appear here as production starts.
        </li>
      )}
    </ul>
  );
}
