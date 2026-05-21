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

export interface RecommendQualInput {
  qualification: {
    id: string;
    expiry_date: string;
    last_continuity_date?: string | null;
    status?: string | null;
  };
}

export function recommendForQualification({ qualification: q }: RecommendQualInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const status = deriveQualStatus({ expiry_date: q.expiry_date, status: q.status });
  const broken = continuityBroken(q.last_continuity_date ?? null);
  const warn = continuityWarning(q.last_continuity_date ?? null);

  if (status === "Expired") {
    recs.push({
      id: `qual-${q.id}-expired`,
      severity: "critical",
      title: "Renew welder qualification",
      why: `Qualification expired on ${q.expiry_date}.`,
      rule: "ASME IX QW-322",
      impact: "Welder cannot legitimately weld on production work — any weld signed off under this WPQ may fail audit.",
      remediation: "Re-test the welder against the same essential variables and issue a new WPQ.",
      action: { label: "Renew qualification", kind: "open-dialog", dialog: "renew-qualification", payload: { qualId: q.id } },
    });
  } else if (status === "Expiring Soon") {
    recs.push({
      id: `qual-${q.id}-expiring`,
      severity: "warning",
      title: "Qualification expiring soon",
      why: `Qualification expires on ${q.expiry_date}.`,
      rule: "ASME IX QW-322",
      impact: "Production planning should re-assign welders or schedule re-tests before expiry.",
      remediation: "Schedule a renewal test now to avoid production interruption.",
      action: { label: "Schedule renewal", kind: "open-dialog", dialog: "renew-qualification", payload: { qualId: q.id } },
    });
  }

  if (broken) {
    recs.push({
      id: `qual-${q.id}-continuity-broken`,
      severity: "critical",
      title: "Continuity broken",
      why: `No welding activity logged in over 6 months (last activity ${q.last_continuity_date ?? "never recorded"}).`,
      rule: "ASME IX QW-322.1",
      impact: "Qualification is suspended for the affected process(es) until requalified.",
      remediation: "Log production welding evidence (or schedule a renewal test) to restore continuity.",
      action: { label: "Log continuity", kind: "open-dialog", dialog: "log-continuity", payload: { qualId: q.id } },
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
    });
  }

  return sortRecs(recs);
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Role filtering                                                     */
/* ──────────────────────────────────────────────────────────────────── */

export function filterRecsForRole(recs: Recommendation[], roles: AppRole[]): Recommendation[] {
  if (roles.length === 0) return recs;
  return recs.filter((r) => !r.roles || r.roles.length === 0 || r.roles.some((role) => roles.includes(role)));
}
