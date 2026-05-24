/**
 * WPS Engineering Intelligence Engines (Phase 3)
 *
 * Pure functions that encode welding engineering domain knowledge:
 *   - F-No / A-No / P-No compatibility (ASME IX QW-422/431/432)
 *   - Process transferability and multi-process transitions
 *   - Polarity / current type compatibility per process
 *   - Backing implications (QW-402.4)
 *   - PWHT conflicts driven by P-No grouping (QW-407)
 *   - Shielding gas constraints per process
 *   - Thickness range validation vs PQR (QW-451)
 *   - Drift-vs-PQR detection
 *   - Readiness scoring & engineering impact
 *   - Dependency graph between WPS sections
 *
 * These complement (do not replace) `wps-intelligence.ts` completeness checks.
 */

import type { ComplianceFinding, Severity } from "./wps-intelligence";

// -----------------------------------------------------------------------------
// Reference tables (compact, hand-curated from ASME IX & AWS practice)
// -----------------------------------------------------------------------------

/** Typical P-No → material family (subset; covers >95% of EPC fab work). */
export const P_NO_FAMILIES: Record<string, string> = {
  "1":  "Carbon steel",
  "3":  "Low-alloy (C-½Mo, Mn-Mo)",
  "4":  "1¼Cr-½Mo",
  "5A": "2¼Cr-1Mo",
  "5B": "5-9Cr-Mo",
  "6":  "Martensitic stainless (410/420)",
  "7":  "Ferritic stainless (405/430)",
  "8":  "Austenitic stainless (304/316/321/347)",
  "9A": "2½Ni",
  "9B": "3½Ni",
  "10H":"Duplex / Super-duplex",
  "11A":"9Ni",
  "21": "Aluminum 1xxx/3xxx",
  "22": "Aluminum 5xxx",
  "23": "Aluminum 6xxx",
  "41": "Nickel 200/201",
  "42": "Monel 400",
  "43": "Inconel 600/625",
  "44": "Hastelloy C-276",
  "45": "Incoloy 800/825",
};

/** F-No → typical electrode family (ASME IX QW-432). */
export const F_NO_FAMILIES: Record<string, string> = {
  "1": "Heavy rutile SMAW (E6010/E7024)",
  "2": "Rutile SMAW (E6013/E7014)",
  "3": "Cellulosic SMAW (E6010/E6011)",
  "4": "Low-hydrogen SMAW (E7018/E7016)",
  "5": "Stainless SMAW (E308/E316)",
  "6": "Solid wire steel (ER70S-x, ER80S-x)",
  "21":"Aluminum bare (ER1xxx)",
  "22":"Aluminum 5xxx bare (ER5356)",
  "23":"Aluminum 4xxx bare (ER4043)",
  "41":"Nickel bare ERNi",
  "43":"Inconel bare ERNiCrMo",
};

/** Approximate A-No (analysis) families (QW-442). */
export const A_NO_FAMILIES: Record<string, string> = {
  "1": "Mild steel",
  "2": "Carbon-Molybdenum",
  "3": "Cr ≤ 0.75%, Mo ≤ 0.40%",
  "4": "1¼ Cr",
  "5": "2¼–5 Cr",
  "6": "9 Cr",
  "8": "Austenitic stainless",
  "9": "Nickel-based",
};

/** Compatible P-No groups commonly qualified together by one PQR. */
const P_NO_GROUPS: string[][] = [
  ["1", "3"],
  ["4", "5A"],
  ["5A", "5B"],
  ["8"],
  ["10H"],
  ["41", "42", "43", "44", "45"],
  ["21", "22", "23"],
];

/** Typical F-No combinations approved with a base-metal P-No group. */
const FNO_FOR_PNO: Record<string, string[]> = {
  "1":  ["1","2","3","4","6"],
  "3":  ["1","2","4","6"],
  "4":  ["4","6"],
  "5A": ["4","6"],
  "5B": ["4","6"],
  "8":  ["5","6"],
  "10H":["6"],
  "41": ["41","43"],
  "42": ["41","43"],
  "43": ["43","41"],
  "44": ["43"],
  "45": ["43","41"],
  "21": ["21","22","23"],
  "22": ["22","23"],
  "23": ["22","23"],
};

