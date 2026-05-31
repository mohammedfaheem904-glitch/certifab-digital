import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link, B as Button } from "./router-DGN8uIPq.js";
import { M as MarketingShell, E as Eyebrow, S as Section } from "./MarketingShell-BOWNVxAp.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import { C as ClipboardCheck } from "./clipboard-check-uPHKjRWU.js";
import { W as Workflow } from "./workflow-BeD2b-lN.js";
import { Q as QrCode } from "./qr-code-BAr1PEWv.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-CPXneq8K.js";
import { G as Gauge } from "./gauge-BpPoZNdd.js";
import { B as Bell } from "./bell-DxOSu_LY.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { C as ChartColumn } from "./chart-column-CdgQTHSX.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { L as Lock } from "./lock-D0LQ0o4o.js";
import { D as Database } from "./database-D0-LGgjW.js";
import { G as Globe } from "./globe-BYBAGMtD.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
const GROUPS = [{
  title: "Procedure & qualification control",
  items: [{
    icon: FileText,
    n: "WPS / PQR authoring",
    d: "Versioned procedures with revision lock, approval workflow and PDF exports."
  }, {
    icon: ClipboardCheck,
    n: "Welder qualifications",
    d: "WPQ register with scope of approval, continuity tracking and expiry alerts."
  }, {
    icon: Workflow,
    n: "Heat-input engine",
    d: "Automatic kJ/mm calculation from voltage, amperage and travel speed; validates against the WPS qualified range."
  }]
}, {
  title: "Weld traceability & inspection",
  items: [{
    icon: QrCode,
    n: "QR-coded weld joints",
    d: "Every joint carries a unique token. Scan once for full chain — welder, WPS, heats, NDT, NCRs."
  }, {
    icon: ShieldCheck,
    n: "NDT / inspection log",
    d: "VT, RT, UT, PT, MT outcomes with inspector signature and per-record evidence attachments."
  }, {
    icon: FileSpreadsheet,
    n: "NCR pipeline",
    d: "Status stepper from Draft → Open → Root Cause → CA/PA → Review → Closed, with audit trail."
  }]
}, {
  title: "Equipment & calibration",
  items: [{
    icon: Gauge,
    n: "Calibration register",
    d: "Welding machines + QA/QC instruments with certificate uploads and overdue alerts."
  }, {
    icon: Bell,
    n: "Automated reminders",
    d: "Email reminders before calibrations and qualifications expire — no more surprise lapses."
  }, {
    icon: Activity,
    n: "Activity timelines",
    d: "Every status change, reassignment and calibration is captured with actor and timestamp."
  }]
}, {
  title: "Operations & analytics",
  items: [{
    icon: ChartColumn,
    n: "Realtime dashboards",
    d: "Acceptance rate, repair rate, welder performance and project compliance — live, not nightly."
  }, {
    icon: FileSpreadsheet,
    n: "Audit-ready reports",
    d: "Print-perfect PDFs for qualifications, welds, inspections, NCRs and calibration."
  }, {
    icon: Users,
    n: "Roles & permissions",
    d: "Super-admin, QA/QC manager, welding engineer, inspector, welder, viewer."
  }]
}, {
  title: "Security & enterprise",
  items: [{
    icon: Lock,
    n: "Multi-tenant isolation",
    d: "Row-level security at the database layer — every query scoped to your company."
  }, {
    icon: Database,
    n: "Per-record attachments",
    d: "Photos, RT films, certificates — securely stored with signed URL access."
  }, {
    icon: Globe,
    n: "Bilingual UI",
    d: "English and Arabic with full RTL support — built for the GCC."
  }]
}];
function FeaturesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Features" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl", children: "Every capability your QA/QC team needs — out of the box." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground max-w-2xl", children: "Weld Yard covers the full welding lifecycle, from procedure authoring to weld closeout and audit. Built with the standards your inspectors actually cite." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { tone: "light", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-16", children: GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight mb-6", children: g.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: g.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md grid place-items-center bg-primary/10 text-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: it.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1.5 leading-relaxed", children: it.d })
      ] }, it.n)) })
    ] }, g.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight", children: "See it on your data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "A 30-minute walkthrough on a project that looks like yours." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/demo", className: "inline-block mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-[image:var(--gradient-primary)] text-primary-foreground", children: "Request a demo" }) })
    ] }) })
  ] });
}
export {
  FeaturesPage as component
};
