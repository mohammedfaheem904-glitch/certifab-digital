import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { Q as Route, s as supabase, T as TriangleAlert } from "./router-DGN8uIPq.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function VerifyWeld() {
  const {
    token
  } = Route.useParams();
  const [data, setData] = reactExports.useState(null);
  const [loaded, setLoaded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.from("welds").select("weld_no, welder_name, status, weld_date, drawing_ref, line_no, spool_no, joint_no, base_material, heat_number, filler_metal, joint_type, inspection_status").eq("qr_token", token).maybeSingle().then(({
      data: data2
    }) => {
      setData(data2);
      setLoaded(true);
    });
  }, [token]);
  const accepted = data?.status === "Accepted";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-background p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Weld Yard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Weld traceability verification" })
      ] })
    ] }),
    !loaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground text-center py-10", children: "Verifying…" }),
    loaded && !data && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-10 text-destructive mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Weld not found" })
    ] }),
    loaded && data && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border p-4 mb-5 ${accepted ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          accepted ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-5 text-warning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: data.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
          "Inspection: ",
          data.inspection_status ?? "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Weld No.", v: data.weld_no }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Welder", v: data.welder_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Date", v: data.weld_date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Drawing", v: data.drawing_ref ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Line / Spool / Joint", v: `${data.line_no ?? "—"} / ${data.spool_no ?? "—"} / ${data.joint_no ?? "—"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Base material", v: data.base_material ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Heat number", v: data.heat_number ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Filler metal", v: data.filler_metal ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Joint type", v: data.joint_type ?? "—" })
      ] })
    ] })
  ] }) });
}
function Row({
  k,
  v
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-border/60 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium text-end", children: v })
  ] });
}
export {
  VerifyWeld as component
};