/** Acceptable current types per process (ASME IX / AWS). */
const PROCESS_CURRENT: Record<string, string[]> = {
  SMAW:   ["DCEN","DCEP","AC"],
  GTAW:   ["DCEN","AC"], // AC only for Al/Mg
  GMAW:   ["DCEP"],
  FCAW:   ["DCEP","DCEN"],
  "FCAW-S":["DCEN"],
  "FCAW-G":["DCEP"],
  SAW:    ["DCEP","DCEN","AC"],
  PAW:    ["DCEN"],
};

/** Processes that consume external shielding gas. */
const PROCESSES_WITH_GAS = new Set(["GTAW","GMAW","FCAW","FCAW-G","PAW","MIG","MAG"]);
/** Processes that must not use external shielding gas. */
const PROCESSES_WITHOUT_GAS = new Set(["SMAW","SAW","FCAW-S"]);

/** PWHT mandatory above these wall thicknesses (mm) — simplified from ASME B31.3 / Sec VIII Div 1. */
const PWHT_THRESHOLD_MM: Record<string, number> = {
  "1":  19,   // P1 carbon steel — typical 19 mm trigger
  "3":  16,
  "4":  13,
  "5A": 13,
  "5B": 0,    // always required
  "6":  10,
  "9A": 16,
  "9B": 16,
  "10H":0,    // duplex — typically forbidden, see PWHT_FORBIDDEN
};
/** P-No families where PWHT is forbidden or harmful (duplex, austenitic). */
const PWHT_FORBIDDEN = new Set(["8","10H","41","42","43","44","45"]);

// -----------------------------------------------------------------------------
// Bundle type (mirrors what UI passes in)
// -----------------------------------------------------------------------------
export type WpsBundle = {
  wps: any;
  joints: any[];
  baseMetals: any[];
  fillers: any[];
  electrical: any[];
  signatures: any[];
};

// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------
const mk = (severity: Severity) =>
  (id: string, category: ComplianceFinding["category"], title: string, message?: string, remediation?: string, codeReference?: string): ComplianceFinding =>
    ({ id, severity, category, title, message: message ?? title, remediation, codeReference });
const info = mk("info");
const warn = mk("warning");
const err = mk("error");
const crit = mk("critical");

const norm = (s?: string | null) => (s ?? "").trim().toUpperCase();
const numOr = (v: any, fb = 0) => (v == null || isNaN(Number(v)) ? fb : Number(v));

