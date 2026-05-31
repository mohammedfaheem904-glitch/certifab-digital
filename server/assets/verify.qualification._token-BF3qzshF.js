import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { U as Route, s as supabase } from "./router-DGN8uIPq.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { d as deriveQualStatus } from "./qualification-status-CLO5y49_.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./format-gAjFLL1B.js";
function VerifyQualificationPage() {
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
      } = await supabase.rpc("get_qualification_by_qr", {
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Certificate Not Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This QR code does not match any active qualification certificate." })
    ] }) });
  }
  const status = deriveQualStatus(data);
  const valid = status === "Active" || status === "Expiring Soon";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-muted/30 grid place-items-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 max-w-lg w-full space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      data.company_logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.company_logo_url, alt: data.company_name, className: "h-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: data.company_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Welder Qualification Verification" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-lg border p-4 ${valid ? "border-emerald-500/50 bg-emerald-500/5" : "border-destructive/50 bg-destructive/5"}`, children: [
      valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-8 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-8 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: valid ? "Certificate is currently valid" : "Certificate is not valid for production welding" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-[140px_1fr] gap-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Welder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium", children: data.welder_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Employee ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.employee_id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "WPQ No." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.wpq_number ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Process" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.process }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.code_family ?? data.standard }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Position" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.position_qualified ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Qualified On" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fmtEngDate(data.qualification_date) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Expires" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: fmtEngDate(data.expiry_date) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center", children: "Verified via Weld Yard digital certificate authority" })
  ] }) });
}
export {
  VerifyQualificationPage as component
};
