/**
 * Code-family reference data and required-test matrix for PQR qualification.
 * Pure data + small helpers, safe to import client & server.
 */

export type CodeFamily = "ASME IX" | "AWS D1.1" | "ISO 15614" | string;
export type JointKind = "Groove" | "Fillet" | "Overlay";

export type RequiredTest =
  | { kind: "ndt"; method: "VT" | "RT" | "UT" | "PT" | "MT"; min: number; note?: string }
  | { kind: "mech"; testType: "Tensile" | "Bend" | "Impact" | "Hardness" | "Macro Etch" | "Fracture"; min: number; note?: string };

/**
 * Required tests by code family + joint kind (simplified industry defaults).
 * Used to surface "missing required test" findings — engineers can still
 * mark findings resolved if their AI/QC plan justifies a different matrix.
 */
export function requiredTestMatrix(args: {
  codeFamily: CodeFamily;
  joint: JointKind;
  thicknessMm?: number | null;
  cvnRequired?: boolean;
}): RequiredTest[] {
  const { codeFamily, joint, thicknessMm, cvnRequired } = args;
  const isASME = (codeFamily || "").toUpperCase().includes("ASME");
  const isAWS = (codeFamily || "").toUpperCase().includes("AWS");
  const t = thicknessMm ?? 0;

  const list: RequiredTest[] = [{ kind: "ndt", method: "VT", min: 1, note: "Visual inspection is mandatory" }];

  if (joint === "Groove") {
    if (isASME) {
      list.push(
        { kind: "ndt", method: t > 8 ? "RT" : "VT", min: 1, note: t > 8 ? "Volumetric NDT recommended for t > 8 mm" : undefined },
        { kind: "mech", testType: "Tensile", min: 2, note: "QW-150 reduced-section" },
        { kind: "mech", testType: "Bend", min: t >= 19 ? 2 : 4, note: t >= 19 ? "Side bend (t ≥ 19 mm)" : "Face + Root bend" },
        { kind: "mech", testType: "Macro Etch", min: 1 },
      );
    } else if (isAWS) {
      list.push(
        { kind: "ndt", method: "RT", min: 1 },
        { kind: "mech", testType: "Tensile", min: 2, note: "Reduced-section per AWS D1.1 Table 4.5" },
        { kind: "mech", testType: "Bend", min: 4 },
        { kind: "mech", testType: "Macro Etch", min: 1 },
      );
      if (cvnRequired) list.push({ kind: "mech", testType: "Impact", min: 3, note: "CVN per contract" });
    } else {
      list.push(
        { kind: "mech", testType: "Tensile", min: 2 },
        { kind: "mech", testType: "Bend", min: 2 },
        { kind: "mech", testType: "Macro Etch", min: 1 },
      );
    }
  } else if (joint === "Fillet") {
    list.push(
      { kind: "mech", testType: "Macro Etch", min: 1 },
      { kind: "mech", testType: "Fracture", min: 1 },
    );
  } else if (joint === "Overlay") {
    list.push(
      { kind: "mech", testType: "Macro Etch", min: 1 },
      { kind: "mech", testType: "Hardness", min: 1 },
    );
  }

  return list;
}

