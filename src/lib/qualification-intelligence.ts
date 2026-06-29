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

/* ================================================================== */
/* Per-variable derivers — used by WPQ Variables matrix                */
/* ================================================================== */

export interface VariableDerivation {
  qualifiedFor: string;
  codeRef: string;
  warning?: string;
}

const EMPTY: VariableDerivation = { qualifiedFor: "", codeRef: "" };

function parseNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

export function derivePNumberRange(value: unknown): VariableDerivation {
  const p = parseNum(value);
  if (p == null) return { ...EMPTY, codeRef: "QW-423.1" };
  const list = PNUM_TRANSFERABILITY[p];
  if (!list) {
    return {
      qualifiedFor: `P-${p} only`,
      codeRef: "QW-423.1",
      warning: `P-No ${p} not in transferability table — qualifies itself only.`,
    };
  }
  const others = list.filter((x) => x !== p);
  const txt = others.length
    ? `P-${p} (also covers ${others.map((x) => `P-${x}`).join(", ")})`
    : `P-${p} only`;
  return { qualifiedFor: txt, codeRef: "QW-423.1" };
}

export function deriveFNumberRange(value: unknown): VariableDerivation {
  const f = parseNum(value);
  if (f == null) return { ...EMPTY, codeRef: "QW-433" };
  // QW-433: change in F-No is essential — qualifies same F-No only.
  // Special: F-6 austenitic SS qualifies F-6 only; F-43 NiCrMo covers some lower per QW-433.
  let note = `F-${f} only`;
  if (f === 6) note = `F-6 only (austenitic SS — no transferability)`;
  return { qualifiedFor: note, codeRef: "QW-433" };
}

export function deriveCouponThicknessDerivation(
  value: unknown,
  withBacking = false,
): VariableDerivation {
  const t = parseNum(value);
  if (t == null) return { ...EMPTY, codeRef: "QW-452.1(b)" };
  const base = asmeBaseThickness(t, withBacking);
  const dep = asmeDepositThickness(t);
  return {
    qualifiedFor: `Base: ${formatRange(base)} · Deposit: ${formatRange(dep)}`,
    codeRef: "QW-452.1(b)",
  };
}

export function derivePipeDiameterRange(value: unknown): VariableDerivation {
  const d = parseNum(value);
  if (d == null) return { ...EMPTY, codeRef: "QW-403.16 / QW-452.3" };
  const r = asmeDiameter(d, true);
  return { qualifiedFor: formatRange(r), codeRef: "QW-403.16 / QW-452.3" };
}

export function derivePositionRangeFromKey(
  value: unknown,
  isPipe = false,
): VariableDerivation {
  const raw = (value ?? "").toString().trim();
  if (!raw) return { ...EMPTY, codeRef: "QW-461.9" };
  const key = normalisePositionKey(raw, isPipe);
  const rule = key ? POSITION_RULES[key] : undefined;
  if (!rule) {
    return {
      qualifiedFor: raw,
      codeRef: "QW-461.9",
      warning: `Position "${raw}" is not in QW-461.9 table — qualifies tested position only.`,
    };
  }
  return { qualifiedFor: rule.positions.join(", "), codeRef: "QW-461.9" };
}

export function deriveProgressionRange(value: unknown): VariableDerivation {
  const v = (value ?? "").toString().trim().toLowerCase();
  if (!v) return { ...EMPTY, codeRef: "QW-405.3" };
  if (v.startsWith("up")) return { qualifiedFor: "Uphill only", codeRef: "QW-405.3" };
  if (v.startsWith("down")) return { qualifiedFor: "Downhill only", codeRef: "QW-405.3" };
  if (v.startsWith("n")) return { qualifiedFor: "N/A", codeRef: "QW-405.3" };
  return {
    qualifiedFor: v,
    codeRef: "QW-405.3",
    warning: "Unknown progression — qualifies tested progression only.",
  };
}

