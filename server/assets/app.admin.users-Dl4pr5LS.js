import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { d as createLucideIcon, b as useAuth, g as useQueryClient, B as Button, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { D as Dialog, b as DialogTrigger, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BSpN8byK.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-BQF7sbtW.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-Cpf81MyI.js";
import { C as Check } from "./check-DS8b9zeL.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { X } from "./x-CQcD6R0Y.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-BlRkZP9l.js";
import "./Combination-DU9AdJ2b.js";
import "./index-BuCuGgC7.js";
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
import "./index-DH7MMPOO.js";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M4.929 4.929 19.07 19.071", key: "196cmz" }]
];
const Ban = createLucideIcon("ban", __iconNode$1);
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
const ROLES = ["super_admin", "qa_qc_manager", "welding_engineer", "inspector", "welder", "client_viewer"];
const ROLE_LABEL = {
  super_admin: "Super Admin",
  qa_qc_manager: "QA/QC Manager",
  welding_engineer: "Welding Engineer",
  inspector: "Inspector",
  welder: "Welder",
  client_viewer: "Client Viewer"
};
function UserManagementPage() {
  const {
    profile,
    roles,
    user
  } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");
  const qc = useQueryClient();
  const {
    data: users,
    isLoading
  } = useQuery({
    queryKey: ["admin-users", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("id, display_name, job_title, avatar_url, approval_status, pending_role, rejection_reason, created_at, approved_at, rejected_at").eq("company_id", cid).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-8 mx-auto text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Restricted area" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "User management is available to workspace administrators only." })
    ] });
  }
  const pending = (users ?? []).filter((u) => u.approval_status === "pending");
  const approved = (users ?? []).filter((u) => u.approval_status === "approved");
  const rejected = (users ?? []).filter((u) => u.approval_status === "rejected");
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin-users", cid]
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "User Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Review new signups and manage workspace access." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "pending", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pending", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5" }),
          " Pending",
          pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ms-1", children: pending.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "approved", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3.5" }),
          " Approved",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ms-1", children: approved.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "rejected", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "size-3.5" }),
          " Rejected",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ms-1", children: rejected.length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pending", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserList, { users: pending, loading: isLoading, emptyText: "No pending requests. New signups will appear here.", renderActions: (u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ApproveDialog, { user: u, onDone: refresh }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RejectDialog, { user: u, onDone: refresh })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "approved", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserList, { users: approved, loading: isLoading, emptyText: "No approved users yet.", renderActions: (u) => u.id === user?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "You" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RejectDialog, { user: u, onDone: refresh, label: "Revoke access" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rejected", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserList, { users: rejected, loading: isLoading, emptyText: "No rejected users.", renderActions: (u) => /* @__PURE__ */ jsxRuntimeExports.jsx(ApproveDialog, { user: u, onDone: refresh, label: "Re-approve" }), showReason: true }) })
    ] })
  ] });
}
function UserList({
  users,
  loading,
  emptyText,
  renderActions,
  showReason
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground", children: "Loading…" });
  }
  if (users.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground", children: emptyText });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border rounded-xl border border-border bg-card overflow-hidden", children: users.map((u) => {
    const initials = (u.display_name ?? "?").slice(0, 2).toUpperCase();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-5 py-3 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: initials }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: u.display_name ?? "Unnamed user" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
          u.job_title ?? "—",
          " · Signed up ",
          formatDistanceToNow(new Date(u.created_at), {
            addSuffix: true
          }),
          u.pending_role && u.approval_status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " · Requested role ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: ROLE_LABEL[u.pending_role] })
          ] })
        ] }),
        showReason && u.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 italic", children: [
          "Reason: ",
          u.rejection_reason
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: renderActions(u) })
    ] }, u.id);
  }) });
}
function ApproveDialog({
  user,
  onDone,
  label
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [role, setRole] = reactExports.useState(user.pending_role ?? "client_viewer");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.rpc("approve_user", {
      _user_id: user.id,
      _role: role
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${user.display_name ?? "User"} approved as ${ROLE_LABEL[role]}`);
    setOpen(false);
    onDone();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
      " ",
      label ?? "Approve"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Approve ",
        user.display_name ?? "user"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Assign role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: (v) => setRole(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABEL[r] }, r)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Approve" })
      ] })
    ] })
  ] });
}
function RejectDialog({
  user,
  onDone,
  label
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [reason, setReason] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.rpc("reject_user", {
      _user_id: user.id,
      _reason: reason || null
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${user.display_name ?? "User"} rejected`);
    setOpen(false);
    onDone();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }),
      " ",
      label ?? "Reject"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        label ?? "Reject",
        " ",
        user.display_name ?? "user"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Shown to the user on their next sign-in", rows: 3 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: submit, disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : label ?? "Reject" })
      ] })
    ] })
  ] });
}
export {
  UserManagementPage as component
};
