import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, b as useAuth, B as Button, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { f as formatDistanceToNow } from "./format-gAjFLL1B.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { D as Database } from "./database-D0-LGgjW.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { M as Mail } from "./mail-Dc31eyoT.js";
import { F as FileExclamationPoint } from "./file-exclamation-point-D_pdeduv.js";
import { B as Bell } from "./bell-DxOSu_LY.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { G as Globe } from "./globe-BYBAGMtD.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M10 16h.01", key: "1bzywj" }],
  [
    "path",
    {
      d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "18tbho"
    }
  ],
  ["path", { d: "M21.946 12.013H2.054", key: "zqlbp7" }],
  ["path", { d: "M6 16h.01", key: "1pmjb7" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode);
function AdminConsole() {
  const {
    profile,
    roles
  } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");
  const {
    data: stats,
    isLoading
  } = useQuery({
    queryKey: ["admin-stats", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const tables = ["welds", "procedures", "qualifications", "inspections", "ncrs", "instruments", "projects", "profiles"];
      const counts = {};
      await Promise.all(tables.map(async (t) => {
        const {
          count
        } = await supabase.from(t).select("id", {
          count: "exact",
          head: true
        });
        counts[t] = count ?? 0;
      }));
      const sumSize = async (t) => {
        const {
          data
        } = await supabase.from(t).select("size_bytes");
        return (data ?? []).reduce((a2, r) => a2 + (r.size_bytes ?? 0), 0);
      };
      const [a, b, c] = await Promise.all([sumSize("procedure_attachments"), sumSize("weld_attachments"), sumSize("ncr_attachments")]);
      const storageBytes = a + b + c;
      const {
        data: pendingInv
      } = await supabase.from("invitations").select("id", {
        count: "exact"
      }).is("accepted_at", null).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString());
      const {
        data: openNcrs
      } = await supabase.from("ncrs").select("id").eq("status", "Open");
      const {
        data: expiringQuals
      } = await supabase.from("qualifications").select("id, welder_name, expiry_date").lte("expiry_date", new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)).order("expiry_date", {
        ascending: true
      }).limit(10);
      const {
        data: recentAudit
      } = await supabase.from("audit_logs").select("id, table_name, action, actor_id, created_at").order("created_at", {
        ascending: false
      }).limit(15);
      return {
        counts,
        storageBytes,
        pendingInvites: pendingInv?.length ?? 0,
        openNcrs: openNcrs?.length ?? 0,
        expiringQuals: expiringQuals ?? [],
        recentAudit: recentAudit ?? []
      };
    }
  });
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-8 mx-auto text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Restricted area" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "The Admin Console is available to workspace owners only." })
    ] });
  }
  const fmtBytes = (b) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
    return `${(b / 1024 ** 3).toFixed(2)} GB`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Admin Console" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Workspace health, storage, recent activity, and operational signals." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: Database, label: "Welds", value: stats?.counts.welds, loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: Database, label: "Procedures", value: stats?.counts.procedures, loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: Users, label: "Members", value: stats?.counts.profiles, loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: Mail, label: "Pending invites", value: stats?.pendingInvites, loading: isLoading, accent: (stats?.pendingInvites ?? 0) > 0 ? "info" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: FileExclamationPoint, label: "Open NCRs", value: stats?.openNcrs, loading: isLoading, accent: (stats?.openNcrs ?? 0) > 0 ? "warn" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: Bell, label: "Inspections", value: stats?.counts.inspections, loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: Database, label: "Instruments", value: stats?.counts.instruments, loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: HardDrive, label: "Storage used", value: stats ? fmtBytes(stats.storageBytes) : "—", loading: isLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-muted-foreground" }),
            "Recent activity"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/audit", children: "Open audit log" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border max-h-[360px] overflow-y-auto", children: [
          (stats?.recentAudit ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-5 py-2.5 flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: r.table_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                r.action,
                " · ",
                r.actor_id?.slice(0, 8) ?? "system"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground whitespace-nowrap ms-3", children: formatDistanceToNow(r.created_at) })
          ] }, r.id)),
          !isLoading && (stats?.recentAudit?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-5 py-8 text-center text-sm text-muted-foreground", children: "No recent activity." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileExclamationPoint, { className: "size-4 text-warning" }),
            "Welder qualifications expiring (30 days)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications", children: "Manage" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border max-h-[360px] overflow-y-auto", children: [
          (stats?.expiringQuals ?? []).map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-5 py-2.5 flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: q.welder_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: q.expiry_date })
          ] }, q.id)),
          !isLoading && (stats?.expiringQuals?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-5 py-8 text-center text-sm text-muted-foreground", children: "All qualifications are current." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DomainSettingsCard, { companyId: cid })
  ] });
}
function DomainSettingsCard({
  companyId
}) {
  const [domain, setDomain] = reactExports.useState("");
  const [allowedRaw, setAllowedRaw] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!companyId) return;
    supabase.from("companies").select("dedicated_domain, allowed_email_domains").eq("id", companyId).maybeSingle().then(({
      data
    }) => {
      setDomain(data?.dedicated_domain ?? "");
      setAllowedRaw((data?.allowed_email_domains ?? []).join(", "));
    }).finally(() => setLoading(false));
  }, [companyId]);
  const save = async () => {
    setBusy(true);
    const list = allowedRaw.split(/[\s,;]+/).map((d) => d.trim().toLowerCase()).filter(Boolean);
    const cleanDomain = domain.trim().toLowerCase() || null;
    const {
      error
    } = await supabase.from("companies").update({
      dedicated_domain: cleanDomain,
      allowed_email_domains: list
    }).eq("id", companyId);
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "That domain is already claimed by another workspace." : error.message);
      return;
    }
    toast.success("Domain settings updated.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-5 py-3 border-b border-border text-sm font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-4 text-primary" }),
      "Domain masking & email whitelisting"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid lg:grid-cols-2 gap-4 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Dedicated domain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: domain, onChange: (e) => setDomain(e.target.value), placeholder: "weld.acme.com", disabled: loading }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "When users open this host, the workspace branding loads automatically and signups land here." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Allowed email domains" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: allowedRaw, onChange: (e) => setAllowedRaw(e.target.value), placeholder: "acme.com, contractors.acme.com", disabled: loading }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          "Comma-separated. New signups whose email matches are auto-joined as ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "client viewers" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy || loading, children: busy ? "Saving…" : "Save domain settings" }) })
    ] })
  ] });
}
function KPI({
  icon: Icon,
  label,
  value,
  loading,
  accent
}) {
  const tone = accent === "warn" ? "text-warning" : accent === "info" ? "text-info" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-2 text-2xl font-semibold tracking-tight ${tone}`, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-6 w-12 rounded bg-muted/60 animate-pulse" }) : value ?? "—" })
  ] });
}
export {
  AdminConsole as component
};
