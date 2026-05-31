import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { B as Button, j as cn, L as Link } from "./router-DGN8uIPq.js";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { u as usePlan, P as PlanBadge, b as PLAN_ORDER, c as PLANS } from "./use-plan-zVTHo2UT.js";
import { A as ArrowUpRight } from "./arrow-up-right-SlsiFPJV.js";
import { C as Check } from "./check-DS8b9zeL.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
function UpgradeBanner({
  title,
  message,
  className
}) {
  const { plan } = usePlan();
  if (plan.id === "enterprise") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-wrap items-start gap-3",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/15 grid place-items-center text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: title ?? "Time to upgrade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeButton, { size: "sm" })
      ]
    }
  );
}
function UpgradeButton({
  size = "sm",
  className,
  children
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size, onClick: () => setOpen(true), className, children: children ?? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3.5 me-1" }),
      " Upgrade plan"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeDialog, { open, onOpenChange: setOpen })
  ] });
}
function UpgradeDialog({
  open,
  onOpenChange
}) {
  const { plan } = usePlan();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      "Upgrade your workspace",
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan, size: "xs" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-3 py-2", children: PLAN_ORDER.map((id) => {
      const p = PLANS[id];
      const current = p.id === plan.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "rounded-xl border p-4 flex flex-col",
            current ? "border-primary/40 bg-primary/5" : p.highlight ? "border-primary/30" : "border-border"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan: p }),
              current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Current" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-2xl font-semibold tracking-tight", children: [
              p.priceMonthly === null ? "Custom" : p.priceMonthly === 0 ? "Free" : `$${p.priceMonthly}`,
              p.priceMonthly && p.priceMonthly > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal", children: "/mo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: p.tagline }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1.5 text-xs flex-1", children: p.perks.map((perk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 mt-0.5 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: perk })
            ] }, perk)) })
          ]
        },
        id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground flex-1 min-w-[200px]", children: "Billing isn't connected yet — talk to your account owner to change plans, or open workspace settings to adjust manually." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Close" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/billing", onClick: () => onOpenChange(false), children: "Manage billing" }) })
    ] })
  ] }) });
}
export {
  UpgradeButton as U,
  UpgradeBanner as a
};
