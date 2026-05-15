/**
 * Qualification Intelligence — code-aware engine for ASME IX (QW-452 / QW-461)
 * and ISO 9606-1 qualification range derivation, transferability and material
 * group logic.
 *
 * Design goals:
 *   • Deterministic, pure functions — no side effects, easy to unit test.
 *   • Modular rule tables (POSITION_RULES, ISO_MATERIAL_GROUPS, …) so new code
 *     editions can be plugged in by extending the lookup, not the algorithm.
 *   • Stable public API — `deriveQualificationRanges` returns a structured
 *     `QualificationRanges` object consumed by both UI and PDF.
 *   • Companion validation engine lives in `qualification-validation.ts` and
 *     consumes these outputs to produce engineering-grade findings.
 *
 * NOTE: Coverage is intentionally pragmatic — the most common pipe + plate,
 * groove + fillet cases for ASME IX and ISO 9606-1. Lookup tables are clearly
 * marked so they can be extended without touching the public surface.
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
  backing: "with" | "without" | "both" | "n/a";
  productForm: "Plate" | "Pipe" | "Both";
  notes: string[];
  /** ASME P-Number / ISO material group qualified by this test. */
  materialGroups: string[];
  /** Whether this single test qualifies multi-process work. */
  multiProcess: boolean;
}

export interface RangeInput {
  code: CodeFamily;
  process: string;
  /** Optional second process for combination tests (e.g. GTAW root + SMAW fill). */
  secondProcess?: string;
  testCouponThicknessMm?: number;
  /** Deposit thickness per process (mm); falls back to coupon thickness. */
  depositThicknessMm?: number;
  testCouponDiameterMm?: number;
  testPosition?: string;
  fNumber?: number;
  pNumber?: number;
  isoGroup?: string;
  isPipe?: boolean;
  /** True if test was performed with backing (or backing weld / consumable insert). */
  withBacking?: boolean;
}

/* ================================================================== */
/* ASME IX (QW-452 / QW-461) lookup tables                             */
/* ================================================================== */

/**
 * QW-461.9 — performance qualification position table (groove welds).
 * Maps "what was tested" → "what is qualified".
 */
const POSITION_RULES: Record<string, { positions: string[]; productForm: "Plate" | "Pipe" | "Both"; note: string }> = {
  // Plate
  "1G":  { positions: ["F"], productForm: "Plate", note: "QW-461.9 — plate flat groove" },
  "2G":  { positions: ["F", "H"], productForm: "Plate", note: "QW-461.9 — plate horizontal groove" },
  "3G":  { positions: ["F", "V"], productForm: "Plate", note: "QW-461.9 — plate vertical groove" },
  "4G":  { positions: ["F", "OH"], productForm: "Plate", note: "QW-461.9 — plate overhead groove" },
  "3G+4G": { positions: ["F", "H", "V", "OH"], productForm: "Plate", note: "QW-461.9 — all plate positions" },
  // Pipe
  "1G-PIPE": { positions: ["F (rolled pipe)"], productForm: "Pipe", note: "QW-461.9 — pipe rolled" },
  "2G-PIPE": { positions: ["F", "H"], productForm: "Pipe", note: "QW-461.9 — pipe horizontal axis fixed" },
  "5G":   { positions: ["F", "V", "OH"], productForm: "Pipe", note: "QW-461.9 — pipe horizontal axis fixed (5G)" },
  "6G":   { positions: ["F", "H", "V", "OH", "All groove"], productForm: "Both", note: "QW-461.9 — 6G qualifies all positions, plate + pipe ≥ 73 mm OD" },
  "6GR":  { positions: ["All — restricted access"], productForm: "Both", note: "QW-461.9 — 6GR restricted access; covers 6G" },
  // Fillet
  "1F": { positions: ["F (fillet)"], productForm: "Both", note: "QW-461.9 — fillet flat" },
  "2F": { positions: ["F", "H (fillet)"], productForm: "Both", note: "QW-461.9 — fillet horizontal" },
  "3F": { positions: ["F", "H", "V (fillet)"], productForm: "Both", note: "QW-461.9 — fillet vertical" },
  "4F": { positions: ["F", "H", "OH (fillet)"], productForm: "Both", note: "QW-461.9 — fillet overhead" },
};

/**
 * P-number → groups it qualifies (QW-423.1, simplified). Listed P-Numbers
 * qualify themselves and selected adjacent groups commonly accepted in
 * industrial practice. Extend as needed.
 */