export function deriveBackingRangeText(value: unknown): VariableDerivation {
  const v = (value ?? "").toString().trim().toLowerCase();
  if (!v) return { ...EMPTY, codeRef: "QW-402.4 / QW-350" };
  if (v.startsWith("with") && !v.startsWith("without")) {
    return {
      qualifiedFor: "With backing only (does NOT qualify without backing)",
      codeRef: "QW-402.4 / QW-350",
    };
  }
  if (v.startsWith("without") || v.startsWith("no")) {
    return {
      qualifiedFor: "With and without backing",
      codeRef: "QW-402.4 / QW-350",
    };
  }
  return { qualifiedFor: v, codeRef: "QW-402.4 / QW-350" };
}

export function deriveCurrentPolarityRange(value: unknown): VariableDerivation {
  const v = (value ?? "").toString().trim();
  if (!v) return { ...EMPTY, codeRef: "QW-409.4" };
  return {
    qualifiedFor: `${v} only (change in current / polarity is essential)`,
    codeRef: "QW-409.4",
  };
}

/** Registry consumed by the WPQ Variables matrix. */
export const VARIABLE_DERIVERS: Record<
  string,
  {
    label: string;
    codeRef: string;
    kind: "number" | "select" | "text";
    options?: string[];
    derive: (value: unknown, extra?: { withBacking?: boolean; isPipe?: boolean }) => VariableDerivation;
    placeholder?: string;
  }
