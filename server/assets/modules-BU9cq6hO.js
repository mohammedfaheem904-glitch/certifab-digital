import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, T as TriangleAlert, L as Link, B as Button } from "./router-DGN8uIPq.js";
import { M as MarketingShell, E as Eyebrow, S as Section } from "./MarketingShell-BOWNVxAp.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import { C as ClipboardCheck } from "./clipboard-check-uPHKjRWU.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { W as Wrench } from "./wrench-CmqB68Gm.js";
import { G as Gauge } from "./gauge-BpPoZNdd.js";
import { C as ChartColumn } from "./chart-column-CdgQTHSX.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { B as Bell } from "./bell-DxOSu_LY.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
const __iconNode = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode);
const MODULES = [{
  icon: FolderOpen,
  n: "Projects",
  d: "Multi-project workspace with client, location and scope."
}, {
  icon: FileText,
  n: "Procedures",
  d: "Versioned procedure register with approval, lock, attachments and PDF export."
}, {
  icon: ClipboardCheck,
  n: "Welder Qualifications",
  d: "WPQ register, scope of approval, continuity, expiry alerts."
}, {
  icon: Activity,
  n: "Weld Traceability",
  d: "Joint log with QR token, heat numbers, filler metals, drawing/spool/line."
}, {
  icon: ShieldCheck,
  n: "Inspections (NDT)",
  d: "VT, RT, UT, PT, MT outcomes with inspector and signed-off evidence."
}, {
  icon: TriangleAlert,
  n: "Non-Conformance (NCR)",
  d: "Status-driven NCR pipeline with root cause, CA/PA and review."
}, {
  icon: Wrench,
  n: "Equipment",
  d: "Welding machines with calibration, location and assignment."
}, {
  icon: Gauge,
  n: "Instruments",
  d: "QA/QC instruments with calibration certificates and QR verification."
}, {
  icon: ChartColumn,
  n: "Reports",
  d: "Print-perfect PDFs and Excel exports for every register."
}, {
  icon: Users,
  n: "Team & Roles",
  d: "Role-based access: super-admin, QA/QC, engineer, inspector, welder, viewer."
}, {
  icon: Bell,
  n: "Notifications",
  d: "Email alerts for expiries, calibrations, NCR assignments and approvals."
}, {
  icon: Activity,
  n: "Audit Log",
  d: "Every change captured with actor, timestamp, before/after JSON."
}];
function ModulesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Modules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl", children: "Twelve modules. One operational record." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground max-w-2xl", children: "Each module is independently useful and tightly integrated. Start with welder qualifications today, add weld traceability and NCR management as you scale." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { tone: "light", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: MODULES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6 hover:shadow-[var(--shadow-elegant)] transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md grid place-items-center bg-primary/10 text-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m.n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1.5 leading-relaxed", children: m.d })
    ] }, m.n)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight", children: "Open the live demo workspace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Click around a fully populated EPC project right now." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app", className: "inline-block mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-[image:var(--gradient-primary)] text-primary-foreground", children: "Launch demo" }) })
    ] }) })
  ] });
}
export {
  ModulesPage as component
};
