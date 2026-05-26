/**
 * Pure PQR evaluation engine. Aggregates NDT + Mechanical test rows and
 * unresolved findings into a checklist + overall readiness verdict.
 */
import { evaluateMechRow, requiredTestMatrix, type CodeFamily, type JointKind } from "./pqr-rules";

export type CheckStatus = "pass" | "fail" | "warn";
export type ChecklistItem = { id: string; label: string; status: CheckStatus; detail?: string };

export type EvaluationResult = {
  ready: boolean;
  checklist: ChecklistItem[];
  blockers: string[];
  warnings: string[];
  recommendedOverallResult: "Pass" | "Fail" | "Pending";
  perRow: Array<{ id: string; pass: boolean; reason?: string; codeRef?: string }>;
};

export function evaluatePqr(args: {
  pqr: any;
  pwps: any | null;
  ndt: any[];
  mech: any[];
  findings: any[];
}): EvaluationResult {
  const { pqr, pwps, ndt, mech, findings } = args;
  const checklist: ChecklistItem[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];
  const perRow: EvaluationResult["perRow"] = [];

  const joint: JointKind = (pwps?.joint_type === "Fillet" ? "Fillet" : pwps?.joint_type === "Overlay" ? "Overlay" : "Groove") as JointKind;
  const required = requiredTestMatrix({
    codeFamily: (pqr?.code_family as CodeFamily) ?? "ASME IX",
    joint,
    thicknessMm: pwps?.thickness_max_mm ?? pwps?.thickness_min_mm ?? null,
  });

  // 1. Required NDT coverage
  const ndtByMethod = new Map<string, number>();
  ndt.forEach((r) => ndtByMethod.set(r.method, (ndtByMethod.get(r.method) ?? 0) + 1));
  const missingNdt = required
    .filter((r) => r.kind === "ndt")
    .filter((r: any) => (ndtByMethod.get(r.method) ?? 0) < r.min);
  if (missingNdt.length === 0) {
    checklist.push({ id: "ndt_coverage", label: "Required NDT methods logged", status: "pass" });
  } else {
    const detail = missingNdt.map((r: any) => `${r.method} (need ${r.min})`).join(", ");
    checklist.push({ id: "ndt_coverage", label: "Required NDT methods logged", status: "fail", detail });
    blockers.push(`Missing required NDT: ${detail}`);
  }

  // 2. NDT results
  const ndtPending = ndt.filter((r) => r.result === "Pending").length;
  const ndtFailed = ndt.filter((r) => r.result === "Fail").length;
  if (ndt.length === 0) {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "warn", detail: "No NDT rows" });
    warnings.push("No NDT tests recorded");
  } else if (ndtPending > 0) {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "fail", detail: `${ndtPending} pending` });
    blockers.push(`${ndtPending} NDT test(s) still Pending`);
  } else if (ndtFailed > 0) {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "fail", detail: `${ndtFailed} failed` });
    blockers.push(`${ndtFailed} NDT test(s) Failed`);
  } else {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "pass" });
  }

  // 3. Required Mechanical coverage
  const mechByType = new Map<string, number>();
  mech.forEach((r) => mechByType.set(r.test_type, (mechByType.get(r.test_type) ?? 0) + 1));
  const missingMech = required
    .filter((r) => r.kind === "mech")
    .filter((r: any) => (mechByType.get(r.testType) ?? 0) < r.min);
  if (missingMech.length === 0) {
    checklist.push({ id: "mech_coverage", label: "Required mechanical tests logged", status: "pass" });
  } else {
    const detail = missingMech.map((r: any) => `${r.testType} (need ${r.min})`).join(", ");
    checklist.push({ id: "mech_coverage", label: "Required mechanical tests logged", status: "fail", detail });
    blockers.push(`Missing required mechanical tests: ${detail}`);
  }

  // 4. Mechanical results (per-row rule evaluation)
  let mechFail = 0;
  let mechPending = 0;
  for (const row of mech) {
    const v = evaluateMechRow(row);
    perRow.push({ id: row.id, pass: v.pass, reason: v.reason, codeRef: v.codeRef });
    if (!v.pass) {
      if (row.result === "Pending") mechPending++;
      else mechFail++;
    }
  }
  if (mech.length === 0) {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "warn", detail: "No mechanical rows" });
    warnings.push("No mechanical tests recorded");
  } else if (mechPending > 0) {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "fail", detail: `${mechPending} pending` });
    blockers.push(`${mechPending} mechanical test(s) still Pending`);
  } else if (mechFail > 0) {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "fail", detail: `${mechFail} below criteria` });
    blockers.push(`${mechFail} mechanical test(s) below acceptance criteria`);
  } else {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "pass" });
  }

  // 5. Qualified ranges set
  const ranges = pqr?.qualified_ranges ?? {};
  const hasRanges = ranges && Object.values(ranges).some((v) => v !== null && v !== undefined && v !== "");
  checklist.push({
    id: "ranges_set",
    label: "Qualified ranges defined",
    status: hasRanges ? "pass" : "warn",
    detail: hasRanges ? undefined : "Open the Qualified Ranges tab and apply suggested defaults",
  });
  if (!hasRanges) warnings.push("Qualified ranges not yet defined");

  // 6. No unresolved blocker findings
  const unresolvedBlockers = findings.filter((f) => !f.resolved && (f.severity === "critical" || f.severity === "error"));
  if (unresolvedBlockers.length === 0) {
    checklist.push({ id: "no_blockers", label: "No unresolved blocker findings", status: "pass" });
  } else {
    checklist.push({
      id: "no_blockers",
      label: "No unresolved blocker findings",
      status: "fail",
      detail: `${unresolvedBlockers.length} unresolved`,
    });
    blockers.push(`${unresolvedBlockers.length} unresolved blocker finding(s)`);
  }

  // 7. pWPS linked
  if (!pqr?.pwps_id) {
    checklist.push({ id: "pwps_linked", label: "Linked to source pWPS", status: "fail", detail: "Set pwps_id on PQR" });
    blockers.push("PQR is not linked to a pWPS");
  } else {
    checklist.push({ id: "pwps_linked", label: "Linked to source pWPS", status: "pass" });
  }

  const ready = blockers.length === 0;
  const recommendedOverallResult: EvaluationResult["recommendedOverallResult"] =
    blockers.length === 0
      ? "Pass"
      : ndtFailed > 0 || mechFail > 0 || unresolvedBlockers.length > 0
        ? "Fail"
        : "Pending";

  return { ready, checklist, blockers, warnings, recommendedOverallResult, perRow };
}
