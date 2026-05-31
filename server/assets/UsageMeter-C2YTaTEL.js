import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { j as cn } from "./router-DGN8uIPq.js";
import { u as usePlan, Q as QUOTA_LABEL, f as formatLimit, i as isUnlimited } from "./use-plan-zVTHo2UT.js";
function UsageMeter({ quota, className }) {
  const { plan, usage, percentUsed } = usePlan();
  const used = usage[quota] ?? 0;
  const limit = plan.limits[quota];
  const pct = percentUsed(quota);
  const tone = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-1.5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: QUOTA_LABEL[quota] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium tabular-nums", children: [
        formatLimit(quota, used),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          " / ",
          formatLimit(quota, limit)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn("h-full transition-all", tone),
        style: { width: isUnlimited(limit) ? "8%" : `${pct}%` }
      }
    ) })
  ] });
}
export {
  UsageMeter as U
};
