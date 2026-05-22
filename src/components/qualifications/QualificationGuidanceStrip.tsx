import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Activity, Briefcase, GitPullRequestArrow, ShieldAlert, Users, ArrowRight, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
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
  qualReadinessScore,
  qualVerdict,
  recommendForQualification,
  type QualImpact,
  type ReplacementWelder,
} from "@/lib/recommendations";
import { deriveQualStatus } from "@/lib/qualification-status";

/**
 * Qualification Guidance Strip — banner + operational impact + suggested
 * replacement welders + recommended actions panel for a WPQ detail page.
 */
export function QualificationGuidanceStrip({ qualification: q }: { qualification: any }) {
  const { roles } = useAuth();
  const [dialog, setDialog] = useState<QuickActionState>(null);

  // 1. Affected welds — welds assigned to this welder that are not yet released/rejected
  const affectedWelds = useQuery<any[]>({
    queryKey: ["qual-impact-welds", q.id, q.welder_name],
    enabled: !!q.welder_name,
    queryFn: async () => {
      const { data } = await supabase
        .from("welds")
        .select("id, project_id, workflow_status, status, welder_name")
        .ilike("welder_name", q.welder_name)
        .limit(500);
      return (data ?? []) as any[];
    },
  });

  // 2. Replacement welders — same process, active, different welder
  const replacements = useQuery<ReplacementWelder[]>({
    queryKey: ["qual-replacements", q.id, q.process],
    enabled: !!q.process,
    queryFn: async () => {
      const { data } = await supabase
        .from("qualifications")
        .select("id, welder_name, employee_id, process, expiry_date, position_qualified, test_thickness_mm, status")
        .eq("process", q.process)
        .neq("id", q.id)
        .order("expiry_date", { ascending: false })
        .limit(40);
      const today = new Date();
      const couponT = Number(q.test_thickness_mm) || undefined;
      return ((data ?? []) as any[])
        .filter((r) => {
          const status = deriveQualStatus({ expiry_date: r.expiry_date, status: r.status });
          if (status === "Expired" || status === "Suspended") return false;
          if (new Date(r.expiry_date) < today) return false;
          // Thickness compatibility — if both known, replacement coupon must be ≥ 0.5× this coupon
          if (couponT && r.test_thickness_mm) {
            const rt = Number(r.test_thickness_mm);
            if (Number.isFinite(rt) && rt < couponT * 0.5) return false;
          }
          return true;
        })
        .slice(0, 5);
    },
  });

  const impact: QualImpact = useMemo(() => {
    const welds = affectedWelds.data ?? [];
    const projects = new Set<string>();
    let pending = 0;
    let blocked = 0;
    for (const w of welds) {
      if (w.project_id) projects.add(w.project_id);
      if (["Pending Validation", "Ready for Release"].includes(w.workflow_status)) pending += 1;
      if (w.workflow_status === "Blocked" || w.status === "Rejected") blocked += 1;
    }
    return {
      affectedWelds: welds.length,
      affectedProjects: projects.size,
      pendingReleases: pending,
      blockedWelds: blocked,
    };
  }, [affectedWelds.data]);

  const score = useMemo(() => qualReadinessScore(q), [q]);

  const recs = useMemo(
    () => recommendForQualification({ qualification: q, impact, replacements: replacements.data }),
    [q, impact, replacements.data],
  );

  const verdict = qualVerdict(q, recs, score, impact);
  const topAction = recs.find((r) => r.severity === verdict.severity && r.action) ?? recs.find((r) => r.action);

  const needsReplacements =
    score.expiryRisk !== "None" ||
    score.continuityHealth !== "Healthy" ||
    score.complianceHealth === "Fail";

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
        <OperationalImpactCard impact={impact} loading={affectedWelds.isLoading} welderName={q.welder_name} />
        <ReplacementWeldersCard
          loading={replacements.isLoading}
          items={replacements.data ?? []}
          highlight={needsReplacements}
        />
      </div>

      <RecommendedActionsCard
        recommendations={recs}
        roles={roles}
        onDialog={(d, p) => setDialog({ kind: d as any, payload: p })}
      />

      <QuickActionDialogs state={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}

/* ─────────────── Readiness Score ─────────────── */

function ReadinessCard({ score }: { score: ReturnType<typeof qualReadinessScore> }) {
  const bandTone =
    score.band === "Ready" ? "text-success"
      : score.band === "High Risk" ? "text-destructive"
      : score.band === "Expiring Soon" ? "text-warning"
      : "text-warning";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Qualification Readiness</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">{score.score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
        <span className={`ms-auto text-xs font-semibold ${bandTone}`}>{score.band}</span>
      </div>
      <Progress value={score.score} className="h-2" />
      <ul className="space-y-1.5 text-xs">
        <HealthRow label="Continuity health" value={score.continuityHealth} />
        <HealthRow label="Compliance health" value={score.complianceHealth} />
        <HealthRow label="Expiry risk" value={score.expiryRisk} />
      </ul>
    </Card>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  const ok = ["Healthy", "Pass", "None"].includes(value);
  const warn = ["At Risk", "Warning", "30 days"].includes(value);
  const Icon = ok ? CheckCircle2 : warn ? AlertTriangle : AlertOctagon;
  const tone = ok ? "text-success" : warn ? "text-warning" : "text-destructive";
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`inline-flex items-center gap-1 font-medium ${tone}`}>
        <Icon className="size-3.5" />
        {value}
      </span>
    </li>
  );
}

