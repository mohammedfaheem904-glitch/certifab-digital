/**
 * Project workflow state machine — mirrors the server-side `transition_project` RPC.
 */
export type ProjectWorkflowStatus =
  | "Draft"
  | "Planning"
  | "Approved"
  | "In Progress"
  | "On Hold"
  | "Closed"
  | "Rejected"
  | "Cancelled";

export const PROJECT_STAGES: ProjectWorkflowStatus[] = [
  "Draft",
  "Planning",
  "Approved",
  "In Progress",
  "Closed",
];

export const PROJECT_BRANCH_STATES: ProjectWorkflowStatus[] = [
  "On Hold",
  "Rejected",
  "Cancelled",
];

export type ProjectTransition = {
  to: ProjectWorkflowStatus;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  needsReason?: boolean;
  /** Role required to perform this transition. */
  role: "editor" | "approver" | "super_admin";
};

export function projectStageIndex(s: ProjectWorkflowStatus): number {
  const i = PROJECT_STAGES.indexOf(s);
  return i === -1 ? 0 : i;
}

export function isProjectBranch(s: ProjectWorkflowStatus): boolean {
  return PROJECT_BRANCH_STATES.includes(s);
}

export const PROJECT_STATUS_TONE: Record<ProjectWorkflowStatus, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Planning: "bg-info/15 text-info border-info/30",
  Approved: "bg-primary/15 text-primary border-primary/30",
  "In Progress": "bg-success/15 text-success border-success/30",
  "On Hold": "bg-warning/15 text-warning border-warning/30",
  Closed: "bg-success/20 text-success border-success/40",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

export type RoleFlags = { isEditor: boolean; isApprover: boolean; isSuperAdmin: boolean };

export function allowedProjectTransitions(
  from: ProjectWorkflowStatus,
  roles: RoleFlags,
): ProjectTransition[] {
  const all: Record<ProjectWorkflowStatus, ProjectTransition[]> = {
    Draft: [
      { to: "Planning", label: "Submit for review", role: "editor" },
    ],
    Planning: [
      { to: "Approved", label: "Approve", role: "approver" },
      { to: "Rejected", label: "Reject", role: "approver", variant: "destructive", needsReason: true },
    ],
    Approved: [
      { to: "In Progress", label: "Kick off", role: "editor" },
    ],
    "In Progress": [
      { to: "On Hold", label: "Put on hold", role: "editor", variant: "outline", needsReason: true },
      { to: "Closed", label: "Close project", role: "approver" },
    ],
    "On Hold": [
      { to: "In Progress", label: "Resume", role: "editor" },
    ],
    Closed: [],
    Rejected: [
      { to: "Draft", label: "Reopen", role: "super_admin", variant: "outline" },
    ],
    Cancelled: [
      { to: "Draft", label: "Reopen", role: "super_admin", variant: "outline" },
    ],
  };

  // Cancellation available from any non-terminal state to super_admin
  const list = [...all[from]];
  if (!["Closed", "Cancelled", "Rejected"].includes(from)) {
    list.push({
      to: "Cancelled",
      label: "Cancel project",
      role: "super_admin",
      variant: "destructive",
      needsReason: true,
    });
  }

  return list.filter((t) => {
    if (t.role === "editor") return roles.isEditor;
    if (t.role === "approver") return roles.isApprover || roles.isSuperAdmin;
    if (t.role === "super_admin") return roles.isSuperAdmin;
    return false;
  });
}
