/**
 * ASME IX filler-classification → F-No / A-No / SFA mapping.
 * Single source of truth used by pWPS detail, pWPS New dialog,
 * and the WPS Filler metals relational table.
 */

export type FillerClassificationEntry = {
  code: string;            // e.g. "E7018"
  f_no: string;            // e.g. "4"
  a_no: string | null;     // null = N/A (no A-No defined)
  sfa_no: string;          // ASME II-C specification, e.g. "SFA-5.1"
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
  // Carbon Steel — SMAW (SFA-5.1), GMAW/GTAW wires (SFA-5.18), FCAW (SFA-5.20)
  { code: "E6010",      f_no: "3", a_no: "1", sfa_no: "SFA-5.1",  group: "Carbon Steel Electrodes" },
  { code: "E6011",      f_no: "3", a_no: "1", sfa_no: "SFA-5.1",  group: "Carbon Steel Electrodes" },
  { code: "E6013",      f_no: "4", a_no: "1", sfa_no: "SFA-5.1",  group: "Carbon Steel Electrodes" },
  { code: "E7016",      f_no: "4", a_no: "1", sfa_no: "SFA-5.1",  group: "Carbon Steel Electrodes" },
  { code: "E7018",      f_no: "4", a_no: "1", sfa_no: "SFA-5.1",  group: "Carbon Steel Electrodes" },
  { code: "E7024",      f_no: "4", a_no: "1", sfa_no: "SFA-5.1",  group: "Carbon Steel Electrodes" },
  { code: "ER70S-2",    f_no: "6", a_no: "1", sfa_no: "SFA-5.18", group: "Carbon Steel Electrodes" },
  { code: "ER70S-3",    f_no: "6", a_no: "1", sfa_no: "SFA-5.18", group: "Carbon Steel Electrodes" },
  { code: "ER70S-6",    f_no: "6", a_no: "1", sfa_no: "SFA-5.18", group: "Carbon Steel Electrodes" },
  { code: "E71T-1",     f_no: "6", a_no: "1", sfa_no: "SFA-5.20", group: "Carbon Steel Electrodes" },
  { code: "E71T-9",     f_no: "6", a_no: "1", sfa_no: "SFA-5.20", group: "Carbon Steel Electrodes" },
  { code: "E71T-11",    f_no: "6", a_no: "1", sfa_no: "SFA-5.20", group: "Carbon Steel Electrodes" },

  // Stainless Steel — SMAW (SFA-5.4), bare wires (SFA-5.9), FCAW (SFA-5.22)
  { code: "E308L-16",   f_no: "5", a_no: "8", sfa_no: "SFA-5.4",  group: "Stainless Steel Electrodes" },
  { code: "E309L-16",   f_no: "5", a_no: "8", sfa_no: "SFA-5.4",  group: "Stainless Steel Electrodes" },
  { code: "E316L-16",   f_no: "5", a_no: "8", sfa_no: "SFA-5.4",  group: "Stainless Steel Electrodes" },
  { code: "ER308L",     f_no: "6", a_no: "8", sfa_no: "SFA-5.9",  group: "Stainless Steel Electrodes" },
  { code: "ER308LSi",   f_no: "6", a_no: "8", sfa_no: "SFA-5.9",  group: "Stainless Steel Electrodes" },
  { code: "ER309L",     f_no: "6", a_no: "8", sfa_no: "SFA-5.9",  group: "Stainless Steel Electrodes" },
  { code: "ER316L",     f_no: "6", a_no: "8", sfa_no: "SFA-5.9",  group: "Stainless Steel Electrodes" },
  { code: "ER316LSi",   f_no: "6", a_no: "8", sfa_no: "SFA-5.9",  group: "Stainless Steel Electrodes" },
  { code: "E308LT1-1",  f_no: "6", a_no: "8", sfa_no: "SFA-5.22", group: "Stainless Steel Electrodes" },
  { code: "E316LT1-1",  f_no: "6", a_no: "8", sfa_no: "SFA-5.22", group: "Stainless Steel Electrodes" },

  // Aluminum — SFA-5.10
  { code: "ER4043",     f_no: "23", a_no: null, sfa_no: "SFA-5.10", group: "Aluminum Fillers" },
  { code: "ER5356",     f_no: "23", a_no: null, sfa_no: "SFA-5.10", group: "Aluminum Fillers" },
  { code: "ER4047",     f_no: "23", a_no: null, sfa_no: "SFA-5.10", group: "Aluminum Fillers" },

  // Nickel Alloy — SFA-5.14
  { code: "ERNiCr-3",   f_no: "43", a_no: null, sfa_no: "SFA-5.14", group: "Nickel Alloy Fillers" },
  { code: "ERNiCrMo-3", f_no: "43", a_no: null, sfa_no: "SFA-5.14", group: "Nickel Alloy Fillers" },
  { code: "ERNi-1",     f_no: "41", a_no: null, sfa_no: "SFA-5.14", group: "Nickel Alloy Fillers" },

  // Low Alloy / Cr-Mo — SMAW (SFA-5.5), wires (SFA-5.28)
  { code: "ER80S-B2",   f_no: "6", a_no: "3", sfa_no: "SFA-5.28", group: "Low Alloy / Cr-Mo Steel Fillers" },
  { code: "ER90S-B3",   f_no: "6", a_no: "4", sfa_no: "SFA-5.28", group: "Low Alloy / Cr-Mo Steel Fillers" },
  { code: "E8018-B2",   f_no: "4", a_no: "3", sfa_no: "SFA-5.5",  group: "Low Alloy / Cr-Mo Steel Fillers" },
  { code: "E8018-B3",   f_no: "4", a_no: "4", sfa_no: "SFA-5.5",  group: "Low Alloy / Cr-Mo Steel Fillers" },

  // SAW — SFA-5.17 (carbon steel wires & flux/wire combos)
  { code: "EM12K",       f_no: "6", a_no: "1", sfa_no: "SFA-5.17", group: "Submerged Arc Welding (SAW) Wires & Flux" },
  { code: "EH14",        f_no: "6", a_no: "1", sfa_no: "SFA-5.17", group: "Submerged Arc Welding (SAW) Wires & Flux" },
  { code: "F7A2-EM12K",  f_no: "6", a_no: "1", sfa_no: "SFA-5.17", group: "Submerged Arc Welding (SAW) Wires & Flux" },
  { code: "F8A2-EH14",   f_no: "6", a_no: "1", sfa_no: "SFA-5.17", group: "Submerged Arc Welding (SAW) Wires & Flux" },

  // Oxy-Fuel — SFA-5.2
  { code: "RG45",        f_no: "6", a_no: "1", sfa_no: "SFA-5.2",  group: "Oxy-Fuel Rods" },
  { code: "RG60",        f_no: "6", a_no: "1", sfa_no: "SFA-5.2",  group: "Oxy-Fuel Rods" },
];

