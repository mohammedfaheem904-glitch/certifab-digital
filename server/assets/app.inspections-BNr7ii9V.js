import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-DGN8uIPq.js";
import "./plus-qnEZmAjm.js";
import "./dialog-Bm3dO2Bl.js";
import "./index-BlRkZP9l.js";
import "./Combination-DU9AdJ2b.js";
import "./index-BuCuGgC7.js";
import "./x-CQcD6R0Y.js";
import "./use-plan-zVTHo2UT.js";
import "./sparkles-ksLz2psn.js";
import "./useQuery-tHuwiQPC.js";
import "./UpgradePrompt-DXJce8Hm.js";
import "./arrow-up-right-SlsiFPJV.js";
import "./check-DS8b9zeL.js";
import "./lock-D0LQ0o4o.js";
function InspectionsPage() {
  const {
    data,
    isLoading
  } = useCompanyRows("inspections", {
    order: {
      column: "inspected_at"
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Inspections & Non-Conformances", subtitle: "VT · PT · MT · RT · UT — defect tracking, repair workflow and acceptance reports.", action: /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "inspections", title: "New inspection / NCR", trigger: "New Inspection", defaults: {
    status: "Open",
    inspection_type: "VT"
  }, children: ({
    values,
    set
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "NCR code (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.ncr_code ?? "", onChange: (e) => set("ncr_code", e.target.value), placeholder: "NCR-0232" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Inspection type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.inspection_type ?? "", onChange: (e) => set("inspection_type", e.target.value), placeholder: "RT" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Defect", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.defect_type ?? "", onChange: (e) => set("defect_type", e.target.value), placeholder: "Porosity cluster" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Severity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.severity ?? "", onChange: (e) => set("severity", e.target.value), placeholder: "High" }) })
  ] }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "NCR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Defect" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Severity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 5, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
        " Loading…"
      ] }),
      !isLoading && (data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 5, children: "No inspections logged yet." }),
      data?.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: n.ncr_code ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: n.inspection_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: n.defect_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: n.severity && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: n.severity }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: n.status })
      ] }, n.id))
    ] })
  ] }) }) });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children });
}
function Empty({
  colSpan,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan, className: "px-5 py-10 text-center text-sm text-muted-foreground", children }) });
}
function F({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  InspectionsPage as component
};
