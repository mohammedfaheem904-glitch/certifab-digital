import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, a as useNavigate, g as useQueryClient, B as Button, j as cn, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { C as Checkbox } from "./checkbox-m8nfdtKo.js";
import { P as PWPS_STATUS_TONE } from "./pwps-workflow-DrDpx5k6.js";
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
const STATUSES = ["Draft", "Under Qualification", "Testing", "Pending Validation", "Qualified", "Rejected", "Converted"];
function PwpsIndexPage() {
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
  const [fCode, setFCode] = reactExports.useState("");
  const [fProcess, setFProcess] = reactExports.useState("");
  const [fPosition, setFPosition] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [busy, setBusy] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["pwps", cid],
    enabled: !!cid,
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pwps").select("*").eq("company_id", cid).is("deleted_at", null).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const allRows = data ?? [];
  const codes = reactExports.useMemo(() => Array.from(new Set(allRows.map((r) => r.code_family).filter(Boolean))), [allRows]);
  const processes = reactExports.useMemo(() => Array.from(new Set(allRows.map((r) => r.process).filter(Boolean))), [allRows]);
  const positions = reactExports.useMemo(() => Array.from(new Set(allRows.map((r) => r.position).filter(Boolean))), [allRows]);
  const filtered = allRows.filter((p) => {
    if (fStatus && p.status !== fStatus) return false;
    if (fCode && p.code_family !== fCode) return false;
    if (fProcess && p.process !== fProcess) return false;
    if (fPosition && p.position !== fPosition) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.pwps_no, p.title, p.standard, p.process, p.status, p.code_family].filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });
  const hasFilters = !!(fStatus || fCode || fProcess || fPosition);
  const clearFilters = () => {
    setFStatus("");
    setFCode("");
    setFProcess("");
    setFPosition("");
  };
  const toggleAll = (checked) => setSelected(checked ? new Set(filtered.map((r) => r.id)) : /* @__PURE__ */ new Set());
  const toggleOne = (id, checked) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
  };
  const exportRows = (rows) => rows.map((r) => ({
    "pWPS No": r.pwps_no,
    Title: r.title ?? "",
    Revision: r.revision,
    Status: r.status,
    Code: r.code_family,
    Standard: r.standard ?? "",
    Process: r.process ?? "",
    Position: r.position ?? "",
    "Base Material": r.base_material ?? "",
    Created: new Date(r.created_at).toISOString().slice(0, 10)
  }));
  const toExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;
  const moveToTrash = async (ids) => {
    if (!confirm(`Move ${ids.length} record${ids.length > 1 ? "s" : ""} to trash?`)) return;
    setBusy(true);
    const results = await Promise.all(ids.map((id) => supabase.rpc("soft_delete_pwps", {
      _id: id
    })));
    setBusy(false);
    const errs = results.filter((r) => r.error);
    if (errs.length) toast.error(`Failed for ${errs.length} record(s): ${errs[0].error.message}`);
    else toast.success(`Moved ${ids.length} to trash.`);
    setSelected(/* @__PURE__ */ new Set());
    qc.invalidateQueries({
      queryKey: ["pwps", cid]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "Preliminary WPS (pWPS)", subtitle: "Candidate welding procedures undergoing qualification. A pWPS becomes a production WPS only after a PQR passes.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pwps/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "size-4 me-1" }),
      " Dashboard"
    ] }) }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pwps/trash", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 me-1" }),
      " Trash"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "pwps", title: "New Preliminary WPS", trigger: "New pWPS", defaults: {
      revision: "Rev 0",
      status: "Draft",
      code_family: "ASME IX"
    }, children: ({
      values,
      set
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "pWPS number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.pwps_no ?? "", onChange: (e) => set("pwps_no", e.target.value), placeholder: "pWPS-GTAW-001" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.title ?? "", onChange: (e) => set("title", e.target.value), placeholder: "GTAW root + SMAW fill, P-1 to P-1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Code family", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.code_family ?? "ASME IX", onChange: (e) => set("code_family", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Standard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.standard ?? "", onChange: (e) => set("standard", e.target.value), placeholder: "ASME IX 2023" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Process", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.process ?? "", onChange: (e) => set("process", e.target.value), placeholder: "GTAW" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Joint type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.joint_type ?? "", onChange: (e) => set("joint_type", e.target.value), placeholder: "Butt" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Groove type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.groove_type ?? "", onChange: (e) => set("groove_type", e.target.value), placeholder: "V" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.position ?? "", onChange: (e) => set("position", e.target.value), placeholder: "6G" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Base material", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.base_material ?? "", onChange: (e) => set("base_material", e.target.value), placeholder: "SA-106 Gr B" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "P-Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.p_number ?? "", onChange: (e) => set("p_number", e.target.value), placeholder: "P-1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Group No.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.group_number ?? "", onChange: (e) => set("group_number", e.target.value), placeholder: "1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Filler classification", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.filler_classification ?? "", onChange: (e) => set("filler_classification", e.target.value), placeholder: "ER70S-2" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Thickness min (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: values.thickness_min_mm ?? "", onChange: (e) => set("thickness_min_mm", parseFloat(e.target.value) || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Thickness max (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: values.thickness_max_mm ?? "", onChange: (e) => set("thickness_max_mm", parseFloat(e.target.value) || null) }) })
    ] }) })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by number, title, process…", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-xs bg-background/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fStatus, onChange: setFStatus, placeholder: "All statuses", options: STATUSES }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fCode, onChange: setFCode, placeholder: "All codes", options: codes }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fProcess, onChange: setFProcess, placeholder: "All processes", options: processes }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: fPosition, onChange: setFPosition, placeholder: "All positions", options: positions }),
        hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 me-1" }),
          " Clear"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportCsv(`pwps-${selected.size > 0 ? "selected" : "filtered"}`, exportRows(toExport)), disabled: toExport.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 me-1" }),
            " CSV"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportExcel(`pwps-${selected.size > 0 ? "selected" : "filtered"}`, "pWPS", exportRows(toExport)), disabled: toExport.length === 0, children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "pWPS No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Process" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Position" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Revision" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-end font-medium px-5 py-2.5", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 9, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 9, children: "No preliminary WPS match." }),
        filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selected.has(p.id), onCheckedChange: (c) => toggleOne(p.id, !!c) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium cursor-pointer", onClick: () => nav({
            to: "/app/pwps/$pwpsId",
            params: {
              pwpsId: p.id
            }
          }), children: p.pwps_no }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.title ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.code_family }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.process ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.position ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.revision }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", PWPS_STATUS_TONE[p.status] ?? ""), children: p.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => nav({
              to: "/app/pwps/$pwpsId",
              params: {
                pwpsId: p.id
              }
            }), "aria-label": "Open pWPS", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }),
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
  PwpsIndexPage as component
};