> = {
  p_no: {
    label: "P-Number (Base)",
    codeRef: "QW-423.1",
    kind: "number",
    placeholder: "e.g. 1",
    derive: (v) => derivePNumberRange(v),
  },
  f_no: {
    label: "F-Number (Filler)",
    codeRef: "QW-433",
    kind: "number",
    placeholder: "e.g. 6",
    derive: (v) => deriveFNumberRange(v),
  },
  thickness: {
    label: "Coupon Thickness (mm)",
    codeRef: "QW-452.1(b)",
    kind: "number",
    placeholder: "mm",
    derive: (v, extra) => deriveCouponThicknessDerivation(v, extra?.withBacking),
  },
  diameter: {
    label: "Pipe Diameter (mm OD)",
    codeRef: "QW-403.16 / QW-452.3",
    kind: "number",
    placeholder: "mm",
    derive: (v) => derivePipeDiameterRange(v),
  },
  position: {
    label: "Position",
    codeRef: "QW-461.9",
    kind: "select",
    options: Object.keys(POSITION_RULES),
    derive: (v, extra) => derivePositionRangeFromKey(v, extra?.isPipe),
  },
  progression: {
    label: "Progression",
    codeRef: "QW-405.3",
    kind: "select",
    options: ["Uphill", "Downhill", "N/A"],
    derive: (v) => deriveProgressionRange(v),
  },
  backing: {
    label: "Backing",
    codeRef: "QW-402.4 / QW-350",
    kind: "select",
    options: ["With backing", "Without backing"],
    derive: (v) => deriveBackingRangeText(v),
  },
  current: {
    label: "Current / Polarity",
    codeRef: "QW-409.4",
    kind: "select",
    options: ["AC", "DCEN", "DCEP", "Pulsed"],
    derive: (v) => deriveCurrentPolarityRange(v),
  },

  // ----- Additional WPQ variables (Inert Gas Backing, AWS Spec, Insert, Weld Deposit, etc.)
  inert_gas_backing: {
    label: "Inert Gas Backing",
    codeRef: "QW-408.5",
    kind: "select",
    options: ["With backing gas", "Without backing gas"],
    derive: (v) => {
      const s = (v ?? "").toString().toLowerCase();
      if (!s) return { qualifiedFor: "", codeRef: "QW-408.5" };
      if (s.includes("without")) {
        return { qualifiedFor: "With and without backing gas", codeRef: "QW-408.5" };
      }
      return {
        qualifiedFor: "With backing gas only (does NOT qualify without)",
        codeRef: "QW-408.5",
        warning: "Deletion of backing gas requires requalification (QW-408.5).",
      };
    },
  },
  aws_spec: {
    label: "AWS Specification",
    codeRef: "QW-404.4",
    kind: "select",
    options: [
      "SFA-5.1", "SFA-5.4", "SFA-5.5", "SFA-5.9", "SFA-5.11", "SFA-5.14",
      "SFA-5.17", "SFA-5.18", "SFA-5.20", "SFA-5.22", "SFA-5.28", "SFA-5.29",
    ],
    derive: (v) => asListed(v, "QW-404.4"),
  },
  insert_ring: {
    label: "Consumable Insert",
    codeRef: "QW-402.10",
    kind: "select",
    options: ["With insert", "Without insert"],
    derive: (v) => {
      const s = (v ?? "").toString().toLowerCase();
      if (!s) return { qualifiedFor: "", codeRef: "QW-402.10" };
      if (s.includes("without")) {
        return {
          qualifiedFor: "Without insert only (adding insert requires requalification)",
          codeRef: "QW-402.10",
        };
      }
      return {
        qualifiedFor: "With consumable insert only (removal requires requalification)",
        codeRef: "QW-402.10",
      };
    },
  },
  weld_deposit: {
    label: "T Weld Deposit Thickness (mm)",
    codeRef: "QW-452.1(b)",
    kind: "number",
    placeholder: "mm",
    derive: (v, extra) => {
      const t = parseNum(v);
      if (t == null) return { qualifiedFor: "", codeRef: "QW-452.1(b)" };
      const dep = asmeDepositThickness(t);
      const base = asmeBaseThickness(t, !!extra?.withBacking);
      return {
        qualifiedFor: `Deposit: ${formatRange(dep)} · Base: ${formatRange(base)}`,
        codeRef: "QW-452.1(b)",
      };
    },
  },
  test_specimen: {
    label: "Test Specimen",
    codeRef: "QW-452",
    kind: "select",
    options: ["Plate", "Pipe", "Plate + Pipe (≥73 mm OD or 6G)"],
    derive: (v) => {
      const s = (v ?? "").toString();
      if (!s) return { qualifiedFor: "", codeRef: "QW-452" };
      if (s.startsWith("Plate +")) {
        return { qualifiedFor: "Plate and Pipe (per QW-303)", codeRef: "QW-303 / QW-452" };
      }
      if (s === "Pipe") {
        return {
          qualifiedFor: "Pipe only (plate not qualified unless OD ≥ 73 mm or 6G)",
          codeRef: "QW-303",
        };
      }
      return {
        qualifiedFor: "Plate only (pipe < 73 mm OD not qualified)",
        codeRef: "QW-303",
      };
    },
  },
  sfa: {
    label: "SFA Classification",
    codeRef: "QW-404.4",
    kind: "text",
    placeholder: "e.g. E7018, ER70S-6",
    derive: (v) => asListed(v, "QW-404.4"),
  },
  filler_metal: {
    label: "Filler Metal Form",
    codeRef: "QW-404.23",
    kind: "select",
    options: ["Solid (Bare)", "Cored (Flux)", "Cored (Metal)", "Covered (Stick)", "Powder", "Strip"],
    derive: (v) => {
      const s = (v ?? "").toString();
      if (!s) return { qualifiedFor: "", codeRef: "QW-404.23" };
      return {
        qualifiedFor: `${s} only (change of form is essential)`,
        codeRef: "QW-404.23",
      };
    },
  },
  transfer_mode: {
    label: "Transfer Mode (GMAW)",
    codeRef: "QW-409.2",
    kind: "select",
    options: ["Short-circuiting", "Globular", "Spray", "Pulsed"],
    derive: (v) => {
      const s = (v ?? "").toString();
      if (!s) return { qualifiedFor: "", codeRef: "QW-409.2" };
      if (s === "Short-circuiting") {
        return {
          qualifiedFor: "Short-circuiting only (change to/from short-circuit is essential)",
          codeRef: "QW-409.2",
          warning: "GMAW-S qualification does not transfer to other transfer modes.",
        };
      }
      return {
        qualifiedFor: `${s} (qualifies globular, spray, pulsed interchangeably; not short-circuit)`,
        codeRef: "QW-409.2",
      };
    },
  },
  joint_type: {
    label: "Joint Type",
    codeRef: "QW-402.1",
    kind: "select",
    options: ["Groove", "Fillet", "Groove + Fillet"],
    derive: (v) => {
      const s = (v ?? "").toString();
      if (!s) return { qualifiedFor: "", codeRef: "QW-402.1" };
      if (s.startsWith("Groove")) {
        return {
          qualifiedFor: "Groove and Fillet (groove qualifies fillet per QW-303.1)",
          codeRef: "QW-303.1",
        };
      }
      return {
        qualifiedFor: "Fillet only (does NOT qualify groove)",
        codeRef: "QW-303.2",
      };
    },
  },
};

