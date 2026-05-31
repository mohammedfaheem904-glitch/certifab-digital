import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, a as useNavigate, g as useQueryClient, B as Button, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { C as Checkbox } from "./checkbox-m8nfdtKo.js";
import { e as exportCsv, a as exportExcel } from "./export-BKxIOV_6.js";
import { X } from "./x-CQcD6R0Y.js";
import { D as Download } from "./download-BKvKMLMR.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { E as Eye } from "./eye-B2HBNUNp.js";
import { C as ChevronRight } from "./chevron-right-DA67_Mf_.js";
import { L as LayoutDashboard } from "./layout-dashboard-BSHvpClX.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./plus-qnEZmAjm.js";
import "./dialog-Bm3dO2Bl.js";
import "./index-BlRkZP9l.js";
import "./Combination-DU9AdJ2b.js";
import "./index-BuCuGgC7.js";
import "./use-plan-zVTHo2UT.js";
import "./sparkles-ksLz2psn.js";
import "./UpgradePrompt-DXJce8Hm.js";
import "./arrow-up-right-SlsiFPJV.js";
import "./check-DS8b9zeL.js";
import "./lock-D0LQ0o4o.js";
import "./index-UZjKeKWi.js";
import "./index-QEgYe57T.js";
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
const RESULT_TONE = {
  Pending: "bg-muted text-muted-foreground border-border",
  Passed: "bg-success/15 text-success border-success/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  Inconclusive: "bg-warning/15 text-warning border-warning/30"
};
const STATUSES = ["Draft", "Under Review", "Approved", "Rejected", "Superseded"];
const RESULTS = ["Pending", "Passed", "Failed", "Inconclusive"];
function PqrsIndexPage() {
  const {
    profile,
    roles
  } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");
  const nav = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [fStatus, setFStatus] = reactExports.useState("");
  const [fResult, setFResult] = reactExports.useState("");
  const [fCode, setFCode] = reactExports.useState("");
  const [fPwps, setFPwps] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [busy, setBusy] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["pqrs", cid],
    enabled: !!cid,
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pqrs").select("*").eq("company_id", cid).is("deleted_at", null).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const {
    data: pwpsOpts
  } = useQuery({
    queryKey: ["pwps-options", cid],
    enabled: !!cid,
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pwps").select("id,pwps_no").eq("company_id", cid).is("deleted_at", null).order("pwps_no");
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const allRows = data ?? [];
  const codes = reactExports.useMemo(() => Array.from(new Set(allRows.map((r) => r.code_family).filter(Boolean))), [allRows]);
  const pwpsMap = reactExports.useMemo(() => new Map((pwpsOpts ?? []).map((o) => [o.id, o.pwps_no])), [pwpsOpts]);
  const filtered = allRows.filter((p) => {
    if (fStatus && p.status !== fStatus) return false;
    if (fResult && p.overall_result !== fResult) return false;
    if (fCode && p.code_family !== fCode) return false;
    if (fPwps && p.pwps_id !== fPwps) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.pqr_no, p.standard, p.code_family, p.status, p.overall_result].filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });
  const hasFilters = !!(fStatus || fResult || fCode || fPwps);
  const clearFilters = () => {
    setFStatus("");
    setFResult("");
    setFCode("");
    setFPwps("");
  };
  const toggleAll = (checked) => setSelected(checked ? new Set(filtered.map((r) => r.id)) : /* @__PURE__ */ new Set());
  const toggleOne = (id, checked) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
  };
  const exportRows = (rows) => rows.map((r) => ({
    "PQR No": r.pqr_no,
    Revision: r.revision,
    Status: r.status,
    Result: r.overall_result,
    Code: r.code_family,
    Standard: r.standard ?? "",
    "Linked pWPS": r.pwps_id ? pwpsMap.get(r.pwps_id) ?? "" : "",
    "Qualification Date": r.qualification_date ?? "",
    "Expiry Date": r.expiry_date ?? "",
    "Resulting WPS": r.resulting_wps_id ? "Yes" : "No",
    Created: new Date(r.created_at).toISOString().slice(0, 10)
  }));
  const toExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;
  const moveToTrash = async (ids) => {
    if (!confirm(`Move ${ids.length} record${ids.length > 1 ? "s" : ""} to trash?`)) return;
    setBusy(true);
    const results = await Promise.all(ids.map((id) => supabase.rpc("soft_delete_pqr", {
      _id: id
    })));
    setBusy(false);
    const errs = results.filter((r) => r.error);
    if (errs.length) toast.error(`Failed for ${errs.length} record(s): ${errs[0].error.message}`);
    else toast.success(`Moved ${ids.length} to trash.`);
    setSelected(/* @__PURE__ */ new Set());
    qc.invalidateQueries({
      queryKey: ["pqrs", cid]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "PQR (Procedure Qualification Records)", subtitle: "Qualification tests that validate a pWPS. A Passed and signed PQR auto-creates a Draft WPS in the Procedures module.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pqrs/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "size-4 me-1" }),
      " Dashboard"
    ] }) }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pqrs/trash", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 me-1" }),
      " Trash"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "pqrs", title: "New PQR", trigger: "New PQR", defaults: {
      revision: "Rev 0",
      status: "Draft",
      code_family: "ASME IX",
      overall_result: "Pending",
      qualified_ranges: {}
    }, children: ({
      values,
      set
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "PQR number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.pqr_no ?? "", onChange: (e) => set("pqr_no", e.target.value), placeholder: "PQR-001" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Linked pWPS", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 rounded-md border border-input bg-background px-3 text-sm w-full", value: values.pwps_id ?? "", onChange: (e) => set("pwps_id", e.target.value || null), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select pWPS —" }),
        (pwpsOpts ?? []).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.id, children: o.pwps_no }, o.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Code family", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.code_family ?? "ASME IX", onChange: (e) => set("code_family", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Standard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.standard ?? "", onChange: (e) => set("standard", e.target.value), placeholder: "ASME IX 2023" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Test date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: values.test_date ?? "", onChange: (e) => set("test_date", e.target.value || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Revision", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.revision ?? "Rev 0", onChange: (e) => set("revision", e.target.value) }) })
    ] }) })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by number, standard…", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-xs bg-background/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fStatus, onChange: setFStatus, placeholder: "All statuses", options: STATUSES }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fResult, onChange: setFResult, placeholder: "All results", options: RESULTS }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fCode, onChange: setFCode, placeholder: "All codes", options: codes }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 rounded-md border border-input bg-background px-2 text-sm", value: fPwps, onChange: (e) => setFPwps(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All pWPS" }),
          (pwpsOpts ?? []).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.id, children: o.pwps_no }, o.id))
        ] }),
        hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 me-1" }),
          " Clear"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportCsv(`pqrs-${selected.size > 0 ? "selected" : "filtered"}`, exportRows(toExport)), disabled: toExport.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 me-1" }),
            " CSV"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportExcel(`pqrs-${selected.size > 0 ? "selected" : "filtered"}`, "PQR", exportRows(toExport)), disabled: toExport.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 me-1" }),
            " XLSX"
          ] })
        ] })
      ] }),
      selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
          selected.size,
          " selected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: busy, onClick: () => moveToTrash(Array.from(selected)), className: "text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5 me-1" }),
            " Move to trash"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setSelected(/* @__PURE__ */ new Set()), children: "Clear" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: filtered.length > 0 && filtered.every((r) => selected.has(r.id)), onCheckedChange: (c) => toggleAll(!!c) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "PQR No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Standard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Qualified" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Resulting WPS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-end font-medium px-5 py-2.5", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 9, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 9, children: "No PQRs match." }),
        filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selected.has(p.id), onCheckedChange: (c) => toggleOne(p.id, !!c) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium cursor-pointer", onClick: () => nav({
            to: "/app/pqrs/$pqrId",
            params: {
              pqrId: p.id
            }
          }), children: p.pqr_no }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.code_family }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.standard ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: RESULT_TONE[p.overall_result] ?? "", children: p.overall_result }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.qualification_date ? new Date(p.qualification_date).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.resulting_wps_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-success/10 text-success border-success/30", children: "Created" }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => nav({
              to: "/app/pqrs/$pqrId",
              params: {
                pqrId: p.id
              }
            }), "aria-label": "Open PQR", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive", disabled: busy, onClick: () => moveToTrash([p.id]), "aria-label": "Move to trash", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 ms-1 text-muted-foreground" })
          ] }) })
        ] }, p.id))
      ] })
    ] }) })
  ] });
}
function Sel({
  value,
  onChange,
  placeholder,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 rounded-md border border-input bg-background px-2 text-sm", value, onChange: (e) => onChange(e.target.value), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: placeholder }),
    options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
  ] });
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
  PqrsIndexPage as component
};
