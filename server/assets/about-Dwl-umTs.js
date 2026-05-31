import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, L as Link, B as Button } from "./router-DGN8uIPq.js";
import { M as MarketingShell, E as Eyebrow, S as Section } from "./MarketingShell-BOWNVxAp.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ]
];
const Compass = createLucideIcon("compass", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Earth = createLucideIcon("earth", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
function AboutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-6 pt-20 pb-12 md:pt-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "About" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight", children: "Built by people who've stood in front of a weld test rejection." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground", children: "Weld Yard exists because the people doing welding QA/QC deserve better than three spreadsheets, two binders and an email thread per joint. We build for the engineers, inspectors and managers who keep refineries, pipelines and power plants safe." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { tone: "light", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Our mission" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: "Make industrial welding QA/QC fully digital, fully traceable, and fully auditable — without forcing teams to abandon the standards their inspectors actually cite. Every joint, every NDT result, every calibration certificate should be one query away." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "How we build" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: `We work alongside QA/QC managers from oil & gas, EPC and fabrication. We ship weekly. We don't patronize our users with toy software. Every screen has been pressure-tested against the question: "Would my old inspector accept this?"` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 grid md:grid-cols-4 gap-5", children: [{
        icon: Target,
        n: "Field-tested",
        d: "Designed with inspectors on real projects."
      }, {
        icon: ShieldCheck,
        n: "Standards-first",
        d: "ASME, EN, AWS, API, JIS, NORSOK."
      }, {
        icon: Compass,
        n: "Audit-ready",
        d: "Every change captured, every record signed."
      }, {
        icon: Earth,
        n: "Bilingual",
        d: "EN / AR with full RTL support."
      }].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(v.icon, { className: "size-5 text-primary mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: v.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: v.d })
      ] }, v.n)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight", children: "Want to help shape the next release?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "We're actively running pilots with EPC contractors and fabrication shops. If you have an opinion on how welding QA/QC should work, we'd like to hear it." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/demo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-[image:var(--gradient-primary)] text-primary-foreground", children: "Request a pilot" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", children: "Get in touch" }) })
      ] })
    ] }) })
  ] });
}
export {
  AboutPage as component
};