function processList(wps: any): string[] {
  if (!wps?.process) return [];
  return String(wps.process)
    .split(/[\s,+/]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

// -----------------------------------------------------------------------------
// 1) F-No / P-No / A-No compatibility matrix
// -----------------------------------------------------------------------------
export type CompatibilityCell = {
  pNo: string;
  fNo: string | null;
  status: "ok" | "uncommon" | "incompatible" | "unknown";
  reason: string;
};

export function fillerBaseMetalMatrix(bundle: WpsBundle): CompatibilityCell[] {
  const cells: CompatibilityCell[] = [];
  const fNos = bundle.fillers.map((f) => String(f.f_no ?? "").trim()).filter(Boolean);
  const pNos = bundle.baseMetals.map((b) => String(b.p_no ?? "").trim()).filter(Boolean);
  if (pNos.length === 0 || fNos.length === 0) return cells;

  for (const p of pNos) {
    const accepted = FNO_FOR_PNO[p] ?? [];
    for (const f of fNos) {
      let status: CompatibilityCell["status"] = "unknown";
      let reason = "No reference data";
      if (accepted.length > 0) {
        if (accepted.includes(f)) { status = "ok"; reason = `F-No ${f} is standard for P-No ${p} (${P_NO_FAMILIES[p] ?? "—"}).`; }
        else if (PWHT_FORBIDDEN.has(p) && ["1","2","3","4"].includes(f)) {
          status = "incompatible"; reason = `Ferritic filler F-No ${f} cannot be used on ${P_NO_FAMILIES[p] ?? `P-No ${p}`}.`;
        } else {
          status = "uncommon"; reason = `F-No ${f} is not the standard match for P-No ${p}; verify dissimilar-metal PQR.`;
        }
      }
      cells.push({ pNo: p, fNo: f, status, reason });
    }
  }
  return cells;
}

// -----------------------------------------------------------------------------
// 2) Process transferability / multi-process transitions
// -----------------------------------------------------------------------------
export function checkProcessTransferability(bundle: WpsBundle): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  const procs = processList(bundle.wps);
  if (procs.length < 2) return f;

  // GTAW root + SMAW/FCAW fill is the canonical pipe combo — OK.
  const has = (p: string) => procs.includes(p);
  if (has("GTAW") && (has("SMAW") || has("FCAW") || has("GMAW"))) {
    f.push(info("xfer_pipe_combo", "compatibility",
      "Standard pipe combination",
      "GTAW root + SMAW/FCAW/GMAW fill detected. Ensure root pass parameters live in their own electrical/filler rows."));
  }
  // Per-process electrical coverage
  const electricalProcs = new Set(bundle.electrical.map((e) => norm(e.process)).filter(Boolean));
  for (const p of procs) {
    if (electricalProcs.size > 0 && !electricalProcs.has(p)) {
      f.push(warn(`xfer_el_${p}`, "electrical",
        `Process ${p} missing electrical parameters`,
        `WPS declares ${p} but no electrical row tags this process.`,
        `Add an electrical row with process = ${p}.`));
    }
  }
  // Per-process filler coverage
  const fillerProcs = new Set(bundle.fillers.map((f) => norm(f.process)).filter(Boolean));
  for (const p of procs) {
    if (fillerProcs.size > 0 && !fillerProcs.has(p)) {
      f.push(warn(`xfer_fm_${p}`, "filler_metal",
        `Process ${p} missing filler entry`,
        `Add a filler row dedicated to ${p}.`));
    }
  }
  return f;
}

// -----------------------------------------------------------------------------
// 3) Polarity / current type validation
// -----------------------------------------------------------------------------
export function checkPolarity(bundle: WpsBundle): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  for (const e of bundle.electrical) {
    const proc = norm(e.process) || norm(bundle.wps.process);
    const allowed = PROCESS_CURRENT[proc];
    const pol = norm(e.polarity);
    if (!allowed || !pol) continue;
    if (!allowed.includes(pol)) {
      f.push(err(`pol_${e.id ?? e.pass_no}`, "electrical",
        `Invalid polarity for ${proc}`,
        `Pass ${e.pass_no ?? "?"} uses ${pol}; ${proc} accepts ${allowed.join(", ")}.`,
        `Update polarity to a value compatible with ${proc}.`));
    }
    // AC + GTAW only valid for Al/Mg (P-No 21–23)
    if (proc === "GTAW" && pol === "AC") {
      const baseP = bundle.baseMetals.map((b) => String(b.p_no ?? ""));
      const alOk = baseP.some((p) => ["21","22","23"].includes(p));
      if (!alOk) {
        f.push(warn(`pol_ac_${e.id}`, "electrical",
          "GTAW AC on non-aluminum base metal",
          "AC polarity in GTAW is normally restricted to aluminum/magnesium alloys."));
      }
    }
  }
  return f;
}

// -----------------------------------------------------------------------------
// 4) Backing implications (QW-402.4)
// -----------------------------------------------------------------------------
export function checkBackingImplications(bundle: WpsBundle): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  for (const j of bundle.joints) {
    const backing = norm(j.backing);
    const open = !backing || backing === "NONE" || backing === "OPEN" || backing.includes("WITHOUT");
    if (open) {
      const hasGtawRoot = bundle.electrical.some((e) => norm(e.process) === "GTAW" && (e.pass_no === 1 || norm(e.pass_type).includes("ROOT")));
      if (!hasGtawRoot) {
        f.push(warn(`bk_${j.id}`, "joint",
          "Open-root joint without GTAW root pass",
          "Open-root grooves typically require a GTAW root or a consumable insert to ensure full penetration.",
          "Add a GTAW root pass or specify a consumable insert.",
          "QW-402.4"));
      }
    }
    if (backing && backing !== "NONE" && !norm(j.backing_material)) {
      f.push(info(`bk_mat_${j.id}`, "joint",
        "Backing used but material not declared",
        "Specify backing material (e.g. same as base, copper, ceramic)."));
    }
  }
  return f;
}

