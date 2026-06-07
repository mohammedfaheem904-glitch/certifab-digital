import { CheckCircle2, AlertTriangle, ShieldAlert, Activity } from "lucide-react";
import type { ReadinessResult } from "@/lib/inspection-readiness";

export function ReadinessGauge({ result }: { result: ReadinessResult }) {
  const tone = {
    Ready: { cls: "text-success bg-success/10 border-success/30", icon: CheckCircle2 },
    Attention: { cls: "text-info bg-info/10 border-info/30", icon: Activity },
    "High Risk": { cls: "text-warning bg-warning/10 border-warning/30", icon: AlertTriangle },
    Critical: { cls: "text-destructive bg-destructive/10 border-destructive/30", icon: ShieldAlert },
  }[result.level];
  const Icon = tone.icon;

  return (
    <div className={`rounded-xl border p-5 ${tone.cls}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="size-6" />
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">Inspection readiness</div>
            <div className="text-xl font-semibold leading-tight">{result.level}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums">{result.score}</div>
          <div className="text-[10px] uppercase tracking-wider opacity-80">/ 100</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <Cell label="Completed" value={`${result.completed}/${result.total}`} />
        <Cell label="Failed" value={result.failed} />
        <Cell label="Out of tol." value={result.outOfTolerance} />
        <Cell label="Missing req." value={result.missingRequired} />
      </div>

      {result.reasons.length > 0 && (
        <ul className="mt-3 text-xs space-y-1 opacity-90">
          {result.reasons.map((r) => <li key={r}>• {r}</li>)}
        </ul>
      )}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md bg-background/40 p-2">
      <div className="text-base font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] opacity-70">{label}</div>
    </div>
  );
}
