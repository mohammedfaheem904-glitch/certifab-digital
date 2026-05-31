import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import { C as ChevronRight } from "./chevron-right-DA67_Mf_.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./plus-qnEZmAjm.js";
const REPORTS = [{
  slug: "qualifications",
  title: "Welder Qualifications Register",
  desc: "Personnel certificates, expiries and continuity status."
}, {
  slug: "procedures",
  title: "WPS / PQR Register",
  desc: "Approved procedures with revision and standard reference."
}, {
  slug: "welds",
  title: "Weld Traceability Report",
  desc: "Project → weld → procedure → inspection chain."
}, {
  slug: "inspections",
  title: "Inspection Outcomes Report",
  desc: "VT/PT/MT/RT/UT results with defect breakdown."
}, {
  slug: "ncrs",
  title: "NCR Register",
  desc: "Non-conformance log with severity and status."
}, {
  slug: "calibration",
  title: "Equipment & Instruments Calibration",
  desc: "Calibration due / overdue across the fleet."
}];
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Reports", subtitle: "Audit-ready industrial reports — print to PDF or export to Excel.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: REPORTS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/reports/$slug", params: {
  slug: r.slug
}, className: "flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-5 text-primary" }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.desc })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
] }) }, r.slug)) }) });
export {
  SplitComponent as component
};