const PNUM_TRANSFERABILITY: Record<number, number[]> = {
  1: [1],          // Carbon steels
  3: [1, 3],       // Low-alloy
  4: [1, 3, 4],
  5: [1, 3, 4, 5], // Cr-Mo
  8: [8],          // Stainless 300-series
  9: [9],          // Ni 9% steel
  10: [10],
  11: [11],
  21: [21],        // Aluminium 1xxx
  22: [21, 22],    // Aluminium 5xxx
  41: [41],        // Nickel
  42: [41, 42],
  43: [41, 42, 43],
  51: [51],        // Titanium
  61: [61],        // Zirconium
};

/* ----- QW-452.1(b): groove weld base metal thickness ----- */
function asmeBaseThickness(t: number, withBacking: boolean): NumericRange {
  if (!t) return { min: null, max: null, unit: "mm", note: "QW-452.1(b) — coupon thickness required" };
  // Without backing on plate test < 16 mm: max qualified is 2t but cap at 'less than 16 mm'
  if (t < 1.5) return { min: t, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (t < 10)  return { min: 1.5, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (t < 19)  return { min: 5, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  // ≥ 19 mm with backing → unlimited; without backing → max 2t (typical interpretation)
  if (withBacking) return { min: 5, max: null, unit: "mm", note: "QW-452.1(b) — with backing, unlimited" };
  return { min: 5, max: 2 * t, unit: "mm", note: "QW-452.1(b) — without backing, max = 2t" };
}

/* ----- QW-452.1(b): deposit thickness ----- */
function asmeDepositThickness(t: number): NumericRange {
  if (!t) return { min: 0, max: null, unit: "mm" };
  if (t < 13) return { min: 0, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  return { min: 0, max: null, unit: "mm", note: "QW-452.1(b) — t ≥ 13 mm: unlimited" };
}

/* ----- QW-452.3: pipe outside-diameter qualification ----- */
function asmeDiameter(d: number | undefined, isPipe: boolean): NumericRange {
  if (!isPipe || !d) return { min: null, max: null, unit: "mm", note: "Plate — diameter not applicable" };
  if (d < 25) return { min: d, max: null, unit: "mm", note: "QW-452.3 — < 25 mm: tested OD only" };
  if (d < 73) return { min: 25, max: null, unit: "mm", note: "QW-452.3 — 25 mm to < 73 mm OD" };
  return { min: 73, max: null, unit: "mm", note: "QW-452.3 — ≥ 73 mm OD: unlimited (plate also qualified)" };
}

/* ================================================================== */
/* ISO 9606-1 lookup tables                                            */
/* ================================================================== */

/**
 * ISO 9606-1 Table 3 — material grouping (simplified). Groups higher up
 * cover groups below per ISO 9606-1 Annex A.
 */
const ISO_MATERIAL_GROUPS: Record<string, string[]> = {
  "1.1": ["1.1"],
  "1.2": ["1.1", "1.2"],
  "1.3": ["1.1", "1.2", "1.3"],
  "1.4": ["1.1", "1.2", "1.3", "1.4"],
  "2":   ["1.1", "1.2", "2"],
  "3":   ["1.1", "1.2", "1.3", "1.4", "3"],
  "4":   ["1.1", "1.2", "1.3", "1.4", "4"],
  "5":   ["1.1", "1.2", "1.3", "1.4", "5"],
  "8":   ["8"],
  "9.1": ["9.1"],
  "9.2": ["9.1", "9.2"],
  "9.3": ["9.1", "9.2", "9.3"],
  "10":  ["10"],
};

function isoBaseThickness(t: number): NumericRange {
  if (!t) return { min: null, max: null, unit: "mm" };
  if (t < 3)  return { min: t, max: 2 * t, unit: "mm", note: "ISO 9606-1 Tab. 4" };
  if (t <= 12) return { min: 3, max: 2 * t, unit: "mm", note: "ISO 9606-1 Tab. 4" };
  return { min: 5, max: null, unit: "mm", note: "ISO 9606-1 Tab. 4 — ≥ 12 mm: unlimited" };
}

function isoDiameter(d: number | undefined, isPipe: boolean): NumericRange {
  if (!isPipe || !d) return { min: null, max: null, unit: "mm" };
  if (d < 25) return { min: 0.5 * d, max: 2 * d, unit: "mm", note: "ISO 9606-1 Tab. 5" };
  return { min: 0.5 * d, max: null, unit: "mm", note: "ISO 9606-1 Tab. 5 — ≥ 25 mm: unlimited upper" };
}

/* ================================================================== */
/* Public API                                                          */
/* ================================================================== */

export function deriveQualificationRanges(input: RangeInput): QualificationRanges {
  const isPipe = !!input.isPipe;
  const t = input.testCouponThicknessMm ?? 0;
  const dep = input.depositThicknessMm ?? t;
  const d = input.testCouponDiameterMm;
  const withBacking = !!input.withBacking;
  const notes: string[] = [];

  let baseThickness: NumericRange;
  let depositThickness: NumericRange;
  let diameter: NumericRange;
  let materialGroups: string[] = [];

  if (input.code === "ASME IX") {
    baseThickness = asmeBaseThickness(t, withBacking);
    depositThickness = asmeDepositThickness(dep);
    diameter = asmeDiameter(d, isPipe);
    if (input.pNumber && PNUM_TRANSFERABILITY[input.pNumber]) {
      materialGroups = PNUM_TRANSFERABILITY[input.pNumber].map((p) => `P-${p}`);
    } else if (input.pNumber) {
      materialGroups = [`P-${input.pNumber}`];
    }
    notes.push("Ranges derived per ASME Section IX, QW-452 / QW-461.");
  } else if (input.code === "EN ISO") {
    baseThickness = isoBaseThickness(t);
    depositThickness = isoBaseThickness(dep);
    diameter = isoDiameter(d, isPipe);
    if (input.isoGroup && ISO_MATERIAL_GROUPS[input.isoGroup]) {
      materialGroups = ISO_MATERIAL_GROUPS[input.isoGroup].map((g) => `Group ${g}`);
    } else if (input.isoGroup) {
      materialGroups = [`Group ${input.isoGroup}`];
    }
    notes.push("Ranges derived per ISO 9606-1 Tables 3–5.");
  } else {
    baseThickness = { min: t, max: 2 * t, unit: "mm" };
    depositThickness = { min: 0, max: 2 * dep, unit: "mm" };
    diameter = { min: d ?? null, max: null, unit: "mm" };
    notes.push(`${input.code}: generic 2t rule applied — extend lookup table for full coverage.`);
  }

  /* Position rules (ASME IX QW-461 used as default; ISO 9606 uses similar codes). */
  const posKey = normalisePositionKey(input.testPosition, isPipe);
  const posRule = posKey ? POSITION_RULES[posKey] : undefined;
  const positions = posRule?.positions ?? (input.testPosition ? [input.testPosition] : []);
  const productForm: "Plate" | "Pipe" | "Both" =
    posRule?.productForm ?? (isPipe ? "Pipe" : "Plate");

  if (posRule?.note) notes.push(posRule.note);

  /* Pipe ↔ plate transferability (QW-303): 6G or pipe ≥ 73 mm OD also qualifies plate. */
  if (isPipe && (posKey === "6G" || posKey === "6GR" || (d ?? 0) >= 73)) {
    notes.push("Pipe ≥ 73 mm OD or 6G test also qualifies plate per QW-303.");
  } else if (!isPipe) {
    notes.push("Plate test does not qualify pipe < 73 mm OD (QW-303).");
  }

  /* Backing rules (QW-350 / QW-403.7): with-backing test does NOT qualify
     without-backing production work. */
  let backing: QualificationRanges["backing"] = "n/a";
  if (input.code === "ASME IX") {
    backing = withBacking ? "with" : "both";
    if (withBacking) {
      notes.push("With-backing test: production welds without backing are NOT qualified (QW-350).");
    } else {
      notes.push("Without-backing test qualifies both with- and without-backing production welds.");
    }
  }

  /* Multi-process: separate processes must each be tested per QW-306, but a
     combination test qualifies the combination plus the separate use of each
     process within its own deposit thickness range. */
  const processes: string[] = [input.process, input.secondProcess].filter(Boolean) as string[];
  const multiProcess = processes.length > 1;
  if (multiProcess) {
    notes.push("Combination test (QW-306): each process qualified for its own deposit thickness only.");
  }

  return {
    baseThickness,
    depositThickness,
    diameter,
    positions,
    processes,
    fNumbers: input.fNumber ? [input.fNumber] : [],
    pNumbers: input.pNumber ? [input.pNumber] : [],
    backing,
    productForm,
    materialGroups,
    multiProcess,
    notes,
  };
}

function normalisePositionKey(pos: string | undefined, isPipe: boolean): string | undefined {
  if (!pos) return undefined;
  const p = pos.trim().toUpperCase().replace(/\s+/g, "");
  if (POSITION_RULES[p]) return p;
  // Pipe variants: caller may pass "1G" but mean pipe rolled
  if (isPipe && (p === "1G" || p === "2G")) return `${p}-PIPE`;
  return p;
}

export function formatRange(r: NumericRange): string {
  if (r.min == null && r.max == null) return "—";
  const u = r.unit;
  if (r.max == null) return `≥ ${r.min} ${u}`;
  if (r.min == null) return `≤ ${r.max} ${u}`;
  return `${r.min} – ${r.max} ${u}`;
}

/** Numeric coverage helper used by validation engine. */
export function isWithinRange(value: number, r: NumericRange): boolean {
  if (r.min != null && value < r.min) return false;
  if (r.max != null && value > r.max) return false;
  return true;
}
