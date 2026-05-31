import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { V as Route, s as supabase, T as TriangleAlert } from "./router-DGN8uIPq.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function VerifyInstrument() {
  const {
    token
  } = Route.useParams();
  const [data, setData] = reactExports.useState(null);
  const [loaded, setLoaded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: data2,
        error
      } = await supabase.rpc("get_instrument_by_qr", {
        _token: token
      });
      if (!error && data2 && data2[0]) setData(data2[0]);
      setLoaded(true);
    })();
  }, [token]);
  const d = daysUntil(data?.calibration_due);
  const valid = data && d != null && d >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center bg-background p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Weld Yard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Instrument calibration verification" })
      ] })
    ] }),
    !loaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground text-center py-10", children: "Verifying…" }),
    loaded && !data && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-10 text-destructive mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Instrument not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "This QR code is invalid or has been revoked." })
    ] }),
    loaded && data && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border p-4 mb-5 ${valid ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-5 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: valid ? "Calibration valid" : "Calibration expired" })
        ] }),
        data.calibration_due && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: valid ? `Valid until ${data.calibration_due} (${d}d remaining)` : `Expired on ${data.calibration_due}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Asset ID", v: data.asset_id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Name", v: data.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Category", v: data.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Model", v: data.model ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Serial", v: data.serial_number ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Manufacturer", v: data.manufacturer ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { k: "Status", v: data.status })
      ] })
    ] })
  ] }) });
}
function Field({
  k,
  v
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-border/60 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium text-end", children: v })
  ] });
}
export {
  VerifyInstrument as component
};
