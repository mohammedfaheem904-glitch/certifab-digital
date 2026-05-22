import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity, Briefcase, GitPullRequestArrow, ShieldAlert, Users, ArrowRight,
  CheckCircle2, AlertTriangle, AlertOctagon, FileWarning, Gauge, Wrench,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { OperationalBanner } from "@/components/common/OperationalBanner";
import { RecommendedActionsCard } from "@/components/common/RecommendedActionsCard";
import { QuickActionDialogs, type QuickActionState } from "@/components/common/QuickActionDialogs";
import {
  wpsReadinessScore,
  wpsVerdict,
  recommendForWps,
  detectParameterDrift,
  type CompatibleWelder,
  type WpsUsage,
  type ParameterDrift,
} from "@/lib/recommendations";
import { deriveQualStatus } from "@/lib/qualification-status";

/**
 * WPS Guidance Strip — operational intelligence panel for a WPS detail page.
 * Surfaces production usage, operational impact, compatible welders, parameter
 * drift detection, and a prioritised recommended-actions list.
 */
export function WpsGuidanceStrip({
  wps,
  bundle,
}: {
  wps: any;
  bundle: { joints: any[]; baseMetals: any[]; fillers: any[]; electrical: any[]; signatures: any[] };
}) {
  const { roles } = useAuth();
  const [dialog, setDialog] = useState<QuickActionState>(null);

  // 1. Welds referencing this WPS (production usage)
  const weldsQ = useQuery<any[]>({
    queryKey: ["wps-usage-welds", wps.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("welds")
        .select("id, project_id, workflow_status, status, welder_name")
        .eq("procedure_id", wps.id)
        .limit(500);
      return (data ?? []) as any[];
    },
  });

  // 2. NCRs linked to welds under this WPS
  const ncrsQ = useQuery<any[]>({
    queryKey: ["wps-usage-ncrs", wps.id, weldsQ.data?.length ?? 0],
    enabled: (weldsQ.data?.length ?? 0) > 0,
    queryFn: async () => {
      const ids = (weldsQ.data ?? []).map((w) => w.id);
      if (ids.length === 0) return [];
      const { data } = await supabase
        .from("ncrs")
        .select("id, status, weld_id")
        .in("weld_id", ids)
        .neq("status", "Closed")
        .limit(200);
      return (data ?? []) as any[];
    },
  });

  // 3. Heat-input logs for drift detection
  const logsQ = useQuery<any[]>({
    queryKey: ["wps-heat-logs", wps.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("heat_inputs")
        .select("*")
        .eq("procedure_id", wps.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return (data ?? []) as any[];
    },
  });

  // 4. Compatible welders (same process, active)
  const weldersQ = useQuery<CompatibleWelder[]>({
    queryKey: ["wps-compatible-welders", wps.id, wps.process],
    enabled: !!wps.process,
    queryFn: async () => {
      const { data } = await supabase
        .from("qualifications")
        .select("id, welder_name, employee_id, process, position_qualified, expiry_date, test_thickness_mm, status")
        .eq("process", wps.process)
        .order("expiry_date", { ascending: false })
        .limit(60);
      const today = new Date();
      return ((data ?? []) as any[])
        .filter((r) => {
          const status = deriveQualStatus({ expiry_date: r.expiry_date, status: r.status });
          if (status === "Expired" || status === "Suspended") return false;
          return new Date(r.expiry_date) >= today;
        })
        .slice(0, 8);
    },
  });

  const drift: ParameterDrift[] = useMemo(
    () => detectParameterDrift(wps, logsQ.data ?? []),
    [wps, logsQ.data],
  );

  const usage: WpsUsage = useMemo(() => {
    const ws = weldsQ.data ?? [];
    const projects = new Set<string>();
    let pending = 0, blocked = 0, released = 0;
    for (const w of ws) {
      if (w.project_id) projects.add(w.project_id);
      if (["Pending Validation", "Ready for Release"].includes(w.workflow_status)) pending++;
      if (w.workflow_status === "Blocked" || w.status === "Rejected") blocked++;
      if (w.workflow_status === "Released") released++;
    }
    return {
      activeWelds: ws.length,
      activeProjects: projects.size,
      pendingApprovals: pending,
      blockedWelds: blocked,
      releasedWelds: released,
      openNcrs: (ncrsQ.data ?? []).length,
      outOfToleranceLogs: drift.length,
    };
  }, [weldsQ.data, ncrsQ.data, drift.length]);

  const score = useMemo(() => wpsReadinessScore(wps, bundle, usage), [wps, bundle, usage]);
  const recs = useMemo(
    () => recommendForWps({ wps, bundle, usage, compatibleWelders: weldersQ.data, drift }),
    [wps, bundle, usage, weldersQ.data, drift],
  );
  const verdict = wpsVerdict(wps, recs, score, usage);
  const topAction = recs.find((r) => r.severity === verdict.severity && r.action) ?? recs.find((r) => r.action);

  return (
    <div className="space-y-3">
      <OperationalBanner
        verdict={verdict}
        actionLabel={topAction?.action?.label}
        onAction={
          topAction?.action?.kind === "open-dialog" && topAction.action.dialog
            ? () => setDialog({ kind: topAction.action!.dialog as any, payload: topAction.action!.payload })
            : undefined
        }
        actionTo={topAction?.action?.kind === "navigate" ? topAction.action.to : undefined}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <ReadinessCard score={score} />
        <ProductionUsageCard usage={usage} loading={weldsQ.isLoading} />
        <CompatibleWeldersCard
          loading={weldersQ.isLoading}
          items={weldersQ.data ?? []}
          highlight={(weldersQ.data?.length ?? 0) === 0 && usage.activeWelds > 0}
        />
      </div>

      <ParameterDriftCard drift={drift} loading={logsQ.isLoading} />

      <RecommendedActionsCard
        recommendations={recs}
        roles={roles}
        onDialog={(d, p) => setDialog({ kind: d as any, payload: p })}
      />

      <QuickActionDialogs state={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}

/* ─────────────── Readiness ─────────────── */
function ReadinessCard({ score }: { score: ReturnType<typeof wpsReadinessScore> }) {
  const bandTone =
    score.band === "Approved" ? "text-success"
      : score.band === "High Risk" ? "text-destructive"
      : score.band === "Attention Required" ? "text-warning"
      : "text-info";
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">WPS Readiness</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{score.score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
        <span className={`ms-auto text-xs font-semibold ${bandTone}`}>{score.band}</span>
      </div>
      <Progress value={score.score} className="h-2" />
      <ul className="space-y-1.5 text-xs">
        <HealthRow label="Approval health" value={score.approvalHealth} />
        <HealthRow label="Document completeness" value={score.completeness} />
        <HealthRow label="Production impact" value={score.productionImpact} />
      </ul>
    </Card>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  const ok = ["Approved", "Complete", "None"].includes(value);
  const warn = ["Pending", "Draft", "Gaps", "Low", "Medium"].includes(value);
  const Icon = ok ? CheckCircle2 : warn ? AlertTriangle : AlertOctagon;
  const tone = ok ? "text-success" : warn ? "text-warning" : "text-destructive";
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`inline-flex items-center gap-1 font-medium ${tone}`}>
        <Icon className="size-3.5" />{value}
      </span>
    </li>
  );
}

/* ─────────────── Production Usage / Operational Impact ─────────────── */
function ProductionUsageCard({ usage, loading }: { usage: WpsUsage; loading: boolean }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Production Usage &amp; Impact</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Operational footprint — what is affected if this WPS changes, is revised or becomes non-compliant.
      </p>
      <ul className="space-y-2 text-sm">
        <Row icon={<ArrowRight className="size-3.5" />} label="Active welds" value={usage.activeWelds} loading={loading} />
        <Row icon={<Briefcase className="size-3.5" />} label="Projects affected" value={usage.activeProjects} loading={loading} />
        <Row icon={<GitPullRequestArrow className="size-3.5" />} label="Pending release workflows" value={usage.pendingApprovals} loading={loading} emphasize={usage.pendingApprovals > 0} />
        {usage.blockedWelds > 0 && (
          <Row icon={<AlertOctagon className="size-3.5" />} label="Blocked welds" value={usage.blockedWelds} loading={loading} emphasize />
        )}
        {usage.openNcrs > 0 && (
          <Row icon={<FileWarning className="size-3.5" />} label="Open NCR investigations" value={usage.openNcrs} loading={loading} emphasize />
        )}
        {usage.releasedWelds > 0 && (
          <Row icon={<CheckCircle2 className="size-3.5" />} label="Released welds" value={usage.releasedWelds} loading={loading} />
        )}
      </ul>
    </Card>
  );
}

