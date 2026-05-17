import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { scoreWpsCompliance, validateWpsCompleteness, type ComplianceFinding, type Severity } from "@/lib/wps-intelligence";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WpsCompliancePanel({ proc }: { proc: any }) {
  const procedureId = proc.id;
  const bundle = useQuery({
    queryKey: ["wps_intel_bundle", procedureId],
    queryFn: async () => {
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

  if (bundle.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" />Analyzing…</div>;
  }
  if (!bundle.data) return null;

  const findings = validateWpsCompleteness(bundle.data);
  const { score, grade } = scoreWpsCompliance(findings);

  const grouped = findings.reduce((acc, f) => {
    (acc[f.severity] ||= []).push(f);
    return acc;
  }, {} as Record<Severity, ComplianceFinding[]>);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-5">
        <div className={cn(
          "rounded-2xl size-20 flex items-center justify-center text-3xl font-bold",
          score >= 85 ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
          : score >= 70 ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-destructive/15 text-destructive"
        )}>{grade}</div>
        <div className="flex-1">
          <div className="text-2xl font-semibold tabular-nums">{score}<span className="text-base text-muted-foreground"> / 100</span></div>
          <div className="text-sm text-muted-foreground">
            {findings.length === 0 ? "No issues detected." : `${findings.length} finding${findings.length === 1 ? "" : "s"} across ${Object.keys(grouped).length} severity level${Object.keys(grouped).length === 1 ? "" : "s"}.`}
          </div>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-3 text-sm">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <div>WPS passes all completeness checks.</div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-sm font-medium">Findings</div>
          <ul className="divide-y divide-border">
            {(["critical", "error", "warning", "info"] as Severity[]).flatMap((sev) =>
              (grouped[sev] ?? []).map((f) => <FindingRow key={f.id} f={f} />)
            )}
          </ul>
        </div>
      )}
    </div>
  );
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
    <li className="px-5 py-3 flex items-start gap-3">
      <Icon className={cn("size-4 mt-0.5", sevColor[f.severity])} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{f.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{f.message}</div>
        {f.remediation && <div className="text-xs text-muted-foreground mt-1"><span className="font-medium">Fix:</span> {f.remediation}</div>}
      </div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.category.replace("_", " ")}</span>
    </li>
  );
}
