import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { s as supabase, a4 as Route, a as useNavigate, b as useAuth, g as useQueryClient, B as Button, L as Link, t as toast } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BSpN8byK.js";
import { S as Skeleton } from "./skeleton-DxehOMK1.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { F as FileUploader } from "./FileUploader-DKjT1GVP.js";
import { D as Dialog, b as DialogTrigger, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { a as exportExcel } from "./export-BKxIOV_6.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { Q as QrCode } from "./qr-code-BAr1PEWv.js";
import { C as Calendar } from "./calendar-D4TonfkD.js";
import { D as Download } from "./download-BKvKMLMR.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import { E as ExternalLink } from "./external-link-6vGs1pBo.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-DH7MMPOO.js";
import "./index-Df5iUNGq.js";
import "./index-BuCuGgC7.js";
import "./index-BlRkZP9l.js";
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
async function signedUrl(bucket, path, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
function InstrumentDetail() {
  const {
    instrumentId
  } = Route.useParams();
  const nav = useNavigate();
  const {
    profile
  } = useAuth();
  const qc = useQueryClient();
  const inst = useQuery({
    queryKey: ["instrument", instrumentId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("instruments").select("*").eq("id", instrumentId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const cals = useQuery({
    queryKey: ["instrument_calibrations", instrumentId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("instrument_calibrations").select("*").eq("instrument_id", instrumentId).order("calibrated_on", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const events = useQuery({
    queryKey: ["instrument_events", instrumentId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("instrument_events").select("*").eq("instrument_id", instrumentId).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  if (inst.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
    ] });
  }
  if (!inst.data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Instrument not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", onClick: () => nav({
        to: "/app/instruments"
      }), children: "Back to instruments" })
    ] });
  }
  const i = inst.data;
  const due = daysUntil(i.calibration_due);
  const status = due == null ? {
    label: "—",
    tone: "muted"
  } : due < 0 ? {
    label: `Overdue ${Math.abs(due)}d`,
    tone: "destructive"
  } : due <= 7 ? {
    label: `Due in ${due}d`,
    tone: "destructive"
  } : due <= 30 ? {
    label: `Due in ${due}d`,
    tone: "warning"
  } : {
    label: `${due}d remaining`,
    tone: "success"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/instruments", className: "hover:text-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
        " Instruments"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: i.asset_id })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: i.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: i.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: status.tone === "destructive" ? "bg-destructive/10 text-destructive border-destructive/30" : status.tone === "warning" ? "bg-warning/10 text-warning border-warning/30" : status.tone === "success" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground", variant: "outline", children: status.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
            "Asset ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: i.asset_id }),
            " · Serial ",
            i.serial_number ?? "—",
            " · ",
            i.manufacturer ?? ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/verify/instrument/$token", params: {
            token: i.qr_token
          }, target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "size-4 me-1" }),
            " QR Verify"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogCalibrationDialog, { instrumentId, onDone: () => {
            cals.refetch();
            qc.invalidateQueries({
              queryKey: ["instrument", instrumentId]
            });
          } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Model", value: i.model ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Status", value: i.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Calibration due", value: i.calibration_due ?? "—", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Last calibrated", value: cals.data?.[0]?.calibrated_on ?? "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "calibrations", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "calibrations", children: "Calibrations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "activity", children: "Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "upload", children: "Documents" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "calibrations", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Calibration history" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: !cals.data?.length, onClick: () => exportExcel(`${i.asset_id}-calibrations`, "Calibrations", (cals.data ?? []).map((c) => ({
            Date: c.calibrated_on,
            "Performed by": c.performed_by,
            "Next due": c.next_due,
            Notes: c.notes
          }))), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 me-1" }),
            " Export"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Performed by" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Next due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Certificate" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            cals.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-8 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline" }) }) }),
            !cals.isLoading && (cals.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10 text-center text-muted-foreground", children: "No calibrations recorded." }) }),
            cals.data?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: c.calibrated_on }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: c.performed_by ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: c.next_due ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground text-xs", children: c.notes ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CertCell, { path: c.certificate_path }) })
            ] }, c.id))
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "activity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-4", children: "Activity timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "relative border-s border-border ms-2 space-y-4", children: [
          (events.data ?? []).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ms-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: e.kind.replace("_", " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(e.created_at).toLocaleString() }),
            e.payload && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 text-[11px] bg-muted/40 rounded p-2 overflow-x-auto", children: JSON.stringify(e.payload, null, 2) })
          ] }, e.id)),
          (events.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No activity yet." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "upload", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileUploader, { bucket: "instrument-files", folder: `${instrumentId}/docs`, table: "instrument_calibrations", recordIdColumn: "instrument_id", recordId: instrumentId, hint: "Drag certificates, manuals, photos." }) })
    ] })
  ] });
}
function Stat({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 inline-flex items-center gap-1.5 text-sm font-medium", children: [
      icon,
      value
    ] })
  ] });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children });
}
function CertCell({
  path
}) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!path) return;
    signedUrl("instrument-files", path).then(setUrl).catch(() => {
    });
  }, [path]);
  if (!path) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: url ?? "#", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 text-xs text-primary hover:underline", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }),
    " View ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3" })
  ] });
}
function LogCalibrationDialog({
  instrumentId,
  onDone
}) {
  const {
    profile,
    user
  } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [calibratedOn, setCalibratedOn] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [nextDue, setNextDue] = reactExports.useState("");
  const [performedBy, setPerformedBy] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const submit = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    let certPath = null;
    if (file) {
      const path = `${profile.company_id}/${instrumentId}/cert-${Date.now()}-${file.name}`;
      const {
        error: error2
      } = await supabase.storage.from("instrument-files").upload(path, file);
      if (error2) {
        toast.error(error2.message);
        setBusy(false);
        return;
      }
      certPath = path;
    }
    const {
      error
    } = await supabase.from("instrument_calibrations").insert({
      company_id: profile.company_id,
      instrument_id: instrumentId,
      calibrated_on: calibratedOn,
      next_due: nextDue || null,
      performed_by: performedBy || null,
      notes: notes || null,
      certificate_path: certPath,
      created_by: user?.id ?? null
    });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    if (nextDue) {
      await supabase.from("instruments").update({
        calibration_due: nextDue,
        status: "Active"
      }).eq("id", instrumentId);
    }
    setBusy(false);
    setOpen(false);
    toast.success("Calibration logged.");
    onDone();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 me-1" }),
      " Log calibration"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Log calibration" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Calibrated on", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: calibratedOn, onChange: (e) => setCalibratedOn(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Next due", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: nextDue, onChange: (e) => setNextDue(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Performed by", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: performedBy, onChange: (e) => setPerformedBy(e.target.value), placeholder: "Lab / technician" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: notes, onChange: (e) => setNotes(e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Certificate (PDF/image)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "application/pdf,image/*", onChange: (e) => setFile(e.target.files?.[0] ?? null) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Save" })
      ] })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  InstrumentDetail as component
};
