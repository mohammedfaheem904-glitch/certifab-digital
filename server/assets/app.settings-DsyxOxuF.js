import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, s as supabase, B as Button, L as Link, t as toast } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { u as usePlan, P as PlanBadge } from "./use-plan-zVTHo2UT.js";
import { U as UsageMeter } from "./UsageMeter-C2YTaTEL.js";
import { a as UpgradeBanner, U as UpgradeButton } from "./UpgradePrompt-DXJce8Hm.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { S as ScrollText } from "./scroll-text-CftZHGq2.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { L as Lock } from "./lock-D0LQ0o4o.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./plus-qnEZmAjm.js";
import "./useQuery-tHuwiQPC.js";
import "./dialog-Bm3dO2Bl.js";
import "./index-BlRkZP9l.js";
import "./Combination-DU9AdJ2b.js";
import "./index-BuCuGgC7.js";
import "./x-CQcD6R0Y.js";
import "./arrow-up-right-SlsiFPJV.js";
import "./check-DS8b9zeL.js";
function SettingsPage() {
  const {
    profile,
    companyName,
    refresh,
    roles
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const [name, setName] = reactExports.useState(companyName ?? "");
  const [logo, setLogo] = reactExports.useState("");
  const [footer, setFooter] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!profile?.company_id) return;
    supabase.from("companies").select("name, logo_url, report_footer").eq("id", profile.company_id).maybeSingle().then(({
      data
    }) => {
      if (data) {
        setName(data.name);
        setLogo(data.logo_url ?? "");
        setFooter(data.report_footer ?? "");
      }
    });
  }, [profile?.company_id]);
  const save = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("companies").update({
      name,
      logo_url: logo,
      report_footer: footer
    }).eq("id", profile.company_id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Workspace updated.");
    refresh();
  };
  const {
    plan,
    hasFeature,
    percentUsed,
    isInternal
  } = usePlan();
  const brandingLocked = !hasFeature("pdf_branding");
  const nearCap = ["users", "projects", "welds", "procedures"].some((q) => percentUsed(q) >= 80);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "Settings", subtitle: "Workspace, branding, members and access control.", children: [
    nearCap && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeBanner, { title: "You're approaching a plan limit", message: `Your workspace is on the ${plan.name} plan. Upgrade to keep adding records without interruption.` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid lg:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { to: "/app/team", icon: Users, title: "Team & Roles", desc: "Invite members, assign roles." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { to: "/app/audit", icon: ScrollText, title: "Audit Log", desc: "Tamper-evident change history." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { to: "/app/billing", icon: Sparkles, title: "Billing & Plan", desc: "Subscription, usage and feature access." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Workspace usage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan }),
          isInternal && /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan, internal: true, size: "xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/billing", children: "View plan details →" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "users" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "welds" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "procedures" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "storage_mb" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-border space-y-4 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Workspace branding" }),
        brandingLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground ms-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-3" }),
          " Professional plan"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Company name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value), disabled: !isAdmin }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Logo URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: logo, onChange: (e) => setLogo(e.target.value), placeholder: "https://…", disabled: !isAdmin || brandingLocked }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Report footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: footer, onChange: (e) => setFooter(e.target.value), placeholder: "Confidential — © 2026", disabled: !isAdmin || brandingLocked }) }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, children: busy ? "Saving…" : "Save changes" }),
        brandingLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeButton, { size: "sm", children: "Unlock branding" })
      ] }),
      !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Only super admins can edit workspace branding." })
    ] })
  ] });
}
function Tile({
  to,
  icon: Icon,
  title,
  desc,
  disabled
}) {
  const Body = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border border-border p-4 hover:bg-muted/20 transition-colors ${disabled ? "opacity-60" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5 text-primary mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: desc })
  ] });
  return disabled ? Body : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, children: Body });
}
function F({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  SettingsPage as component
};
