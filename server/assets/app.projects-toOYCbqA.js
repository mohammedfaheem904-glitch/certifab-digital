import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { M as ModulePage } from "./ModulePage-DJ6DAyl1.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { N as NewRecordDialog } from "./NewRecordDialog-DtCuwNfh.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-DGN8uIPq.js";
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
function ProjectsPage() {
  const {
    data,
    isLoading
  } = useCompanyRows("projects", {
    order: {
      column: "created_at"
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ModulePage, { title: "Projects", subtitle: "Master data for every fabrication and field-welding project.", action: /* @__PURE__ */ jsxRuntimeExports.jsx(NewRecordDialog, { table: "projects", title: "New project", trigger: "New Project", quota: "projects", defaults: {
    status: "Active"
  }, children: ({
    values,
    set
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Code", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.code ?? "", onChange: (e) => set("code", e.target.value), placeholder: "PRJ-001" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: values.name ?? "", onChange: (e) => set("name", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Client", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.client ?? "", onChange: (e) => set("client", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Location", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: values.location ?? "", onChange: (e) => set("location", e.target.value) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: values.description ?? "", onChange: (e) => set("description", e.target.value), placeholder: "Scope, deliverables, notes…" }) })
  ] }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Client" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Empty, { colSpan: 6, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }),
        " Loading…"
      ] }),
      !isLoading && (data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { colSpan: 6, children: "No projects yet." }),
      data?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60 hover:bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: p.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: p.client }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: p.location }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground max-w-[320px] truncate", title: p.description ?? "", children: p.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status }) })
      ] }, p.id))
    ] })
  ] }) }) });
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
  ProjectsPage as component
};
