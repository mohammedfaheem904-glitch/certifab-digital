const POSITION_RULES = {
  // Plate
  "1G": { positions: ["F"], productForm: "Plate", note: "QW-461.9 — plate flat groove" },
  "2G": { positions: ["F", "H"], productForm: "Plate", note: "QW-461.9 — plate horizontal groove" },
  "3G": { positions: ["F", "V"], productForm: "Plate", note: "QW-461.9 — plate vertical groove" },
  "4G": { positions: ["F", "OH"], productForm: "Plate", note: "QW-461.9 — plate overhead groove" },
  "3G+4G": { positions: ["F", "H", "V", "OH"], productForm: "Plate", note: "QW-461.9 — all plate positions" },
  // Pipe
  "1G-PIPE": { positions: ["F (rolled pipe)"], productForm: "Pipe", note: "QW-461.9 — pipe rolled" },
  "2G-PIPE": { positions: ["F", "H"], productForm: "Pipe", note: "QW-461.9 — pipe horizontal axis fixed" },
  "5G": { positions: ["F", "V", "OH"], productForm: "Pipe", note: "QW-461.9 — pipe horizontal axis fixed (5G)" },
  "6G": { positions: ["F", "H", "V", "OH", "All groove"], productForm: "Both", note: "QW-461.9 — 6G qualifies all positions, plate + pipe ≥ 73 mm OD" },
  "6GR": { positions: ["All — restricted access"], productForm: "Both", note: "QW-461.9 — 6GR restricted access; covers 6G" },
  // Fillet
  "1F": { positions: ["F (fillet)"], productForm: "Both", note: "QW-461.9 — fillet flat" },
  "2F": { positions: ["F", "H (fillet)"], productForm: "Both", note: "QW-461.9 — fillet horizontal" },
  "3F": { positions: ["F", "H", "V (fillet)"], productForm: "Both", note: "QW-461.9 — fillet vertical" },
  "4F": { positions: ["F", "H", "OH (fillet)"], productForm: "Both", note: "QW-461.9 — fillet overhead" }
};
const PNUM_TRANSFERABILITY = {
  1: [1],
  // Carbon steels
  3: [1, 3],
  // Low-alloy
  4: [1, 3, 4],
  5: [1, 3, 4, 5],
  // Cr-Mo
  8: [8],
  // Stainless 300-series
  9: [9],
  // Ni 9% steel
  10: [10],
  11: [11],
  21: [21],
  // Aluminium 1xxx
  22: [21, 22],
  // Aluminium 5xxx
  41: [41],
  // Nickel
  42: [41, 42],
  43: [41, 42, 43],
  51: [51],
  // Titanium
  61: [61]
  // Zirconium
};
function asmeBaseThickness(t, withBacking) {
  if (!t) return { min: null, max: null, unit: "mm", note: "QW-452.1(b) — coupon thickness required" };
  if (t < 1.5) return { min: t, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (t < 10) return { min: 1.5, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (t < 19) return { min: 5, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  if (withBacking) return { min: 5, max: null, unit: "mm", note: "QW-452.1(b) — with backing, unlimited" };
  return { min: 5, max: 2 * t, unit: "mm", note: "QW-452.1(b) — without backing, max = 2t" };
}
function asmeDepositThickness(t) {
  if (!t) return { min: 0, max: null, unit: "mm" };
  if (t < 13) return { min: 0, max: 2 * t, unit: "mm", note: "QW-452.1(b)" };
  return { min: 0, max: null, unit: "mm", note: "QW-452.1(b) — t ≥ 13 mm: unlimited" };
}
function asmeDiameter(d, isPipe) {
  if (!isPipe || !d) return { min: null, max: null, unit: "mm", note: "Plate — diameter not applicable" };
  if (d < 25) return { min: d, max: null, unit: "mm", note: "QW-452.3 — < 25 mm: tested OD only" };
  if (d < 73) return { min: 25, max: null, unit: "mm", note: "QW-452.3 — 25 mm to < 73 mm OD" };
  return { min: 73, max: null, unit: "mm", note: "QW-452.3 — ≥ 73 mm OD: unlimited (plate also qualified)" };
}
const ISO_MATERIAL_GROUPS = {
  "1.1": ["1.1"],
  "1.2": ["1.1", "1.2"],
  "1.3": ["1.1", "1.2", "1.3"],
  "1.4": ["1.1", "1.2", "1.3", "1.4"],
  "2": ["1.1", "1.2", "2"],
  "3": ["1.1", "1.2", "1.3", "1.4", "3"],
  "4": ["1.1", "1.2", "1.3", "1.4", "4"],
  "5": ["1.1", "1.2", "1.3", "1.4", "5"],
  "8": ["8"],
  "9.1": ["9.1"],
  "9.2": ["9.1", "9.2"],
  "9.3": ["9.1", "9.2", "9.3"],
  "10": ["10"]
};
function isoBaseThickness(t) {
  if (!t) return { min: null, max: null, unit: "mm" };
  if (t < 3) return { min: t, max: 2 * t, unit: "mm", note: "ISO 9606-1 Tab. 4" };
  if (t <= 12) return { min: 3, max: 2 * t, unit: "mm", note: "ISO 9606-1 Tab. 4" };
  return { min: 5, max: null, unit: "mm", note: "ISO 9606-1 Tab. 4 — ≥ 12 mm: unlimited" };
}
function isoDiameter(d, isPipe) {
  if (!isPipe || !d) return { min: null, max: null, unit: "mm" };
  if (d < 25) return { min: 0.5 * d, max: 2 * d, unit: "mm", note: "ISO 9606-1 Tab. 5" };
  return { min: 0.5 * d, max: null, unit: "mm", note: "ISO 9606-1 Tab. 5 — ≥ 25 mm: unlimited upper" };
}
function deriveQualificationRanges(input) {
  const isPipe = !!input.isPipe;
  const t = input.testCouponThicknessMm ?? 0;
  const dep = input.depositThicknessMm ?? t;
  const d = input.testCouponDiameterMm;
  const withBacking = !!input.withBacking;
  const notes = [];
  let baseThickness;
  let depositThickness;
  let diameter;
  let materialGroups = [];
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
  const posKey = normalisePositionKey(input.testPosition, isPipe);
  const posRule = posKey ? POSITION_RULES[posKey] : void 0;
  const positions = posRule?.positions ?? (input.testPosition ? [input.testPosition] : []);
  const productForm = posRule?.productForm ?? (isPipe ? "Pipe" : "Plate");
  if (posRule?.note) notes.push(posRule.note);
  if (isPipe && (posKey === "6G" || posKey === "6GR" || (d ?? 0) >= 73)) {
    notes.push("Pipe ≥ 73 mm OD or 6G test also qualifies plate per QW-303.");
  } else if (!isPipe) {
    notes.push("Plate test does not qualify pipe < 73 mm OD (QW-303).");
  }
  let backing = "n/a";
  if (input.code === "ASME IX") {
    backing = withBacking ? "with" : "both";
    if (withBacking) {
      notes.push("With-backing test: production welds without backing are NOT qualified (QW-350).");
    } else {
      notes.push("Without-backing test qualifies both with- and without-backing production welds.");
    }
  }
  const processes = [input.process, input.secondProcess].filter(Boolean);
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
    notes
  };
}
function normalisePositionKey(pos, isPipe) {
  if (!pos) return void 0;
  const p = pos.trim().toUpperCase().replace(/\s+/g, "");
  if (POSITION_RULES[p]) return p;
  if (isPipe && (p === "1G" || p === "2G")) return `${p}-PIPE`;
  return p;
}
function formatRange(r) {
  if (r.min == null && r.max == null) return "—";
  const u = r.unit;
  if (r.max == null) return `≥ ${r.min} ${u}`;
  if (r.min == null) return `≤ ${r.max} ${u}`;
  return `${r.min} – ${r.max} ${u}`;
}
function isWithinRange(value, r) {
  if (r.min != null && value < r.min) return false;
  if (r.max != null && value > r.max) return false;
  return true;
}
export {
  deriveQualificationRanges as d,
  formatRange as f,
  isWithinRange as i
};
