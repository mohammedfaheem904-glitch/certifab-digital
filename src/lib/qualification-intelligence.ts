/**
 * Qualification Intelligence — future-ready engine for code-based range derivation.
 *
 * Provides the scaffolding for ASME Section IX (QW-452 / QW-461) and ISO 9606
 * qualification-range calculations: thickness, diameter, position, process and
 * F-number derivations. Functions return structured `Range` objects so the UI
 * can later render qualification matrices automatically from a small set of
 * test inputs.
 *
 * NOTE: The current implementations cover the most common pipe + plate cases.
 * Extend the lookup tables as more cases are required — the public API is
 * stable, so consumers (UI, PDF) won't need to change.
 */

export type CodeFamily = "ASME IX" | "AWS" | "EN ISO" | "AS/NZS" | "JIS";

export interface NumericRange {
  min: number | null;
  max: number | null;
  unit: "mm" | "in" | "deg";
  note?: string;
}

export interface QualificationRanges {
  baseThickness: NumericRange;
  depositThickness: NumericRange;
  diameter: NumericRange;
  positions: string[];
  processes: string[];
  fNumbers: number[];
  pNumbers: number[];
  notes: string[];
}

export interface RangeInput {
  code: CodeFamily;
  process: string;
  testCouponThicknessMm?: number;
  testCouponDiameterMm?: number;
  testPosition?: string;
  fNumber?: number;
  pNumber?: number;
  isPipe?: boolean;
}

/* ------------------------------------------------------------------ */
/* ASME IX (QW-452) — simplified rules                                 */
/* ------------------------------------------------------------------ */

function asmeBaseThickness(t: number): NumericRange {
  // QW-452.1(b) Groove welds — base metal thickness qualified
  if (t < 1.5) return { min: t, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (t <= 10) return { min: 1.5, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (t < 19) return { min: 5, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  return { min: 5, max: null, unit: "mm", note: "QW-452.1(b) — unlimited" };
}

function asmeDepositThickness(t: number): NumericRange {
  // Deposit thickness "t" qualifies up to 2t (single process, ≤ 13 mm rule)
  if (t < 13) return { min: 0, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  return { min: 0, max: null, unit: "mm", note: "QW-452.1(b) — unlimited" };
}

function asmeDiameter(d: number | undefined, isPipe: boolean): NumericRange {
  if (!isPipe || !d) return { min: null, max: null, unit: "mm", note: "Plate — N/A" };
  // QW-452.3 — pipe OD qualification
  if (d < 25) return { min: d, max: null, unit: "mm", note: "QW-452.3" };
  if (d < 73) return { min: 25, max: null, unit: "mm", note: "QW-452.3" };
  return { min: 73, max: null, unit: "mm", note: "QW-452.3 — ≥ NPS 2½ unlimited" };
}

function asmePositions(test: string | undefined, isPipe: boolean): string[] {
  // QW-461 — position qualification (groove)
  const t = (test ?? "").toUpperCase();
  if (!t) return [];
  if (isPipe) {
    if (t === "6G") return ["F", "H", "V", "OH", "1G", "2G", "3G", "4G", "5G", "6G"];
    if (t === "6GR") return ["All — restricted access"];
    if (t === "5G") return ["F", "V", "OH", "1G", "3G", "4G", "5G"];
    if (t === "2G") return ["F", "H", "1G", "2G"];
    if (t === "1G") return ["F", "1G"];
  }
  if (t === "3G+4G") return ["All plate positions"];
  if (t === "1G") return ["F"];
  if (t === "2G") return ["F", "H"];
  if (t === "3G") return ["F", "V"];
  if (t === "4G") return ["F", "OH"];
  return [t];
}

function asmeProcesses(p: string): string[] {
  // Same process qualifies the same process. (QW-403 future expansion.)
  return p ? [p] : [];
}

/* ------------------------------------------------------------------ */
/* ISO 9606-1 — simplified ranges                                      */
/* ------------------------------------------------------------------ */

function isoBaseThickness(t: number): NumericRange {
  if (t < 3) return { min: t, max: 2 * t, unit: "mm" };
  if (t <= 12) return { min: 3, max: 2 * t, unit: "mm" };
  return { min: 5, max: null, unit: "mm", note: "ISO 9606-1 Tab. 4 — unlimited" };
}

function isoDiameter(d: number | undefined, isPipe: boolean): NumericRange {
  if (!isPipe || !d) return { min: null, max: null, unit: "mm" };
  if (d < 25) return { min: 0.5 * d, max: 2 * d, unit: "mm", note: "ISO 9606-1 Tab. 5" };
  if (d <= 150) return { min: 0.5 * d, max: null, unit: "mm", note: "ISO 9606-1 Tab. 5" };
  return { min: 0.5 * d, max: null, unit: "mm", note: "ISO 9606-1 Tab. 5" };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function deriveQualificationRanges(input: RangeInput): QualificationRanges {
  const isPipe = !!input.isPipe;
  const t = input.testCouponThicknessMm ?? 0;
  const d = input.testCouponDiameterMm;
  const notes: string[] = [];

  let baseThickness: NumericRange;
  let depositThickness: NumericRange;
  let diameter: NumericRange;

  if (input.code === "ASME IX") {
    baseThickness = asmeBaseThickness(t);
    depositThickness = asmeDepositThickness(t);
    diameter = asmeDiameter(d, isPipe);
    notes.push("Ranges derived per ASME Section IX, QW-452 (simplified).");
  } else if (input.code === "EN ISO") {
    baseThickness = isoBaseThickness(t);
    depositThickness = isoBaseThickness(t);
    diameter = isoDiameter(d, isPipe);
    notes.push("Ranges derived per ISO 9606-1 (simplified).");
  } else {
    baseThickness = { min: t, max: 2 * t, unit: "mm" };
    depositThickness = { min: 0, max: 2 * t, unit: "mm" };
    diameter = { min: d ?? null, max: null, unit: "mm" };
    notes.push(`${input.code}: generic 2t rule applied. Extend lookup table for full coverage.`);
  }

  return {
    baseThickness,
    depositThickness,
    diameter,
    positions: asmePositions(input.testPosition, isPipe),
    processes: asmeProcesses(input.process),
    fNumbers: input.fNumber ? [input.fNumber] : [],
    pNumbers: input.pNumber ? [input.pNumber] : [],
    notes,
  };
}

export function formatRange(r: NumericRange): string {
  if (r.min == null && r.max == null) return "—";
  const u = r.unit;
  if (r.max == null) return `≥ ${r.min} ${u}`;
  if (r.min == null) return `≤ ${r.max} ${u}`;
  return `${r.min} – ${r.max} ${u}`;
}
