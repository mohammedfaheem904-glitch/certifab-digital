import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, g as useQueryClient, B as Button, j as cn, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { u as usePlan, P as PlanBadge, b as PLAN_ORDER, c as PLANS, F as FEATURE_LABEL } from "./use-plan-zVTHo2UT.js";
import { U as UsageMeter } from "./UsageMeter-C2YTaTEL.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
import { C as Check } from "./check-DS8b9zeL.js";
import { A as ArrowUpRight } from "./arrow-up-right-SlsiFPJV.js";
import { X } from "./x-CQcD6R0Y.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./plus-qnEZmAjm.js";
import "./useQuery-tHuwiQPC.js";
const FEATURE_KEYS = ["qr_verification", "advanced_reports", "audit_export", "pdf_branding", "calibration_tracking", "team_management", "priority_support", "api_access"];
function BillingPage() {
  const {
    plan
  } = usePlan();
  const {
    roles,
    profile
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(null);
  const switchPlan = async (target) => {
    if (!isAdmin || !profile?.company_id) return;
    setBusy(target);
    const {
      error
    } = await supabase.from("companies").update({
      plan: target
    }).eq("id", profile.company_id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Switched to ${PLANS[target].name} plan.`);
    qc.invalidateQueries({
      queryKey: ["plan-usage"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Billing & Plan", subtitle: "Workspace subscription, usage limits and feature access.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-wrap items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/15 grid place-items-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Current plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: plan.tagline })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-semibold tracking-tight", children: [
          plan.priceMonthly === null ? "Custom" : plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`,
          plan.priceMonthly && plan.priceMonthly > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal", children: "/mo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Stripe billing — coming soon" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-4", children: "Workspace usage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "users" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "welds" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "procedures" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UsageMeter, { quota: "storage_mb" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid lg:grid-cols-3 gap-4", children: PLAN_ORDER.map((id) => {
      const p = PLANS[id];
      const current = p.id === plan.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border p-5 flex flex-col", current ? "border-primary/40 bg-primary/5" : p.highlight ? "border-primary/30" : "border-border bg-card"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan: p }),
          p.highlight && !current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wide text-primary", children: "Most popular" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-3xl font-semibold tracking-tight", children: [
          p.priceMonthly === null ? "Custom" : p.priceMonthly === 0 ? "Free" : `$${p.priceMonthly}`,
          p.priceMonthly && p.priceMonthly > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground font-normal", children: "/mo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: p.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-1.5 text-sm flex-1", children: p.perks.map((perk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 mt-0.5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: perk })
        ] }, perk)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: current ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", disabled: true, className: "w-full", children: "Current plan" }) : isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: () => switchPlan(id), disabled: busy !== null, children: busy === id ? "Switching…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3.5 me-1" }),
          "Switch to ",
          p.name
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", disabled: true, children: "Contact admin" }) })
      ] }, id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Feature comparison" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Feature" }),
          PLAN_ORDER.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center font-medium px-5 py-2.5", children: PLANS[id].name }, id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: FEATURE_KEYS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5", children: FEATURE_LABEL[f] }),
          PLAN_ORDER.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2.5 text-center", children: PLANS[id].features[f] ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-success inline" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4 text-muted-foreground/50 inline" }) }, id))
        ] }, f)) })
      ] }) })
    ] }),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Only super admins can change the workspace plan." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Note: pricing is illustrative. Stripe billing will be wired up in the next release — switching plans currently updates the workspace tier instantly so you can validate access controls." })
  ] }) });
}
export {
  BillingPage as component
};
