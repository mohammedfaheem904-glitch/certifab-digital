/**
 * Weld Compatibility Intelligence
 *
 * Pure, side-effect-free service that answers the operational question:
 *
 *   "Given THIS production weld, THIS WPS and THIS welder's WPQ — is the
 *    welder qualified, is the procedure compatible, and is the weld within
 *    qualified ranges?"
 *
 * Designed to be reused by:
 *   • the Weld detail page "Compliance" tab (interactive UI)
 *   • a future weld-release / production readiness workflow
 *   • automated QA/QC validation pipelines
 *   • AI-assisted compliance analysis (the structured output is LLM-friendly)
 *
 * Architecture:
 *   • Pure functions, no DB / React imports.
 *   • Reuses `evaluateQualification` for the WPQ leg, then layers WPS↔Weld
 *     and WPS↔WPQ checks on top.
 *   • Returns a `WeldMatchReport` with categorised findings, subscores,
 *     overall score, risk level and a human-readable readiness verdict.
 */

import {
  deriveQualificationRanges,
  formatRange,
  isWithinRange,
  type CodeFamily,
} from "./qualification-intelligence";
import {
  evaluateQualification,
  type ComplianceFinding,
  type FindingSeverity,
  type QualificationLike,
} from "./qualification-validation";

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

/** Subset of the `procedures` row consumed by the matcher. */
export interface WpsLike {
  id?: string | null;
  code?: string | null;
  process?: string | null;
  standard?: string | null;
  position?: string | null;
  base_material?: string | null;
  filler_material?: string | null;
  shielding_gas?: string | null;
  joint_type?: string | null;
  thickness_range?: string | null;
  status?: string | null;
  /** Heat-input limits, used for cross-check against the weld's heat input. */
  heat_input_min?: number | null;
  heat_input_max?: number | null;
  pwht?: string | null;
}

/** Subset of the `welds` row + optional production hints. */
export interface WeldLike {
  id?: string | null;
  weld_no?: string | null;
  joint_type?: string | null;
  base_material?: string | null;
  filler_metal?: string | null;
  heat_input?: string | null;
  /** Optional structured production parameters (entered in the UI, not stored). */
  thicknessMm?: number;
  diameterMm?: number;
  isPipe?: boolean;
  position?: string;
  withBacking?: boolean;
  pNumber?: number;
  isoGroup?: string;
}

export type WpqLike = QualificationLike;

export interface WeldMatchInput {
  weld: WeldLike;
  wps?: WpsLike | null;
  wpq?: WpqLike | null;
  code?: CodeFamily;
}

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

