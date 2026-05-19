/**
 * Weld Release Readiness Engine
 *
 * Aggregates the weld's compliance findings (WPS/WPQ matching) PLUS operational
 * facts — inspections, NCRs, calibration of involved instruments, approvals —
 * into a single release-readiness verdict + categorized blockers.
 *
 * Pure, side-effect free. Re-used by the Compliance Center UI.
 */

import {
  evaluateWeldCompatibility,
  type WeldLike,
  type WeldMatchReport,
  type WpqLike,
  type WpsLike,
} from "./weld-matching";
import type { ComplianceFinding } from "./qualification-validation";

export type ReadinessVerdict =
  | "Release Ready"
  | "Approved"
  | "Ready for Release"
  | "Warning"
  | "Blocked";

export interface ReadinessTile {
  key: string;
  label: string;
  status: "ok" | "warn" | "fail" | "neutral";
  value: string;
  hint?: string;
}

export interface ReleaseReadiness {
  score: number;                       // 0-100
  verdict: ReadinessVerdict;
  summary: string;
  tiles: ReadinessTile[];              // operational tile strip
  blockers: ComplianceFinding[];       // severity=critical
  warnings: ComplianceFinding[];       // severity=warning
  informational: ComplianceFinding[];  // severity=info|pass
  matchReport: WeldMatchReport;
}

export interface ReadinessInput {
  weld: WeldLike & {
    workflow_status?: string | null;
    approved_at?: string | null;
    released_at?: string | null;
  };
  wps?: WpsLike | null;
  wpq?: WpqLike | null;
  inspections?: Array<{
    id: string;
    inspection_type?: string | null;
    status?: string | null;
    severity?: string | null;
    defect_type?: string | null;
    inspected_at?: string | null;
  }>;
  ncrs?: Array<{ id: string; status?: string | null; severity?: string | null; ncr_no?: string | null }>;
  instruments?: Array<{
    id: string;
    asset_id?: string | null;
    name?: string | null;
    calibration_due?: string | null;
    status?: string | null;
  }>;
  requiredInspections?: string[]; // e.g. ["Visual","RT"]
}

