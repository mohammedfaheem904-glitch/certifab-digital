import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, L as Link, B as Button } from "./router-DGN8uIPq.js";
import { M as MarketingShell, E as Eyebrow, S as Section } from "./MarketingShell-BOWNVxAp.js";
import { B as Building2 } from "./building-2-CNolPY5a.js";
import { C as Cpu } from "./cpu-CGExwvY2.js";
import { W as Wrench } from "./wrench-CmqB68Gm.js";
import { Z as Zap } from "./zap-BIEDeIiy.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
const __iconNode$2 = [
  ["path", { d: "M12 6v16", key: "nqf5sj" }],
  ["path", { d: "m19 13 2-1a9 9 0 0 1-18 0l2 1", key: "y7qv08" }],
  ["path", { d: "M9 11h6", key: "1fldmi" }],
  ["circle", { cx: "12", cy: "4", r: "2", key: "muu5ef" }]
];
const Anchor = createLucideIcon("anchor", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M16 16h.01", key: "1f9h7w" }],
  [
    "path",
    {
      d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z",
      key: "1iv0i2"
    }
  ],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const Factory = createLucideIcon("factory", __iconNode$1);
const __iconNode = [
  ["path", { d: "m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9", key: "1hayfq" }],
  ["path", { d: "m18 15 4-4", key: "16gjal" }],
  [
    "path",
    {
      d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",
      key: "15ts47"
    }
  ]
];
const Hammer = createLucideIcon("hammer", __iconNode);
const INDUSTRIES = [{
  icon: Building2,
  n: "Oil & Gas",
  d: "Refineries, midstream pipelines, offshore platforms.",
  points: ["API 1104 pipeline welds", "B31.3 process piping", "Sour-service traceability"]
}, {
  icon: Cpu,
  n: "EPC Contractors",
  d: "Multi-project, multi-site fabrication and erection.",
  points: ["Project-scoped dashboards", "Subcontractor visibility", "Client handover packs"]
}, {
  icon: Wrench,
  n: "Fabrication Shops",
  d: "Pressure vessels, structural steel, modular skids.",
  points: ["ASME U-stamp prep", "Heat-number reconciliation", "Shop-to-site continuity"]
}, {
  icon: Zap,
  n: "Power & Utilities",
  d: "Conventional, nuclear, hydro and renewables.",
  points: ["ASME III tracking", "Long-cycle qualification", "Outage repair NCRs"]
}, {
  icon: Anchor,
  n: "Shipbuilding & Marine",
  d: "Hull, piping and structural welds with class society oversight.",
  points: ["DNV / ABS / LR ready", "Block-level traceability", "Surveyor witness logs"]
}, {
  icon: Hammer,
  n: "Heavy Structural Steel",
  d: "Bridges, towers, cranes, mining infrastructure.",
  points: ["AWS D1.1 / D1.5", "Critical joint flagging", "Erection sequence audit"]
}, {
  icon: Factory,
  n: "Process Industries",
  d: "Petrochemical, chemical, fertilizer plants.",
  points: ["Material traceability", "Service-class welds", "Turnaround NCR closeout"]
}, {
  icon: Activity,
  n: "Mining & Metals",
  d: "Mills, conveyors, pressure equipment, structural.",
  points: ["Site + camp coverage", "Mobile-first inspection", "Offline-tolerant sync"]
}];
function IndustriesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Industries" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl", children: "Built for industries where one bad weld is a national headline." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground max-w-2xl", children: "Weld Yard adapts to the standards, audits and pace of your sector — from refinery turnarounds to nuclear new-build." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { tone: "light", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-5", children: INDUSTRIES.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 shrink-0 rounded-md grid place-items-center bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(i.icon, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: i.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: i.d }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 text-sm", children: i.points.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-muted-foreground", children: [
          "· ",
          p
        ] }, p)) })
      ] })
    ] }) }, i.n)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight", children: "Don't see your industry?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "If you weld it and audit it, we can help." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "inline-block mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", children: "Talk to us" }) })
    ] }) })
  ] });
}
export {
  IndustriesPage as component
};
