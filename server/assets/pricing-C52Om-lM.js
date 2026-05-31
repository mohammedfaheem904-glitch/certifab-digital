import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link, B as Button } from "./router-DGN8uIPq.js";
import { M as MarketingShell, E as Eyebrow, S as Section } from "./MarketingShell-BOWNVxAp.js";
import { C as Check } from "./check-DS8b9zeL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
const TIERS = [{
  name: "Pilot",
  price: "$0",
  period: "30-day trial",
  desc: "Validate Weld Yard on a real project, with our team.",
  cta: {
    label: "Start pilot",
    to: "/demo"
  },
  features: ["Up to 25 welders", "1 project", "All core modules", "Email support", "Sample data preloaded"]
}, {
  name: "Professional",
  price: "$1,490",
  period: "/ month",
  desc: "For active fabrication shops and single-project EPC teams.",
  highlight: true,
  cta: {
    label: "Request demo",
    to: "/demo"
  },
  features: ["Up to 100 welders", "5 projects", "All modules + reports", "Email + chat support", "Custom branding on PDFs", "Bilingual UI (EN / AR)"]
}, {
  name: "Enterprise",
  price: "Custom",
  period: "annual",
  desc: "Multi-project EPCs, owner-operators and regulators.",
  cta: {
    label: "Contact sales",
    to: "/contact"
  },
  features: ["Unlimited welders & projects", "SSO / SAML", "Dedicated tenant", "On-prem option", "SLA & priority support", "Custom integrations (ERP, IoT)"]
}];
function PricingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Pricing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight", children: "Honest pricing for industrial teams." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground max-w-2xl mx-auto", children: "No per-seat surprises. Pricing is per project workspace, with unlimited inspectors and viewers on every plan." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { tone: "light", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: TIERS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border p-7 flex flex-col ${t.highlight ? "border-primary bg-card shadow-[var(--shadow-elegant)] relative" : "border-border bg-card"}`, children: [
        t.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-full", children: "Most popular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold uppercase tracking-widest text-muted-foreground", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-semibold tracking-tight", children: t.price }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: t.period })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: t.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-2.5 text-sm flex-1", children: t.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-primary mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
        ] }, f)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: t.cta.to, className: "mt-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: `w-full ${t.highlight ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : ""}`, variant: t.highlight ? "default" : "outline", children: t.cta.label }) })
      ] }, t.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center text-sm text-muted-foreground", children: "All plans include: multi-tenant isolation · audit log · email notifications · CSV / Excel / PDF exports · GDPR-aligned data handling." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight mb-6", children: "Frequently asked" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [{
        q: "Can we self-host Weld Yard?",
        a: "Yes. Enterprise customers can deploy Weld Yard on their own VPC or on-prem; we provide migration tooling and a maintenance SLA."
      }, {
        q: "Do you charge per inspector?",
        a: "No. Inspectors and viewers are unlimited on every plan. Pricing is per active project workspace."
      }, {
        q: "Is data isolated between companies?",
        a: "Yes. Multi-tenant isolation is enforced at the database layer using row-level security. Your data never leaves your tenant."
      }, {
        q: "Do you support Arabic?",
        a: "Yes — full bilingual EN / AR UI with RTL layout, Cairo font, and printed reports in either language."
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: f.q }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1.5", children: f.a })
      ] }, f.q)) })
    ] }) })
  ] });
}
export {
  PricingPage as component
};
