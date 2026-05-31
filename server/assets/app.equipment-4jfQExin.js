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
function EquipmentPage() {
  const {
    data,
    isLoading
  } = useCompanyRows("equipment", {
    order: {
      column: "calibration_due",
      ascending: true
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Fleet & Equipment", subtitle: "Welding machines, calibration schedules and maintenance status across the yard.", action: /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "equipment", title: "Register machine", trigger: "Register Machine", defaults: {
    status: "Operational"
  }, children: ({
    values,
    set
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Asset ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.asset_id ?? "", onChange: (e) => set("asset_id", e.target.value), placeholder: "MIG-205" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Model", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.model ?? "", onChange: (e) => set("model", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Calibration due", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: values.calibration_due ?? "", onChange: (e) => set("calibration_due", e.target.value) }) })
  ] }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Asset" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Model" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Calibration due" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 4, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
        " Loading…"
      ] }),
      !isLoading && (data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 4, children: "No equipment registered." }),
      data?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: e.asset_id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: e.model }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: e.calibration_due }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: e.status }) })
      ] }, e.id))
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
  EquipmentPage as component
};
