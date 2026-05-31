import { a4 as notFound, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { R as ReportShell } from "./ReportShell-DFFKdsOP.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { a as exportExcel } from "./export-BKxIOV_6.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { X as Route } from "./router-DGN8uIPq.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./doc-number-DocNUsKJ.js";
import "./arrow-left-Dxzf8ThQ.js";
import "./file-spreadsheet-CPXneq8K.js";
import "./shield-check-BhHQurBT.js";
import "./useQuery-tHuwiQPC.js";
import "crypto";
import "fs";
import "stream";
import "events";
import "buffer";
import "util";
import "string_decoder";
import "path";
import "constants";
import "assert";
import "zlib";
import "os";
const TITLES = {
  qualifications: "Welder Qualifications Register",
  procedures: "WPS / PQR Register",
  welds: "Weld Traceability Report",
  inspections: "Inspection Outcomes Report",
  ncrs: "NCR Register",
  calibration: "Equipment & Instruments Calibration"
};
function ReportPage() {
  const {
    slug
  } = Route.useParams();
  if (!TITLES[slug]) throw notFound();
  switch (slug) {
    case "qualifications":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(QualificationsReport, {});
    case "procedures":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ProceduresReport, {});
    case "welds":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(WeldsReport, {});
    case "inspections":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(InspectionsReport, {});
    case "ncrs":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(NcrsReport, {});
    case "calibration":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CalibrationReport, {});
  }
  return null;
}
const DOC_TYPES = {
  qualifications: "WQR",
  procedures: "WPS-REG",
  welds: "WTR",
  inspections: "INS",
  ncrs: "NCR",
  calibration: "CAL"
};
function Wrap({
  slug,
  title,
  rows,
  isLoading,
  columns,
  onExportRows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ReportShell, { title, subtitle: `${rows.length} record${rows.length === 1 ? "" : "s"}`, docType: DOC_TYPES[slug] ?? "RPT", revision: "Rev 1", status: "ISSUED", meta: [{
    label: "Report type",
    value: title
  }, {
    label: "Records",
    value: String(rows.length)
  }, {
    label: "Period",
    value: "All time"
  }, {
    label: "Confidentiality",
    value: "Internal · Controlled"
  }], onExportExcel: () => exportExcel(title, "Report", onExportRows ? onExportRows() : rows), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: c.label }, c.key)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: columns.length, className: "text-center text-muted-foreground py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
        " Loading…"
      ] }) }),
      !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: columns.length, className: "text-center text-muted-foreground py-6", children: "No records." }) }),
      rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.render ? c.render(r) : r[c.key] ?? "—" }, c.key)) }, r.id ?? i))
    ] })
  ] }) });
}
function QualificationsReport() {
  const {
    data,
    isLoading
  } = useCompanyRows("qualifications", {
    order: {
      column: "expiry_date",
      ascending: true
    }
  });
  const rows = data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrap, { slug: "qualifications", title: TITLES.qualifications, isLoading, rows, columns: [{
    key: "welder_name",
    label: "Welder"
  }, {
    key: "employee_id",
    label: "Employee ID"
  }, {
    key: "process",
    label: "Process"
  }, {
    key: "standard",
    label: "Standard"
  }, {
    key: "expiry_date",
    label: "Expiry"
  }, {
    key: "status",
    label: "Status",
    render: (r) => {
      const d = daysUntil(r.expiry_date);
      return d == null ? r.status : d < 0 ? `Expired ${Math.abs(d)}d ago` : d <= 30 ? `Expires in ${d}d` : r.status;
    }
  }] });
}
function ProceduresReport() {
  const {
    data,
    isLoading
  } = useCompanyRows("procedures", {
    order: {
      column: "code",
      ascending: true
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrap, { slug: "procedures", title: TITLES.procedures, isLoading, rows: data ?? [], columns: [{
    key: "code",
    label: "Code"
  }, {
    key: "standard",
    label: "Standard"
  }, {
    key: "process",
    label: "Process"
  }, {
    key: "thickness_range",
    label: "Thickness"
  }, {
    key: "revision",
    label: "Rev"
  }, {
    key: "status",
    label: "Status"
  }] });
}
function WeldsReport() {
  const {
    data,
    isLoading
  } = useCompanyRows("welds", {
    order: {
      column: "weld_date",
      ascending: false
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrap, { slug: "welds", title: TITLES.welds, isLoading, rows: data ?? [], columns: [{
    key: "weld_no",
    label: "Weld No."
  }, {
    key: "welder_name",
    label: "Welder"
  }, {
    key: "heat_input",
    label: "Heat input"
  }, {
    key: "weld_date",
    label: "Date"
  }, {
    key: "status",
    label: "Status"
  }] });
}
function InspectionsReport() {
  const {
    data,
    isLoading
  } = useCompanyRows("inspections", {
    order: {
      column: "inspected_at",
      ascending: false
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrap, { slug: "inspections", title: TITLES.inspections, isLoading, rows: data ?? [], columns: [{
    key: "inspection_type",
    label: "Type"
  }, {
    key: "ncr_code",
    label: "NCR"
  }, {
    key: "defect_type",
    label: "Defect"
  }, {
    key: "severity",
    label: "Severity"
  }, {
    key: "status",
    label: "Status"
  }, {
    key: "inspector_name",
    label: "Inspector"
  }] });
}
function NcrsReport() {
  const {
    data,
    isLoading
  } = useCompanyRows("inspections", {
    order: {
      column: "inspected_at",
      ascending: false
    }
  });
  const rows = (data ?? []).filter((r) => r.ncr_code);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrap, { slug: "ncrs", title: TITLES.ncrs, isLoading, rows, columns: [{
    key: "ncr_code",
    label: "NCR"
  }, {
    key: "inspection_type",
    label: "Detected via"
  }, {
    key: "defect_type",
    label: "Defect"
  }, {
    key: "severity",
    label: "Severity"
  }, {
    key: "status",
    label: "Status"
  }] });
}
function CalibrationReport() {
  const {
    data: equipment,
    isLoading: l1
  } = useCompanyRows("equipment", {
    order: {
      column: "calibration_due",
      ascending: true
    }
  });
  const {
    data: instruments,
    isLoading: l2
  } = useCompanyRows("instruments", {
    order: {
      column: "calibration_due",
      ascending: true
    }
  });
  const rows = [...(equipment ?? []).map((e) => ({
    id: `e-${e.id}`,
    kind: "Welding machine",
    asset: e.asset_id,
    name: e.model,
    due: e.calibration_due,
    status: e.status
  })), ...(instruments ?? []).map((i) => ({
    id: `i-${i.id}`,
    kind: "QA/QC instrument",
    asset: i.asset_id,
    name: i.name,
    due: i.calibration_due,
    status: i.status
  }))];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrap, { slug: "calibration", title: TITLES.calibration, isLoading: l1 || l2, rows, columns: [{
    key: "kind",
    label: "Kind"
  }, {
    key: "asset",
    label: "Asset ID"
  }, {
    key: "name",
    label: "Name / Model"
  }, {
    key: "due",
    label: "Calibration due",
    render: (r) => {
      const d = daysUntil(r.due);
      if (d == null) return r.due ?? "—";
      const tag = d < 0 ? ` (overdue ${Math.abs(d)}d)` : d <= 30 ? ` (due ${d}d)` : "";
      return `${r.due}${tag}`;
    }
  }, {
    key: "status",
    label: "Status"
  }] });
}
export {
  ReportPage as component
};
