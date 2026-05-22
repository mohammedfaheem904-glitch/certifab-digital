/**
 * Recommendations Engine — operational guidance across the platform.
 *
 * Pure, side-effect-free functions per entity. Each returns a prioritised list
 * of `Recommendation`s the UI can render as banners, action cards or list
 * chips. Wraps existing intelligence (`weld-readiness`, `weld-matching`,
 * `qualification-validation`, `qualification-status`) — no rule duplication.
 *
 * Shape is shared across all modules so banners, dashboard and detail pages
 * stay in lockstep.
 */

import type { AppRole } from "./auth";
import type { ReleaseReadiness } from "./weld-readiness";
import { continuityBroken, continuityWarning, deriveQualStatus } from "./qualification-status";

export type RecSeverity = "critical" | "warning" | "info" | "ok";

export type RecActionKind = "navigate" | "open-dialog" | "external";

export type RecActionDialog =
  | "assign-welder"
  | "pick-wps"
  | "create-ncr"
  | "create-inspection"
  | "request-approval"
  | "request-calibration"
  | "renew-qualification"
  | "log-continuity";

export interface RecAction {
  label: string;
  kind: RecActionKind;
  to?: string;
  search?: Record<string, string>;
  params?: Record<string, string>;
  dialog?: RecActionDialog;
  payload?: Record<string, unknown>;
}