export const FILLER_CLASSIFICATION_MAP: Record<string, { f_no: string; a_no: string | null; sfa_no: string }> =
  FILLER_CLASSIFICATIONS.reduce((acc, e) => {
    acc[e.code] = { f_no: e.f_no, a_no: e.a_no, sfa_no: e.sfa_no };
    return acc;
  }, {} as Record<string, { f_no: string; a_no: string | null; sfa_no: string }>);

export function lookupFillerClassification(
  code: string | null | undefined,
): { f_no: string; a_no: string | null; sfa_no: string } | null {
  if (!code) return null;
  return FILLER_CLASSIFICATION_MAP[code.trim()] ?? null;
}

/** Returns the SFA(s) compatible with a given AWS class. */
export function lookupSfaForAwsClass(code: string | null | undefined): string[] {
  if (!code) return [];
  const entry = FILLER_CLASSIFICATION_MAP[code.trim()];
  return entry ? [entry.sfa_no] : [];
}

/** Returns the AWS classes that belong to a given SFA spec. */
export function lookupAwsClassesForSfa(sfa: string | null | undefined): string[] {
  if (!sfa) return [];
  const target = sfa.trim().toUpperCase();
  return FILLER_CLASSIFICATIONS
    .filter((e) => e.sfa_no.toUpperCase() === target)
    .map((e) => e.code);
}

/** Validate whether an AWS / SFA pair matches the ASME II-C catalog. */
export function isValidAwsSfaPair(
  awsClass: string | null | undefined,
  sfa: string | null | undefined,
): boolean {
  if (!awsClass || !sfa) return true; // partial = not yet invalid
  const entry = lookupFillerClassification(awsClass);
  if (!entry) return true; // custom / non-catalog AWS — can't judge
  return entry.sfa_no.toUpperCase() === sfa.trim().toUpperCase();
}

/** Sorted unique list of SFA specs, suitable for a combobox. */
export const SFA_NO_OPTIONS = Array.from(
  new Set(FILLER_CLASSIFICATIONS.map((e) => e.sfa_no)),
)
  .sort((a, b) => {
    const na = Number(a.replace(/[^\d.]/g, ""));
    const nb = Number(b.replace(/[^\d.]/g, ""));
    return na - nb;
  })
  .map((sfa) => {
    const codes = lookupAwsClassesForSfa(sfa);
    return {
      value: sfa,
      label: sfa,
      description: codes.length ? `AWS: ${codes.slice(0, 4).join(", ")}${codes.length > 4 ? "…" : ""}` : undefined,
      keywords: codes.join(" "),
    };
  });

/** Grouped form suitable for <optgroup> rendering. */
export function fillerClassificationsByGroup(): { group: string; codes: string[] }[] {
  return FILLER_CLASSIFICATION_GROUPS.map((g) => ({
    group: g,
    codes: FILLER_CLASSIFICATIONS.filter((e) => e.group === g).map((e) => e.code),
  }));
}
