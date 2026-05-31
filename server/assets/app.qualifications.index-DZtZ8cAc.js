import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, a as useNavigate, g as useQueryClient, T as TriangleAlert, L as Link, B as Button, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-Bb0rGCTW.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Bwb2_y48.js";
import { c as continuityBroken, d as deriveQualStatus } from "./qualification-status-CLO5y49_.js";
import { a as exportExcel } from "./export-BKxIOV_6.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { E as Eye } from "./eye-B2HBNUNp.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { D as Download } from "./download-BKvKMLMR.js";
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
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-MDeoBVHG.js";
import "./format-gAjFLL1B.js";
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
function QualificationsPage() {
  const {
    roles
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const canDelete = isAdmin || roles.includes("qa_qc_manager");
  const nav = useNavigate();
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  const {
    data,
    isLoading
  } = useCompanyRows("qualifications", {
    order: {
      column: "expiry_date",
      ascending: true
    }
  });
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [processFilter, setProcessFilter] = reactExports.useState("all");
  const [codeFilter, setCodeFilter] = reactExports.useState("all");
  const enriched = reactExports.useMemo(() => (data ?? []).map((r) => ({
    ...r,
    derived: deriveQualStatus(r),
    continuity_broken: continuityBroken(r.last_continuity_date)
  })), [data]);
  const processes = Array.from(new Set(enriched.map((r) => r.process).filter(Boolean)));
  const codes = Array.from(new Set(enriched.map((r) => r.code_family ?? r.standard).filter(Boolean)));
  const filtered = enriched.filter((r) => {
    if (statusFilter !== "all" && r.derived !== statusFilter) return false;
    if (processFilter !== "all" && r.process !== processFilter) return false;
    if (codeFilter !== "all" && (r.code_family ?? r.standard) !== codeFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (![r.welder_name, r.employee_id, r.wpq_number, r.stamp_number].filter(Boolean).some((v) => String(v).toLowerCase().includes(s))) return false;
    }
    return true;
  });
  const kpi = {
    total: enriched.length,
    active: enriched.filter((r) => r.derived === "Active").length,
    expiring: enriched.filter((r) => r.derived === "Expiring Soon").length,
    expired: enriched.filter((r) => r.derived === "Expired").length,
    continuityIssues: enriched.filter((r) => r.continuity_broken).length
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "Welder Qualifications", subtitle: "ASME Section IX WPQ certificates — issuance, expiry, continuity & verification.", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", children: "WPQ Dashboard" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", children: "Build WPQ" }) }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/trash", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 me-1" }),
      " Trash"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => exportExcel("welder-qualifications", "WPQ", filtered.map((r) => ({
      WPQ: r.wpq_number ?? "",
      Welder: r.welder_name,
      Employee: r.employee_id,
      Stamp: r.stamp_number ?? "",
      Process: r.process,
      Code: r.code_family ?? r.standard,
      Position: r.position_qualified ?? "",
      Expiry: r.expiry_date,
      Status: r.derived,
      "Last Continuity": r.last_continuity_date ?? ""
    }))), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 me-1" }),
      " Export"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "qualifications", title: "New welder qualification (WPQ)", trigger: "New WPQ", defaults: {
      status: "Active",
      code_family: "ASME IX",
      revision: "Rev 0"
    }, children: ({
      values,
      set
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Welder name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.welder_name ?? "", onChange: (e) => set("welder_name", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Employee ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.employee_id ?? "", onChange: (e) => set("employee_id", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "WPQ Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.wpq_number ?? "", onChange: (e) => set("wpq_number", e.target.value), placeholder: "WPQ-2026-001" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Stamp Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.stamp_number ?? "", onChange: (e) => set("stamp_number", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "WPS Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.wps_number ?? "", onChange: (e) => set("wps_number", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "PQR Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.pqr_number ?? "", onChange: (e) => set("pqr_number", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Process", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.process ?? "", onChange: (e) => set("process", e.target.value), placeholder: "GTAW" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Process Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.process_type ?? "", onChange: (e) => set("process_type", e.target.value), placeholder: "Manual" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Code Family", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 rounded-md border bg-transparent px-2 text-sm", value: values.code_family ?? "ASME IX", onChange: (e) => set("code_family", e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "ASME IX" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AWS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "EN ISO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AS/NZS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "JIS" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Standard / Edition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.standard ?? "", onChange: (e) => set("standard", e.target.value), placeholder: "ASME IX 2023" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.position_qualified ?? "", onChange: (e) => set("position_qualified", e.target.value), placeholder: "6G" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Test Coupon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.test_coupon_type ?? "", onChange: (e) => set("test_coupon_type", e.target.value), placeholder: "Pipe 6 in. Sch 80" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Qualification Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: values.qualification_date ?? "", onChange: (e) => set("qualification_date", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Expiry Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", required: true, value: values.expiry_date ?? "", onChange: (e) => set("expiry_date", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Result", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 rounded-md border bg-transparent px-2 text-sm", value: values.result ?? "Satisfactory", onChange: (e) => set("result", e.target.value), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Satisfactory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Unsatisfactory" })
      ] }) })
    ] }) })
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }), label: "Total Welders", value: kpi.total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-emerald-500" }), label: "Active", value: kpi.active }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-amber-500" }), label: "Expiring Soon", value: kpi.expiring }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-destructive" }), label: "Expired", value: kpi.expired }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-destructive" }), label: "Continuity Broken", value: kpi.continuityIssues })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "max-w-xs", placeholder: "Search welder, ID, WPQ, stamp…", value: search, onChange: (e) => setSearch(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { value: statusFilter, onChange: setStatusFilter, options: ["all", "Active", "Expiring Soon", "Expired", "Suspended"] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { value: processFilter, onChange: setProcessFilter, options: ["all", ...processes] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { value: codeFilter, onChange: setCodeFilter, options: ["all", ...codes] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "WPQ No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Welder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Process" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Position" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Expiry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Continuity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 10, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 10, children: "No qualifications match." }),
        filtered.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20 cursor-pointer", onClick: () => nav({
          to: "/app/qualifications/$qualId",
          params: {
            qualId: q.id
          }
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-mono text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/$qualId", params: {
            qualId: q.id
          }, className: "hover:text-primary", onClick: (e) => e.stopPropagation(), children: q.wpq_number ?? q.id.slice(0, 8) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/$qualId", params: {
            qualId: q.id
          }, className: "hover:text-primary", onClick: (e) => e.stopPropagation(), children: q.welder_name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: q.employee_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: q.process }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: q.code_family ?? q.standard }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: q.position_qualified ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: fmtEngDate(q.expiry_date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: q.continuity_broken ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-xs", children: "Broken" }) : q.last_continuity_date ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: fmtEngDate(q.last_continuity_date) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: q.derived }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/$qualId", params: {
                qualId: q.id
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "size-8", "aria-label": "Open certificate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Open certificate" })
            ] }),
            canDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "size-8 text-destructive hover:text-destructive", "aria-label": "Delete certificate", onClick: () => setDeleteId(q.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Move to Trash" })
            ] })
          ] }) })
        ] }, q.id))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Move WPQ to Trash?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This certificate will be soft-deleted and hidden from standard lists and reports. Super admins can restore it from Trash. The action is audit-logged." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: deleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { disabled: deleting, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", onClick: async (e) => {
          e.preventDefault();
          if (!deleteId) return;
          setDeleting(true);
          const {
            error
          } = await supabase.rpc("soft_delete_qualification", {
            _id: deleteId
          });
          setDeleting(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Moved to Trash.");
          setDeleteId(null);
          qc.invalidateQueries({
            queryKey: ["qualifications"]
          });
        }, children: deleting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Move to Trash" })
      ] })
    ] }) })
  ] });
}
function Kpi({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1", children: value })
  ] });
}
function Select({
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-9 rounded-md border bg-transparent px-2 text-sm", value, onChange: (e) => onChange(e.target.value), children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o === "all" ? "All" : o }, o)) });
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
  QualificationsPage as component
};