// -----------------------------------------------------------------------------
// 5) PWHT conflicts (QW-407)
// -----------------------------------------------------------------------------
export function checkPwht(bundle: WpsBundle): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  const pwhtDeclared = !!(bundle.wps.pwht && String(bundle.wps.pwht).trim() && !/^no(ne)?$/i.test(String(bundle.wps.pwht)));
  for (const b of bundle.baseMetals) {
    const p = String(b.p_no ?? "");
    if (!p) continue;
    const tMax = numOr(b.thickness_max_mm);
    const trig = PWHT_THRESHOLD_MM[p];
    if (PWHT_FORBIDDEN.has(p) && pwhtDeclared) {
      f.push(err(`pwht_forb_${b.id}`, "thermal",
        `PWHT not allowed for P-No ${p}`,
        `${P_NO_FAMILIES[p] ?? "Material"} should not receive PWHT — risk of sensitization / loss of properties.`,
        "Remove PWHT or revisit material selection.",
        "ASME Sec VIII Div 1 UHA/UNF"));
    }
    if (trig !== undefined && trig > 0 && tMax > trig && !pwhtDeclared) {
      f.push(warn(`pwht_req_${b.id}`, "thermal",
        `PWHT likely required for P-No ${p} above ${trig} mm`,
        `Max thickness ${tMax} mm exceeds the ${trig} mm threshold; PWHT should be specified.`,
        "Add a PWHT schedule (temperature, hold time, ramp rates)."));
    }
    if (trig === 0 && !pwhtDeclared) {
      f.push(warn(`pwht_always_${b.id}`, "thermal",
        `PWHT required for P-No ${p}`,
        `${P_NO_FAMILIES[p] ?? "This material"} requires PWHT regardless of thickness.`));
    }
  }
  return f;
}

// -----------------------------------------------------------------------------
// 6) Shielding gas constraints
// -----------------------------------------------------------------------------
export function checkShieldingGas(bundle: WpsBundle): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  const procs = processList(bundle.wps);
  const needGas = procs.some((p) => PROCESSES_WITH_GAS.has(p));
  const banGas = procs.length > 0 && procs.every((p) => PROCESSES_WITHOUT_GAS.has(p));
  const gas = String(bundle.wps.shielding_gas ?? "").trim();

  if (needGas && !gas) {
    f.push(err("gas_missing", "technique",
      "Shielding gas not specified",
      `${procs.filter(p => PROCESSES_WITH_GAS.has(p)).join(", ")} requires a shielding gas.`,
      "Add gas type and composition (e.g. Ar, Ar+2%CO₂, Ar+30%He)."));
  }
  if (banGas && gas) {
    f.push(warn("gas_unused", "technique",
      "Shielding gas declared on no-gas process",
      `${procs.join(", ")} does not use shielding gas; the value will be ignored.`));
  }
  // Austenitic stainless requires low-CO₂ blend
  const isAustenitic = bundle.baseMetals.some((b) => String(b.p_no) === "8");
  if (isAustenitic && /co2/i.test(gas) && !/ar/i.test(gas)) {
    f.push(warn("gas_co2_stainless", "technique",
      "Pure CO₂ on austenitic stainless",
      "Pure CO₂ raises carbon pickup and degrades corrosion resistance on P-No 8; use Ar-rich blend."));
  }
  return f;
}

