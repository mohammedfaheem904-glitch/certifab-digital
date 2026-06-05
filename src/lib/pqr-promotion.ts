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

export const pick = <T,>(qualified: T | undefined | null, fallback: T | undefined | null) =>
  qualified !== undefined && qualified !== null ? qualified : fallback ?? null;

/** Derive a WPS code from the source pWPS number. */
export function deriveWpsCode(pwpsNo: string): string {
  if (!pwpsNo) return `WPS-${Date.now().toString(36).toUpperCase()}`;
  const cleaned = pwpsNo.replace(/^p?wps[-_ ]*/i, "");
  return `WPS-${cleaned || pwpsNo}`;
}

/** Read the qualified ranges object from a PQR row. */
export function getQualifiedRanges(pqr: Record<string, any>): Partial<RangeShape> {
  return (pqr.qualified_ranges ?? {}) as Partial<RangeShape>;
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
  const ranges = getQualifiedRanges(pqr);
  const code = deriveWpsCode(pwps.pwps_no);

  const provenance = `Auto-generated from ${pwps.pwps_no} qualified by ${pqr.pqr_no} on ${new Date()
    .toISOString()
    .slice(0, 10)}.`;
  const notes = pwps.notes ? `${provenance}\n\n${pwps.notes}` : provenance;

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
    electrode_type: pwps.filler_classification ?? null,
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
    back_gouging: pwps.backing ?? null,
    thickness_range:
      pwps.thickness_min_mm != null && pwps.thickness_max_mm != null
        ? `${pick(ranges.thickness_min_mm, pwps.thickness_min_mm)}–${pick(ranges.thickness_max_mm, pwps.thickness_max_mm)} mm`
        : null,
    technique_notes: pwps.technique_notes ?? null,
    notes,
  };
}

/**
 * Build seed rows for each WPS child/detail table from the pWPS scalars,
 * applying PQR qualified-range overrides where present. Returns an object
 * keyed by table name → single-row payload (or null when nothing meaningful
 * to seed).
 */
export function buildChildSeeds(args: {
  companyId: string;
  procedureId: string;
  pwps: Record<string, any>;
  pqr: Record<string, any>;
}): Record<string, Record<string, any> | null> {
  const { companyId, procedureId, pwps, pqr } = args;
  const ranges = getQualifiedRanges(pqr);
  const base = { company_id: companyId, procedure_id: procedureId };
  const has = (...vals: any[]) => vals.some((v) => v !== null && v !== undefined && v !== "");

  return {
    wps_base_metals: has(
      pwps.base_material,
      pwps.p_number,
      pwps.group_number,
      pwps.thickness_min_mm,
      pwps.thickness_max_mm,
      pwps.diameter_min_mm,
      pwps.diameter_max_mm,
    )
      ? {
          ...base,
          material_spec: pwps.base_material ?? null,
          p_no: pwps.p_number ?? null,
          group_no: pwps.group_number ?? null,
          thickness_min_mm: pick(ranges.thickness_min_mm, pwps.thickness_min_mm),
          thickness_max_mm: pick(ranges.thickness_max_mm, pwps.thickness_max_mm),
          diameter_min_mm: pick(ranges.diameter_min_mm, pwps.diameter_min_mm),
          diameter_max_mm: pick(ranges.diameter_max_mm, pwps.diameter_max_mm),
        }
      : null,

    wps_filler_metals: has(pwps.filler_material, pwps.filler_classification)
      ? {
          ...base,
          process: pwps.process ?? null,
          filler_type: pwps.filler_material ?? null,
          aws_classification: pwps.filler_classification ?? null,
        }
      : null,

    wps_positions: has(pwps.position)
      ? {
          ...base,
          position: pwps.position ?? null,
          qualified_range: pick(ranges.position, pwps.position),
        }
      : null,

    wps_preheat_entries: has(pwps.preheat_min_c, pwps.interpass_max_c)
      ? {
          ...base,
          applicability: "All",
          preheat_min_c: pwps.preheat_min_c ?? null,
          interpass_max_c: pwps.interpass_max_c ?? null,
        }
      : null,

    wps_shielding_gases: has(pwps.shielding_gas)
      ? {
          ...base,
          process: pwps.process ?? null,
          gas_type: pwps.shielding_gas ?? null,
        }
      : null,

    wps_pwht:
      pwps.pwht && pwps.pwht !== "None"
        ? {
            ...base,
            applicability: pwps.pwht,
            notes: pwps.pwht,
          }
        : null,

    wps_electrical_characteristics: has(
      pwps.current_min,
      pwps.current_max,
      pwps.voltage_min,
      pwps.voltage_max,
      pwps.travel_speed_min,
      pwps.travel_speed_max,
      pwps.heat_input_min,
      pwps.heat_input_max,
      pwps.polarity,
    )
      ? {
          ...base,
          process: pwps.process ?? null,
          polarity: pwps.polarity ?? null,
          filler_class: pwps.filler_classification ?? null,
          amperage_min: pwps.current_min ?? null,
          amperage_max: pwps.current_max ?? null,
          voltage_min: pwps.voltage_min ?? null,
          voltage_max: pwps.voltage_max ?? null,
          travel_speed_min: pwps.travel_speed_min ?? null,
          travel_speed_max: pwps.travel_speed_max ?? null,
          heat_input_min: pick(ranges.heat_input_min, pwps.heat_input_min),
          heat_input_max: pick(ranges.heat_input_max, pwps.heat_input_max),
        }
      : null,

    wps_techniques: has(pwps.process, pwps.technique_notes, pwps.backing)
      ? {
          ...base,
          process: pwps.process ?? null,
          back_gouging: pwps.backing ?? null,
          notes: pwps.technique_notes ?? null,
        }
      : null,

    wps_notes: pwps.notes
      ? {
          ...base,
          category: "engineering",
          body: pwps.notes,
        }
      : null,
  };
}
