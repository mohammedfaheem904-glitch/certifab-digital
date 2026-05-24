/**
 * WPS Builder Workspace (Phase 4)
 *
 * Guided, process-aware stepper that wraps the existing relational tables
 * with live readiness scoring, validation, and reuse actions. Reads bundle
 * data through props (parent route already queries it) and reuses the same
 * editor components surfaced in the standalone tabs.
 */
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2, Circle, AlertTriangle, ChevronRight, ChevronLeft,
  Sparkles, Copy, GitBranch, ListChecks, Loader2, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { JointConfigList } from "./JointConfigList";
import { BaseMetalsTable } from "./BaseMetalsTable";
import { FillerMetalsTable } from "./FillerMetalsTable";
import { ElectricalCharacteristicsTable } from "./ElectricalCharacteristicsTable";
import { WpsVariablesMatrix } from "./WpsVariablesMatrix";
import {
  PositionsTable, PreheatTable, TechniquesTable,
  ShieldingGasesTable, PwhtTable,
} from "./DynamicSectionTables";

import { validateWpsCompleteness } from "@/lib/wps-intelligence";
import { runAllEngines, computeReadiness, type WpsBundle } from "@/lib/wps-engineering";
import { parseProcesses } from "@/lib/wps-rules";
import {
  buildStepReports, overallCompletion, visibleSteps,
  type StepKey, type StepReport,
} from "@/lib/wps-builder";
import { cn } from "@/lib/utils";

type Props = {
  procedureId: string;
  canEdit: boolean;
  bundle: WpsBundle;
};

