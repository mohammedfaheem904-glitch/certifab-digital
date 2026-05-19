import { ShieldAlert, ShieldCheck, ShieldQuestion, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ReleaseReadiness } from "@/lib/weld-readiness";

interface Props {
  readiness: ReleaseReadiness;
}

/**
 * Big visual readiness gauge — score, verdict, summary.
 * SVG-based circular progress so it scales cleanly on print.
 */
export function ReleaseReadinessGauge({ readiness }: Props) {
  const { score, verdict, summary, blockers, warnings } = readiness;

  const tone =
    verdict === "Blocked" ? "destructive" :
    verdict === "Warning" ? "warning" :
    "success";

  const ringColor =
    tone === "destructive" ? "stroke-destructive" :
    tone === "warning" ? "stroke-warning" :
    "stroke-success";

  const bgTone =
    tone === "destructive" ? "border-destructive/40 bg-destructive/5" :
    tone === "warning" ? "border-warning/40 bg-warning/5" :
    "border-success/40 bg-success/5";

  const Icon =
    tone === "destructive" ? ShieldAlert :
    tone === "warning" ? ShieldQuestion :
    ShieldCheck;

  const c = 2 * Math.PI * 52;
  const offset = c - (score / 100) * c;

  return (
    <div className={`rounded-xl border ${bgTone} p-6`}>
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative size-32 shrink-0">
          <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
            <circle cx="60" cy="60" r="52" className="fill-none stroke-border" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52"
              className={`fill-none ${ringColor} transition-all duration-700`}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-semibold tabular-nums">{score}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Readiness</div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Icon className={`size-5 ${tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-success"}`} />
            <div className="text-xl font-semibold tracking-tight">{verdict}</div>
          </div>
          <div className="text-sm text-muted-foreground">{summary}</div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Pill tone="destructive" icon={AlertTriangle} count={blockers.length} label="blockers" />
            <Pill tone="warning" icon={AlertTriangle} count={warnings.length} label="warnings" />
            <Pill tone="success" icon={CheckCircle2} count={readiness.matchReport.findings.filter(f => f.severity === "pass").length} label="checks passed" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({
  tone, icon: Icon, count, label,
}: { tone: "destructive" | "warning" | "success"; icon: typeof CheckCircle2; count: number; label: string }) {
  const cls =
    tone === "destructive" ? "border-destructive/40 text-destructive bg-destructive/10" :
    tone === "warning" ? "border-warning/40 text-warning bg-warning/10" :
    "border-success/40 text-success bg-success/10";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      <Icon className="size-3.5" /> {count} {label}
    </span>
  );
}
