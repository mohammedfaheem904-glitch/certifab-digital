import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, ShieldCheck, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  evaluateWeldCompatibility,
  type WeldLike,
  type WeldMatchReport,
} from "@/lib/weld-matching";
import type { ComplianceFinding } from "@/lib/qualification-validation";

interface Props {
  weld: any;
}

/**
 * Renders the WPS ↔ WPQ ↔ Weld compatibility report for a given production
 * weld. Lets the engineer pick a welder (WPQ) and confirm production
 * parameters that aren't stored on the weld row (thickness, OD, position,
 * backing, P-Number).
 */
export function WeldComplianceCheck({ weld }: Props) {
  const [wpqId, setWpqId] = useState<string | "">("");
  const [params, setParams] = useState<Partial<WeldLike>>({
    thicknessMm: undefined,
    diameterMm: undefined,
    isPipe: false,
    position: undefined,
    withBacking: undefined,
    pNumber: undefined,
  });

  const wps = useQuery({
    queryKey: ["wps-for-weld", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data as any;
    },
  });

  const qualifications = useQuery<any[]>({
    queryKey: ["wpq-options", weld.welder_name],
    queryFn: async () => {
      const q = supabase.from("qualifications").select("id,welder_name,employee_id,wpq_number,process,position_qualified,test_thickness_mm,test_diameter_mm,test_coupon_type,code_family,standard,status,result,expiry_date,qualification_date,last_continuity_date,pqr_number,wps_number");
      const { data } = weld.welder_name
        ? await q.ilike("welder_name", `%${weld.welder_name}%`).order("created_at", { ascending: false })
        : await q.order("created_at", { ascending: false }).limit(25);
      return (data ?? []) as any[];
    },
  });

  /* Auto-select the most relevant WPQ on first load. */
  const autoWpqId = qualifications.data?.[0]?.id ?? "";
  const effectiveId = wpqId || autoWpqId;
  const wpq = qualifications.data?.find((q) => q.id === effectiveId) ?? null;

  const report: WeldMatchReport = useMemo(
    () => evaluateWeldCompatibility({
      weld: { ...weld, ...params },
      wps: wps.data ?? null,
      wpq,
    }),
    [weld, params, wps.data, wpq],
  );

  const grouped = report.findings.reduce<Record<string, ComplianceFinding[]>>((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});

  const verdictTone =
    report.readiness === "Ready to weld" ? "border-success/40 bg-success/10 text-success" :
    report.readiness === "Hold — do not weld" ? "border-destructive/40 bg-destructive/10 text-destructive" :
    "border-warning/40 bg-warning/10 text-warning";

  return (
    <div className="space-y-4">
      {/* Verdict */}
      <Card className={`p-5 border ${verdictTone}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {report.readiness === "Ready to weld" ? <ShieldCheck className="size-6" /> : <ShieldAlert className="size-6" />}
            <div>
              <div className="text-base font-semibold tracking-tight">{report.readiness}</div>
              <div className="text-xs opacity-80">{report.summary}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold leading-none">{report.overallScore}<span className="text-base opacity-70">/100</span></div>
            <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1">Overall compatibility</div>
          </div>
        </div>
      </Card>

      {/* Subscores */}
      <div className="grid sm:grid-cols-3 gap-3">
        <ScoreCard label="WPS ↔ Weld" value={report.subscores.wpsToWeld} hint="Procedure covers process / position / range / material" />
        <ScoreCard label="WPQ ↔ Weld" value={report.subscores.wpqToWeld} hint="Welder qualified for the production parameters" />
        <ScoreCard label="WPS ↔ WPQ" value={report.subscores.wpsToWpq} hint="Procedure and qualification agree on process & material" />
      </div>

      {/* Inputs */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Wand2 className="size-4 text-primary" /> Production parameters</h3>
          <Button variant="outline" size="sm" onClick={() => setParams({})}>Reset</Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <PF label="Welder qualification (WPQ)">
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={effectiveId} onChange={(e) => setWpqId(e.target.value)}>
              <option value="">— Select WPQ —</option>
              {(qualifications.data ?? []).map((q) => (
                <option key={q.id} value={q.id}>
                  {q.welder_name} · {q.wpq_number ?? q.employee_id} · {q.process}
                </option>
              ))}
            </select>
          </PF>
          <PF label="Thickness (mm)">
            <Input type="number" value={params.thicknessMm ?? ""} onChange={(e) => setParams((s) => ({ ...s, thicknessMm: Number(e.target.value) || undefined }))} />
          </PF>
          <PF label="Pipe OD (mm)">
            <Input type="number" value={params.diameterMm ?? ""} onChange={(e) => setParams((s) => ({ ...s, diameterMm: Number(e.target.value) || undefined, isPipe: !!Number(e.target.value) }))} />
          </PF>
          <PF label="Position">
            <Input value={params.position ?? ""} onChange={(e) => setParams((s) => ({ ...s, position: e.target.value.toUpperCase() }))} placeholder="6G" />
          </PF>
          <PF label="P-Number">
            <Input type="number" value={params.pNumber ?? ""} onChange={(e) => setParams((s) => ({ ...s, pNumber: Number(e.target.value) || undefined }))} />
          </PF>
          <PF label="Backing">
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={params.withBacking == null ? "" : params.withBacking ? "yes" : "no"}
              onChange={(e) => setParams((s) => ({ ...s, withBacking: e.target.value === "" ? undefined : e.target.value === "yes" }))}>
              <option value="">—</option><option value="yes">With backing</option><option value="no">Without backing</option>
            </select>
          </PF>
        </div>
      </Card>

      {/* Findings */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([cat, items]) => (
          <Card key={cat} className="p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{cat}</h3>
            <ul className="space-y-3">
              {items.map((f) => <FindingRow key={f.id} f={f} />)}
            </ul>
          </Card>
        ))}
        {report.findings.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No issues detected. WPS, WPQ and weld parameters are compatible.
          </Card>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  const tone = value >= 90 ? "text-success" : value >= 60 ? "text-warning" : "text-destructive";
  return (
    <Card className="p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${tone}`}>{value}<span className="text-sm text-muted-foreground">/100</span></div>
      <Progress value={value} className="mt-2 h-1.5" />
      <div className="text-[11px] text-muted-foreground mt-2 leading-snug">{hint}</div>
    </Card>
  );
}

function FindingRow({ f }: { f: ComplianceFinding }) {
  const Icon =
    f.severity === "critical" || f.severity === "warning" ? AlertTriangle :
    f.severity === "pass" ? CheckCircle2 : Info;
  const tone =
    f.severity === "critical" ? "text-destructive bg-destructive/5 border-destructive/30" :
    f.severity === "warning" ? "text-warning bg-warning/5 border-warning/30" :
    f.severity === "pass" ? "text-success bg-success/5 border-success/30" :
    "text-muted-foreground bg-muted/30 border-border";
  return (
    <li className={`rounded-md border p-3 flex gap-3 ${tone}`}>
      <Icon className="size-4 mt-0.5 shrink-0" />
      <div className="space-y-1 text-sm">
        <div className="font-medium text-foreground">{f.title}</div>
        <div className="text-foreground/80">{f.message}</div>
        {f.codeRef && <div className="text-xs font-mono opacity-80">Ref: {f.codeRef}</div>}
        {f.remediation && <div className="text-xs"><span className="font-semibold">Action:</span> {f.remediation}</div>}
      </div>
    </li>
  );
}

function PF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
