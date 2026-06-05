import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  evaluateQualification,
  type ComplianceFinding,
  type ProductionPlan,
  type QualificationLike,
} from "@/lib/qualification-validation";
import { formatRange } from "@/lib/qualification-intelligence";

interface Props {
  qualification: QualificationLike;
}

/**
 * Renders the structured compliance report for a WPQ — status, continuity,
 * range derivation, coverage gaps and an interactive "production plan" check
 * so engineers can verify "is this WPQ valid for THIS job?".
 */
export function QualificationComplianceReport({ qualification }: Props) {
  const [plan, setPlan] = useState<ProductionPlan>({});
  const [planEnabled, setPlanEnabled] = useState(false);

  const report = useMemo(
    () => evaluateQualification(qualification, planEnabled ? plan : undefined),
    [qualification, plan, planEnabled],
  );

  const grouped = report.findings.reduce<Record<string, ComplianceFinding[]>>((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});

  const riskTone =
    report.riskLevel === "High" ? "bg-destructive/10 text-destructive border-destructive/30" :
    report.riskLevel === "Medium" ? "bg-warning/10 text-warning border-warning/30" :
    "bg-success/10 text-success border-success/30";

  return (
    <div className="space-y-4">
      {/* Score banner */}
      <Card className="p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Compliance score</div>
          <div className="text-3xl font-semibold tracking-tight mt-1">{report.score}<span className="text-base text-muted-foreground">/100</span></div>
        </div>
        <div className={`px-3 py-1.5 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 ${riskTone}`}>
          {report.riskLevel === "Low" ? <ShieldCheck className="size-4" /> : <ShieldAlert className="size-4" />}
          Risk: {report.riskLevel}
        </div>
        <div className="text-xs text-muted-foreground">
          {report.findings.filter((f) => f.severity === "critical").length} critical ·{" "}
          {report.findings.filter((f) => f.severity === "warning").length} warnings ·{" "}
          {report.findings.filter((f) => f.severity === "info").length} info
        </div>
      </Card>

      {/* Derived ranges */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Derived qualification coverage</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <Stat label="Base thickness" value={formatRange(report.ranges.baseThickness)} />
          <Stat label="Deposit thickness" value={formatRange(report.ranges.depositThickness)} />
          <Stat label="Diameter" value={formatRange(report.ranges.diameter)} />
          <Stat label="Positions" value={report.ranges.positions.join(", ") || "—"} />
          <Stat label="Material groups" value={report.ranges.materialGroups.join(", ") || "—"} />
          <Stat label="Backing" value={report.ranges.backing} />
          <Stat label="Product form" value={report.ranges.productForm} />
          <Stat label="Processes" value={report.ranges.processes.join(" + ") || "—"} />
        </div>
        {report.ranges.notes.length > 0 && (
          <ul className="mt-3 text-xs text-muted-foreground list-disc ms-5 space-y-0.5">
            {report.ranges.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        )}
      </Card>

      {/* Production plan check */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Production plan check</h3>
          <Button size="sm" variant={planEnabled ? "default" : "outline"} onClick={() => setPlanEnabled((s) => !s)}>
            {planEnabled ? "Active" : "Run check"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the production weld parameters to verify if this WPQ covers the job (process, thickness, OD,
          position, backing, P-Number).
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <PF label="Process"><Input value={plan.process ?? ""} onChange={(e) => setPlan((s) => ({ ...s, process: e.target.value }))} placeholder="GTAW" /></PF>
          <PF label="Thickness (mm)"><Input type="number" value={plan.thicknessMm ?? ""} onChange={(e) => setPlan((s) => ({ ...s, thicknessMm: Number(e.target.value) || undefined }))} /></PF>
          <PF label="Pipe OD (mm)"><Input type="number" value={plan.diameterMm ?? ""} onChange={(e) => setPlan((s) => ({ ...s, diameterMm: Number(e.target.value) || undefined, isPipe: true }))} /></PF>
          <PF label="Position">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={plan.position ?? ""} onChange={(e) => setPlan((s) => ({ ...s, position: e.target.value }))}>
              <option value="">— Select position —</option>
              <option value="1G (Flat Groove)">1G (Flat Groove)</option>
              <option value="2G (Horizontal Groove)">2G (Horizontal Groove)</option>
              <option value="3G (Vertical Groove)">3G (Vertical Groove)</option>
              <option value="4G (Overhead Groove)">4G (Overhead Groove)</option>
              <option value="5G (Fixed Horizontal Pipe)">5G (Fixed Horizontal Pipe)</option>
              <option value="6G (Fixed 45° Pipe)">6G (Fixed 45° Pipe)</option>
              <option value="1F (Flat Fillet)">1F (Flat Fillet)</option>
              <option value="2F (Horizontal Fillet)">2F (Horizontal Fillet)</option>
              <option value="3F (Vertical Fillet)">3F (Vertical Fillet)</option>
              <option value="4F (Overhead Fillet)">4F (Overhead Fillet)</option>
              <option value="5F (Fixed Horizontal Pipe Fillet)">5F (Fixed Horizontal Pipe Fillet)</option>
            </select>
          </PF>
          <PF label="P-Number"><Input type="number" value={plan.pNumber ?? ""} onChange={(e) => setPlan((s) => ({ ...s, pNumber: Number(e.target.value) || undefined }))} /></PF>
          <PF label="Backing">
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={plan.withBacking == null ? "" : plan.withBacking ? "yes" : "no"}
              onChange={(e) => setPlan((s) => ({ ...s, withBacking: e.target.value === "" ? undefined : e.target.value === "yes" }))}>
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
            No compliance findings — qualification record is clean.
          </Card>
        )}
      </div>
    </div>
  );
}

function FindingRow({ f }: { f: ComplianceFinding }) {
  const Icon =
    f.severity === "critical" ? AlertTriangle :
    f.severity === "warning" ? AlertTriangle :
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
        {f.remediation && (
          <div className="text-xs"><span className="font-semibold">Action:</span> {f.remediation}</div>
        )}
      </div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-2.5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-sm mt-0.5 break-words">{value}</div>
    </div>
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
