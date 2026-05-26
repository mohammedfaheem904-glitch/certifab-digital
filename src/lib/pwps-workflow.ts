/**
 * pWPS workflow state machine.
 * pWPS = Preliminary Welding Procedure Specification.
 * Must pass qualification (PQR) before being promoted to a production WPS.
 */
export type PwpsStatus =
  | "Draft"
  | "Under Qualification"
  | "Testing"
  | "Pending Validation"
  | "Qualified"
  | "Rejected"
  | "Converted";

export const PWPS_STAGES: PwpsStatus[] = [
  "Draft",
  "Under Qualification",
  "Testing",
  "Pending Validation",
  "Qualified",
  "Converted",
];

export const PWPS_BRANCH_STATES: PwpsStatus[] = ["Rejected"];

export type PwpsTransition = {
  to: PwpsStatus;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  requires?: string;
  needsReason?: boolean;
};

export function allowedPwpsTransitions(s: PwpsStatus): PwpsTransition[] {
  switch (s) {
    case "Draft":
      return [{ to: "Under Qualification", label: "Submit for qualification" }];
    case "Under Qualification":
      return [
        { to: "Testing", label: "Start testing", requires: "Test coupon prepared" },
        { to: "Draft", label: "Return to draft", variant: "outline" },
      ];
    case "Testing":
      return [
        { to: "Pending Validation", label: "Submit results for validation" },
        { to: "Rejected", label: "Reject", variant: "destructive", needsReason: true },
      ];
    case "Pending Validation":
      return [
        { to: "Qualified", label: "Approve qualification", requires: "PQR passed" },
        { to: "Rejected", label: "Reject", variant: "destructive", needsReason: true },
        { to: "Testing", label: "Request more testing", variant: "outline" },
      ];
    case "Qualified":
      return [{ to: "Converted", label: "Promote to WPS", requires: "PQR signed" }];
    case "Rejected":
      return [{ to: "Draft", label: "Reopen as draft", variant: "outline" }];
    case "Converted":
      return [];
  }
}

export function pwpsStageIndex(s: PwpsStatus): number {
  const i = PWPS_STAGES.indexOf(s);
  return i === -1 ? 0 : i;
}

export function isPwpsBranch(s: PwpsStatus): boolean {
  return PWPS_BRANCH_STATES.includes(s);
}

export const PWPS_STATUS_TONE: Record<PwpsStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  "Under Qualification": "bg-info/15 text-info border-info/30",
  Testing: "bg-warning/15 text-warning border-warning/30",
  "Pending Validation": "bg-primary/15 text-primary border-primary/30",
  Qualified: "bg-success/15 text-success border-success/30",
  Converted: "bg-success/20 text-success border-success/40",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};