// -----------------------------------------------------------------------------
// 7) Thickness range validation (QW-451 simplified)
// -----------------------------------------------------------------------------
export type ThicknessQualification = {
  pqrTestThicknessMm: number | null;
  qualifiedMinMm: number;
  qualifiedMaxMm: number;
};
/** Approximate QW-451.1 rule: t = test thickness → qualifies 1.5t (and ≥5mm down to t/2 or 1.5 mm). */
export function computeQualifiedThicknessRange(testThicknessMm: number | null | undefined): ThicknessQualification {
  const t = numOr(testThicknessMm, 0);
  if (t <= 0) return { pqrTestThicknessMm: null, qualifiedMinMm: 0, qualifiedMaxMm: 0 };
  const max = t < 38 ? 2 * t : 200;
  const min = t >= 25 ? 5 : t >= 6 ? Math.max(5, t / 2) : Math.max(1.5, t / 2);
  return { pqrTestThicknessMm: t, qualifiedMinMm: +min.toFixed(1), qualifiedMaxMm: +max.toFixed(1) };
}
export function checkThicknessRange(bundle: WpsBundle, pqrTestThicknessMm?: number | null): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  if (pqrTestThicknessMm == null) return f;
  const q = computeQualifiedThicknessRange(pqrTestThicknessMm);
  for (const b of bundle.baseMetals) {
    const tMin = numOr(b.thickness_min_mm);
    const tMax = numOr(b.thickness_max_mm);
    if (tMin > 0 && tMin < q.qualifiedMinMm) {
      f.push(err(`thk_lo_${b.id}`, "base_metal",
        `Base metal #${b.sort_order ?? "?"} below qualified minimum`,
        `WPS allows ${tMin} mm; PQR ${q.pqrTestThicknessMm} mm only qualifies ≥ ${q.qualifiedMinMm} mm.`,
        "Raise the WPS minimum thickness or qualify a thinner PQR.",
        "QW-451.1"));
    }
    if (tMax > 0 && tMax > q.qualifiedMaxMm) {
      f.push(err(`thk_hi_${b.id}`, "base_metal",
        `Base metal #${b.sort_order ?? "?"} above qualified maximum`,
        `WPS allows ${tMax} mm; PQR ${q.pqrTestThicknessMm} mm only qualifies ≤ ${q.qualifiedMaxMm} mm.`,
        "Lower the WPS maximum or perform an additional thicker PQR.",
        "QW-451.1"));
    }
  }
  return f;
}

// -----------------------------------------------------------------------------
// 8) Drift-vs-PQR detection
// -----------------------------------------------------------------------------
export type PqrSnapshot = {
  process?: string | null;
  pNos?: string[];
  fNos?: string[];
  testThicknessMm?: number | null;
  preheatMinC?: number | null;
  interpassMaxC?: number | null;
  pwht?: string | null;
};
export function detectDriftFromPqr(bundle: WpsBundle, pqr: PqrSnapshot | null | undefined): ComplianceFinding[] {
  const f: ComplianceFinding[] = [];
  if (!pqr) return f;

  if (pqr.process && norm(pqr.process) !== norm(bundle.wps.process)) {
    f.push(err("drift_process", "compatibility",
      "Process differs from PQR",
      `PQR qualifies ${pqr.process} but WPS specifies ${bundle.wps.process}.`));
  }
  if (pqr.pNos?.length) {
    const wpsP = new Set(bundle.baseMetals.map((b) => String(b.p_no ?? "")));
    const allowed = new Set([...pqr.pNos, ...P_NO_GROUPS.filter(g => pqr.pNos!.some(p => g.includes(p))).flat()]);
    for (const p of wpsP) if (p && !allowed.has(p)) {
      f.push(warn(`drift_p_${p}`, "base_metal", `P-No ${p} not covered by PQR`,
        `PQR qualified P-No ${pqr.pNos.join(", ")}; WPS extends to P-No ${p}.`));
    }
  }
  if (pqr.fNos?.length) {
    const wpsF = new Set(bundle.fillers.map((f) => String(f.f_no ?? "")));
    for (const fn of wpsF) if (fn && !pqr.fNos.includes(fn)) {
      f.push(warn(`drift_f_${fn}`, "filler_metal", `F-No ${fn} not covered by PQR`,
        `PQR qualified F-No ${pqr.fNos.join(", ")}; WPS uses F-No ${fn}.`));
    }
  }
  if (pqr.preheatMinC != null && bundle.wps.preheat_min_c != null && numOr(bundle.wps.preheat_min_c) < numOr(pqr.preheatMinC) - 5) {
    f.push(err("drift_preheat", "thermal",
      "Preheat lower than PQR",
      `PQR ${pqr.preheatMinC}°C → WPS ${bundle.wps.preheat_min_c}°C. Essential variable QW-406.`));
  }
  if (pqr.interpassMaxC != null && bundle.wps.interpass_max_c != null && numOr(bundle.wps.interpass_max_c) > numOr(pqr.interpassMaxC) + 5) {
    f.push(warn("drift_interpass", "thermal",
      "Interpass higher than PQR",
      `PQR ${pqr.interpassMaxC}°C → WPS ${bundle.wps.interpass_max_c}°C.`));
  }
  return f;
}

