import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { a as useNavigate, g as useQueryClient, b as useAuth, B as Button, t as toast, s as supabase } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { b as bulkExportProceduresCsv, a as bulkExportProceduresXlsx } from "./wps-export-Cgb3CbaI.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem } from "./dropdown-menu-BGS54mDP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-Bb0rGCTW.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Bwb2_y48.js";
import { X } from "./x-CQcD6R0Y.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { E as Eye } from "./eye-B2HBNUNp.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { C as ChevronRight } from "./chevron-right-DA67_Mf_.js";
import { C as ChartColumn } from "./chart-column-CdgQTHSX.js";
import { D as Download } from "./download-BKvKMLMR.js";
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
import "./export-BKxIOV_6.js";
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
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-DH7MMPOO.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
function ProceduresPage() {
  const {
    data,
    isLoading
  } = useCompanyRows("procedures", {
    order: {
      column: "created_at"
    }
  });
  const [q, setQ] = reactExports.useState("");
  const [tab, setTab] = reactExports.useState("all");
  const nav = useNavigate();
  const qc = useQueryClient();
  const {
    roles
  } = useAuth();
  const canDelete = roles.includes("super_admin") || roles.includes("qa_qc_manager");
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [processFilter, setProcessFilter] = reactExports.useState("all");
  const [standardFilter, setStandardFilter] = reactExports.useState("all");
  const [sourceFilter, setSourceFilter] = reactExports.useState("all");
  const [positionFilter, setPositionFilter] = reactExports.useState("all");
  const all = data ?? [];
  const qualifiedAll = all.filter((p) => !!p.pqr_id);
  const legacyAll = all.filter((p) => !p.pqr_id);
  const pendingApproval = qualifiedAll.filter((p) => p.status === "Draft").length;
  const uniq = (arr) => Array.from(new Set(arr.filter((v) => !!v && String(v).trim() !== ""))).sort((a, b) => a.localeCompare(b));
  const statusOptions = reactExports.useMemo(() => uniq(all.map((p) => p.status)), [all]);
  const processOptions = reactExports.useMemo(() => uniq(all.map((p) => p.process)), [all]);
  const standardOptions = reactExports.useMemo(() => uniq(all.map((p) => p.standard)), [all]);
  const positionOptions = reactExports.useMemo(() => uniq(all.map((p) => p.position)), [all]);
  const scoped = tab === "qualified" ? qualifiedAll : tab === "legacy" ? legacyAll : all;
  const filtered = scoped.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (processFilter !== "all" && p.process !== processFilter) return false;
    if (standardFilter !== "all" && p.standard !== standardFilter) return false;
    if (positionFilter !== "all" && p.position !== positionFilter) return false;
    if (sourceFilter === "qualified" && !p.pqr_id) return false;
    if (sourceFilter === "manual" && !!p.pqr_id) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.code, p.standard, p.process, p.revision, p.status, p.pqr_no].filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });
  const activeFilters = [statusFilter !== "all" && {
    key: "status",
    label: `Status: ${statusFilter}`,
    clear: () => setStatusFilter("all")
  }, processFilter !== "all" && {
    key: "process",
    label: `Process: ${processFilter}`,
    clear: () => setProcessFilter("all")
  }, standardFilter !== "all" && {
    key: "standard",
    label: `Standard: ${standardFilter}`,
    clear: () => setStandardFilter("all")
  }, sourceFilter !== "all" && {
    key: "source",
    label: `Source: ${sourceFilter === "qualified" ? "Qualified by PQR" : "Manual"}`,
    clear: () => setSourceFilter("all")
  }, positionFilter !== "all" && {
    key: "position",
    label: `Position: ${positionFilter}`,
    clear: () => setPositionFilter("all")
  }].filter(Boolean);
  const clearAllFilters = () => {
    setStatusFilter("all");
    setProcessFilter("all");
    setStandardFilter("all");
    setSourceFilter("all");
    setPositionFilter("all");
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const {
      error
    } = await supabase.rpc("soft_delete_procedure", {
      _id: deleteId
    });
    setDeleting(false);
    if (error) {
      toast.error(error.message || "Failed to delete WPS");
      return;
    }
    toast.success("WPS moved to Trash");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["company-rows", "procedures"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "Procedures", subtitle: "Create, revise and approve WPS across ASME, EN ISO, AWS, AS/NZS and JIS.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => nav({
      to: "/app/procedures/dashboard"
    }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-4 me-1.5" }),
      " Dashboard"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 me-1.5" }),
        " Bulk Export"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => {
          bulkExportProceduresCsv(filtered, "wps-export");
          toast.success("CSV exported");
        }, children: "Export visible to CSV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: async () => {
          await bulkExportProceduresXlsx(filtered, "wps-export");
          toast.success("Excel exported");
        }, children: "Export visible to Excel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => {
          bulkExportProceduresCsv(data ?? [], "wps-all");
          toast.success("CSV exported");
        }, children: "Export all to CSV" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "procedures", quota: "procedures", title: "​Pre Welding Procedure Specification ( PWPS )", trigger: "New WPS", defaults: {
      revision: "Rev 0",
      status: "Draft"
    }, children: ({
      values,
      set
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Code", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.code ?? "", onChange: (e) => set("code", e.target.value), placeholder: "WPS-GTAW-042" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Standard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.standard ?? "", onChange: (e) => set("standard", e.target.value), placeholder: "ASME IX" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Process", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.process ?? "", onChange: (e) => set("process", e.target.value), placeholder: "GTAW" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Revision", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.revision ?? "", onChange: (e) => set("revision", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Thickness range", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.thickness_range ?? "", onChange: (e) => set("thickness_range", e.target.value), placeholder: "3–25 mm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Joint type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.joint_type ?? "", onChange: (e) => set("joint_type", e.target.value), placeholder: "Butt" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.position ?? "", onChange: (e) => set("position", e.target.value), placeholder: "6G" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Base material", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.base_material ?? "", onChange: (e) => set("base_material", e.target.value), placeholder: "P-No 1 Gr 1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Filler material", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.filler_material ?? "", onChange: (e) => set("filler_material", e.target.value), placeholder: "ER70S-2" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Shielding gas", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.shielding_gas ?? "", onChange: (e) => set("shielding_gas", e.target.value), placeholder: "Ar 100%" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Voltage min", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: values.voltage_min ?? "", onChange: (e) => set("voltage_min", parseFloat(e.target.value) || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Voltage max", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: values.voltage_max ?? "", onChange: (e) => set("voltage_max", parseFloat(e.target.value) || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Current min", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: values.current_min ?? "", onChange: (e) => set("current_min", parseFloat(e.target.value) || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Current max", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: values.current_max ?? "", onChange: (e) => set("current_max", parseFloat(e.target.value) || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Heat input min (kJ/mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: values.heat_input_min ?? "", onChange: (e) => set("heat_input_min", parseFloat(e.target.value) || null) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Heat input max (kJ/mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: values.heat_input_max ?? "", onChange: (e) => set("heat_input_max", parseFloat(e.target.value) || null) }) })
    ] }) })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex rounded-md border border-border bg-muted/30 p-0.5 text-xs", children: [{
        k: "all",
        label: `All (${all.length})`
      }, {
        k: "qualified",
        label: `Qualified (${qualifiedAll.length})`
      }, {
        k: "legacy",
        label: `Legacy (${legacyAll.length})`
      }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.k), className: `px-3 py-1.5 rounded ${tab === t.k ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`, children: t.label }, t.k)) }),
      pendingApproval > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs px-2 py-1 rounded border border-warning/30 bg-warning/10 text-warning", children: [
        pendingApproval,
        " qualified draft",
        pendingApproval > 1 ? "s" : "",
        " pending approval"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by code, standard, process, PQR…", value: q, onChange: (e) => setQ(e.target.value), className: "max-w-sm bg-background/60 ms-auto" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-b border-border flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Status", value: statusFilter, onChange: setStatusFilter, options: statusOptions }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Process", value: processFilter, onChange: setProcessFilter, options: processOptions }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Standard", value: standardFilter, onChange: setStandardFilter, options: standardOptions }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sourceFilter, onValueChange: setSourceFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[160px] text-xs bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Source" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All sources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "qualified", children: "Qualified by PQR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "manual", children: "Manual" })
        ] })
      ] }),
      positionOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(FilterSelect, { label: "Position", value: positionFilter, onChange: setPositionFilter, options: positionOptions }),
      activeFilters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: activeFilters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: f.clear, className: "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-border bg-muted/40 hover:bg-muted", children: [
          f.label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
        ] }, f.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", onClick: clearAllFilters, children: "Clear filters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ms-auto", children: [
        "Showing ",
        filtered.length,
        " of ",
        scoped.length
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Standard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Process" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Thickness" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Revision" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-end font-medium px-5 py-2.5", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 8, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 8, children: "No procedures in this tab." }),
        filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => nav({
          to: "/app/procedures/$procedureId",
          params: {
            procedureId: p.id
          }
        }), className: "border-t border-border/60 hover:bg-muted/20 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: p.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.standard }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.process }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.thickness_range }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.revision }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: p.pqr_id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full border border-success/30 bg-success/10 text-success", children: [
            "Qualified by ",
            p.pqr_no ?? "PQR"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Manual" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: (e) => {
                e.stopPropagation();
                nav({
                  to: "/app/procedures/$procedureId",
                  params: {
                    procedureId: p.id
                  }
                });
              }, "aria-label": "Open WPS", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Open WPS" })
            ] }),
            canDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive hover:text-destructive", onClick: () => setDeleteId(p.id), "aria-label": "Delete WPS", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Move to Trash" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 ms-1 text-muted-foreground" })
          ] }) })
        ] }, p.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Move WPS to Trash?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This procedure will be soft-deleted. Super admins can restore it from Trash. The action is recorded in the audit log." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: deleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          handleDelete();
        }, disabled: deleting, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: [
          deleting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin me-2" }) : null,
          "Move to Trash"
        ] })
      ] })
    ] }) })
  ] }) });
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
function FilterSelect({
  label,
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value, onValueChange: onChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[160px] text-xs bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: label }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", children: [
        "All ",
        label.toLowerCase()
      ] }),
      options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o, children: o }, o))
    ] })
  ] });
}
export {
  ProceduresPage as component
};