/* ================================================================== */
/* WPS variable derivers — used by the WPS Variables matrix            */
/* ================================================================== */

export interface WpsVarSpec {
  /** Input control type for the Qualified Value cell. */
  kind: "number" | "select" | "text";
  /** Options for select kind. */
  options?: string[];
  /** Optional placeholder / unit hint. */
  placeholder?: string;
  /** Show a "Tested with backing" checkbox alongside the input. */
  withBackingToggle?: boolean;
  /** Default code reference (used when no value entered). */
  codeRef: string;
  /** Compute the range string + code ref + warning from the value. */
  derive: (
    value: unknown,
    extra?: { withBacking?: boolean; isPipe?: boolean },
  ) => VariableDerivation;
}

const numFmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2));

function pmTemp(value: unknown, deltaLow: number, deltaHigh: number, ref: string): VariableDerivation {
  const t = parseNum(value);
  if (t == null) return { qualifiedFor: "", codeRef: ref };
  return { qualifiedFor: `${numFmt(t - deltaLow)} – ${numFmt(t + deltaHigh)} °C`, codeRef: ref };
}

function maxOnly(value: unknown, ref: string, unit: string): VariableDerivation {
  const v = parseNum(value);
  if (v == null) return { qualifiedFor: "", codeRef: ref };
  return { qualifiedFor: `≤ ${numFmt(v)} ${unit}`, codeRef: ref };
}

function minOnly(value: unknown, ref: string, unit: string, delta = 0): VariableDerivation {
  const v = parseNum(value);
  if (v == null) return { qualifiedFor: "", codeRef: ref };
  return { qualifiedFor: `≥ ${numFmt(v - delta)} ${unit}`, codeRef: ref };
}

function plusMinusPct(value: unknown, pct: number, ref: string, unit: string): VariableDerivation {
  const v = parseNum(value);
  if (v == null) return { qualifiedFor: "", codeRef: ref };
  const lo = v * (1 - pct / 100);
  const hi = v * (1 + pct / 100);
  return {
    qualifiedFor: `${numFmt(lo)} – ${numFmt(hi)} ${unit} (±${pct}%)`,
    codeRef: ref,
  };
}

function asListed(value: unknown, ref: string): VariableDerivation {
  const v = (value ?? "").toString().trim();
  if (!v) return { qualifiedFor: "", codeRef: ref };
  return { qualifiedFor: `As qualified: ${v}`, codeRef: ref };
}