/* ─────────────── Operational Impact ─────────────── */

function OperationalImpactCard({
  impact,
  loading,
  welderName,
}: {
  impact: QualImpact;
  loading: boolean;
  welderName?: string | null;
}) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Operational Impact</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        {welderName
          ? <>This qualification covers <span className="font-medium text-foreground">{welderName}</span>'s production work:</>
          : "Operational footprint of this qualification:"}
      </p>
      <ul className="space-y-2 text-sm">
        <ImpactRow icon={<ArrowRight className="size-3.5" />} label="Active welds" value={impact.affectedWelds} loading={loading} />
        <ImpactRow icon={<Briefcase className="size-3.5" />} label="Projects affected" value={impact.affectedProjects} loading={loading} />
        <ImpactRow icon={<GitPullRequestArrow className="size-3.5" />} label="Pending release workflows" value={impact.pendingReleases} loading={loading} emphasize={impact.pendingReleases > 0} />
        {impact.blockedWelds > 0 && (
          <ImpactRow icon={<AlertOctagon className="size-3.5" />} label="Blocked welds" value={impact.blockedWelds} loading={loading} emphasize />
        )}
      </ul>
    </Card>
  );
}

function ImpactRow({
  icon, label, value, loading, emphasize,
}: { icon: React.ReactNode; label: string; value: number; loading: boolean; emphasize?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className={`tabular-nums font-semibold ${emphasize ? "text-warning" : "text-foreground"}`}>
        {loading ? "…" : value}
      </span>
    </li>
  );
}

/* ─────────────── Replacement Welders ─────────────── */

function ReplacementWeldersCard({
  items, loading, highlight,
}: { items: ReplacementWelder[]; loading: boolean; highlight: boolean }) {
  return (
    <Card className={`p-4 space-y-3 ${highlight ? "border-warning/40 bg-warning/5" : ""}`}>
      <div className="flex items-center gap-2">
        <Users className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Suggested Replacement Welders</h3>
        {highlight && <Badge variant="outline" className="text-[10px] border-warning/40 text-warning ms-auto">Recommended</Badge>}
      </div>
      {loading ? (
        <p className="text-xs text-muted-foreground">Searching matching welders…</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No alternative welders qualified for this process with active continuity.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
              <Link
                to="/app/qualifications/$qualId"
                params={{ qualId: r.id }}
                className="min-w-0 truncate font-medium hover:text-primary"
              >
                {r.welder_name}
              </Link>
              <span className="text-[11px] text-muted-foreground shrink-0">
                {r.process}
                {r.position_qualified ? ` · ${r.position_qualified}` : ""}
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
