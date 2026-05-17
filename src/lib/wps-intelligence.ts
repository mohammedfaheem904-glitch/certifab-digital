/**
 * WPS Intelligence Engine
 *
 * Pure functions for compliance scoring, completeness validation,
 * and WPS ↔ WPQ compatibility checks. Mirrors the ComplianceFinding
 * pattern used by qualification-validation.ts.
 */

export type Severity = "info" | "warning" | "error" | "critical";

export type ComplianceFinding = {
  id: string;
  severity: Severity;
  category:
    | "header"
    | "joint"
    | "base_metal"
    | "filler_metal"
    | "electrical"
    | "thermal"
    | "technique"
    | "approval"
    | "compatibility";
  title: string;
  message: string;
  codeReference?: string;
  remediation?: string;
};

export type WpsRow = {
  id: string;
  code?: string | null;
  wps_no?: string | null;
  pqr_no?: string | null;
  standard?: string | null;
  process?: string | null;
  status?: string | null;
  position_qualified?: string | null;
  groove_type?: string | null;
  preheat_min_c?: number | null;
  interpass_max_c?: number | null;
  approved_at?: string | null;
};

export type WpsBundle = {
  wps: WpsRow;
  joints: any[];
  baseMetals: any[];
  fillers: any[];
  electrical: any[];
  signatures: any[];
};

export type WpqRow = {
  process?: string | null;
  position_qualified?: string | null;
  test_thickness_mm?: number | null;
  test_diameter_mm?: number | null;
  status?: string | null;
  expiry_date?: string | null;
};

// ------------------------------------------------------------------
// Completeness validation
// ------------------------------------------------------------------
export function validateWpsCompleteness(bundle: WpsBundle): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  const { wps, joints, baseMetals, fillers, electrical, signatures } = bundle;

  if (!wps.wps_no) f.push(err("header_wps_no", "header", "Missing WPS number", "WPS identifier (WPS No) is required for traceability.", "Populate the WPS No field."));
  if (!wps.pqr_no) f.push(warn("header_pqr_no", "header", "No supporting PQR referenced", "Every WPS must reference its qualifying PQR.", "Add the supporting PQR number."));
  if (!wps.standard) f.push(err("header_standard", "header", "Missing applicable code", "Welding code / standard is required."));
  if (!wps.process) f.push(err("header_process", "header", "Missing welding process"));

  if (joints.length === 0) f.push(err("joints_missing", "joint", "No joint configuration defined", "At least one joint configuration is required."));

  if (baseMetals.length === 0) {
    f.push(err("basemetals_missing", "base_metal", "No base metals defined", "Define at least one base metal entry with P-No and thickness range."));
  } else {
    baseMetals.forEach((b: any, i: number) => {
      if (!b.p_no) f.push(warn(`bm_pno_${i}`, "base_metal", `Base metal #${i + 1}: missing P-No`));
      if (b.thickness_min_mm == null || b.thickness_max_mm == null)
        f.push(warn(`bm_thk_${i}`, "base_metal", `Base metal #${i + 1}: thickness range incomplete`));
    });
  }

  if (fillers.length === 0) {
    f.push(err("fillers_missing", "filler_metal", "No filler metals defined", "At least one consumable must be specified."));
  } else {
    fillers.forEach((fm: any, i: number) => {
      if (!fm.aws_classification && !fm.sfa_no)
        f.push(warn(`fm_class_${i}`, "filler_metal", `Filler #${i + 1}: missing AWS class / SFA No`));
      if (!fm.f_no) f.push(info(`fm_fno_${i}`, "filler_metal", `Filler #${i + 1}: F-No not set`, "F-No is required for WPS ↔ WPQ matching."));
    });
  }

  if (electrical.length === 0) {
    f.push(err("electrical_missing", "electrical", "No electrical parameters defined", "Add at least one pass with amperage and voltage ranges."));
  } else {
    electrical.forEach((e: any, i: number) => {
      if (e.amperage_min == null || e.amperage_max == null) f.push(warn(`el_amps_${i}`, "electrical", `Pass #${i + 1}: amperage range incomplete`));
      if (e.voltage_min == null || e.voltage_max == null) f.push(warn(`el_volts_${i}`, "electrical", `Pass #${i + 1}: voltage range incomplete`));
      if (e.amperage_min != null && e.amperage_max != null && e.amperage_min > e.amperage_max)
        f.push(err(`el_amp_order_${i}`, "electrical", `Pass #${i + 1}: amperage min exceeds max`));
      if (e.voltage_min != null && e.voltage_max != null && e.voltage_min > e.voltage_max)
        f.push(err(`el_volt_order_${i}`, "electrical", `Pass #${i + 1}: voltage min exceeds max`));
    });
  }

  if (wps.preheat_min_c == null) f.push(warn("thermal_preheat", "thermal", "No minimum preheat specified"));
  if (wps.interpass_max_c == null) f.push(info("thermal_interpass", "thermal", "No maximum interpass specified"));

  if (wps.status === "Approved" && signatures.length === 0) {
    f.push(warn("appr_no_sig", "approval", "Approved without signature record", "Capture a signed approval entry for the audit trail."));
  }

  return f;
}