function Row({
  icon, label, value, loading, emphasize,
}: { icon: React.ReactNode; label: string; value: number; loading: boolean; emphasize?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2 text-muted-foreground">{icon}{label}</span>
      <span className={`tabular-nums font-semibold ${emphasize ? "text-warning" : "text-foreground"}`}>
        {loading ? "…" : value}
      </span>
    </li>
  );
}

/* ─────────────── Compatible WPQs / Welders ─────────────── */
function CompatibleWeldersCard({
  items, loading, highlight,
}: { items: CompatibleWelder[]; loading: boolean; highlight: boolean }) {
  return (
    <Card className={`p-4 space-y-3 ${highlight ? "border-warning/40 bg-warning/5" : ""}`}>
      <div className="flex items-center gap-2">
        <Users className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Compatible WPQs / Welders</h3>
        {highlight && <Badge variant="outline" className="text-[10px] border-warning/40 text-warning ms-auto">No coverage</Badge>}
      </div>
      {loading ? (
        <p className="text-xs text-muted-foreground">Matching active welders…</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No active welder qualifications match this WPS process. Production assignments cannot be made compliantly.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {items.slice(0, 6).map((w) => (
            <li key={w.id} className="flex items-center justify-between gap-2 text-sm">
              <Link
                to="/app/qualifications/$qualId"
                params={{ qualId: w.id }}
                className="min-w-0 truncate font-medium hover:text-primary"
              >
                {w.welder_name}
              </Link>
              <span className="text-[11px] text-muted-foreground shrink-0">
                {w.position_qualified ?? w.process}
              </span>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <Link to="/app/qualifications">
          <Button variant="outline" size="sm" className="w-full">
            Browse all welders <ArrowRight className="size-3 ms-1.5" />
          </Button>
        </Link>
      )}
    </Card>
  );
}

/* ─────────────── Parameter Drift Detection ─────────────── */
function ParameterDriftCard({ drift, loading }: { drift: ParameterDrift[]; loading: boolean }) {
  if (loading) return null;
  if (drift.length === 0) {
    return (
      <Card className="p-4 border-success/40 bg-success/5 flex items-center gap-3 text-sm">
        <Gauge className="size-4 text-success shrink-0" />
        <div>
          <div className="font-semibold text-success">No parameter drift detected</div>
          <div className="text-xs text-muted-foreground">
            All recent heat-input logs are within WPS-qualified ranges.
          </div>
        </div>
      </Card>
    );
  }
  const crit = drift.filter((d) => d.severity === "critical").length;
  return (
    <Card className={`overflow-hidden ${crit > 0 ? "border-destructive/40" : "border-warning/40"}`}>
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${crit > 0 ? "bg-destructive/5 border-destructive/30" : "bg-warning/5 border-warning/30"}`}>
        <Wrench className={`size-4 ${crit > 0 ? "text-destructive" : "text-warning"}`} />
        <h3 className="text-sm font-semibold">Parameter Drift Detection</h3>
        <span className="ms-auto text-xs text-muted-foreground">
          {drift.length} drift event{drift.length === 1 ? "" : "s"} ({crit} critical)
        </span>
      </div>
      <ul className="divide-y divide-border/60 max-h-64 overflow-auto">
        {drift.map((d) => {
          const Icon = d.severity === "critical" ? AlertOctagon : AlertTriangle;
          const tone = d.severity === "critical" ? "text-destructive" : "text-warning";
          return (
            <li key={d.id} className="flex items-start gap-3 px-4 py-2.5 text-sm">
              <Icon className={`size-4 mt-0.5 shrink-0 ${tone}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.message}</div>
              </div>
              {d.weldId && (
                <Link to="/app/welds/$weldId" params={{ weldId: d.weldId }} className="text-xs text-primary hover:underline shrink-0">
                  View weld
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
