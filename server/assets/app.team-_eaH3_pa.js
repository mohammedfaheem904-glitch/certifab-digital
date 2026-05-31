import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { b as useAuth, g as useQueryClient, s as supabase, B as Button, t as toast } from "./router-DGN8uIPq.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-BQF7sbtW.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { D as Dialog, b as DialogTrigger, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { u as usePlan } from "./use-plan-zVTHo2UT.js";
import { U as UpgradeButton } from "./UpgradePrompt-DXJce8Hm.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as Copy } from "./copy-GEc2yaBI.js";
import { M as Mail } from "./mail-Dc31eyoT.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-Cpf81MyI.js";
import { X } from "./x-CQcD6R0Y.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-BlRkZP9l.js";
import "./index-BuCuGgC7.js";
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
import "./check-DS8b9zeL.js";
import "./sparkles-ksLz2psn.js";
import "./arrow-up-right-SlsiFPJV.js";
const ROLES = ["super_admin", "qa_qc_manager", "welding_engineer", "inspector", "welder", "client_viewer"];
const ROLE_LABEL = {
  super_admin: "Super Admin",
  qa_qc_manager: "QA/QC Manager",
  welding_engineer: "Welding Engineer",
  inspector: "Inspector",
  welder: "Welder",
  client_viewer: "Client Viewer"
};
const ROLE_SCOPE = {
  super_admin: "Full workspace control, billing, roles & integrations.",
  qa_qc_manager: "Approves WPS, signs off inspections, manages NCRs.",
  welding_engineer: "Authors WPS/PQR, manages welding parameters.",
  inspector: "Logs inspections, raises NCRs, monitors weld quality.",
  welder: "Views assigned welds, scans WPS via QR.",
  client_viewer: "Read-only access to project KPIs & reports."
};
function TeamPage() {
  const {
    profile,
    roles
  } = useAuth();
  const qc = useQueryClient();
  const isAdmin = roles.includes("super_admin");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["team", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data: profs
      } = await supabase.from("profiles").select("id, display_name, job_title").eq("company_id", profile.company_id);
      const ids = (profs ?? []).map((p) => p.id);
      const {
        data: roleRows
      } = await supabase.from("user_roles").select("user_id, role").in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const grouped = {};
      (roleRows ?? []).forEach((r) => {
        grouped[r.user_id] = [...grouped[r.user_id] ?? [], r.role];
      });
      return (profs ?? []).map((p) => ({
        id: p.id,
        display_name: p.display_name,
        job_title: p.job_title,
        roles: grouped[p.id] ?? [],
        email: null
      }));
    }
  });
  const updateRole = async (userId, role, hasIt) => {
    if (!isAdmin || !profile?.company_id) return toast.error("Only super admins can change roles.");
    if (hasIt) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    } else {
      await supabase.from("user_roles").insert({
        user_id: userId,
        role,
        company_id: profile.company_id
      });
    }
    qc.invalidateQueries({
      queryKey: ["team", profile.company_id]
    });
    toast.success("Role updated.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Team & Roles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage workspace members and their access levels." })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(InviteDialog, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Job title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Roles" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 3, className: "px-5 py-10 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }) }),
        data?.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: (m.display_name ?? "?").slice(0, 2).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m.display_name ?? "(unnamed)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: m.id.slice(0, 8) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: m.job_title ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ROLES.map((r) => {
            const has = m.roles.includes(r);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !isAdmin, onClick: () => updateRole(m.id, r, has), className: `text-[11px] px-2 py-1 rounded-full border transition-colors ${has ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"} ${!isAdmin ? "cursor-not-allowed opacity-70" : ""}`, children: ROLE_LABEL[r] }, r);
          }) }) })
        ] }, m.id))
      ] })
    ] }) }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(PendingInvites, { companyId: profile.company_id }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Role permissions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mb-2", children: ROLE_LABEL[r] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ROLE_SCOPE[r] })
      ] }, r)) })
    ] })
  ] });
}
function PendingInvites({
  companyId
}) {
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["invitations", companyId],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("invitations").select("id, email, token, role, expires_at, accepted_at, created_at").eq("company_id", companyId).is("accepted_at", null).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const inviteUrl = (token) => `${window.location.origin}/accept-invite?token=${token}`;
  const copy = async (token) => {
    await navigator.clipboard.writeText(inviteUrl(token));
    toast.success("Invitation link copied");
  };
  const revoke = async (id) => {
    const {
      error
    } = await supabase.from("invitations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Invitation revoked");
    qc.invalidateQueries({
      queryKey: ["invitations", companyId]
    });
  };
  if (isLoading) return null;
  if (!data || data.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Pending invitations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ms-1", children: data.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Expires" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-end font-medium px-5 py-2.5", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.map((inv) => {
        const expired = new Date(inv.expires_at) < /* @__PURE__ */ new Date();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5 font-mono text-xs", children: inv.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: ROLE_LABEL[inv.role] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5 text-xs text-muted-foreground", children: expired ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Expired" }) : `in ${formatDistanceToNow(new Date(inv.expires_at))}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => copy(inv.token), disabled: expired, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5 me-1" }),
              " Copy link"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => revoke(inv.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
          ] }) })
        ] }, inv.id);
      }) })
    ] })
  ] });
}
function InviteDialog() {
  const {
    profile,
    user
  } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("inspector");
  const [busy, setBusy] = reactExports.useState(false);
  const [link, setLink] = reactExports.useState(null);
  const {
    isOverQuota,
    reasonForQuota,
    plan,
    usage
  } = usePlan();
  const blocked = isOverQuota("users");
  const submit = async (e) => {
    e.preventDefault();
    if (!profile?.company_id) return;
    if (blocked) {
      toast.error(reasonForQuota("users"));
      return;
    }
    setBusy(true);
    const {
      data,
      error
    } = await supabase.from("invitations").insert({
      company_id: profile.company_id,
      email: email.trim().toLowerCase(),
      role,
      invited_by: user?.id,
      invited_by_name: profile.display_name ?? user?.email ?? null
    }).select("token").single();
    setBusy(false);
    if (error) return toast.error(error.message);
    const url = `${window.location.origin}/accept-invite?token=${data.token}`;
    setLink(url);
    qc.invalidateQueries({
      queryKey: ["invitations", profile.company_id]
    });
    toast.success("Invitation created — share the link below.");
  };
  const close = () => {
    setOpen(false);
    setEmail("");
    setRole("inspector");
    setLink(null);
  };
  if (blocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        usage.users,
        "/",
        plan.limits.users,
        " seats on ",
        plan.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeButton, { size: "sm", children: "Upgrade to invite" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (v) => v ? setOpen(true) : close(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Invite member" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { children: !link ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Invite member" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "name@company.com" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Initial role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: (v) => setRole(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABEL[r] }, r)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "We'll generate a one-time invitation link valid for 14 days. Send it to your teammate over email or chat." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: close, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Creating…" : "Create invitation" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Invitation ready" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Share this link with ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: email }),
          ". It expires in 14 days and can only be used once."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { readOnly: true, value: link, className: "font-mono text-xs", onFocus: (e) => e.currentTarget.select() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: () => {
            navigator.clipboard.writeText(link);
            toast.success("Copied");
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: close, children: "Done" }) })
    ] }) })
  ] });
}
export {
  TeamPage as component
};
