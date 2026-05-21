import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertOctagon, AlertTriangle, ChevronDown, Info, CheckCircle2,
  ArrowRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { AppRole } from "@/lib/auth";
import {
  filterRecsForRole,
  type RecSeverity,
  type Recommendation,
} from "@/lib/recommendations";

/**
 * Recommended Actions Card — operational guidance panel.
 * Groups recommendations by severity, exposes one-click actions, and shows
 * the explainability layer (why · rule · impact · remediation).
 */
export function RecommendedActionsCard({
  recommendations,
  roles,
  onDialog,
  title = "Recommended Actions",
}: {
  recommendations: Recommendation[];
  roles?: AppRole[];
  onDialog?: (dialog: string, payload?: Record<string, unknown>) => void;
  title?: string;
}) {
  const visible = roles ? filterRecsForRole(recommendations, roles) : recommendations;

  if (visible.length === 0) {
    return (
      <Card className="p-4 border-success/40 bg-success/5 flex items-center gap-3 text-sm">
        <CheckCircle2 className="size-4 text-success shrink-0" />
        <div>
          <div className="font-semibold text-success">No action required</div>
          <div className="text-muted-foreground text-xs">
            All operational checks satisfied — nothing recommended for your role.
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/30">
        <Sparkles className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="ms-auto text-xs text-muted-foreground">
          {visible.length} item{visible.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {visible.map((r) => (
          <RecommendationRow key={r.id} rec={r} onDialog={onDialog} />
        ))}
      </ul>
    </Card>
  );
}

function RecommendationRow({
  rec,
  onDialog,
}: {
  rec: Recommendation;
  onDialog?: (dialog: string, payload?: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const palette = sevPalette(rec.severity);
  const Icon = palette.Icon;

  const handleAction = () => {
    if (!rec.action) return;
    if (rec.action.kind === "navigate" && rec.action.to) {
      nav({ to: rec.action.to, search: rec.action.search as any, params: rec.action.params as any });
    } else if (rec.action.kind === "open-dialog" && rec.action.dialog && onDialog) {
      onDialog(rec.action.dialog, rec.action.payload);
    } else if (rec.action.kind === "external" && rec.action.to) {
      window.open(rec.action.to, "_blank");
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <li className={`${palette.bg}`}>
        <div className="flex items-start gap-3 p-4">
          <div className={`shrink-0 rounded-full ${palette.iconBg} p-1.5`}>
            <Icon className={`size-3.5 ${palette.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{rec.title}</span>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${palette.chip}`}>
                {rec.severity}
              </span>
              {rec.rule && (
                <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                  {rec.rule}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.why}</p>
            <CollapsibleContent className="mt-3 space-y-2 text-xs">
              <Block label="Operational impact" tone="warning">{rec.impact}</Block>
              <Block label="Remediation" tone="primary">{rec.remediation}</Block>
              {rec.roles && rec.roles.length > 0 && (
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground/70">Who should act: </span>
                  {rec.roles.map(humanRole).join(", ")}
                </div>
              )}
            </CollapsibleContent>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            {rec.action && (
              <Button size="sm" variant={rec.severity === "critical" ? "default" : "outline"} onClick={handleAction}>
                {rec.action.label}
                <ArrowRight className="size-3 ms-1" />
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                {open ? "Hide details" : "Why this matters"}
                <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
      </li>
    </Collapsible>
  );
}

function Block({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "primary" | "warning";
  children: React.ReactNode;
}) {
  const cls =
    tone === "primary"
      ? "border-primary/30 bg-primary/5"
      : "border-warning/30 bg-warning/5";
  const textTone = tone === "primary" ? "text-primary" : "text-warning";
  return (
    <div className={`rounded-md border ${cls} px-3 py-2`}>
      <div className={`text-[10px] uppercase tracking-wider font-semibold ${textTone}`}>{label}</div>
      <div className="text-foreground/85 mt-0.5 leading-relaxed">{children}</div>
    </div>
  );
}

function sevPalette(s: RecSeverity) {
  switch (s) {
    case "critical":
      return {
        bg: "bg-destructive/5",
        iconBg: "bg-destructive/15",
        text: "text-destructive",
        chip: "bg-destructive/15 text-destructive",
        Icon: AlertOctagon,
      };
    case "warning":
      return {
        bg: "bg-warning/5",
        iconBg: "bg-warning/15",
        text: "text-warning",
        chip: "bg-warning/15 text-warning",
        Icon: AlertTriangle,
      };
    case "info":
      return {
        bg: "bg-info/5",
        iconBg: "bg-info/15",
        text: "text-info",
        chip: "bg-info/15 text-info",
        Icon: Info,
      };
    default:
      return {
        bg: "bg-success/5",
        iconBg: "bg-success/15",
        text: "text-success",
        chip: "bg-success/15 text-success",
        Icon: CheckCircle2,
      };
  }
}

function humanRole(r: AppRole): string {
  return r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
