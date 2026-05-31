import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, B as Button } from "./router-DGN8uIPq.js";
import { i as isTipDismissed, d as dismissTip } from "./discovery-D5siu6b6.js";
import { X } from "./x-CQcD6R0Y.js";
const __iconNode = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
function SpotlightTip({
  id,
  title,
  body,
  action
}) {
  const [hidden, setHidden] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setHidden(isTipDismissed(id));
    const onChange = () => setHidden(isTipDismissed(id));
    window.addEventListener("cf:discovery-changed", onChange);
    return () => window.removeEventListener("cf:discovery-changed", onChange);
  }, [id]);
  if (hidden) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 rounded-full bg-primary/15 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "size-4 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary", children: "New here" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: body }),
      action && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "mt-2", onClick: action.onClick, children: action.label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "text-muted-foreground hover:text-foreground",
        onClick: () => dismissTip(id),
        "aria-label": "Dismiss tip",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
      }
    )
  ] });
}
export {
  SpotlightTip as S
};
