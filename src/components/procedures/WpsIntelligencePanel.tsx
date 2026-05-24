import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fillerBaseMetalMatrix,
  runAllEngines,
  computeReadiness,
  buildDependencyGraph,
  computeQualifiedThicknessRange,
  P_NO_FAMILIES,
  F_NO_FAMILIES,
  type WpsBundle,
  type PqrSnapshot,
} from "@/lib/wps-engineering";
import { validateWpsCompleteness, type ComplianceFinding, type Severity } from "@/lib/wps-intelligence";
import { AlertCircle, AlertTriangle, CheckCircle2, GitBranch, Info, Loader2, ShieldAlert, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function WpsIntelligencePanel({ proc }: { proc: any }) {
  const procedureId = proc.id;

  const bundleQ = useQuery({
    queryKey: ["wps_engineering_bundle", procedureId],
    queryFn: async (): Promise<WpsBundle> => {
      const [joints, baseMetals, fillers, electrical, sigs] = await Promise.all([
        supabase.from("wps_joint_configurations").select("*").eq("procedure_id", procedureId),
        supabase.from("wps_base_metals").select("*").eq("procedure_id", procedureId),
        supabase.from("wps_filler_metals").select("*").eq("procedure_id", procedureId),
        supabase.from("wps_electrical_characteristics").select("*").eq("procedure_id", procedureId),
        supabase.from("wps_signatures").select("*").eq("procedure_id", procedureId),
      ]);
      return {
        wps: proc,
        joints: joints.data ?? [],
        baseMetals: baseMetals.data ?? [],
        fillers: fillers.data ?? [],
        electrical: electrical.data ?? [],
        signatures: sigs.data ?? [],
      };
    },
  });

  // Best-effort PQR lookup by pqr_no within the company.
  const pqrQ = useQuery({
    queryKey: ["pqr_snapshot", proc.company_id, proc.pqr_no],
    enabled: !!proc.pqr_no,
    queryFn: async (): Promise<PqrSnapshot | null> => {
      // PQRs are stored as procedures with procedure_type = 'PQR' (best effort).
      const { data } = await supabase
        .from("procedures")
        .select("*")
        .eq("company_id", proc.company_id)
        .ilike("code", `%${proc.pqr_no}%`)
        .maybeSingle();
      if (!data) return null;
      return {
        process: data.process,
        preheatMinC: data.preheat_min_c,
        interpassMaxC: data.interpass_max_c,
        pwht: data.pwht,
      };
    },
  });

  if (bundleQ.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" />Analyzing engineering relationships…</div>;
  }
  const bundle = bundleQ.data;
  if (!bundle) return null;

  const completeness = validateWpsCompleteness(bundle);
  const engineering = runAllEngines(bundle, pqrQ.data ?? null, null);
  const allFindings = [...completeness, ...engineering];
  const readiness = computeReadiness(allFindings, bundle);
  const matrix = fillerBaseMetalMatrix(bundle);
  const edges = buildDependencyGraph(bundle);
  const qThk = computeQualifiedThicknessRange(null);

  const byCat = engineering.reduce((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {} as Record<string, ComplianceFinding[]>);

  return (
    <div className="space-y-5">
      {/* Readiness gauge */}
      <div className="rounded-xl border border-border bg-card p-5 grid md:grid-cols-[auto,1fr,auto] gap-5 items-center">
        <div className={cn(
          "rounded-2xl size-24 flex flex-col items-center justify-center font-bold",
          readiness.score >= 85 ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : readiness.score >= 70 ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-destructive/15 text-destructive"
        )}>
          <span className="text-3xl leading-none">{readiness.grade}</span>
          <span className="text-xs mt-1 tabular-nums">{readiness.score}/100</span>
        </div>
        <div>
          <div className="text-lg font-semibold flex items-center gap-2">
            {readiness.status === "Ready for production" ? <ShieldCheck className="size-5 text-emerald-500" /> :
             readiness.status === "Not releasable"        ? <ShieldAlert className="size-5 text-destructive" /> :
             <AlertTriangle className="size-5 text-amber-500" />}
            {readiness.status}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {allFindings.length} engineering finding{allFindings.length === 1 ? "" : "s"} across {Object.keys(byCat).length + 1} domains.
            {pqrQ.data ? " PQR snapshot found — drift checks active." : " No PQR snapshot — drift checks skipped."}
          </div>
          {readiness.blockers.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {readiness.blockers.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-destructive"><ShieldAlert className="size-4 mt-0.5" /> {b}</li>
              ))}
            </ul>
          )}
        </div>
        {readiness.impact.length > 0 && (
          <div className="md:max-w-xs rounded-lg border border-border bg-muted/30 p-3 text-xs">
            <div className="font-medium flex items-center gap-1.5 mb-1.5"><TrendingUp className="size-3.5" /> Operational impact</div>
            <ul className="space-y-1 text-muted-foreground">
              {readiness.impact.map((i, idx) => <li key={idx}>• {i}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* F-No ↔ P-No compatibility matrix */}
      <Section title="Filler ↔ Base metal compatibility" icon={<Sparkles className="size-4" />} subtitle="ASME IX QW-432 / QW-422 reference matrix">
        {matrix.length === 0 ? (
          <Empty>Add base metals (with P-No) and fillers (with F-No) to compute the compatibility matrix.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/30">
                <tr><Th>P-No</Th><Th>Material</Th><Th>F-No</Th><Th>Filler family</Th><Th>Status</Th><Th>Reason</Th></tr>
              </thead>
              <tbody>
                {matrix.map((c, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="px-4 py-2 font-medium tabular-nums">{c.pNo}</td>
                    <td className="px-4 py-2 text-muted-foreground">{P_NO_FAMILIES[c.pNo] ?? "—"}</td>
                    <td className="px-4 py-2 tabular-nums">{c.fNo ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{c.fNo ? F_NO_FAMILIES[c.fNo] ?? "—" : "—"}</td>
                    <td className="px-4 py-2">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        c.status === "ok" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                        c.status === "uncommon" && "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                        c.status === "incompatible" && "bg-destructive/15 text-destructive",
                        c.status === "unknown" && "bg-muted text-muted-foreground",
                      )}>{c.status}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Findings grouped by domain */}
      <Section title="Engineering analysis" icon={<AlertTriangle className="size-4" />} subtitle="Process, polarity, backing, thermal, gas, thickness, drift">
        {engineering.length === 0 ? (
          <div className="px-5 py-6 flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-emerald-500" /> No engineering issues detected.</div>
        ) : (
          <div className="divide-y divide-border">
            {Object.entries(byCat).map(([cat, items]) => (
              <div key={cat} className="px-5 py-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{cat.replace("_", " ")}</div>
                <ul className="space-y-2">
                  {items.map((f) => <li key={f.id}><FindingRow f={f} /></li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Dependency graph */}
      <Section title="Dependency graph" icon={<GitBranch className="size-4" />} subtitle="How WPS sections drive each other">
        <ul className="px-5 py-3 space-y-1.5 text-sm">
          {edges.map((e, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{e.from}</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{e.to}</span>
              <span className="text-xs text-muted-foreground">{e.reason}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        {icon}
        <div>
          <div className="text-sm font-medium">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 text-start font-medium">{children}</th>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-6 text-sm text-muted-foreground">{children}</div>;
}
function FindingRow({ f }: { f: ComplianceFinding }) {
  const sevColor: Record<Severity, string> = {
    critical: "text-destructive",
    error: "text-destructive",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-muted-foreground",
  };
  const Icon = f.severity === "info" ? Info : f.severity === "warning" ? AlertTriangle : AlertCircle;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className={cn("size-4 mt-0.5 shrink-0", sevColor[f.severity])} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{f.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{f.message}</div>
        {f.remediation && <div className="text-xs text-muted-foreground mt-1"><span className="font-medium">Fix:</span> {f.remediation}</div>}
        {f.codeReference && <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{f.codeReference}</div>}
      </div>
    </div>
  );
}
