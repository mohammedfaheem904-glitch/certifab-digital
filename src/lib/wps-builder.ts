/**
 * WPS Builder Workspace — pure logic (Phase 4)
 *
 * Defines the guided engineering stepper, dynamic visibility, and per-step
 * completion scoring used by the Builder UI. Pure functions only — no I/O.
 */

import type { ComplianceFinding } from "./wps-intelligence";
import type { WpsBundle } from "./wps-engineering";
import { getApplicableSections, parseProcesses, type WpsContext } from "./wps-rules";

export type StepKey =
  | "general"
  | "processes"
  | "joints"
  | "basemetals"
  | "fillers"
  | "positions"
  | "preheat"
  | "electrical"
  | "gases"
  | "pwht"
  | "techniques"
  | "variables"
  | "review"
  | "approval";

export type BuilderStep = {
  key: StepKey;
  label: string;
  short: string;
  description: string;
  required: boolean;
  codeRef?: string;
  /** Sections from wps-rules that gate this step (empty = always shown). */
  gatedBy?: ("shielding_gases" | "pwht")[];
};

export const BUILDER_STEPS: BuilderStep[] = [
  { key: "general",     label: "General information",        short: "General",      description: "WPS identifier, code family, supporting PQR.", required: true,  codeRef: "QW-200" },
  { key: "processes",   label: "Welding processes",          short: "Processes",    description: "Process(es), automation level, multi-process layout.", required: true, codeRef: "QW-403" },
  { key: "joints",      label: "Joint design",               short: "Joints",       description: "Groove geometry, backing, progression.", required: true, codeRef: "QW-402" },
  { key: "basemetals",  label: "Base materials",             short: "Base metals",  description: "P-No, group, thickness and diameter ranges.", required: true, codeRef: "QW-403" },
  { key: "fillers",     label: "Filler metals",              short: "Fillers",      description: "Consumables — SFA / AWS class / F-No / A-No.", required: true, codeRef: "QW-404" },
  { key: "positions",   label: "Positions & progression",    short: "Positions",    description: "Qualified positions and uphill/downhill progression.", required: true, codeRef: "QW-405" },
  { key: "preheat",     label: "Preheat & interpass",        short: "Preheat",      description: "Preheat, interpass, maintenance.", required: true, codeRef: "QW-406" },
  { key: "electrical",  label: "Electrical characteristics", short: "Electrical",   description: "Pass-by-pass amperage, voltage, polarity.", required: true, codeRef: "QW-409" },
  { key: "gases",       label: "Shielding & purge gases",    short: "Gases",        description: "Gas type, composition, flow, purge.", required: false, codeRef: "QW-408", gatedBy: ["shielding_gases"] },
  { key: "pwht",        label: "Post weld heat treatment",   short: "PWHT",         description: "Temperature, hold, ramp rates.", required: false, codeRef: "QW-407" },
  { key: "techniques",  label: "Technique & variables",      short: "Technique",    description: "String/weave, cleaning, peening, oscillation.", required: false, codeRef: "QW-410" },
  { key: "variables",   label: "Variables matrix",           short: "Variables",    description: "Essential / supplementary / non-essential map.", required: true, codeRef: "QW-250" },
  { key: "review",      label: "Review & validation",        short: "Review",       description: "Resolve engineering findings before release.", required: true },
  { key: "approval",    label: "Approval & release",         short: "Approval",     description: "Signatures, status transition, audit.", required: true },
];

export function visibleSteps(ctx: WpsContext): BuilderStep[] {
  const sections = new Set(getApplicableSections(ctx).map((s) => s.key));
  return BUILDER_STEPS.filter((s) => {
    if (!s.gatedBy || s.gatedBy.length === 0) return true;
    return s.gatedBy.some((k) => sections.has(k));
  });
}

export type StepStatus = "complete" | "in_progress" | "blocked" | "optional" | "pending";
export type StepReport = {
  step: BuilderStep;
  status: StepStatus;
  /** 0..1 */
  completion: number;
  /** Findings that pertain to this step */
  findings: ComplianceFinding[];
  /** Short human summary used in the sidebar. */
  summary: string;
};

const CATEGORY_TO_STEP: Record<string, StepKey> = {
  header: "general",
  joint: "joints",
  base_metal: "basemetals",
  filler_metal: "fillers",
  electrical: "electrical",
  thermal: "preheat",
  technique: "techniques",
  approval: "approval",
  compatibility: "review",
};