// -----------------------------------------------------------------------------
// 9) Readiness scoring & engineering impact analysis
// -----------------------------------------------------------------------------
export type ReadinessReport = {
  score: number;        // 0..100
  grade: "A" | "B" | "C" | "D" | "F";
  status: "Ready for production" | "Conditional" | "Engineering review required" | "Not releasable";
  blockers: string[];
  impact: string[];
};
export function computeReadiness(findings: ComplianceFinding[], bundle: WpsBundle): ReadinessReport {
  const w: Record<Severity, number> = { info: 1, warning: 4, error: 12, critical: 25 };
  const penalty = findings.reduce((a, f) => a + w[f.severity], 0);
  const score = Math.max(0, 100 - penalty);
  const grade = score >= 95 ? "A" : score >= 85 ? "B" : score >= 70 ? "C" : score >= 50 ? "D" : "F";
  const hasCritical = findings.some((f) => f.severity === "critical");
  const errors = findings.filter((f) => f.severity === "error").length;
  const blockers: string[] = [];
  const impact: string[] = [];

  if (!bundle.wps.pqr_no) blockers.push("No PQR linked — WPS cannot be released without a qualifying PQR.");
  if (bundle.electrical.length === 0) blockers.push("No electrical parameters defined — welders cannot set machines.");
  if (bundle.fillers.length === 0) blockers.push("No filler metals defined — procurement and welder kit cannot be planned.");
  if (bundle.baseMetals.length === 0) blockers.push("No base metals defined — inspection acceptance criteria undefined.");

  if (findings.some(f => f.category === "thermal" && f.severity !== "info"))
    impact.push("Thermal regime issues will affect heat-affected zone properties and may require requalification.");
  if (findings.some(f => f.category === "compatibility" && f.severity !== "info"))
    impact.push("Compatibility drift increases NCR risk — welder qualifications may not cover production scope.");
  if (findings.some(f => f.category === "electrical" && f.severity === "error"))
    impact.push("Electrical errors will reject welds during parameter audit; rework risk is high.");

  const status: ReadinessReport["status"] =
    hasCritical || blockers.length > 0 ? "Not releasable"
    : errors > 0 ? "Engineering review required"
    : score >= 85 ? "Ready for production"
    : "Conditional";
  return { score, grade, status, blockers, impact };
}

// -----------------------------------------------------------------------------
// 10) Dependency graph
// -----------------------------------------------------------------------------
export type DependencyEdge = { from: string; to: string; reason: string };
export function buildDependencyGraph(bundle: WpsBundle): DependencyEdge[] {
  const edges: DependencyEdge[] = [
    { from: "PQR", to: "WPS header", reason: "PQR qualifies WPS essential variables" },
    { from: "Base metals", to: "Fillers", reason: "Filler F-No must match base P-No (QW-432)" },
    { from: "Base metals", to: "PWHT", reason: "P-No group drives PWHT requirement (QW-407)" },
    { from: "Base metals", to: "Preheat", reason: "P-No and thickness drive preheat (QW-406)" },
    { from: "Process", to: "Electrical", reason: "Process dictates allowable polarity / current type" },
    { from: "Process", to: "Shielding gas", reason: "Only GTAW/GMAW/FCAW-G/PAW use external gas" },
    { from: "Joints", to: "Electrical", reason: "Open-root joints typically demand a GTAW root pass" },
    { from: "Fillers", to: "Variables matrix", reason: "F-No / A-No changes are essential variables" },
  ];
  return edges;
}

// -----------------------------------------------------------------------------
// Aggregator
// -----------------------------------------------------------------------------
export function runAllEngines(bundle: WpsBundle, pqr?: PqrSnapshot | null, pqrTestThicknessMm?: number | null): ComplianceFinding[] {
  return [
    ...checkProcessTransferability(bundle),
    ...checkPolarity(bundle),
    ...checkBackingImplications(bundle),
    ...checkPwht(bundle),
    ...checkShieldingGas(bundle),
    ...checkThicknessRange(bundle, pqrTestThicknessMm),
    ...detectDriftFromPqr(bundle, pqr),
  ];
}
