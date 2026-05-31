import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, a as useNavigate, g as useQueryClient, B as Button, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { U as Undo2 } from "./undo-2--cZR7gWA.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./plus-qnEZmAjm.js";
function TrashPage() {
  const {
    roles,
    profile
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const nav = useNavigate();
  const qc = useQueryClient();
  const [rows, setRows] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(null);
  const load = async () => {
    if (!profile?.company_id) return;
    setRows(null);
    const {
      data,
      error
    } = await supabase.from("welds").select("id, weld_no, welder_name, weld_date, workflow_status, status, deleted_at").eq("company_id", profile.company_id).not("deleted_at", "is", null).order("deleted_at", {
      ascending: false
    });
    if (error) {
      toast.error(error.message);
      setRows([]);
      return;
    }
    setRows(data ?? []);
  };
  reactExports.useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, profile?.company_id]);
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Welds Trash", subtitle: "Restricted to super admins.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "You don't have permission to view the welds trash." }) });
  }
  const restore = async (id) => {
    setBusy(id);
    const {
      error
    } = await supabase.rpc("restore_weld", {
      _id: id
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Restored.");
    qc.invalidateQueries({
      queryKey: ["welds"]
    });
    load();
  };
  const hardDelete = async (id) => {
    if (!confirm("Permanently delete? This cannot be undone.")) return;
    setBusy(id);
    const {
      error
    } = await supabase.from("welds").delete().eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Permanently deleted.");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Welds Trash", subtitle: "Soft-deleted welds. Restore to return them to the active log.", action: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 me-1" }),
    " Back to Weld Log"
  ] }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Weld No." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Welder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Workflow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Result" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Deleted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { className: "text-end pe-5", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
      rows === null && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 7, className: "px-5 py-10 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
        " Loading…"
      ] }) }),
      rows && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-5 py-10 text-center text-muted-foreground", children: "Trash is empty." }) }),
      rows?.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-mono text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
          to: "/app/welds/$weldId",
          params: {
            weldId: r.id
          }
        }), className: "hover:text-primary", children: r.weld_no }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: r.welder_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: r.weld_date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: r.workflow_status ?? "Draft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: r.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: fmtEngDate(r.deleted_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pe-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: busy === r.id, onClick: () => restore(r.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "size-3.5 me-1" }),
            " Restore"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: busy === r.id, onClick: () => hardDelete(r.id), className: "text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5 me-1" }),
            " Delete"
          ] })
        ] }) })
      ] }, r.id))
    ] })
  ] }) }) });
}
function Th({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `text-start font-medium px-5 py-2.5 ${className}`, children });
}
export {
  TrashPage as component
};
