import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { T as TriangleAlert, L as Link } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
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
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
const CATEGORIES = ["UT", "RT", "Welding Gauge", "Coating", "Pressure Gauge", "Temperature", "NDT", "Other"];
function InstrumentsPage() {
  const {
    data,
    isLoading
  } = useCompanyRows("instruments", {
    order: {
      column: "calibration_due",
      ascending: true
    }
  });
  const [search, setSearch] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("all");
  const rows = (data ?? []).filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (search && !`${r.asset_id} ${r.name} ${r.serial_number ?? ""} ${r.manufacturer ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const total = rows.length;
  const overdue = rows.filter((r) => (daysUntil(r.calibration_due) ?? 999) < 0).length;
  const dueSoon = rows.filter((r) => {
    const d = daysUntil(r.calibration_due);
    return d != null && d >= 0 && d <= 30;
  }).length;
  const active = total - overdue - dueSoon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "QA/QC Instruments", subtitle: "UT, RT, gauges, coating & temperature instruments — with calibration tracking and QR verification.", action: /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "instruments", title: "Register instrument", trigger: "Register Instrument", defaults: {
    status: "Active",
    category: "Welding Gauge"
  }, children: ({
    values,
    set
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Asset ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.asset_id ?? "", onChange: (e) => set("asset_id", e.target.value), placeholder: "UT-014" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.name ?? "", onChange: (e) => set("name", e.target.value), placeholder: "Olympus EPOCH 650" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: values.category ?? "Welding Gauge", onValueChange: (v) => set("category", v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Model", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.model ?? "", onChange: (e) => set("model", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Serial number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.serial_number ?? "", onChange: (e) => set("serial_number", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Manufacturer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.manufacturer ?? "", onChange: (e) => set("manufacturer", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Calibration due", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: values.calibration_due ?? "", onChange: (e) => set("calibration_due", e.target.value) }) })
  ] }) }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: CircleCheck, label: "Active", value: active, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Activity, label: "Due in 30d", value: dueSoon, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: TriangleAlert, label: "Overdue", value: overdue, tone: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Activity, label: "Total", value: total, tone: "info" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex flex-wrap gap-2 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search asset, model, serial…", value: search, onChange: (e) => setSearch(e.target.value), className: "max-w-sm h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: cat, onValueChange: setCat, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44 h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All categories" }),
          CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Asset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Serial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Calibration due" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "px-5 py-10 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }) }),
        !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-10 text-center text-muted-foreground", children: "No instruments registered." }) }),
        rows.map((r) => {
          const d = daysUntil(r.calibration_due);
          const calBadge = d == null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) : d < 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Pill, { tone: "destructive", children: [
            "Overdue ",
            Math.abs(d),
            "d"
          ] }) : d <= 30 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Pill, { tone: "warning", children: [
            "Due in ",
            d,
            "d"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Pill, { tone: "success", children: [
            d,
            "d"
          ] });
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/verify/instrument/$token", params: {
              token: r.qr_token
            }, className: "hover:text-primary", children: r.asset_id }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: r.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs font-mono text-muted-foreground", children: r.serial_number ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3", children: [
              r.calibration_due ?? "—",
              " ",
              calBadge
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: r.status })
          ] }, r.id);
        })
      ] })
    ] }) })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  tone
}) {
  const cls = {
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
    info: "text-info bg-info/10"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-3 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-9 rounded-md grid place-items-center ${cls}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold leading-tight", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: label })
    ] })
  ] });
}
function Pill({
  tone,
  children
}) {
  const cls = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ms-2 text-[10px] px-1.5 py-0.5 rounded ${cls}`, children });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children });
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
  InstrumentsPage as component
};
