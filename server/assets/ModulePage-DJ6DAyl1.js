import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { B as Button } from "./router-DGN8uIPq.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
function ModulePage({
  title,
  subtitle,
  primaryAction,
  action,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: action ?? (primaryAction && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 me-1" }),
        " ",
        primaryAction
      ] })) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children })
  ] });
}
export {
  ModulePage as M
};
