import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { a as useNavigate, g as useQueryClient, b as useAuth, m as Route, B as Button, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { C as Checkbox } from "./checkbox-m8nfdtKo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-Bb0rGCTW.js";
import { W as WeldStatusBadge } from "./WeldStatusBadge-B_9QG7hG.js";
import { e as exportCsv, a as exportExcel } from "./export-BKxIOV_6.js";
import { X } from "./x-CQcD6R0Y.js";
import { D as Download } from "./download-BKvKMLMR.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { E as Eye } from "./eye-B2HBNUNp.js";
import { E as ExternalLink } from "./external-link-6vGs1pBo.js";
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
import "./useQuery-tHuwiQPC.js";
import "./UpgradePrompt-DXJce8Hm.js";
import "./arrow-up-right-SlsiFPJV.js";
import "./check-DS8b9zeL.js";
import "./lock-D0LQ0o4o.js";
import "./index-UZjKeKWi.js";
import "./index-QEgYe57T.js";
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
import "./shield-alert-Dr9D1Rqa.js";
import "./circle-x-CEG87Cnk.js";
import "./circle-check-DDw0jk-W.js";
import "./shield-check-BhHQurBT.js";
import "./octagon-alert-CjvTeUly.js";
import "./search-DlrNhFVp.js";
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
const WORKFLOW_STATUSES = ["Draft", "Pending Validation", "Awaiting Inspection", "NCR Open", "Ready for Release", "Approved", "Released", "Rejected", "Blocked"];
function WeldsPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const {
    roles,
    profile
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const {
    workflow
  } = Route.useSearch();
  const {
    data,
    isLoading
  } = useCompanyRows("welds", {
    order: {
      column: "weld_date"
    },
    realtime: true
  });
  const projects = useCompanyRows("projects");
  const procs = useCompanyRows("procedures");
  const qualifications = useCompanyRows("qualifications");
  const [statusFilter, setStatusFilter] = reactExports.useState(workflow ?? "all");
  const [projectFilter, setProjectFilter] = reactExports.useState("all");
  const [wpsFilter, setWpsFilter] = reactExports.useState("all");
  const [welderFilter, setWelderFilter] = reactExports.useState("all");
  const [resultFilter, setResultFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (workflow && workflow !== statusFilter) setStatusFilter(workflow);
  }, [workflow]);
  const projectName = (id) => projects.data?.find((p) => p.id === id)?.code ?? "—";
  const procCode = (id) => procs.data?.find((p) => p.id === id)?.code ?? "—";
  const welders = reactExports.useMemo(() => {
    const fromQuals = (qualifications.data ?? []).map((q) => q.welder_name).filter(Boolean);
    const fromWelds = (data ?? []).map((w) => w.welder_name).filter(Boolean);
    return Array.from(/* @__PURE__ */ new Set([...fromQuals, ...fromWelds])).sort();
  }, [qualifications.data, data]);
  const results = reactExports.useMemo(() => Array.from(new Set((data ?? []).map((r) => r.status).filter(Boolean))).sort(), [data]);
  const filtered = (data ?? []).filter((r) => (statusFilter === "all" || (r.workflow_status ?? "Draft") === statusFilter) && (projectFilter === "all" || r.project_id === projectFilter) && (wpsFilter === "all" || r.procedure_id === wpsFilter) && (welderFilter === "all" || r.welder_name === welderFilter) && (resultFilter === "all" || r.status === resultFilter));
  const hasFilters = statusFilter !== "all" || projectFilter !== "all" || wpsFilter !== "all" || welderFilter !== "all" || resultFilter !== "all";
  const clearFilters = () => {
    setStatusFilter("all");
    setProjectFilter("all");
    setWpsFilter("all");
    setWelderFilter("all");
    setResultFilter("all");
  };
  const toggleAll = (checked) => setSelected(checked ? new Set(filtered.map((r) => r.id)) : /* @__PURE__ */ new Set());
  const toggleOne = (id, checked) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
  };
  const exportRows = (rows) => rows.map((r) => ({
    "Weld No": r.weld_no,
    Project: projectName(r.project_id),
    WPS: procCode(r.procedure_id),
    Welder: r.welder_name ?? "",
    Date: r.weld_date,
    "Joint No": r.joint_no ?? "",
    "Spool No": r.spool_no ?? "",
    "Line No": r.line_no ?? "",
    "Drawing Ref": r.drawing_ref ?? "",
    "Joint Type": r.joint_type ?? "",
    "Base Material": r.base_material ?? "",
    "Filler Metal": r.filler_metal ?? "",
    "Heat Input": r.heat_input ?? "",
    Workflow: r.workflow_status ?? "Draft",
    Result: r.status,
    "Inspection Status": r.inspection_status ?? ""
  }));
  const toExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;
  const moveToTrash = async (ids) => {
    if (!confirm(`Move ${ids.length} weld${ids.length > 1 ? "s" : ""} to trash?`)) return;
    setBusy(true);
    const results2 = await Promise.all(ids.map((id) => supabase.rpc("soft_delete_weld", {
      _id: id
    })));
    setBusy(false);
    const errs = results2.filter((r) => r.error);
    if (errs.length) toast.error(`Failed for ${errs.length}: ${errs[0].error.message}`);
    else toast.success(`Moved ${ids.length} to trash.`);
    setSelected(/* @__PURE__ */ new Set());
    qc.invalidateQueries({
      queryKey: ["welds", profile?.company_id]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "Weld Traceability Log", subtitle: "Every weld linked to its WPS, welder, project, joint and inspection result.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "size-4 me-1" }),
      " Dashboard"
    ] }) }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds/trash", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 me-1" }),
      " Trash"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { quota: "welds", table: "welds", title: "Log a weld", trigger: "Log Weld", defaults: {
      status: "Pending",
      weld_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    }, children: ({
      values,
      set
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Weld No.*", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.weld_no ?? "", onChange: (e) => set("weld_no", e.target.value), placeholder: "WL-2410-0500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: values.weld_date ?? "", onChange: (e) => set("weld_date", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Project", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: values.project_id ?? "", onValueChange: (v) => set("project_id", v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select project" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: projects.data?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: p.id, children: [
          p.code,
          " — ",
          p.name
        ] }, p.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "WPS", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: values.procedure_id ?? "", onValueChange: (v) => set("procedure_id", v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select WPS" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: procs.data?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.code }, p.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(F, { label: "Welder", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: values.welder_name && values.welder_name !== "__other__" ? values.welder_name : values._welder_mode === "other" ? "__other__" : "", onValueChange: (v) => {
          if (v === "__other__") {
            set("_welder_mode", "other");
            set("welder_name", "");
          } else {
            set("_welder_mode", "list");
            set("welder_name", v);
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select welder" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            welders.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: w, children: w }, w)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__other__", children: "— Other (type name) —" })
          ] })
        ] }),
        values._welder_mode === "other" && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", value: values.welder_name ?? "", onChange: (e) => set("welder_name", e.target.value), placeholder: "Welder name" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Drawing ref", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.drawing_ref ?? "", onChange: (e) => set("drawing_ref", e.target.value), placeholder: "DWG-PIP-001" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Line no.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.line_no ?? "", onChange: (e) => set("line_no", e.target.value), placeholder: "L-101-A1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Spool no.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.spool_no ?? "", onChange: (e) => set("spool_no", e.target.value), placeholder: "SP-014" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Joint no.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.joint_no ?? "", onChange: (e) => set("joint_no", e.target.value), placeholder: "J-08" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Joint type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: values.joint_type ?? "", onValueChange: (v) => set("joint_type", v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Butt", "Fillet", "Socket", "Branch", "Lap"].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: j, children: j }, j)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Base material", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.base_material ?? "", onChange: (e) => set("base_material", e.target.value), placeholder: "ASTM A106 Gr B" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Heat number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.heat_number ?? "", onChange: (e) => set("heat_number", e.target.value), placeholder: "H-23901" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Filler metal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.filler_metal ?? "", onChange: (e) => set("filler_metal", e.target.value), placeholder: "ER70S-6 / E7018" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Heat input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.heat_input ?? "", onChange: (e) => set("heat_input", e.target.value), placeholder: "1.42 kJ/mm" }) })
    ] }) })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: statusFilter, onChange: setStatusFilter, placeholder: "All workflow", width: "w-[170px]", options: [{
          value: "all",
          label: "All workflow"
        }, ...WORKFLOW_STATUSES.map((s) => ({
          value: s,
          label: s
        }))] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: projectFilter, onChange: setProjectFilter, placeholder: "All projects", width: "w-[150px]", options: [{
          value: "all",
          label: "All projects"
        }, ...(projects.data ?? []).map((p) => ({
          value: p.id,
          label: p.code
        }))] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: wpsFilter, onChange: setWpsFilter, placeholder: "All WPS", width: "w-[150px]", options: [{
          value: "all",
          label: "All WPS"
        }, ...(procs.data ?? []).map((p) => ({
          value: p.id,
          label: p.code
        }))] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: welderFilter, onChange: setWelderFilter, placeholder: "All welders", width: "w-[170px]", options: [{
          value: "all",
          label: "All welders"
        }, ...welders.map((w) => ({
          value: w,
          label: w
        }))] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sel, { value: resultFilter, onChange: setResultFilter, placeholder: "All results", width: "w-[140px]", options: [{
          value: "all",
          label: "All results"
        }, ...results.map((r) => ({
          value: r,
          label: r
        }))] }),
        hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 me-1" }),
          " Clear"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Showing ",
            filtered.length,
            " of ",
            data?.length ?? 0
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportCsv(`welds-${selected.size > 0 ? "selected" : "filtered"}`, exportRows(toExport)), disabled: toExport.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 me-1" }),
            " CSV"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportExcel(`welds-${selected.size > 0 ? "selected" : "filtered"}`, "Welds", exportRows(toExport)), disabled: toExport.length === 0, children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Weld No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Project" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "WPS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Joint / Spool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Welder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Workflow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-end font-medium px-5 py-2.5", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 10, className: "px-5 py-10 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "px-5 py-10 text-center text-muted-foreground", children: "No welds match your filters." }) }),
        filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selected.has(r.id), onCheckedChange: (c) => toggleOne(r.id, !!c) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium text-primary cursor-pointer", onClick: () => nav({
            to: "/app/welds/$weldId",
            params: {
              weldId: r.id
            }
          }), children: r.weld_no }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: projectName(r.project_id) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: procCode(r.procedure_id) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-xs text-muted-foreground", children: [
            r.joint_no ?? "—",
            " / ",
            r.spool_no ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: r.welder_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: r.weld_date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeldStatusBadge, { status: r.workflow_status ?? "Draft" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", "aria-label": "View weld details", onClick: (e) => {
                e.stopPropagation();
                nav({
                  to: "/app/welds/$weldId",
                  params: {
                    weldId: r.id
                  }
                });
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "View weld details" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", "aria-label": "Open weld", onClick: (e) => {
                e.stopPropagation();
                nav({
                  to: "/app/welds/$weldId",
                  params: {
                    weldId: r.id
                  }
                });
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Open weld" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive", disabled: busy, "aria-label": "Move to trash", onClick: (e) => {
                e.stopPropagation();
                moveToTrash([r.id]);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Move to trash" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 ms-1 text-muted-foreground" })
          ] }) })
        ] }, r.id))
      ] })
    ] }) })
  ] }) });
}
function Sel({
  value,
  onChange,
  placeholder,
  options,
  width = "w-[150px]"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value, onValueChange: onChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: `h-9 ${width}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
  ] });
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
  WeldsPage as component
};
