/**
 * Helpers for promoting a Passed PQR (+ its linked pWPS) into a Draft WPS
 * row in the `procedures` table. Pure functions only — DB calls happen in
 * `pqr-promotion-runtime.ts`.
 */

export type RangeShape = {
  thickness_min_mm?: number | null;
  thickness_max_mm?: number | null;
  diameter_min_mm?: number | null;
  diameter_max_mm?: number | null;
  heat_input_min?: number | null;
  heat_input_max?: number | null;
  position?: string | null;
};

/** Derive a WPS code from the source pWPS number. */
export function deriveWpsCode(pwpsNo: string): string {
  if (!pwpsNo) return `WPS-${Date.now().toString(36).toUpperCase()}`;
  const cleaned = pwpsNo.replace(/^p?wps[-_ ]*/i, "");
  return `WPS-${cleaned || pwpsNo}`;
}

/**
 * Build the `procedures` insert payload by copying pWPS variables and
 * letting qualified ranges from the PQR override where present.
 */
export function buildWpsPayload(args: {
  companyId: string;
  pwps: Record<string, any>;
  pqr: Record<string, any>;
}): Record<string, any> {
  const { companyId, pwps, pqr } = args;
  const ranges = (pqr.qualified_ranges ?? {}) as Partial<RangeShape>;
  const code = deriveWpsCode(pwps.pwps_no);

  const pick = <T,>(qualified: T | undefined | null, fallback: T | undefined | null) =>
    qualified !== undefined && qualified !== null ? qualified : fallback ?? null;

  return {
    company_id: companyId,
    status: "Draft",
    revision: "Rev 0",
    procedure_type: "WPS",
    code,
    wps_no: code,
    pqr_no: pqr.pqr_no ?? null,
    pwps_id: pwps.id,
    pqr_id: pqr.id,
    standard: pwps.standard ?? "",
    process: pwps.process ?? "",
    joint_type: pwps.joint_type ?? null,
    groove_type: pwps.groove_type ?? null,
    position: pick(ranges.position, pwps.position),
    position_qualified: pick(ranges.position, pwps.position),
    base_material: pwps.base_material ?? null,
    filler_material: pwps.filler_material ?? null,
    shielding_gas: pwps.shielding_gas ?? null,
    preheat_min_c: pwps.preheat_min_c ?? null,
    interpass_max_c: pwps.interpass_max_c ?? null,
    pwht: pwps.pwht ?? null,
    voltage_min: pwps.voltage_min ?? null,
    voltage_max: pwps.voltage_max ?? null,
    current_min: pwps.current_min ?? null,
    current_max: pwps.current_max ?? null,
    travel_speed_min: pwps.travel_speed_min ?? null,
    travel_speed_max: pwps.travel_speed_max ?? null,
    heat_input_min: pick(ranges.heat_input_min, pwps.heat_input_min),
    heat_input_max: pick(ranges.heat_input_max, pwps.heat_input_max),
    thickness_range:
      pwps.thickness_min_mm != null && pwps.thickness_max_mm != null
        ? `${pick(ranges.thickness_min_mm, pwps.thickness_min_mm)}–${pick(ranges.thickness_max_mm, pwps.thickness_max_mm)} mm`
        : null,
    technique_notes: pwps.technique_notes ?? null,
    notes: `Auto-generated from ${pwps.pwps_no} qualified by ${pqr.pqr_no} on ${new Date().toISOString().slice(0, 10)}.`,
  };
}
