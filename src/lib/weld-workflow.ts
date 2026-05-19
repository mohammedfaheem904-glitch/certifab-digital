/**
 * Weld workflow state machine — shared between UI & validation.
 * Keep transitions narrow & operational; aligns with weld_workflow_status enum.
 */
export type WeldWorkflowStatus =
  | "Draft"
  | "Pending Validation"
  | "Awaiting Inspection"
  | "NCR Open"
  | "Ready for Release"
  | "Approved"
  | "Released"
  | "Rejected"
  | "Blocked";

export const WORKFLOW_STAGES: WeldWorkflowStatus[] = [
  "Draft",
  "Pending Validation",
  "Awaiting Inspection",
  "Ready for Release",
  "Approved",
  "Released",
];

/** Terminal/branch states shown outside the main stepper. */
export const BRANCH_STATES: WeldWorkflowStatus[] = ["NCR Open", "Rejected", "Blocked"];

export type Transition = {
  to: WeldWorkflowStatus;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  /** Optional client-side guard description; UI may disable when not satisfied. */
  requires?: string;
  /** Asks for a reason (rejected_reason / blocked_reason). */
  needsReason?: boolean;
};

export function allowedTransitions(s: WeldWorkflowStatus): Transition[] {
  switch (s) {
    case "Draft":
      return [
        { to: "Pending Validation", label: "Submit for validation" },
        { to: "Blocked", label: "Block", variant: "destructive", needsReason: true },
      ];
    case "Pending Validation":
      return [
        { to: "Awaiting Inspection", label: "Approve compatibility", requires: "WPS ↔ WPQ check" },
        { to: "Blocked", label: "Block", variant: "destructive", needsReason: true },
        { to: "Draft", label: "Return to draft", variant: "outline" },
      ];
    case "Awaiting Inspection":
      return [
        { to: "Ready for Release", label: "Mark inspected & ready" },
        { to: "NCR Open", label: "Raise NCR", variant: "destructive" },
      ];
    case "NCR Open":
      return [
        { to: "Awaiting Inspection", label: "Re-inspect", variant: "outline" },
        { to: "Rejected", label: "Reject weld", variant: "destructive", needsReason: true },
      ];
    case "Ready for Release":
      return [
        { to: "Approved", label: "Approve" },
        { to: "Rejected", label: "Reject", variant: "destructive", needsReason: true },
      ];
    case "Approved":
      return [
        { to: "Released", label: "Release weld" },
        { to: "Awaiting Inspection", label: "Reopen", variant: "outline" },
      ];
    case "Released":
      return [{ to: "Awaiting Inspection", label: "Reopen", variant: "outline" }];
    case "Rejected":
    case "Blocked":
      return [{ to: "Draft", label: "Reopen", variant: "outline" }];
  }
}

export function stageIndex(s: WeldWorkflowStatus): number {
  const i = WORKFLOW_STAGES.indexOf(s);
  return i === -1 ? 0 : i;
}

export function isBranch(s: WeldWorkflowStatus): boolean {
  return BRANCH_STATES.includes(s);
}

export const STATUS_TONE: Record<WeldWorkflowStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  "Pending Validation": "bg-info/15 text-info border-info/30",
  "Awaiting Inspection": "bg-warning/15 text-warning border-warning/30",
  "NCR Open": "bg-destructive/15 text-destructive border-destructive/30",
  "Ready for Release": "bg-primary/15 text-primary border-primary/30",
  Approved: "bg-success/15 text-success border-success/30",
  Released: "bg-success/20 text-success border-success/40",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Blocked: "bg-destructive/15 text-destructive border-destructive/30",
};