export interface Recommendation {
  id: string;
  severity: RecSeverity;
  /** Headline e.g. "Renew welder qualification". */
  title: string;
  /** Plain-language explanation of why this matters now. */
  why: string;
  /** Code clause that drives the rule (e.g. "ASME IX QW-322"). */
  rule?: string;
  /** Operational consequence if the user does nothing. */
  impact: string;
  /** Narrative how-to. */
  remediation: string;
  /** Optional one-click action. */
  action?: RecAction;
  /** Roles for whom this is actionable. Empty = anyone. */
  roles?: AppRole[];
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Verdict / banner                                                   */
/* ──────────────────────────────────────────────────────────────────── */

export type Verdict = {
  severity: RecSeverity;
  label: string;          // "Critical Risk" | "Attention Required" | …
  summary: string;        // one-line operational summary
  next?: string;          // suggested next step (string form)
};

const sevOrder: Record<RecSeverity, number> = { critical: 3, warning: 2, info: 1, ok: 0 };

export function highestSeverity(recs: Recommendation[]): RecSeverity {
  return recs.reduce<RecSeverity>(
    (acc, r) => (sevOrder[r.severity] > sevOrder[acc] ? r.severity : acc),
    "ok",
  );
}

export function sortRecs(recs: Recommendation[]): Recommendation[] {
  return [...recs].sort((a, b) => sevOrder[b.severity] - sevOrder[a.severity]);
}

export function severityLabel(s: RecSeverity): string {
  return s === "critical" ? "Critical Risk"
    : s === "warning" ? "Attention Required"
    : s === "info" ? "Pending Review"
    : "Ready";
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Welds                                                              */
/* ──────────────────────────────────────────────────────────────────── */

export interface RecommendWeldInput {
  weldId: string;
  weld: { workflow_status?: string | null; welder_name?: string | null; procedure_id?: string | null };
  readiness: ReleaseReadiness;
  roles?: AppRole[];
}

export function recommendForWeld(input: RecommendWeldInput): Recommendation[] {
  const { weldId, weld, readiness } = input;
  const recs: Recommendation[] = [];

  // 1. Convert each readiness blocker / warning into an actionable recommendation
  for (const f of readiness.blockers) {
    recs.push({
      id: `weld-${weldId}-${f.id}`,
      severity: "critical",
      title: f.title,
      why: f.message,
      rule: f.codeRef,
      impact: "Production weld cannot be released — release authorisation will fail QA/QC review.",
      remediation: f.remediation ?? "Resolve the blocking condition and re-run the compliance check.",
      action: mapFindingAction(f.id, weldId),
      roles: ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"],
    });
  }
  for (const f of readiness.warnings) {
    recs.push({
      id: `weld-${weldId}-${f.id}`,
      severity: "warning",
      title: f.title,
      why: f.message,
      rule: f.codeRef,
      impact: "Engineering review required before this weld can progress to approval.",
      remediation: f.remediation ?? "Review the highlighted condition with the welding engineer.",
      action: mapFindingAction(f.id, weldId),
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  // 2. Workflow-driven actions
  const ws = weld.workflow_status ?? "Draft";
  if (ws === "Ready for Release" && readiness.blockers.length === 0) {
    recs.push({
      id: `weld-${weldId}-approval`,
      severity: "info",
      title: "Request engineering approval",
      why: "All operational checks have passed — the weld is awaiting sign-off from the welding engineer / QA-QC manager.",
      impact: "Without approval the weld cannot be released to production records.",
      remediation: "Submit the weld for approval from the action bar.",
      action: { label: "Submit for approval", kind: "open-dialog", dialog: "request-approval", payload: { weldId } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (!weld.procedure_id) {
    recs.push({
      id: `weld-${weldId}-link-wps`,
      severity: "critical",
      title: "Link a compatible WPS",
      why: "No WPS is linked to this weld, so essential-variable compliance cannot be evaluated.",
      rule: "ASME IX QW-200",
      impact: "Release readiness cannot be calculated; the weld will be flagged in every report.",
      remediation: "Pick a WPS qualified for the weld's process, material and thickness.",
      action: { label: "Pick compatible WPS", kind: "open-dialog", dialog: "pick-wps", payload: { weldId } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (!weld.welder_name) {
    recs.push({
      id: `weld-${weldId}-assign-welder`,
      severity: "warning",
      title: "Assign a qualified welder",
      why: "No welder is assigned to this weld, so WPQ matching is impossible.",
      impact: "Continuity tracking and qualification coverage cannot be enforced.",
      remediation: "Assign a welder whose WPQ covers the WPS process, position and thickness range.",
      action: { label: "Assign welder", kind: "open-dialog", dialog: "assign-welder", payload: { weldId } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  return sortRecs(recs);
}

function mapFindingAction(findingId: string, weldId: string): RecAction | undefined {
  if (findingId === "insp-open") {
    return { label: "Close inspection", kind: "navigate", to: "/app/inspections" };
  }
  if (findingId === "insp-fail" || findingId.startsWith("insp-missing-")) {
    return { label: "Log inspection", kind: "open-dialog", dialog: "create-inspection", payload: { weldId } };
  }
  if (findingId === "ncr-open") {
    return { label: "Open NCRs", kind: "navigate", to: "/app/ncrs" };
  }
  if (findingId.startsWith("cal-")) {
    return { label: "Request recalibration", kind: "navigate", to: "/app/instruments" };
  }
  if (findingId === "approval-pending") {
    return { label: "Request approval", kind: "open-dialog", dialog: "request-approval", payload: { weldId } };
  }
  return undefined;
}

export function weldVerdict(readiness: ReleaseReadiness, recs: Recommendation[]): Verdict {
  const sev = highestSeverity(recs);
  if (readiness.verdict === "Release Ready") {
    return { severity: "ok", label: "Released", summary: "Weld is released to production records." };
  }
  if (readiness.verdict === "Approved") {
    return { severity: "ok", label: "Approved", summary: "Approved by engineering — pending release." };
  }
  if (sev === "critical") {
    return {
      severity: "critical",
      label: "Critical Risk",
      summary: `${readiness.blockers.length} blocker${readiness.blockers.length === 1 ? "" : "s"} prevent release.`,
      next: recs.find((r) => r.severity === "critical")?.title,
    };
  }
  if (sev === "warning") {
    return {
      severity: "warning",
      label: "Attention Required",
      summary: `${readiness.warnings.length} warning${readiness.warnings.length === 1 ? "" : "s"} require engineering review.`,
      next: recs.find((r) => r.severity === "warning")?.title,
    };
  }
  if (sev === "info") {
    return {
      severity: "info",
      label: "Pending Review",
      summary: readiness.summary,
      next: recs[0]?.title,
    };
  }
  return { severity: "ok", label: "Ready for Release", summary: "All operational checks satisfied." };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Qualifications (used in later slice — exported now for reuse)      */
/* ──────────────────────────────────────────────────────────────────── */

export interface QualificationLite {
  id: string;
  welder_name?: string | null;
  process?: string | null;
  expiry_date: string;
  qualification_date?: string | null;
  last_continuity_date?: string | null;
  status?: string | null;
  position_qualified?: string | null;
  test_thickness_mm?: number | string | null;
  code_family?: string | null;
}

export interface QualImpact {
  affectedWelds: number;
  affectedProjects: number;
  pendingReleases: number;
  blockedWelds: number;
}

export interface ReplacementWelder {
  id: string;
  welder_name: string;
  employee_id?: string | null;
  process?: string | null;
  expiry_date?: string | null;
  position_qualified?: string | null;
  test_thickness_mm?: number | string | null;
}

export interface QualReadinessScore {
  score: number;            // 0-100
  band: "Ready" | "Attention Required" | "Expiring Soon" | "High Risk";
  continuityHealth: "Healthy" | "At Risk" | "Broken";
  complianceHealth: "Pass" | "Warning" | "Fail";
  expiryRisk: "None" | "30 days" | "Expired";
}

export interface RecommendQualInput {
  qualification: QualificationLite;
  impact?: QualImpact;
  replacements?: ReplacementWelder[];
}

export function qualReadinessScore(q: QualificationLite): QualReadinessScore {
  const status = deriveQualStatus({
    expiry_date: q.expiry_date,
    status: q.status,
    last_continuity_date: q.last_continuity_date,
  });
  const broken = continuityBroken(q.last_continuity_date ?? null);
  const warn = continuityWarning(q.last_continuity_date ?? null);

  let score = 100;
  if (status === "Expired") score -= 60;
  else if (status === "Expiring Soon") score -= 25;
  else if (status === "Suspended") score -= 80;
  if (broken) score -= 40;
  else if (warn) score -= 12;
  if (!q.position_qualified) score -= 4;
  if (!q.test_thickness_mm) score -= 4;
  score = Math.max(0, Math.min(100, score));

  const continuityHealth: QualReadinessScore["continuityHealth"] =
    broken ? "Broken" : warn ? "At Risk" : "Healthy";
  const expiryRisk: QualReadinessScore["expiryRisk"] =
    status === "Expired" ? "Expired" : status === "Expiring Soon" ? "30 days" : "None";
  const complianceHealth: QualReadinessScore["complianceHealth"] =
    status === "Expired" || status === "Suspended" || broken ? "Fail"
      : status === "Expiring Soon" || warn ? "Warning"
      : "Pass";

  let band: QualReadinessScore["band"] = "Ready";
  if (score < 40) band = "High Risk";
  else if (status === "Expiring Soon") band = "Expiring Soon";
  else if (score < 80) band = "Attention Required";

  return { score, band, continuityHealth, complianceHealth, expiryRisk };
}

export function recommendForQualification({
  qualification: q,
  impact,
  replacements,
}: RecommendQualInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const status = deriveQualStatus({ expiry_date: q.expiry_date, status: q.status });
  const broken = continuityBroken(q.last_continuity_date ?? null);
  const warn = continuityWarning(q.last_continuity_date ?? null);

  const impactSuffix = impact && (impact.affectedWelds + impact.pendingReleases > 0)
    ? ` Currently impacts ${impact.affectedWelds} active weld${impact.affectedWelds === 1 ? "" : "s"} across ${impact.affectedProjects} project${impact.affectedProjects === 1 ? "" : "s"}` +
      (impact.pendingReleases > 0 ? ` and ${impact.pendingReleases} pending release workflow${impact.pendingReleases === 1 ? "" : "s"}.` : ".")
    : "";

  const replacementHint = replacements && replacements.length > 0
    ? ` Suggested replacements: ${replacements.slice(0, 3).map((r) => r.welder_name).join(", ")}.`
    : "";

  if (status === "Expired") {
    recs.push({
      id: `qual-${q.id}-expired`,
      severity: "critical",
      title: "Renew welder qualification",
      why: `Qualification expired on ${q.expiry_date}.${impactSuffix}`,
      rule: "ASME IX QW-322",
      impact: `Welder cannot legitimately weld on production work — any weld signed off under this WPQ may fail audit.${impactSuffix}`,
      remediation: `Re-test the welder against the same essential variables and issue a new WPQ.${replacementHint}`,
      action: { label: "Renew qualification", kind: "open-dialog", dialog: "renew-qualification", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  } else if (status === "Expiring Soon") {
    recs.push({
      id: `qual-${q.id}-expiring`,
      severity: "warning",
      title: "Qualification expiring soon",
      why: `Qualification expires on ${q.expiry_date}.${impactSuffix}`,
      rule: "ASME IX QW-322",
      impact: `Production planning should re-assign welders or schedule re-tests before expiry.${impactSuffix}`,
      remediation: `Schedule a renewal test now to avoid production interruption.${replacementHint}`,
      action: { label: "Schedule renewal", kind: "open-dialog", dialog: "renew-qualification", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (status === "Suspended") {
    recs.push({
      id: `qual-${q.id}-suspended`,
      severity: "critical",
      title: "Qualification is suspended",
      why: `This WPQ is currently suspended.${impactSuffix}`,
      rule: "ASME IX QW-322",
      impact: `Welder cannot perform production work under this qualification until reinstated.${impactSuffix}`,
      remediation: `Resolve the suspension cause and reinstate, or re-qualify the welder.${replacementHint}`,
      roles: ["super_admin", "qa_qc_manager"],
    });
  }

  if (broken) {
    recs.push({
      id: `qual-${q.id}-continuity-broken`,
      severity: "critical",
      title: "Continuity broken",
      why: `No welding activity logged in over 6 months (last activity ${q.last_continuity_date ?? "never recorded"}).${impactSuffix}`,
      rule: "ASME IX QW-322.1",
      impact: `Qualification is suspended for the affected process(es) until requalified.${impactSuffix}`,
      remediation: `Log production welding evidence (or schedule a renewal test) to restore continuity.${replacementHint}`,
      action: { label: "Log continuity", kind: "open-dialog", dialog: "log-continuity", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  } else if (warn) {
    recs.push({
      id: `qual-${q.id}-continuity-warn`,
      severity: "warning",
      title: "Continuity at risk",
      why: `Last welding activity recorded on ${q.last_continuity_date}. Continuity expires after 6 months without activity.`,
      rule: "ASME IX QW-322.1",
      impact: "Without an evidence log soon, the qualification will be suspended automatically.",
      remediation: "Log a recent production weld to extend continuity.",
      action: { label: "Log continuity", kind: "open-dialog", dialog: "log-continuity", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (!q.position_qualified) {
    recs.push({
      id: `qual-${q.id}-no-position`,
      severity: "info",
      title: "Position not recorded",
      why: "Position qualification is missing — coverage cannot be derived per QW-461.9.",
      rule: "ASME IX QW-461.9",
      impact: "Compliance reports will flag this WPQ as incomplete for position coverage.",
      remediation: "Edit the WPQ and record the tested position (e.g. 6G, 3G+4G).",
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  return sortRecs(recs);
}

export function qualVerdict(
  q: QualificationLite,
  recs: Recommendation[],
  score: QualReadinessScore,
  impact?: QualImpact,
): Verdict {
  const sev = highestSeverity(recs);
  const impactPhrase = impact && (impact.affectedWelds + impact.pendingReleases > 0)
    ? ` Impacts ${impact.affectedWelds} weld${impact.affectedWelds === 1 ? "" : "s"} / ${impact.affectedProjects} project${impact.affectedProjects === 1 ? "" : "s"}` +
      (impact.pendingReleases > 0 ? `, ${impact.pendingReleases} pending release.` : ".")
    : "";

  if (sev === "critical") {
    return {
      severity: "critical",
      label: score.band === "High Risk" ? "High Risk" : "Critical Risk",
      summary: `Qualification is not valid for production work.${impactPhrase}`,
      next: recs.find((r) => r.severity === "critical")?.title,
    };
  }
  if (sev === "warning") {
    return {
      severity: "warning",
      label: score.band === "Expiring Soon" ? "Expiring Soon" : "Attention Required",
      summary: `Engineering review required to keep ${q.welder_name ?? "this welder"} on production.${impactPhrase}`,
      next: recs.find((r) => r.severity === "warning")?.title,
    };
  }
  if (sev === "info") {
    return {
      severity: "info",
      label: "Pending Review",
      summary: `Minor data gaps to address.${impactPhrase}`,
      next: recs[0]?.title,
    };
  }
  return {
    severity: "ok",
    label: "Ready",
    summary: `Qualification valid and active.${impactPhrase}`,
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  WPS / Procedures                                                   */
/* ──────────────────────────────────────────────────────────────────── */

export interface WpsLite {
  id: string;
  code?: string | null;
  wps_no?: string | null;
  status?: string | null;
  process?: string | null;
  standard?: string | null;
  revision?: string | null;
  pqr_no?: string | null;
  position_qualified?: string | null;
  position?: string | null;
  thickness_range?: string | null;
  heat_input_min?: number | null;
  heat_input_max?: number | null;
  voltage_min?: number | null;
  voltage_max?: number | null;
  current_min?: number | null;
  current_max?: number | null;
  travel_speed_min?: number | null;
  travel_speed_max?: number | null;
}

export interface WpsUsage {
  activeWelds: number;
  activeProjects: number;
  pendingApprovals: number;
  blockedWelds: number;
  releasedWelds: number;
  openNcrs: number;
  outOfToleranceLogs: number;
}

export interface CompatibleWelder {
  id: string;
  welder_name: string;
  employee_id?: string | null;
  process?: string | null;
  position_qualified?: string | null;
  expiry_date?: string | null;
  test_thickness_mm?: number | string | null;
}

export interface WpsReadinessScore {
  score: number;
  band: "Approved" | "In Review" | "Draft" | "Attention Required" | "High Risk";
  approvalHealth: "Approved" | "Pending" | "Draft" | "Rejected";
  completeness: "Complete" | "Gaps" | "Missing";
  productionImpact: "None" | "Low" | "Medium" | "High";
}

export function wpsReadinessScore(
  wps: WpsLite,
  bundle: { joints: any[]; baseMetals: any[]; fillers: any[]; electrical: any[]; signatures: any[] },
  usage: WpsUsage,
): WpsReadinessScore {
  let score = 100;
  const status = (wps.status ?? "Draft").toLowerCase();
  if (status === "draft") score -= 20;
  else if (status === "review") score -= 10;
  else if (status === "rejected") score -= 60;

  if (bundle.joints.length === 0) score -= 10;
  if (bundle.baseMetals.length === 0) score -= 12;
  if (bundle.fillers.length === 0) score -= 12;
  if (bundle.electrical.length === 0) score -= 12;
  if (status === "approved" && bundle.signatures.length === 0) score -= 6;
  if (!wps.pqr_no) score -= 6;

  if (usage.outOfToleranceLogs > 0) score -= Math.min(15, usage.outOfToleranceLogs * 3);
  if (usage.blockedWelds > 0) score -= Math.min(15, usage.blockedWelds * 3);
  if (usage.openNcrs > 0) score -= Math.min(10, usage.openNcrs * 4);

  score = Math.max(0, Math.min(100, score));

  const approvalHealth: WpsReadinessScore["approvalHealth"] =
    status === "approved" ? "Approved"
      : status === "review" ? "Pending"
      : status === "rejected" ? "Rejected"
      : "Draft";

  const gaps =
    (bundle.joints.length === 0 ? 1 : 0) +
    (bundle.baseMetals.length === 0 ? 1 : 0) +
    (bundle.fillers.length === 0 ? 1 : 0) +
    (bundle.electrical.length === 0 ? 1 : 0);
  const completeness: WpsReadinessScore["completeness"] =
    gaps === 0 ? "Complete" : gaps <= 1 ? "Gaps" : "Missing";

  const productionImpact: WpsReadinessScore["productionImpact"] =
    usage.activeWelds >= 25 || usage.pendingApprovals >= 5 ? "High"
      : usage.activeWelds >= 10 || usage.pendingApprovals >= 2 ? "Medium"
      : usage.activeWelds > 0 ? "Low"
      : "None";

  let band: WpsReadinessScore["band"] = "Approved";
  if (score < 40) band = "High Risk";
  else if (score < 70) band = "Attention Required";
  else if (status === "review") band = "In Review";
  else if (status === "draft") band = "Draft";
  return { score, band, approvalHealth, completeness, productionImpact };
}

export interface ParameterDrift {
  id: string;
  metric: "heat_input" | "voltage" | "current" | "travel_speed";
  label: string;
  recorded: number;
  min?: number | null;
  max?: number | null;
  severity: "warning" | "critical";
  message: string;
  weldId?: string | null;
  loggedAt?: string | null;
}

export function detectParameterDrift(wps: WpsLite, logs: any[]): ParameterDrift[] {
  const out: ParameterDrift[] = [];
  for (const log of logs) {
    const v = Number(log.voltage), a = Number(log.current_amp),
      ts = Number(log.travel_speed), hi = Number(log.heat_input);
    const check = (
      metric: ParameterDrift["metric"], label: string, val: number,
      min?: number | null, max?: number | null,
    ) => {
      if (!Number.isFinite(val)) return;
      if (max != null && val > max) {
        out.push({
          id: `${log.id}-${metric}-high`, metric, label, recorded: val, min, max,
          severity: "critical",
          message: `${label} ${val} exceeds WPS max ${max}.`,
          weldId: log.weld_id, loggedAt: log.created_at,
        });
      } else if (min != null && val < min) {
        out.push({
          id: `${log.id}-${metric}-low`, metric, label, recorded: val, min, max,
          severity: "warning",
          message: `${label} ${val} below WPS min ${min}.`,
          weldId: log.weld_id, loggedAt: log.created_at,
        });
      }
    };
    check("voltage", "Voltage", v, wps.voltage_min, wps.voltage_max);
    check("current", "Current (A)", a, wps.current_min, wps.current_max);
    check("travel_speed", "Travel speed", ts, wps.travel_speed_min, wps.travel_speed_max);
    check("heat_input", "Heat input (kJ/mm)", hi, wps.heat_input_min, wps.heat_input_max);
  }
  return out.slice(0, 12);
}

export interface RecommendWpsInput {
  wps: WpsLite;
  bundle: { joints: any[]; baseMetals: any[]; fillers: any[]; electrical: any[]; signatures: any[] };
  usage: WpsUsage;
  compatibleWelders?: CompatibleWelder[];
  drift?: ParameterDrift[];
}

export function recommendForWps({
  wps, bundle, usage, compatibleWelders, drift = [],
}: RecommendWpsInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const status = (wps.status ?? "Draft").toLowerCase();

  const impactSuffix =
    usage.activeWelds > 0
      ? ` Currently impacts ${usage.activeWelds} active weld${usage.activeWelds === 1 ? "" : "s"} across ${usage.activeProjects} project${usage.activeProjects === 1 ? "" : "s"}` +
        (usage.pendingApprovals > 0 ? ` and ${usage.pendingApprovals} pending release${usage.pendingApprovals === 1 ? "" : "s"}.` : ".")
      : "";

  if (status === "draft") {
    recs.push({
      id: `wps-${wps.id}-submit`,
      severity: "info",
      title: "Submit WPS for review",
      why: "This WPS is still in Draft — production welding cannot reference it for compliance.",
      rule: "ASME IX QW-200.2",
      impact: `Any weld linked to a draft WPS will fail release readiness.${impactSuffix}`,
      remediation: "Complete the essential variables and submit the WPS for engineering review.",
      action: { label: "Submit for review", kind: "open-dialog", dialog: "request-approval", payload: { wpsId: wps.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  } else if (status === "review") {
    recs.push({
      id: `wps-${wps.id}-approve`,
      severity: "info",
      title: "Awaiting approval signature",
      why: "WPS is under review and waiting for the welding engineer / QA-QC manager sign-off.",
      rule: "ASME IX QW-201",
      impact: `Production welds linked to this WPS cannot be released until approved.${impactSuffix}`,
      remediation: "Review the procedure, confirm essential variables, and approve or reject.",
      roles: ["super_admin", "qa_qc_manager"],
    });
  } else if (status === "rejected") {
    recs.push({
      id: `wps-${wps.id}-rejected`,
      severity: "critical",
      title: "WPS rejected — production blocked",
      why: "This WPS was rejected during review and cannot be used for production welding.",
      impact: `All welds linked to this WPS are non-compliant until a new revision is approved.${impactSuffix}`,
      remediation: "Issue a corrected revision, address the rejection comments, and re-submit for approval.",
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (bundle.joints.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-joints`, severity: "warning",
      title: "Add joint configuration",
      why: "No joint configuration is defined for this WPS.",
      rule: "ASME IX QW-402",
      impact: "Welds will not have geometry traceability and the WPS document will print incomplete.",
      remediation: "Add at least one joint with groove geometry and (optionally) a sketch.",
      roles: ["super_admin", "welding_engineer"],
    });
  }
  if (bundle.baseMetals.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-base`, severity: "warning",
      title: "Add base metals",
      why: "No base metals are defined — P-Number coverage cannot be derived.",
      rule: "ASME IX QW-403",
      impact: "Material compatibility checks will fail for every linked weld.",
      remediation: "Add at least one base metal with P-No and thickness range.",
      roles: ["super_admin", "welding_engineer"],
    });
  }
  if (bundle.fillers.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-filler`, severity: "warning",
      title: "Add filler metals",
      why: "No filler metals are defined for this procedure.",
      rule: "ASME IX QW-404",
      impact: "Consumable traceability is missing and WPS↔WPQ matching cannot resolve F-Number.",
      remediation: "Add at least one filler with AWS class / SFA No and F-No.",
      roles: ["super_admin", "welding_engineer"],
    });
  }
  if (bundle.electrical.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-electrical`, severity: "warning",
      title: "Add electrical parameters",
      why: "No amperage / voltage ranges are defined — parameter drift cannot be detected.",
      rule: "ASME IX QW-409",
      impact: "Heat-input and parameter compliance for every linked weld is unverifiable.",
      remediation: "Add at least one pass with amperage and voltage ranges.",
      roles: ["super_admin", "welding_engineer"],
    });
  }

  if (drift.length > 0) {
    const crit = drift.filter((d) => d.severity === "critical").length;
    recs.push({
      id: `wps-${wps.id}-drift`,
      severity: crit > 0 ? "critical" : "warning",
      title: `Parameter drift detected on ${drift.length} log${drift.length === 1 ? "" : "s"}`,
      why: `Production logs are drifting outside WPS expected ranges (${crit} critical, ${drift.length - crit} warning).`,
      rule: "ASME IX QW-409",
      impact: "Affected welds may be non-compliant and could trigger NCRs at audit.",
      remediation: "Review the highlighted logs, retrain welders, or revise the WPS ranges if production conditions changed.",
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (usage.openNcrs > 0) {
    recs.push({
      id: `wps-${wps.id}-ncrs`, severity: "critical",
      title: `${usage.openNcrs} open NCR${usage.openNcrs === 1 ? "" : "s"} linked to this WPS`,
      why: "Welds executed under this procedure are currently under non-conformance investigation.",
      impact: "Production may need to halt this procedure until the root cause is closed.",
      remediation: "Review the open NCRs, identify root cause, and close them with preventive actions.",
      action: { label: "Open NCRs", kind: "navigate", to: "/app/ncrs" },
      roles: ["super_admin", "qa_qc_manager"],
    });
  }

  if (usage.blockedWelds > 0) {
    recs.push({
      id: `wps-${wps.id}-blocked`, severity: "warning",
      title: `${usage.blockedWelds} blocked weld${usage.blockedWelds === 1 ? "" : "s"} reference this WPS`,
      why: "Production welds are blocked in the release workflow under this procedure.",
      impact: "Project schedule is exposed — release of these welds is on hold.",
      remediation: "Open the affected welds and resolve their blocking conditions, or assign an alternative WPS.",
      action: { label: "View welds", kind: "navigate", to: "/app/welds" },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  if (status === "approved" && (compatibleWelders?.length ?? 0) === 0 && usage.activeWelds > 0) {
    recs.push({
      id: `wps-${wps.id}-no-compat-welders`, severity: "warning",
      title: "No active welders qualified for this WPS process",
      why: "No active WPQ records match this WPS's process — production cannot be staffed compliantly.",
      rule: "ASME IX QW-301",
      impact: "Welds executed under this WPS may not be backed by a valid welder qualification.",
      remediation: "Qualify welders on this process or extend an existing WPQ before continuing production.",
      action: { label: "Browse welders", kind: "navigate", to: "/app/qualifications" },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"],
    });
  }

  return sortRecs(recs);
}

export function wpsVerdict(
  _wps: WpsLite,
  recs: Recommendation[],
  score: WpsReadinessScore,
  usage: WpsUsage,
): Verdict {
  const sev = highestSeverity(recs);
  const impactPhrase =
    usage.activeWelds > 0
      ? ` Impacts ${usage.activeWelds} weld${usage.activeWelds === 1 ? "" : "s"} / ${usage.activeProjects} project${usage.activeProjects === 1 ? "" : "s"}.`
      : "";

  if (sev === "critical") {
    return {
      severity: "critical",
      label: score.band === "High Risk" ? "High Risk" : "Critical Risk",
      summary: `WPS is exposing production to non-compliance.${impactPhrase}`,
      next: recs.find((r) => r.severity === "critical")?.title,
    };
  }
  if (sev === "warning") {
    return {
      severity: "warning",
      label: "Attention Required",
      summary: `Engineering review required to keep this WPS production-ready.${impactPhrase}`,
      next: recs.find((r) => r.severity === "warning")?.title,
    };
  }
  if (sev === "info") {
    return {
      severity: "info",
      label: score.band === "In Review" ? "In Review" : score.band === "Draft" ? "Draft" : "Pending Review",
      summary: `WPS workflow has open steps before it can drive production.${impactPhrase}`,
      next: recs[0]?.title,
    };
  }
  return {
    severity: "ok",
    label: "Approved & Production-Ready",
    summary: `WPS is approved and driving production.${impactPhrase}`,
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Role filtering                                                     */
/* ──────────────────────────────────────────────────────────────────── */

export function filterRecsForRole(recs: Recommendation[], roles: AppRole[]): Recommendation[] {
  if (roles.length === 0) return recs;
  return recs.filter((r) => !r.roles || r.roles.length === 0 || r.roles.some((role) => roles.includes(role)));
}
