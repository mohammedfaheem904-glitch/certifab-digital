export const INSPECTION_WORKFLOW_STAGES = [
  "Requested",
  "Assigned",
  "In Progress",
  "Pending Review",
  "Accepted",
  "Closed",
] as const;

export type InspectionWorkflowStatus =
  | (typeof INSPECTION_WORKFLOW_STAGES)[number]
  | "Rejected"
  | "NCR Raised"
  | "Re-Inspection Required";

export const INSPECTION_BRANCH_STATES: InspectionWorkflowStatus[] = [
  "Rejected",
  "NCR Raised",
  "Re-Inspection Required",
];

export function inspectionStageIndex(status: InspectionWorkflowStatus | string): number {
  const i = (INSPECTION_WORKFLOW_STAGES as readonly string[]).indexOf(status);
  return i === -1 ? 0 : i;
}

const TRANSITIONS: Record<string, InspectionWorkflowStatus[]> = {
  Requested: ["Assigned", "Rejected", "Closed"],
  Assigned: ["In Progress", "Requested", "Closed"],
  "In Progress": ["Pending Review", "Assigned"],
  "Pending Review": ["Accepted", "Rejected", "NCR Raised", "In Progress"],
  Accepted: ["Closed", "Re-Inspection Required"],
  Rejected: ["NCR Raised", "Re-Inspection Required", "Closed"],
  "NCR Raised": ["Re-Inspection Required", "Closed"],
  "Re-Inspection Required": ["Assigned", "Closed"],
  Closed: [],
};

export function allowedTransitions(status: string): InspectionWorkflowStatus[] {
  return TRANSITIONS[status] ?? [];
}

export function inspectionStatusTone(
  status: string,
): "success" | "destructive" | "warning" | "info" | "muted" {
  switch (status) {
    case "Accepted":
    case "Closed":
      return "success";
    case "Rejected":
    case "NCR Raised":
      return "destructive";
    case "Re-Inspection Required":
    case "Pending Review":
      return "warning";
    case "In Progress":
    case "Assigned":
      return "info";
    default:
      return "muted";
  }
}
