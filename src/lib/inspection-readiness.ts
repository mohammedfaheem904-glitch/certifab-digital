// Inspection readiness scorer — combines checklist completion, measurement
// tolerances, attachments and approvals into a single readiness level.

export type ReadinessLevel = "Ready" | "Attention" | "High Risk" | "Critical";

export interface ReadinessInput {
  checklistItems: any[];
  workflowStatus: string;
  hasFindings?: boolean;
}

export interface ReadinessResult {
  level: ReadinessLevel;
  score: number; // 0-100
  total: number;
  completed: number;
  outOfTolerance: number;
  missingRequired: number;
  failed: number;
  reasons: string[];
}

export function scoreInspection({ checklistItems, workflowStatus, hasFindings }: ReadinessInput): ReadinessResult {
  const total = checklistItems.length;
  let completed = 0;
  let outOfTolerance = 0;
  let missingRequired = 0;
  let failed = 0;
  const reasons: string[] = [];

  for (const item of checklistItems) {
    const hasValue =
      item.result != null ||
      item.value_text != null ||
      item.value_number != null ||
      item.value_bool != null ||
      !!item.attachment_path;

    if (hasValue) completed++;
    else if (item.required) missingRequired++;

    if (item.result === "Fail") failed++;

    if (
      item.field_type === "measurement" &&
      item.value_number != null &&
      ((item.tolerance_min != null && item.value_number < item.tolerance_min) ||
        (item.tolerance_max != null && item.value_number > item.tolerance_max))
    ) {
      outOfTolerance++;
    }
  }

  const baseCompletion = total === 0 ? 0 : Math.round((completed / total) * 100);
  const penalty = failed * 25 + outOfTolerance * 15 + missingRequired * 10;
  const score = Math.max(0, Math.min(100, baseCompletion - penalty));

  if (failed > 0) reasons.push(`${failed} failed item${failed > 1 ? "s" : ""}`);
  if (outOfTolerance > 0) reasons.push(`${outOfTolerance} measurement${outOfTolerance > 1 ? "s" : ""} out of tolerance`);
  if (missingRequired > 0) reasons.push(`${missingRequired} required item${missingRequired > 1 ? "s" : ""} missing`);
  if (hasFindings) reasons.push("Open findings recorded");
  if (workflowStatus === "Rejected") reasons.push("Inspection rejected");
  if (workflowStatus === "NCR Raised") reasons.push("NCR raised against this inspection");

  let level: ReadinessLevel;
  if (failed > 0 || workflowStatus === "Rejected" || workflowStatus === "NCR Raised") level = "Critical";
  else if (outOfTolerance > 0 || missingRequired > 0) level = "High Risk";
  else if (total === 0 || completed < total) level = "Attention";
  else level = "Ready";

  return { level, score, total, completed, outOfTolerance, missingRequired, failed, reasons };
}