export function evaluateReleaseReadiness(input: ReadinessInput): ReleaseReadiness {
  const { weld, wps, wpq, inspections = [], ncrs = [], instruments = [], requiredInspections = ["Visual"] } = input;

  const match = evaluateWeldCompatibility({ weld, wps, wpq });
  const findings: ComplianceFinding[] = [...match.findings];

  /* --- Inspections --- */
  const missingInspections = requiredInspections.filter(
    (t) => !inspections.some((i) => norm(i.inspection_type) === norm(t)),
  );
  for (const m of missingInspections) {
    findings.push({
      id: `insp-missing-${m}`, severity: "critical", category: "WPS Match",
      title: `Missing mandatory ${m} inspection`,
      message: `Release requires a ${m} inspection record against this weld — none has been logged.`,
      remediation: `Schedule and record a ${m} inspection before release.`,
    });
  }
  const openInspections = inspections.filter((i) => (i.status ?? "").toLowerCase() === "open");
  if (openInspections.length > 0) {
    findings.push({
      id: "insp-open", severity: "warning", category: "WPS Match",
      title: `${openInspections.length} open inspection${openInspections.length > 1 ? "s" : ""}`,
      message: "Inspections are still open — close them before authorising release.",
    });
  }
  const failedInspections = inspections.filter(
    (i) => ["reject", "rejected", "fail", "failed"].includes((i.severity ?? "").toLowerCase())
        || ["reject", "rejected", "fail"].includes((i.status ?? "").toLowerCase()),
  );
  if (failedInspections.length > 0) {
    findings.push({
      id: "insp-fail", severity: "critical", category: "WPS Match",
      title: `${failedInspections.length} failed inspection${failedInspections.length > 1 ? "s" : ""}`,
      message: "One or more inspections recorded a reject / fail outcome.",
      remediation: "Raise an NCR (if not already) and complete corrective action before release.",
    });
  }

  /* --- NCRs --- */
  const openNcrs = ncrs.filter((n) => !["closed", "verified"].includes((n.status ?? "").toLowerCase()));
  if (openNcrs.length > 0) {
    findings.push({
      id: "ncr-open", severity: "critical", category: "WPS Match",
      title: `${openNcrs.length} open NCR${openNcrs.length > 1 ? "s" : ""}`,
      message: "Production weld cannot be released while NCRs against it remain open.",
      remediation: "Close NCRs through the standard CAPA workflow.",
    });
  }

  /* --- Calibration --- */
  const today = new Date().toISOString().slice(0, 10);
  const expiredCal = instruments.filter((i) => i.calibration_due && i.calibration_due < today);
  const soonCal = instruments.filter((i) => {
    if (!i.calibration_due || i.calibration_due < today) return false;
    const diff = (new Date(i.calibration_due).getTime() - Date.now()) / 86400000;
    return diff <= 30;
  });
  for (const ins of expiredCal) {
    findings.push({
      id: `cal-exp-${ins.id}`, severity: "critical", category: "WPS Match",
      title: `Calibration expired — ${ins.asset_id ?? ins.name}`,
      message: `Instrument calibration expired on ${ins.calibration_due}. Measurements recorded under expired calibration are not admissible.`,
      remediation: "Recalibrate the instrument and re-verify the affected measurements.",
    });
  }
  for (const ins of soonCal) {
    findings.push({
      id: `cal-soon-${ins.id}`, severity: "warning", category: "WPS Match",
      title: `Calibration due soon — ${ins.asset_id ?? ins.name}`,
      message: `Instrument calibration expires on ${ins.calibration_due}.`,
    });
  }

  /* --- Approvals --- */
  const ws = weld.workflow_status ?? "Draft";
  if (!weld.approved_at && !["Approved", "Released"].includes(ws)) {
    findings.push({
      id: "approval-pending", severity: "warning", category: "WPS Match",
      title: "Engineering approval pending",
      message: "This weld has not been approved by the welding engineer / QA-QC manager yet.",
    });
  }

  /* --- Scoring --- */
  const blockers = findings.filter((f) => f.severity === "critical");
  const warnings = findings.filter((f) => f.severity === "warning");
  const informational = findings.filter((f) => f.severity === "info" || f.severity === "pass");

  let score = 100;
  score -= blockers.length * 25;
  score -= warnings.length * 8;
  score -= informational.length * 2;
  score = Math.max(0, Math.min(100, score));

  const verdict: ReadinessVerdict =
    ws === "Released" ? "Release Ready" :
    ws === "Approved" ? "Approved" :
    blockers.length > 0 ? "Blocked" :
    warnings.length > 0 ? "Warning" :
    "Ready for Release";

  const summary =
    verdict === "Blocked" ? `${blockers.length} blocker${blockers.length > 1 ? "s" : ""} must be cleared before release` :
    verdict === "Warning" ? `${warnings.length} warning${warnings.length > 1 ? "s" : ""} require engineering review` :
    verdict === "Ready for Release" ? "All operational checks satisfied — ready for engineering sign-off" :
    verdict === "Approved" ? "Approved by engineering — pending release" :
    "Released to production records";

  /* --- Tiles --- */
  const tiles: ReadinessTile[] = [
    {
      key: "wps", label: "WPS",
      status: wps ? (match.subscores.wpsToWeld >= 90 ? "ok" : match.subscores.wpsToWeld >= 60 ? "warn" : "fail") : "fail",
      value: wps ? `${match.subscores.wpsToWeld}/100` : "Missing",
      hint: wps ? `${wps.code ?? "—"} · ${wps.status ?? "—"}` : "Link a WPS to enable compliance checks",
    },
    {
      key: "wpq", label: "Welder WPQ",
      status: wpq ? (match.subscores.wpqToWeld >= 90 ? "ok" : match.subscores.wpqToWeld >= 60 ? "warn" : "fail") : "fail",
      value: wpq ? `${match.subscores.wpqToWeld}/100` : "Missing",
      hint: wpq?.process ? `Process ${wpq.process}` : "Select the welder's qualification",
    },
    {
      key: "insp", label: "Inspections",
      status: failedInspections.length ? "fail" : missingInspections.length || openInspections.length ? "warn" : inspections.length ? "ok" : "warn",
      value: `${inspections.length} logged`,
      hint: missingInspections.length ? `Missing: ${missingInspections.join(", ")}` : openInspections.length ? `${openInspections.length} open` : "Closed",
    },
    {
      key: "ncr", label: "NCRs",
      status: openNcrs.length ? "fail" : ncrs.length ? "ok" : "ok",
      value: openNcrs.length ? `${openNcrs.length} open` : ncrs.length ? `${ncrs.length} closed` : "0",
      hint: openNcrs.length ? "Blocking release" : "Clear",
    },
    {
      key: "cal", label: "Calibration",
      status: expiredCal.length ? "fail" : soonCal.length ? "warn" : instruments.length ? "ok" : "neutral",
      value: expiredCal.length ? `${expiredCal.length} expired` : soonCal.length ? `${soonCal.length} due soon` : "OK",
      hint: instruments.length ? `${instruments.length} instrument${instruments.length > 1 ? "s" : ""} linked` : "No instruments linked",
    },
    {
      key: "appr", label: "Approval",
      status: weld.approved_at || ["Approved", "Released"].includes(ws) ? "ok" : "warn",
      value: weld.approved_at ? "Approved" : ws,
      hint: weld.approved_at ? new Date(weld.approved_at).toLocaleDateString() : "Pending engineering sign-off",
    },
  ];

  return { score, verdict, summary, tiles, blockers, warnings, informational, matchReport: match };
}

function norm(s: string | null | undefined): string {
  return (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}