/** Per-test-type evaluation rules. Returns null if pass, else reason. */
export function evaluateMechRow(row: {
  test_type: string;
  results?: Record<string, any> | null;
  minimum_requirement?: string | null;
  result: string;
}): { pass: boolean; reason?: string; codeRef?: string } {
  // Honor explicit Pass/Fail set by user
  if (row.result === "Pass") return { pass: true };
  if (row.result === "Fail") return { pass: false, reason: "Marked as Fail by evaluator" };
  if (row.result === "N/A") return { pass: true };

  const r = row.results ?? {};
  switch (row.test_type) {
    case "Tensile": {
      const uts = Number(r.uts_mpa);
      const min = parseFirstNumber(row.minimum_requirement);
      const location = String(r.failure_location ?? "");
      if (location.toLowerCase().includes("weld") && (!isFinite(min) || uts < min)) {
        return { pass: false, reason: "Failure in weld + below min UTS", codeRef: "ASME IX QW-153" };
      }
      if (isFinite(min) && uts && uts < min) {
        return { pass: false, reason: `UTS ${uts} < min ${min} MPa`, codeRef: "ASME IX QW-153" };
      }
      if (uts) return { pass: true };
      return { pass: false, reason: "UTS not recorded" };
    }
    case "Bend": {
      const opening = Number(r.open_discontinuity_mm);
      if (isFinite(opening) && opening > 3) {
        return { pass: false, reason: `Open discontinuity ${opening} mm > 3 mm`, codeRef: "ASME IX QW-163" };
      }
      if (r.open_discontinuity_mm == null) return { pass: false, reason: "Open discontinuity not recorded" };
      return { pass: true };
    }
    case "Macro Etch": {
      const defects = Array.isArray(r.defects) ? r.defects : [];
      if (defects.length > 0) return { pass: false, reason: `Defects observed: ${defects.join(", ")}` };
      if (r.examined !== true) return { pass: false, reason: "Macro examination not confirmed" };
      return { pass: true };
    }
    case "Hardness": {
      const max = Number(r.max_hv_haz);
      const limit = Number(r.limit_hv ?? row.minimum_requirement);
      if (isFinite(max) && isFinite(limit) && max > limit) {
        return { pass: false, reason: `HAZ ${max} HV > limit ${limit} HV`, codeRef: "NACE MR0175" };
      }
      if (!isFinite(max)) return { pass: false, reason: "Max HV not recorded" };
      return { pass: true };
    }
    case "Impact": {
      const avg = Number(r.avg_j);
      const min = Number(r.min_j_required ?? parseFirstNumber(row.minimum_requirement));
      if (isFinite(avg) && isFinite(min) && avg < min) {
        return { pass: false, reason: `Avg ${avg} J < min ${min} J`, codeRef: "ASME IX QW-171" };
      }
      if (!isFinite(avg)) return { pass: false, reason: "Average energy not recorded" };
      return { pass: true };
    }
    case "Fracture": {
      const defects = Array.isArray(r.defects) ? r.defects : [];
      if (defects.length > 0) return { pass: false, reason: `Defects: ${defects.join(", ")}` };
      return { pass: true };
    }
  }
  return { pass: false, reason: "Result Pending" };
}

function parseFirstNumber(s?: string | null): number {
  if (!s) return NaN;
  const m = s.match(/[-+]?\d*\.?\d+/);
  return m ? Number(m[0]) : NaN;
}

/** Compute code-suggested qualified ranges from a tested pWPS. */
export function suggestQualifiedRanges(pwps: any): Record<string, any> {
  const t = Number(pwps?.thickness_min_mm) || Number(pwps?.thickness_max_mm);
  const d = Number(pwps?.diameter_min_mm) || Number(pwps?.diameter_max_mm);
  const hi_lo = Number(pwps?.heat_input_min);
  const hi_hi = Number(pwps?.heat_input_max);
  const pos = pwps?.position ?? null;
  return {
    thickness_min_mm: isFinite(t) ? round(t * 0.5, 2) : null,
    thickness_max_mm: isFinite(t) ? round(Math.min(t * 2, 200), 2) : null,
    diameter_min_mm: isFinite(d) ? round(d * 0.5, 2) : null,
    diameter_max_mm: isFinite(d) ? round(d * 2, 2) : null,
    heat_input_min: isFinite(hi_lo) ? round(hi_lo * 0.9, 3) : null,
    heat_input_max: isFinite(hi_hi) ? round(hi_hi * 1.1, 3) : null,
    position: pos,
    p_number: pwps?.p_number ?? null,
    group_number: pwps?.group_number ?? null,
    filler_classification: pwps?.filler_classification ?? null,
    pwht: pwps?.pwht ?? null,
  };
}

function round(n: number, d: number) {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}
