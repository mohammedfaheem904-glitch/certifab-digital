import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, g as useQueryClient, T as TriangleAlert, B as Button, L as Link, t as toast, s as supabase } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { D as Dialog, b as DialogTrigger, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { a as exportExcel } from "./export-BKxIOV_6.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { D as Download } from "./download-BKvKMLMR.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
import "./check-DS8b9zeL.js";
import "./index-BlRkZP9l.js";
import "./index-BuCuGgC7.js";
import "./x-CQcD6R0Y.js";
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
function NcrsPage() {
  const {
    profile
  } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["ncrs", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("ncrs").select("*").eq("company_id", profile.company_id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const rows = (data ?? []).filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !`${r.ncr_no} ${r.title}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const open = rows.filter((r) => !["Closed", "Rejected"].includes(r.status)).length;
  const overdue = rows.filter((r) => r.due_date && (daysUntil(r.due_date) ?? 999) < 0 && !["Closed", "Rejected"].includes(r.status)).length;
  const critical = rows.filter((r) => r.severity === "Critical" && !["Closed", "Rejected"].includes(r.status)).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ModulePage, { title: "Non-Conformance Reports", subtitle: "Raise, investigate, and close NCRs with full root-cause and corrective-action workflow.", action: /* @__PURE__ */ jsxRuntimeExports.jsx(NewNcrDialog, { onDone: () => qc.invalidateQueries({
    queryKey: ["ncrs"]
  }) }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: ShieldAlert, label: "Open", value: open, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: "Overdue", value: overdue, tone: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: TriangleAlert, label: "Critical", value: critical, tone: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: ShieldAlert, label: "Total", value: rows.length, tone: "info" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex flex-wrap gap-2 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search NCR number or title…", value: search, onChange: (e) => setSearch(e.target.value), className: "max-w-sm h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44 h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["all", "Open", "Root Cause", "CA Pending", "In Review", "Closed", "Rejected"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s === "all" ? "All statuses" : s }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ms-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => exportExcel("ncrs", "NCRs", rows.map((r) => ({
        NCR: r.ncr_no,
        Title: r.title,
        Severity: r.severity,
        Status: r.status,
        "Due date": r.due_date,
        "Raised": r.created_at
      }))), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 me-1" }),
        " Export"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "NCR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Due" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Raised" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-10 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }) }) }),
        !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-10 text-center text-muted-foreground", children: "No NCRs." }) }),
        rows.map((r) => {
          const d = r.due_date ? daysUntil(r.due_date) : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/ncrs/$ncrId", params: {
              ncrId: r.id
            }, className: "hover:text-primary", children: r.ncr_no }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: r.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.severity ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: r.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-xs", children: [
              r.due_date ?? "—",
              d != null && d < 0 && !["Closed", "Rejected"].includes(r.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-2 text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive", children: [
                "Overdue ",
                Math.abs(d),
                "d"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-muted-foreground", children: new Date(r.created_at).toLocaleDateString() })
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
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children });
}
function NewNcrDialog({
  onDone
}) {
  const {
    profile,
    user
  } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [v, setV] = reactExports.useState({
    severity: "Medium",
    status: "Open"
  });
  const set = (k, val) => setV((s) => ({
    ...s,
    [k]: val
  }));
  const submit = async () => {
    if (!profile?.company_id || !v.title || !v.ncr_no) {
      toast.error("NCR number and title required.");
      return;
    }
    setBusy(true);
    const {
      error
    } = await supabase.from("ncrs").insert({
      ...v,
      company_id: profile.company_id,
      raised_by: user?.id ?? null
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("NCR raised.");
    setOpen(false);
    setV({
      severity: "Medium",
      status: "Open"
    });
    onDone();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 me-1" }),
      " Raise NCR"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Raise Non-Conformance Report" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "NCR number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.ncr_no ?? "", onChange: (e) => set("ncr_no", e.target.value), placeholder: "NCR-0231" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.title ?? "", onChange: (e) => set("title", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: v.description ?? "", onChange: (e) => set("description", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Severity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: v.severity, onValueChange: (x) => set("severity", x), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Low", "Medium", "High", "Critical"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Due date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: v.due_date ?? "", onChange: (e) => set("due_date", e.target.value) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Raise" })
      ] })
    ] })
  ] });
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
  NcrsPage as component
};
