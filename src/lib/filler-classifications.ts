/**
 * ASME IX filler-classification → F-No / A-No mapping.
 * Single source of truth used by pWPS detail, pWPS New dialog,
 * and the WPS Filler metals relational table.
 */

export type FillerClassificationEntry = {
  code: string;            // e.g. "E7018"
  f_no: string;            // e.g. "4"
  a_no: string | null;     // null = N/A (no A-No defined)
  group: string;           // optgroup / family label
};

export const FILLER_CLASSIFICATION_GROUPS = [
  "Carbon Steel Electrodes",
  "Stainless Steel Electrodes",
  "Aluminum Fillers",
  "Nickel Alloy Fillers",
  "Low Alloy / Cr-Mo Steel Fillers",
  "Submerged Arc Welding (SAW) Wires & Flux",
  "Oxy-Fuel Rods",
] as const;

export const FILLER_CLASSIFICATIONS: FillerClassificationEntry[] = [
  // Carbon Steel
  { code: "E6010",      f_no: "3", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E6011",      f_no: "3", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E6013",      f_no: "4", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E7016",      f_no: "4", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E7018",      f_no: "4", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E7024",      f_no: "4", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "ER70S-2",    f_no: "6", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "ER70S-3",    f_no: "6", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "ER70S-6",    f_no: "6", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E71T-1",     f_no: "6", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E71T-9",     f_no: "6", a_no: "1", group: "Carbon Steel Electrodes" },
  { code: "E71T-11",    f_no: "6", a_no: "1", group: "Carbon Steel Electrodes" },

  // Stainless Steel
  { code: "E308L-16",   f_no: "5", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "E309L-16",   f_no: "5", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "E316L-16",   f_no: "5", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "ER308L",     f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "ER308LSi",   f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "ER309L",     f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "ER316L",     f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "ER316LSi",   f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "E308LT1-1",  f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },
  { code: "E316LT1-1",  f_no: "6", a_no: "8", group: "Stainless Steel Electrodes" },

  // Aluminum
  { code: "ER4043",     f_no: "23", a_no: null, group: "Aluminum Fillers" },
  { code: "ER5356",     f_no: "23", a_no: null, group: "Aluminum Fillers" },
  { code: "ER4047",     f_no: "23", a_no: null, group: "Aluminum Fillers" },

  // Nickel Alloy
  { code: "ERNiCr-3",   f_no: "43", a_no: null, group: "Nickel Alloy Fillers" },
  { code: "ERNiCrMo-3", f_no: "43", a_no: null, group: "Nickel Alloy Fillers" },
  { code: "ERNi-1",     f_no: "41", a_no: null, group: "Nickel Alloy Fillers" },

  // Low Alloy / Cr-Mo Steel
  { code: "ER80S-B2",   f_no: "6", a_no: "3", group: "Low Alloy / Cr-Mo Steel Fillers" },
  { code: "ER90S-B3",   f_no: "6", a_no: "4", group: "Low Alloy / Cr-Mo Steel Fillers" },
  { code: "E8018-B2",   f_no: "4", a_no: "3", group: "Low Alloy / Cr-Mo Steel Fillers" },
  { code: "E8018-B3",   f_no: "4", a_no: "4", group: "Low Alloy / Cr-Mo Steel Fillers" },

  // SAW
  { code: "EM12K",       f_no: "6", a_no: "1", group: "Submerged Arc Welding (SAW) Wires & Flux" },
  { code: "EH14",        f_no: "6", a_no: "1", group: "Submerged Arc Welding (SAW) Wires & Flux" },
  { code: "F7A2-EM12K",  f_no: "6", a_no: "1", group: "Submerged Arc Welding (SAW) Wires & Flux" },
  { code: "F8A2-EH14",   f_no: "6", a_no: "1", group: "Submerged Arc Welding (SAW) Wires & Flux" },

  // Oxy-Fuel
  { code: "RG45",        f_no: "6", a_no: "1", group: "Oxy-Fuel Rods" },
  { code: "RG60",        f_no: "6", a_no: "1", group: "Oxy-Fuel Rods" },
];

export const FILLER_CLASSIFICATION_MAP: Record<string, { f_no: string; a_no: string | null }> =
  FILLER_CLASSIFICATIONS.reduce((acc, e) => {
    acc[e.code] = { f_no: e.f_no, a_no: e.a_no };
    return acc;
  }, {} as Record<string, { f_no: string; a_no: string | null }>);

export function lookupFillerClassification(
  code: string | null | undefined,
): { f_no: string; a_no: string | null } | null {
  if (!code) return null;
  return FILLER_CLASSIFICATION_MAP[code.trim()] ?? null;
}

/** Grouped form suitable for <optgroup> rendering. */
export function fillerClassificationsByGroup(): { group: string; codes: string[] }[] {
  return FILLER_CLASSIFICATION_GROUPS.map((g) => ({
    group: g,
    codes: FILLER_CLASSIFICATIONS.filter((e) => e.group === g).map((e) => e.code),
  }));
}
