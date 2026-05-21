import { Link } from "@tanstack/react-router";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecSeverity, Verdict } from "@/lib/recommendations";

/**
 * Operational Banner — the headline 🔴🟠🟢🔵 strip at the top of any entity
 * detail page. Communicates verdict, severity, summary and the single
 * highest-priority next action.
 */
export function OperationalBanner({
  verdict,
  onAction,
  actionLabel,
  actionTo,
}: {
  verdict: Verdict;
  onAction?: () => void;
  actionLabel?: string;
  actionTo?: string;
}) {
  const palette = bannerPalette(verdict.severity);
  const Icon = palette.Icon;
  return (
    <div
      className={`rounded-xl border ${palette.border} ${palette.bg} px-4 py-3 flex items-start gap-3`}
      role="status"
      aria-live="polite"
    >
      <div className={`shrink-0 rounded-full ${palette.iconBg} p-2`}>
        <Icon className={`size-4 ${palette.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-sm font-semibold ${palette.text}`}>{verdict.label}</span>
          <span className="text-sm text-foreground/85">{verdict.summary}</span>
        </div>
        {verdict.next && (
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground/70">Next: </span>
            {verdict.next}
          </div>
        )}
      </div>
      {actionLabel && (actionTo || onAction) && (
        actionTo ? (
          <Link to={actionTo}>
            <Button size="sm" variant={verdict.severity === "ok" ? "outline" : "default"}>
              {actionLabel}
              <ArrowRight className="size-3.5 ms-1.5" />
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            variant={verdict.severity === "ok" ? "outline" : "default"}
            onClick={onAction}
          >
            {actionLabel}
            <ArrowRight className="size-3.5 ms-1.5" />
          </Button>
        )
      )}
    </div>
  );
}

function bannerPalette(s: RecSeverity) {
  switch (s) {
    case "critical":
      return {
        border: "border-destructive/40",
        bg: "bg-destructive/5",
        iconBg: "bg-destructive/10",
        text: "text-destructive",
        Icon: AlertOctagon,
      };
    case "warning":
      return {
        border: "border-warning/40",
        bg: "bg-warning/5",
        iconBg: "bg-warning/10",
        text: "text-warning",
        Icon: AlertTriangle,
      };
    case "info":
      return {
        border: "border-info/40",
        bg: "bg-info/5",
        iconBg: "bg-info/10",
        text: "text-info",
        Icon: Info,
      };
    default:
      return {
        border: "border-success/40",
        bg: "bg-success/5",
        iconBg: "bg-success/10",
        text: "text-success",
        Icon: CheckCircle2,
      };
  }
}
