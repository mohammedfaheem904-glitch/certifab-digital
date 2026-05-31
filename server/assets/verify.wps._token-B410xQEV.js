import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { P as Route, s as supabase } from "./router-DGN8uIPq.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function VerifyWpsPage() {
  const {
    token
  } = Route.useParams();
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: data2,
        error
      } = await supabase.rpc("get_wps_by_qr", {
        _token: token
      });
      if (!error && data2 && data2[0]) setData(data2[0]);
      setLoading(false);
    })();
  }, [token]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" }) });
  }
  if (!data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 max-w-md text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-10 mx-auto text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "WPS Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This QR code does not match any active Welding Procedure Specification." })
    ] }) });
  }
  const valid = data.status === "Approved";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-muted/30 grid place-items-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 max-w-lg w-full space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      data.company_logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.company_logo_url, alt: data.company_name, className: "h-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: data.company_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "WPS Document Verification" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-lg border p-4 ${valid ? "border-emerald-500/50 bg-emerald-500/5" : "border-amber-500/50 bg-amber-500/5"}`, children: [
      valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-8 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-8 text-amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: data.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: valid ? "Procedure is approved for production" : "Procedure not yet approved for production" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-[140px_1fr] gap-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "WPS Code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium", children: data.code }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "WPS No." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.wps_no ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Supporting PQR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.pqr_no ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Document No." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.document_no ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Process" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.process }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Standard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.standard }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Groove" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.groove_type ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Position" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.position_qualified ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Revision" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.revision }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Effective" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.wps_date ? fmtEngDate(data.wps_date) : "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center", children: "Verified via Weld Yard digital certificate authority" })
  ] }) });
}
export {
  VerifyWpsPage as component
};