export function WpsBuilderWorkspace({ procedureId, canEdit, bundle }: Props) {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { profile, user } = useAuth();
  const proc = bundle.wps as any;

  const ctx = {
    process: proc.process, processes: parseProcesses(proc.process),
    standard: proc.standard, joint_type: proc.joint_type,
    pipe_or_plate: proc.pipe_or_plate, automation: proc.automation,
  };

  const steps = useMemo(() => visibleSteps(ctx), [proc.process, proc.standard, proc.pipe_or_plate]);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = steps[activeIdx] ?? steps[0];

  const findings = useMemo(() => [
    ...validateWpsCompleteness(bundle),
    ...runAllEngines(bundle, null, null),
  ], [bundle]);

  const readiness = useMemo(() => computeReadiness(findings, bundle), [findings, bundle]);
  const reports = useMemo(() => buildStepReports(bundle, findings, ctx), [bundle, findings, ctx]);
  const overall = overallCompletion(reports);
  const activeReport = reports.find((r) => r.step.key === activeStep.key);

  const goto = (key: StepKey) => {
    const i = steps.findIndex((s) => s.key === key);
    if (i >= 0) setActiveIdx(i);
  };

  return (
    <div className="space-y-4">
      <BuilderHeader
        proc={proc}
        overall={overall}
        readiness={readiness}
        canEdit={canEdit}
        onDuplicate={() => duplicateProcedure(proc, profile?.company_id ?? undefined, user?.id, nav)}
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Stepper sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
            Workflow ({reports.filter(r => r.status === "complete").length}/{steps.length})
          </div>
          {reports.map((r, i) => (
            <StepperItem
              key={r.step.key}
              report={r}
              index={i}
              active={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </aside>

        {/* Main step content */}
        <main className="col-span-12 lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Step {activeIdx + 1} of {steps.length}{activeStep.codeRef ? ` · ${activeStep.codeRef}` : ""}
                </div>
                <h2 className="text-lg font-semibold mt-0.5">{activeStep.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{activeStep.description}</p>
              </div>
              <StatusPill status={activeReport?.status ?? "pending"} />
            </div>
            <Separator className="my-4" />
            <StepBody stepKey={activeStep.key} procedureId={procedureId} canEdit={canEdit} proc={proc} qc={qc} bundle={bundle} goto={goto} />
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={activeIdx === 0} onClick={() => setActiveIdx(activeIdx - 1)}>
              <ChevronLeft className="size-4 me-1" /> Previous
            </Button>
            <div className="text-xs text-muted-foreground tabular-nums">
              {Math.round(overall * 100)}% complete · readiness {readiness.score}
            </div>
            <Button size="sm" disabled={activeIdx >= steps.length - 1} onClick={() => setActiveIdx(activeIdx + 1)}>
              Next <ChevronRight className="size-4 ms-1" />
            </Button>
          </div>
        </main>

        {/* Validation panel */}
        <aside className="col-span-12 lg:col-span-3 space-y-3 lg:sticky lg:top-4 self-start">
          <ValidationPanel
            report={activeReport}
            readiness={readiness}
            onJump={goto}
            allFindings={findings}
          />
        </aside>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Header
// -----------------------------------------------------------------------------
function BuilderHeader({ proc, overall, readiness, canEdit, onDuplicate }: {
  proc: any;
  overall: number;
  readiness: ReturnType<typeof computeReadiness>;
  canEdit: boolean;
  onDuplicate: () => void;
}) {
  const gradeColor = {
    A: "text-emerald-500", B: "text-emerald-500",
    C: "text-amber-500", D: "text-orange-500", F: "text-destructive",
  }[readiness.grade];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3.5" /> Guided WPS Builder
          </div>
          <h1 className="text-xl font-semibold">{proc.code ?? proc.wps_no ?? "Untitled WPS"}</h1>
          <div className="text-sm text-muted-foreground">
            {proc.standard ?? "—"} · {proc.process ?? "—"} · {proc.revision ?? "Rev 0"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button size="sm" variant="outline" onClick={onDuplicate}>
              <Copy className="size-4 me-1.5" /> Duplicate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium tabular-nums">{Math.round(overall * 100)}%</span>
          </div>
          <Progress value={overall * 100} className="h-2" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Readiness score</span>
            <span className={cn("font-semibold tabular-nums", gradeColor)}>
              {readiness.score} · {readiness.grade}
            </span>
          </div>
          <Progress value={readiness.score} className="h-2" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className={cn("size-4", readiness.status === "Ready for production" ? "text-emerald-500" : "text-amber-500")} />
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium">{readiness.status}</span>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Stepper item
// -----------------------------------------------------------------------------
function StepperItem({ report, index, active, onClick }: {
  report: StepReport; index: number; active: boolean; onClick: () => void;
}) {
  const Icon =
    report.status === "complete" ? CheckCircle2 :
    report.status === "blocked" ? AlertTriangle :
    Circle;
  const iconColor =
    report.status === "complete" ? "text-emerald-500" :
    report.status === "blocked" ? "text-destructive" :
    report.status === "in_progress" ? "text-primary" :
    "text-muted-foreground";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-start rounded-lg px-3 py-2.5 flex items-start gap-3 transition-colors border",
        active ? "bg-muted/60 border-border" : "border-transparent hover:bg-muted/40",
      )}
    >
      <Icon className={cn("size-4 mt-0.5 shrink-0", iconColor)} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium flex items-center gap-1.5">
          <span className="text-muted-foreground tabular-nums">{index + 1}.</span>
          {report.step.short}
          {!report.step.required && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">optional</Badge>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground truncate">{report.summary}</div>
      </div>
    </button>
  );
}

function StatusPill({ status }: { status: StepReport["status"] }) {
  const map: Record<StepReport["status"], { label: string; cls: string }> = {
    complete:    { label: "Complete",    cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
    in_progress: { label: "In progress", cls: "bg-primary/10 text-primary border-primary/30" },
    blocked:     { label: "Issues",      cls: "bg-destructive/10 text-destructive border-destructive/30" },
    optional:    { label: "Optional",    cls: "bg-muted text-muted-foreground border-border" },
    pending:     { label: "Pending",     cls: "bg-muted text-muted-foreground border-border" },
  };
  const m = map[status];
  return <span className={cn("text-[10px] uppercase tracking-wider px-2 py-1 rounded border", m.cls)}>{m.label}</span>;
}

// -----------------------------------------------------------------------------
// Validation Panel
// -----------------------------------------------------------------------------
function ValidationPanel({ report, readiness, onJump, allFindings }: {
  report: StepReport | undefined;
  readiness: ReturnType<typeof computeReadiness>;
  onJump: (k: StepKey) => void;
  allFindings: ReturnType<typeof validateWpsCompleteness>;
}) {
  const blockers = readiness.blockers;
  const stepFindings = report?.findings ?? [];

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ListChecks className="size-3.5" /> This step
        </div>
        {stepFindings.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">No issues for this step.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {stepFindings.slice(0, 6).map((f) => (
              <li key={f.id} className="text-xs border-s-2 ps-2 py-0.5"
                  style={{ borderColor: sevColor(f.severity) }}>
                <div className="font-medium">{f.title}</div>
                {f.remediation && <div className="text-muted-foreground">{f.remediation}</div>}
                {f.codeReference && <div className="text-[10px] text-muted-foreground mt-0.5">{f.codeReference}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {blockers.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="text-[11px] uppercase tracking-wider text-destructive flex items-center gap-1.5">
            <AlertTriangle className="size-3.5" /> Release blockers
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {blockers.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}

      {readiness.impact.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Operational impact</div>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {readiness.impact.map((b, i) => <li key={i}>· {b}</li>)}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">All findings ({allFindings.length})</div>
        <button
          onClick={() => onJump("review")}
          className="text-xs text-primary hover:underline mt-1"
        >
          Jump to Review →
        </button>
      </div>
    </>
  );
}

function sevColor(s: string) {
  return s === "critical" ? "hsl(var(--destructive))"
    : s === "error" ? "hsl(var(--destructive))"
    : s === "warning" ? "hsl(38 92% 50%)"
    : "hsl(var(--muted-foreground))";
}

// -----------------------------------------------------------------------------
// Step bodies
// -----------------------------------------------------------------------------
function StepBody({ stepKey, procedureId, canEdit, proc, qc, bundle, goto }: {
  stepKey: StepKey;
  procedureId: string;
  canEdit: boolean;
  proc: any;
  qc: ReturnType<typeof useQueryClient>;
  bundle: WpsBundle;
  goto: (k: StepKey) => void;
}) {
  switch (stepKey) {
    case "general":   return <GeneralStep proc={proc} canEdit={canEdit} qc={qc} />;
    case "processes": return <ProcessStep proc={proc} canEdit={canEdit} qc={qc} />;
    case "joints":      return <JointConfigList procedureId={procedureId} canEdit={canEdit} />;
    case "basemetals":  return <BaseMetalsTable procedureId={procedureId} canEdit={canEdit} />;
    case "fillers":     return <FillerMetalsTable procedureId={procedureId} canEdit={canEdit} />;
    case "positions":   return <PositionsTable procedureId={procedureId} canEdit={canEdit} />;
    case "preheat":     return <PreheatTable procedureId={procedureId} canEdit={canEdit} />;
    case "electrical":  return <ElectricalCharacteristicsTable procedureId={procedureId} canEdit={canEdit} />;
    case "gases":       return <ShieldingGasesTable procedureId={procedureId} canEdit={canEdit} />;
    case "pwht":        return <PwhtTable procedureId={procedureId} canEdit={canEdit} />;
    case "techniques":  return <TechniquesTable procedureId={procedureId} canEdit={canEdit} />;
    case "variables":   return <WpsVariablesMatrix procedureId={procedureId} canEdit={canEdit} process={proc.process} />;
    case "review":      return <ReviewStep bundle={bundle} goto={goto} />;
    case "approval":    return <ApprovalStep proc={proc} bundle={bundle} />;
  }
}

// -----------------------------------------------------------------------------
// Inline-editable General / Process steps (mini autosave on blur)
// -----------------------------------------------------------------------------
function GeneralStep({ proc, canEdit, qc }: { proc: any; canEdit: boolean; qc: ReturnType<typeof useQueryClient> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <InlineField label="WPS No" field="wps_no" proc={proc} canEdit={canEdit} qc={qc} placeholder="WPS-001" />
      <InlineField label="Document No" field="document_no" proc={proc} canEdit={canEdit} qc={qc} />
      <InlineField label="Code / Standard" field="standard" proc={proc} canEdit={canEdit} qc={qc} placeholder="ASME IX" />
      <InlineField label="Supporting PQR" field="pqr_no" proc={proc} canEdit={canEdit} qc={qc} placeholder="PQR-001" />
      <InlineField label="Code reference" field="code" proc={proc} canEdit={canEdit} qc={qc} />
      <InlineField label="Revision" field="revision" proc={proc} canEdit={canEdit} qc={qc} />
    </div>
  );
}

function ProcessStep({ proc, canEdit, qc }: { proc: any; canEdit: boolean; qc: ReturnType<typeof useQueryClient> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <InlineField label="Process(es)" field="process" proc={proc} canEdit={canEdit} qc={qc} placeholder="GTAW + SMAW" />
      <InlineField label="Automation" field="automation" proc={proc} canEdit={canEdit} qc={qc} placeholder="Manual / Mechanized" />
      <InlineField label="Pipe or plate" field="pipe_or_plate" proc={proc} canEdit={canEdit} qc={qc} placeholder="Pipe / Plate" />
      <InlineField label="Joint type" field="joint_type" proc={proc} canEdit={canEdit} qc={qc} placeholder="Butt / Fillet" />
      <InlineField label="Groove type" field="groove_type" proc={proc} canEdit={canEdit} qc={qc} placeholder="V / Single bevel" />
      <InlineField label="Progression" field="welding_progression" proc={proc} canEdit={canEdit} qc={qc} placeholder="Uphill / Downhill" />
    </div>
  );
}

function InlineField({ label, field, proc, canEdit, qc, placeholder }: {
  label: string; field: string; proc: any; canEdit: boolean;
  qc: ReturnType<typeof useQueryClient>; placeholder?: string;
}) {
  const [val, setVal] = useState<string>(proc[field] ?? "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if ((proc[field] ?? "") === val) return;
    setSaving(true);
    const { error } = await (supabase.from("procedures") as any).update({ [field]: val || null }).eq("id", proc.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["procedure", proc.id] });
  };
  return (
    <div className="space-y-1.5">
      <Label className="text-xs flex items-center justify-between">
        <span>{label}</span>
        {saving && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
      </Label>
      <Input
        value={val}
        disabled={!canEdit}
        placeholder={placeholder}
        onChange={(e) => setVal(e.target.value)}
        onBlur={save}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Review / Approval
// -----------------------------------------------------------------------------
function ReviewStep({ bundle, goto }: { bundle: WpsBundle; goto: (k: StepKey) => void }) {
  const findings = [
    ...validateWpsCompleteness(bundle),
    ...runAllEngines(bundle, null, null),
  ];
  const byCat = findings.reduce<Record<string, typeof findings>>((a, f) => {
    (a[f.category] ??= []).push(f); return a;
  }, {});
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
        <CheckCircle2 className="size-4" /> No engineering findings — this WPS is ready for approval.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {Object.entries(byCat).map(([cat, items]) => (
        <div key={cat} className="rounded-lg border border-border">
          <div className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
            {cat.replace(/_/g, " ")} ({items.length})
          </div>
          <ul className="divide-y divide-border/60">
            {items.map((f) => (
              <li key={f.id} className="px-3 py-2.5 text-sm flex items-start gap-3">
                <span className="size-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: sevColor(f.severity) }} />
                <div className="flex-1">
                  <div className="font-medium">{f.title}</div>
                  {f.message !== f.title && <div className="text-xs text-muted-foreground">{f.message}</div>}
                  {f.remediation && <div className="text-xs text-muted-foreground mt-1">→ {f.remediation}</div>}
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">{f.severity}</Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => goto("approval")}>
        Continue to approval <ChevronRight className="size-4 ms-1" />
      </Button>
    </div>
  );
}

function ApprovalStep({ proc, bundle }: { proc: any; bundle: WpsBundle }) {
  const status = proc.status ?? "Draft";
  return (
    <div className="space-y-3 text-sm">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="text-xs text-muted-foreground">Current status</div>
        <div className="text-lg font-semibold mt-0.5">{status}</div>
      </div>
      <p className="text-muted-foreground">
        Use the status actions in the page header (Submit / Approve / Reject) to transition the WPS.
        All transitions are recorded in the audit log and create signature entries.
      </p>
      <div className="text-xs text-muted-foreground">
        Signatures on file: {bundle.signatures.length}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Duplicate workflow
// -----------------------------------------------------------------------------
async function duplicateProcedure(proc: any, companyId: string | undefined, userId: string | undefined, nav: any) {
  if (!companyId) return;
  const newCode = window.prompt("New WPS code:", `${proc.code ?? "WPS"}-COPY`);
  if (!newCode) return;
  // copy header fields, reset workflow
  const exclude = new Set(["id", "created_at", "updated_at", "approved_at", "approved_by",
    "reviewed_at", "reviewed_by", "submitted_for_review_at", "submitted_by",
    "qr_token", "deleted_at", "deleted_by"]);
  const payload: any = { company_id: companyId, status: "Draft", revision: "Rev 0" };
  for (const [k, v] of Object.entries(proc)) {
    if (!exclude.has(k) && v != null) payload[k] = v;
  }
  payload.code = newCode;
  payload.wps_no = newCode;
  const { data, error } = await (supabase.from("procedures") as any)
    .insert(payload).select("id").single();
  if (error) return toast.error(error.message);
  toast.success("Duplicated — opening new draft");
  nav({ to: "/app/procedures/$procedureId", params: { procedureId: data.id } });
}