export interface WeldMatchReport {
  findings: ComplianceFinding[];
  subscores: {
    /** How well the WPS covers the weld (process, position, thickness, material). */
    wpsToWeld: number;
    /** How well the WPQ covers the weld (range, position, backing, material). */
    wpqToWeld: number;
    /** How well WPS and WPQ agree on process / standard / material family. */
    wpsToWpq: number;
  };
  /** 0-100 weighted overall compatibility score. */
  overallScore: number;
  riskLevel: "Low" | "Medium" | "High";
  readiness: "Ready to weld" | "Conditional — review required" | "Hold — do not weld";
  /** Quick summary used by lists / banners. */
  summary: string;
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export function evaluateWeldCompatibility(input: WeldMatchInput): WeldMatchReport {
  const { weld, wps, wpq } = input;
  const findings: ComplianceFinding[] = [];

  /* ------ WPS ↔ Weld ------ */
  if (!wps) {
    findings.push(f("wps-missing", "critical", "WPS Match",
      "No WPS linked to this weld",
      "A welding procedure specification (WPS) is required for traceability and compliance — this weld currently has no procedure assigned.",
      "ASME IX QW-200.2",
      "Link an approved WPS that covers the joint, material and process before authorising production welding.",
    ));
  } else {
    if (wps.status && wps.status.toLowerCase() !== "approved") {
      findings.push(f("wps-not-approved", "critical", "WPS Match",
        `Linked WPS is in ${wps.status} status`,
        "Production welding may only be performed under an Approved WPS. The currently linked procedure has not completed approval.",
        "ASME IX QW-200.2",
        "Either complete WPS approval or link an alternative approved procedure.",
      ));
    }
    if (weld.joint_type && wps.joint_type && norm(weld.joint_type) !== norm(wps.joint_type)) {
      findings.push(f("wps-joint", "warning", "WPS Match",
        "Joint type differs from the WPS",
        `Weld joint type "${weld.joint_type}" does not match the WPS joint type "${wps.joint_type}".`,
        undefined,
        "Confirm with the welding engineer whether this WPS is intended to cover the as-built joint, or use a more specific WPS.",
      ));
    }
    if (weld.base_material && wps.base_material && !materialMatch(weld.base_material, wps.base_material)) {
      findings.push(f("wps-base", "warning", "Material",
        "Base material differs from the WPS",
        `Weld base material "${weld.base_material}" is not aligned with the WPS base material "${wps.base_material}".`,
        "ASME IX QW-403",
      ));
    }
    if (weld.filler_metal && wps.filler_material && !materialMatch(weld.filler_metal, wps.filler_material)) {
      findings.push(f("wps-filler", "warning", "Material",
        "Filler metal differs from the WPS",
        `Weld filler "${weld.filler_metal}" is not aligned with the WPS filler "${wps.filler_material}".`,
      ));
    }
    if (weld.position && wps.position && !positionCovered(weld.position, wps.position)) {
      findings.push(f("wps-position", "warning", "Position",
        `Production position ${weld.position} not listed on the WPS`,
        `The WPS covers position "${wps.position}". Verify the WPS qualification includes the as-built position.`,
        "ASME IX QW-461",
      ));
    }
    if (weld.thicknessMm != null && wps.thickness_range) {
      const within = thicknessWithinText(weld.thicknessMm, wps.thickness_range);
      if (within === false) {
        findings.push(f("wps-thk", "critical", "Range",
          "Production thickness outside WPS range",
          `Weld thickness ${weld.thicknessMm} mm is outside the WPS thickness range "${wps.thickness_range}".`,
          "ASME IX QW-451",
          "Use a WPS qualified for this thickness or escalate to the welding engineer.",
        ));
      }
    }
    if (wps.heat_input_max != null) {
      const hi = parseHeatInput(weld.heat_input);
      if (hi != null && hi > wps.heat_input_max) {
        findings.push(f("wps-heat-high", "critical", "Range",
          "Heat input above WPS maximum",
          `Recorded heat input ${hi.toFixed(2)} kJ/mm exceeds the WPS maximum ${wps.heat_input_max} kJ/mm.`,
          "ASME IX QW-409",
        ));
      } else if (hi != null && wps.heat_input_min != null && hi < wps.heat_input_min) {
        findings.push(f("wps-heat-low", "warning", "Range",
          "Heat input below WPS minimum",
          `Recorded heat input ${hi.toFixed(2)} kJ/mm is below the WPS minimum ${wps.heat_input_min} kJ/mm.`,
          "ASME IX QW-409",
        ));
      }
    }
  }

  /* ------ WPQ ↔ Weld ------ */
  if (!wpq) {
    findings.push(f("wpq-missing", "critical", "Welder Qualification",
      "No WPQ linked to this weld",
      "Welder qualification record is missing — the welder cannot be confirmed as qualified for this production weld.",
      "ASME IX QW-301",
      "Assign a qualified welder and link their WPQ to this weld.",
    ));
  } else {
    /* Run the deep WPQ evaluation against the weld as a 'production plan'. */
    const wpqReport = evaluateQualification(wpq, {
      process: wps?.process ?? wpq.process ?? undefined,
      thicknessMm: weld.thicknessMm,
      diameterMm: weld.diameterMm,
      isPipe: weld.isPipe,
      position: weld.position,
      withBacking: weld.withBacking,
      pNumber: weld.pNumber,
      isoGroup: weld.isoGroup,
    });
    /* Promote only the directly-relevant findings (status, continuity, plan-*). */
    for (const wf of wpqReport.findings) {
      const isPlan = wf.id.startsWith("plan-");
      const isStatus = ["status-expired", "status-expiring", "status-suspended", "result-fail",
        "continuity-broken", "continuity-warning"].includes(wf.id);
      if (isPlan || isStatus) {
        findings.push({ ...wf, id: `wpq-${wf.id}` });
      }
    }
  }

  /* ------ WPS ↔ WPQ cross-check ------ */
  if (wps && wpq) {
    if (wps.process && wpq.process && norm(wps.process) !== norm(wpq.process)) {
      findings.push(f("crs-process", "critical", "Process",
        `WPS process ${wps.process} not covered by WPQ ${wpq.process}`,
        "The selected WPS uses a welding process that is not on the welder's qualification record.",
        "ASME IX QW-301.2",
        "Either pick a WPS using the welder's qualified process, or qualify the welder on the required process.",
      ));
    }
    if (wps.standard && wpq.standard && norm(wps.standard) !== norm(wpq.standard)) {
      findings.push(f("crs-standard", "info", "WPS Match",
        "WPS and WPQ reference different standards",
        `WPS standard is "${wps.standard}", WPQ standard is "${wpq.standard}". Verify equivalence.`,
      ));
    }
    if (wps.base_material && wpq.test_coupon_type && !materialMatch(wps.base_material, wpq.test_coupon_type)) {
      findings.push(f("crs-material", "info", "Material",
        "WPS base material vs. WPQ coupon — verify P-Number coverage",
        `WPS base "${wps.base_material}" should map to a P-Number / group covered by the welder's qualification "${wpq.test_coupon_type}".`,
        "ASME IX QW-423",
      ));
    }
  }

  /* ------ Coverage gap awareness (purely informational) ------ */
  if (wpq) {
    const ranges = deriveQualificationRanges({
      code: (wpq.code_family as CodeFamily) ?? "ASME IX",
      process: wpq.process ?? "",
      testCouponThicknessMm: numOrUndef(wpq.test_thickness_mm),
      testCouponDiameterMm: numOrUndef(wpq.test_diameter_mm),
      testPosition: wpq.position_qualified ?? undefined,
      withBacking: !!wpq.with_backing,
      isPipe: (wpq.test_coupon_type ?? "").toLowerCase().includes("pipe"),
    });
    if (weld.thicknessMm != null && !isWithinRange(weld.thicknessMm, ranges.baseThickness)) {
      findings.push(f("cov-thk", "critical", "Coverage Gap",
        "Welder not qualified for this thickness",
        `Weld thickness ${weld.thicknessMm} mm is outside the welder's qualified base-metal range (${formatRange(ranges.baseThickness)}).`,
        "ASME IX QW-452.1(b)",
        "Use a welder qualified on a thicker coupon, or qualify the assigned welder on a coupon that covers this thickness.",
      ));
    }
    if (weld.position && ranges.positions.length > 0 && !ranges.positions.some((p) => p.toUpperCase().startsWith(weld.position!.toUpperCase()))) {
      findings.push(f("cov-pos", "critical", "Coverage Gap",
        `Welder not qualified for position ${weld.position}`,
        `WPQ qualifies positions [${ranges.positions.join(", ")}]; production position ${weld.position} is not covered.`,
        "ASME IX QW-461.9",
      ));
    }
  }

  /* ------ Data quality ------ */
  if (weld.thicknessMm == null) {
    findings.push(f("data-thk", "warning", "Data Quality",
      "Weld thickness not provided",
      "Without the production thickness, range-based compliance checks cannot be evaluated.",
      undefined, "Enter the weld thickness in the production parameters panel.",
    ));
  }
  if (weld.position == null) {
    findings.push(f("data-pos", "warning", "Data Quality",
      "Production position not provided",
      "Position-based qualification checks require the production weld position (e.g. 6G, 3F).",
    ));
  }

  /* ------ Subscores ------ */
  const subscores = {
    wpsToWeld: scoreFor(findings, ["WPS Match", "Range", "Material", "Position"]),
    wpqToWeld: scoreFor(findings, ["Welder Qualification", "Continuity", "Status", "Coverage Gap", "Backing"]),
    wpsToWpq: scoreFor(findings, ["Process", "WPS Match", "Material"], (id) => id.startsWith("crs-")),
  };
  const overallScore = Math.round(
    subscores.wpsToWeld * 0.35 + subscores.wpqToWeld * 0.45 + subscores.wpsToWpq * 0.20,
  );

  const hasCritical = findings.some((f) => f.severity === "critical");
  const hasWarning = findings.some((f) => f.severity === "warning");
  const riskLevel: WeldMatchReport["riskLevel"] = hasCritical ? "High" : hasWarning ? "Medium" : "Low";
  const readiness: WeldMatchReport["readiness"] =
    hasCritical ? "Hold — do not weld" :
    hasWarning ? "Conditional — review required" : "Ready to weld";

  const summary = readiness === "Ready to weld"
    ? "All compatibility checks passed."
    : `${findings.filter((x) => x.severity === "critical").length} critical and ${findings.filter((x) => x.severity === "warning").length} warning items detected.`;

  return { findings, subscores, overallScore, riskLevel, readiness, summary };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function f(
  id: string,
  severity: FindingSeverity,
  category: ComplianceFinding["category"],
  title: string,
  message: string,
  codeRef?: string,
  remediation?: string,
): ComplianceFinding {
  return { id, severity, category, title, message, codeRef, remediation };
}

function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function materialMatch(a: string, b: string): boolean {
  const A = norm(a); const B = norm(b);
  if (A === B) return true;
  // Heuristic: if either side contains the other (e.g. "SA-106 Gr B" vs "SA-106"), treat as match.
  return A.includes(B) || B.includes(A);
}

function positionCovered(weldPos: string, wpsPos: string): boolean {
  const w = norm(weldPos); const p = norm(wpsPos);
  if (w === p) return true;
  if (p.includes("all")) return true;
  if (p.includes(w)) return true;
  return false;
}

function thicknessWithinText(t: number, range: string): boolean | null {
  // Parses "3-25 mm", "≥ 5 mm", "5 to 25", "0.5 to 2 in" etc.
  const r = range.replace(",", ".");
  const inches = /in\b|"|inch/i.test(r);
  const mul = inches ? 25.4 : 1;
  const bothNums = r.match(/(-?\d+(?:\.\d+)?)\s*(?:[-–to]+)\s*(-?\d+(?:\.\d+)?)/i);
  if (bothNums) {
    const min = Number(bothNums[1]) * mul;
    const max = Number(bothNums[2]) * mul;
    return t >= min && t <= max;
  }
  const minOnly = r.match(/(?:>=|≥|min|>\s*=?)\s*(-?\d+(?:\.\d+)?)/i);
  if (minOnly) return t >= Number(minOnly[1]) * mul;
  const maxOnly = r.match(/(?:<=|≤|max|<\s*=?)\s*(-?\d+(?:\.\d+)?)/i);
  if (maxOnly) return t <= Number(maxOnly[1]) * mul;
  return null;
}

function parseHeatInput(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = String(s).match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function numOrUndef(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function scoreFor(
  findings: ComplianceFinding[],
  categories: ComplianceFinding["category"][],
  predicate?: (id: string) => boolean,
): number {
  let score = 100;
  for (const f of findings) {
    if (predicate && !predicate(f.id)) continue;
    if (!predicate && !categories.includes(f.category)) continue;
    if (f.severity === "critical") score -= 30;
    else if (f.severity === "warning") score -= 10;
    else if (f.severity === "info") score -= 2;
  }
  return Math.max(0, score);
}
