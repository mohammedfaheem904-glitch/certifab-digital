import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { b as useAuth, s as supabase, B as Button } from "./router-DGN8uIPq.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle } from "./sheet-KIz9GboM.js";
import { a as exportExcel } from "./export-BKxIOV_6.js";
import { f as formatDistanceToNow } from "./format-gAjFLL1B.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-CPXneq8K.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { E as Eye } from "./eye-B2HBNUNp.js";
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
function AuditPage() {
  const {
    profile
  } = useAuth();
  const [table, setTable] = reactExports.useState("all");
  const [action, setAction] = reactExports.useState("all");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(null);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["audit", profile?.company_id, table, action, from, to],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      let q = supabase.from("audit_logs").select("*").order("created_at", {
        ascending: false
      }).limit(500);
      if (table !== "all") q = q.eq("table_name", table);
      if (action !== "all") q = q.eq("action", action);
      if (from) q = q.gte("created_at", from);
      if (to) q = q.lte("created_at", to + "T23:59:59");
      const {
        data: data2,
        error
      } = await q;
      if (error) throw error;
      return data2;
    }
  });
  const rows = data ?? [];
  reactExports.useMemo(() => Array.from(new Set(rows.map((r) => r.table_name))), [rows]);
  const handleExport = () => exportExcel("audit-log", "Audit", rows.map((r) => ({
    Time: new Date(r.created_at).toLocaleString(),
    Table: r.table_name,
    Action: r.action,
    RecordId: r.record_id,
    ActorId: r.actor_id
  })));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Audit Log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Centralized, tamper-evident trail of all data changes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleExport, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "size-4 me-1" }),
        " Export Excel"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Module" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: table, onValueChange: setTable, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All modules" }),
            ["procedures", "qualifications", "welds", "inspections", "equipment", "instruments", "instrument_calibrations", "projects"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: action, onValueChange: setAction, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "INSERT", children: "INSERT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "UPDATE", children: "UPDATE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DELETE", children: "DELETE" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "When" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Module" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Record" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children: "Actor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-2.5" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "px-5 py-10 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
          " Loading…"
        ] }) }),
        !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-5 py-10 text-center text-muted-foreground", children: "No audit entries match these filters." }) }),
        rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-muted-foreground", children: formatDistanceToNow(r.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: r.table_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${r.action === "DELETE" ? "bg-destructive/10 text-destructive" : r.action === "UPDATE" ? "bg-info/10 text-info" : "bg-success/10 text-success"}`, children: r.action }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs font-mono text-muted-foreground", children: r.record_id?.slice(0, 8) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs font-mono text-muted-foreground", children: r.actor_id?.slice(0, 8) ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setOpen(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }) })
        ] }, r.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!open, onOpenChange: (o) => !o && setOpen(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "w-[600px] sm:max-w-[600px] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { children: [
        open?.table_name,
        " · ",
        open?.action
      ] }) }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-1 text-muted-foreground", children: "Before" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-3 rounded bg-muted/40 overflow-x-auto", children: JSON.stringify(open.before, null, 2) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-1 text-muted-foreground", children: "After" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-3 rounded bg-muted/40 overflow-x-auto", children: JSON.stringify(open.after, null, 2) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AuditPage as component
};