/** Registry keyed by WpsVariablesMatrix preset `variable_key`. */
export const WPS_VARIABLE_SPECS: Record<string, WpsVarSpec> = {
  // ----- Welding Process
  process: {
    kind: "select",
    options: ["SMAW", "GTAW", "GMAW", "FCAW", "SAW", "PAW", "ESW"],
    codeRef: "QW-401.1",
    derive: (v) => asListed(v, "QW-401.1"),
  },
  process_type: {
    kind: "select",
    options: ["Manual", "Semi-Automatic", "Mechanized", "Automatic"],
    codeRef: "QW-410",
    derive: (v) => asListed(v, "QW-410"),
  },

  // ----- Joint Design
  joint_groove: {
    kind: "text",
    codeRef: "QW-402.1",
    derive: (v) => asListed(v, "QW-402.1"),
  },
  joint_backing: {
    kind: "select",
    options: ["With backing", "Without backing"],
    codeRef: "QW-402.4",
    derive: (v) => deriveBackingRangeText(v),
  },
  joint_root_spacing: {
    kind: "text",
    codeRef: "QW-402.10",
    derive: (v) => asListed(v, "QW-402.10"),
  },

  // ----- Base Metal
  bm_pno: {
    kind: "number",
    placeholder: "e.g. 1",
    codeRef: "QW-403.11",
    derive: (v) => ({ ...derivePNumberRange(v), codeRef: "QW-403.11" }),
  },
  bm_group: {
    kind: "number",
    placeholder: "e.g. 1",
    codeRef: "QW-403.16",
    derive: (v) => {
      const g = parseNum(v);
      if (g == null) return { qualifiedFor: "", codeRef: "QW-403.16" };
      return { qualifiedFor: `Group ${g} only`, codeRef: "QW-403.16" };
    },
  },
  bm_thickness: {
    kind: "number",
    placeholder: "mm",
    withBackingToggle: true,
    codeRef: "QW-451.1",
    derive: (v, extra) => ({
      ...deriveCouponThicknessDerivation(v, extra?.withBacking),
      codeRef: "QW-403.6 / QW-451.1",
    }),
  },
  bm_diameter: {
    kind: "number",
    placeholder: "mm OD",
    codeRef: "QW-403.13",
    derive: (v) => ({ ...derivePipeDiameterRange(v), codeRef: "QW-403.13" }),
  },
  bm_pwht_cond: {
    kind: "text",
    codeRef: "QW-403.8",
    derive: (v) => asListed(v, "QW-403.8"),
  },

  // ----- Filler Metal
  fm_fno: {
    kind: "number",
    placeholder: "e.g. 6",
    codeRef: "QW-404.4",
    derive: (v) => ({ ...deriveFNumberRange(v), codeRef: "QW-404.4" }),
  },
  fm_ano: {
    kind: "number",
    placeholder: "e.g. 8",
    codeRef: "QW-404.5",
    derive: (v) => {
      const a = parseNum(v);
      if (a == null) return { qualifiedFor: "", codeRef: "QW-404.5" };
      return { qualifiedFor: `A-${a} only`, codeRef: "QW-404.5" };
    },
  },
  fm_sfa: {
    kind: "text",
    codeRef: "QW-404.4",
    derive: (v) => asListed(v, "QW-404.4"),
  },
  fm_diameter: {
    kind: "number",
    placeholder: "mm",
    codeRef: "QW-404.6",
    derive: (v) => {
      const d = parseNum(v);
      if (d == null) return { qualifiedFor: "", codeRef: "QW-404.6" };
      return { qualifiedFor: `≤ ${numFmt(d)} mm (qualified diameter and smaller)`, codeRef: "QW-404.6" };
    },
  },
  fm_deposit_thk: {
    kind: "number",
    placeholder: "mm",
    codeRef: "QW-404.32",
    derive: (v) => {
      const t = parseNum(v);
      if (t == null) return { qualifiedFor: "", codeRef: "QW-404.32" };
      const r = asmeDepositThickness(t);
      return { qualifiedFor: formatRange(r), codeRef: "QW-404.32" };
    },
  },
  fm_supplemental: {
    kind: "text",
    codeRef: "QW-404.23",
    derive: (v) => asListed(v, "QW-404.23"),
  },

  // ----- Electrical
  el_current: {
    kind: "select",
    options: ["AC", "DCEN", "DCEP", "Pulsed"],
    codeRef: "QW-409.4",
    derive: (v) => deriveCurrentPolarityRange(v),
  },
  el_amperage: {
    kind: "number",
    placeholder: "A",
    codeRef: "QW-409.8",
    derive: (v) => plusMinusPct(v, 10, "QW-409.8", "A"),
  },
  el_voltage: {
    kind: "number",
    placeholder: "V",
    codeRef: "QW-409.8",
    derive: (v) => plusMinusPct(v, 10, "QW-409.8", "V"),
  },
  el_heat_input: {
    kind: "number",
    placeholder: "kJ/mm",
    codeRef: "QW-409.1",
    derive: (v) => maxOnly(v, "QW-409.1", "kJ/mm"),
  },
  el_travel_speed: {
    kind: "number",
    placeholder: "mm/min",
    codeRef: "QW-410.5",
    derive: (v) => plusMinusPct(v, 10, "QW-410.5", "mm/min"),
  },

  // ----- Position
  pos_qualified: {
    kind: "select",
    options: Object.keys(POSITION_RULES),
    codeRef: "QW-405.1",
    derive: (v, extra) => ({
      ...derivePositionRangeFromKey(v, extra?.isPipe),
      codeRef: "QW-405.1",
    }),
  },
  pos_progression: {
    kind: "select",
    options: ["Uphill", "Downhill", "N/A"],
    codeRef: "QW-405.3",
    derive: (v) => deriveProgressionRange(v),
  },

  // ----- Preheat / Interpass
  pre_min_temp: {
    kind: "number",
    placeholder: "°C",
    codeRef: "QW-406.1",
    derive: (v) => minOnly(v, "QW-406.1", "°C", 55),
  },
  pre_interpass: {
    kind: "number",
    placeholder: "°C",
    codeRef: "QW-406.2",
    derive: (v) => {
      const t = parseNum(v);
      if (t == null) return { qualifiedFor: "", codeRef: "QW-406.2" };
      return { qualifiedFor: `≤ ${numFmt(t + 55)} °C`, codeRef: "QW-406.2" };
    },
  },
  pre_maintenance: {
    kind: "text",
    codeRef: "QW-406.3",
    derive: (v) => asListed(v, "QW-406.3"),
  },

  // ----- PWHT
  pwht_type: {
    kind: "select",
    options: ["None", "Below lower transformation", "Above upper transformation", "Solution anneal", "Other"],
    codeRef: "QW-407.1",
    derive: (v) => asListed(v, "QW-407.1"),
  },
  pwht_temp_time: {
    kind: "number",
    placeholder: "°C",
    codeRef: "QW-407.2",
    derive: (v) => pmTemp(v, 15, 15, "QW-407.2"),
  },
  pwht_thickness: {
    kind: "number",
    placeholder: "mm",
    codeRef: "QW-407.4",
    derive: (v) => {
      const t = parseNum(v);
      if (t == null) return { qualifiedFor: "", codeRef: "QW-407.4" };
      return { qualifiedFor: `≤ ${numFmt(1.1 * t)} mm`, codeRef: "QW-407.4" };
    },
  },

  // ----- Shielding Gas
  gas_type: {
    kind: "text",
    codeRef: "QW-408.2",
    derive: (v) => asListed(v, "QW-408.2"),
  },
  gas_flow: {
    kind: "number",
    placeholder: "L/min",
    codeRef: "QW-408.3",
    derive: (v) => plusMinusPct(v, 10, "QW-408.3", "L/min"),
  },
  gas_backing: {
    kind: "select",
    options: ["With backing gas", "Without backing gas"],
    codeRef: "QW-408.5",
    derive: (v) => {
      const s = (v ?? "").toString().toLowerCase();
      if (!s) return { qualifiedFor: "", codeRef: "QW-408.5" };
      if (s.includes("without")) {
        return { qualifiedFor: "With and without backing gas", codeRef: "QW-408.5" };
      }
      return {
        qualifiedFor: "With backing gas only (does NOT qualify without)",
        codeRef: "QW-408.5",
      };
    },
  },

  // ----- Backing
  back_type: {
    kind: "select",
    options: ["With backing", "Without backing"],
    codeRef: "QW-402.4",
    derive: (v) => deriveBackingRangeText(v),
  },

  // ----- Technique
  tech_string_weave: {
    kind: "select",
    options: ["String", "Weave", "Both"],
    codeRef: "QW-410.1",
    derive: (v) => asListed(v, "QW-410.1"),
  },
  tech_cleaning: {
    kind: "text",
    codeRef: "QW-410.5",
    derive: (v) => asListed(v, "QW-410.5"),
  },
  tech_oscillation: {
    kind: "text",
    codeRef: "QW-410.7",
    derive: (v) => asListed(v, "QW-410.7"),
  },
  tech_peening: {
    kind: "select",
    options: ["None", "Manual", "Mechanical"],
    codeRef: "QW-410.9",
    derive: (v) => asListed(v, "QW-410.9"),
  },
  tech_back_gouge: {
    kind: "select",
    options: ["None", "Grinding", "Air Carbon Arc", "Machining"],
    codeRef: "QW-410.6",
    derive: (v) => asListed(v, "QW-410.6"),
  },

  // ----- Material Compatibility
  mat_dissimilar: {
    kind: "text",
    codeRef: "QW-403.20",
    derive: (v) => asListed(v, "QW-403.20"),
  },
};

/** Dispatcher used by the WPS Variables matrix. */
export function deriveWpsRange(
  variableKey: string,
  value: unknown,
  extra?: { withBacking?: boolean; isPipe?: boolean },
): VariableDerivation {
  const spec = WPS_VARIABLE_SPECS[variableKey];
  if (!spec) return { qualifiedFor: "", codeRef: "" };
  return spec.derive(value, extra);
}


