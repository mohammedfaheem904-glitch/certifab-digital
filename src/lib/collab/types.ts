export type CollabEntityType =
  | "ncr"
  | "weld"
  | "procedure"
  | "pwps"
  | "pqr"
  | "qualification"
  | "inspection"
  | "project"
  | "capa"
  | "rework_job"
  | "instrument"
  | "equipment";

export type AppRole =
  | "super_admin"
  | "qa_qc_manager"
  | "welding_engineer"
  | "inspector"
  | "welder"
  | "client_viewer";

export type Reaction = "👍" | "✅" | "👀" | "⚠" | "❌";

export const REACTIONS: Reaction[] = ["👍", "✅", "👀", "⚠", "❌"];

export const REACTION_LABELS: Record<Reaction, string> = {
  "👍": "Approved",
  "✅": "Completed",
  "👀": "Reviewing",
  "⚠": "Needs attention",
  "❌": "Rejected",
};

export const ROLE_GROUPS: { token: string; role: AppRole; label: string }[] = [
  { token: "@QA-Team", role: "qa_qc_manager", label: "QA / QC managers" },
  { token: "@Inspectors", role: "inspector", label: "Inspectors" },
  { token: "@Engineering", role: "welding_engineer", label: "Welding engineers" },
  { token: "@Welders", role: "welder", label: "Welders" },
  { token: "@Admins", role: "super_admin", label: "Admins" },
];

export type Comment = {
  id: string;
  company_id: string;
  entity_type: CollabEntityType;
  entity_id: string;
  parent_id: string | null;
  author_id: string;
  body_md: string;
  body_plain: string;
  category: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CommentWithMeta = Comment & {
  author_name: string | null;
  author_avatar: string | null;
  author_role: AppRole | null;
  reactions: { emoji: Reaction; count: number; mine: boolean }[];
  attachments: {
    id: string;
    file_name: string;
    storage_path: string;
    mime_type: string | null;
    size_bytes: number | null;
  }[];
  mentions: { user_id: string | null; role: AppRole | null }[];
  children: CommentWithMeta[];
};

export type ActivityEvent = {
  id: string;
  company_id: string;
  entity_type: CollabEntityType;
  entity_id: string;
  kind: string;
  actor_id: string | null;
  summary: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};