// ------------------------------------------------------------------
// WPS ↔ WPQ compatibility
// ------------------------------------------------------------------
export function checkWpsWpqCompatibility(bundle: WpsBundle, wpq: WpqRow): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  if (wpq.process && bundle.wps.process && wpq.process !== bundle.wps.process) {
    f.push(err("cmp_process", "compatibility", "Process mismatch",
      `WPQ qualifies ${wpq.process} but WPS uses ${bundle.wps.process}.`));
  }
  if (wpq.position_qualified && bundle.wps.position_qualified &&
      !wpq.position_qualified.toUpperCase().includes(bundle.wps.position_qualified.toUpperCase())) {
    f.push(warn("cmp_position", "compatibility", "Position may not be qualified",
      `WPQ position ${wpq.position_qualified} vs WPS position ${bundle.wps.position_qualified}.`));
  }
  // Thickness coverage against base metals
  if (wpq.test_thickness_mm != null) {
    const maxQualifiedThk = Math.max(0, ...bundle.baseMetals.map((b: any) => Number(b.thickness_max_mm ?? 0)));
    if (maxQualifiedThk > 0 && wpq.test_thickness_mm * 2 < maxQualifiedThk) {
      f.push(info("cmp_thk", "compatibility", "Welder thickness coverage may be limited",
        `WPQ test thickness ${wpq.test_thickness_mm} mm; WPS qualifies up to ${maxQualifiedThk} mm.`));
    }
  }
  if (wpq.status && wpq.status !== "Active") {
    f.push(err("cmp_status", "compatibility", `Welder qualification is ${wpq.status}`));
  }
  if (wpq.expiry_date && new Date(wpq.expiry_date) < new Date()) {
    f.push(err("cmp_expired", "compatibility", "Welder qualification expired"));
  }
  return f;
}

// ------------------------------------------------------------------
// Compliance scoring
// ------------------------------------------------------------------
export function scoreWpsCompliance(findings: ComplianceFinding[]): { score: number; grade: "A" | "B" | "C" | "D" | "F" } {
  const weights: Record<Severity, number> = { info: 1, warning: 4, error: 12, critical: 25 };
  const penalty = findings.reduce((acc, f) => acc + weights[f.severity], 0);
  const score = Math.max(0, 100 - penalty);
  const grade = score >= 95 ? "A" : score >= 85 ? "B" : score >= 70 ? "C" : score >= 50 ? "D" : "F";
  return { score, grade };
}

// ------------------------------------------------------------------
// helpers
// ------------------------------------------------------------------
function mk(severity: Severity) {
  return (id: string, category: ComplianceFinding["category"], title: string, message?: string, remediation?: string, codeReference?: string): ComplianceFinding =>
    ({ id, severity, category, title, message: message ?? title, remediation, codeReference });
}
const info = mk("info");
const warn = mk("warning");
const err = mk("error");