function bucketFindings(findings: ComplianceFinding[]): Record<StepKey, ComplianceFinding[]> {
  const out = Object.fromEntries(BUILDER_STEPS.map((s) => [s.key, [] as ComplianceFinding[]])) as Record<StepKey, ComplianceFinding[]>;
  for (const f of findings) {
    const step = CATEGORY_TO_STEP[f.category] ?? "review";
    out[step].push(f);
  }
  return out;
}

const has = (v: any) => v != null && String(v).trim() !== "";

export function buildStepReports(
  bundle: WpsBundle,
  findings: ComplianceFinding[],
  ctx: WpsContext,
): StepReport[] {
  const steps = visibleSteps(ctx);
  const buckets = bucketFindings(findings);
  const w = bundle.wps as any;
  const procs = parseProcesses(ctx.process);

  const completionByStep: Record<StepKey, number> = {} as any;
  completionByStep.general = avg([has(w.wps_no), has(w.standard), has(w.code ?? w.wps_no), has(w.pqr_no)]);
  completionByStep.processes = avg([has(w.process), procs.length >= 1, has(w.automation), has(w.pipe_or_plate)]);
  completionByStep.joints = bundle.joints.length > 0 ? 1 : 0;
  completionByStep.basemetals = bundle.baseMetals.length === 0 ? 0
    : avg(bundle.baseMetals.map((b: any) => avg([has(b.p_no), has(b.thickness_min_mm), has(b.thickness_max_mm)])));
  completionByStep.fillers = bundle.fillers.length === 0 ? 0
    : avg(bundle.fillers.map((f: any) => avg([has(f.aws_classification) || has(f.sfa_no), has(f.f_no)])));
  completionByStep.positions = has(w.position_qualified) || has(w.position) ? 1 : 0.2;
  completionByStep.preheat = avg([has(w.preheat_min_c) || has(w.preheat_temp), has(w.interpass_max_c) || has(w.interpass_temp)]);
  completionByStep.electrical = bundle.electrical.length === 0 ? 0
    : avg(bundle.electrical.map((e: any) => avg([has(e.amperage_min), has(e.amperage_max), has(e.voltage_min), has(e.voltage_max), has(e.polarity)])));
  completionByStep.gases = has(w.shielding_gas) ? 1 : 0;
  completionByStep.pwht = has(w.pwht) ? 1 : 0.5; // optional → half-credit when intentionally empty
  completionByStep.techniques = has(w.technique_string_weave) || has(w.cleaning_method) ? 1 : 0.3;
  completionByStep.variables = 0.6; // surfaced via Variables tab; we don't load rows here
  completionByStep.review = findings.filter((f) => f.severity === "error" || f.severity === "critical").length === 0 ? 1 : 0.4;
  completionByStep.approval = w.status === "Approved" ? 1 : w.status === "Review" ? 0.5 : 0.1;

  return steps.map((step) => {
    const completion = clamp01(completionByStep[step.key] ?? 0);
    const stepFindings = buckets[step.key] ?? [];
    const hasBlocker = stepFindings.some((f) => f.severity === "error" || f.severity === "critical");
    let status: StepStatus;
    if (completion >= 0.95 && !hasBlocker) status = "complete";
    else if (hasBlocker) status = "blocked";
    else if (completion >= 0.1) status = "in_progress";
    else if (!step.required) status = "optional";
    else status = "pending";

    const summary =
      status === "complete" ? "All required fields present."
      : status === "blocked" ? `${stepFindings.filter(f => f.severity !== "info").length} issue(s) to resolve.`
      : status === "in_progress" ? `${Math.round(completion * 100)}% complete.`
      : status === "optional" ? "Optional for this configuration."
      : "Not started.";

    return { step, status, completion, findings: stepFindings, summary };
  });
}

export function overallCompletion(reports: StepReport[]): number {
  const required = reports.filter((r) => r.step.required);
  if (required.length === 0) return 0;
  return required.reduce((a, r) => a + r.completion, 0) / required.length;
}

function avg(xs: (number | boolean)[]) {
  if (xs.length === 0) return 0;
  return xs.reduce<number>((a, b) => a + (typeof b === "boolean" ? (b ? 1 : 0) : b), 0) / xs.length;
}
function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
