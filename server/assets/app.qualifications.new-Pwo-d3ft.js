import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, a as useNavigate, L as Link, B as Button, t as toast, s as supabase } from "./router-DGN8uIPq.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { d as deriveQualificationRanges, f as formatRange } from "./qualification-intelligence-CQ5mpNJP.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { S as Save } from "./save-Br-gy0vX.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const STEPS = ["Identity", "Process & Code", "Test Coupon", "Variables", "Result", "Review"];
const DRAFT_KEY = "wpq-wizard-draft";
function WpqWizard() {
  const {
    profile
  } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = reactExports.useState(0);
  const [busy, setBusy] = reactExports.useState(false);
  const [v, setV] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) return JSON.parse(raw);
      } catch {
      }
    }
    return {
      code_family: "ASME IX",
      revision: "Rev 0",
      result: "Satisfactory",
      status: "Active",
      qualification_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    };
  });
  const set = (k, val) => setV((s) => ({
    ...s,
    [k]: val
  }));
  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(v));
    toast.success("Draft saved locally.");
  };
  const validate = () => {
    if (step === 0) {
      if (!v.welder_name) return "Welder name required.";
      if (!v.employee_id) return "Employee ID required.";
    }
    if (step === 1) {
      if (!v.process) return "Process required.";
      if (!v.standard) return "Standard / Edition required.";
    }
    if (step === 2) {
      if (!v.expiry_date) return "Expiry date required.";
    }
    return null;
  };
  const next = () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const submit = async () => {
    if (!profile?.company_id) return;
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setBusy(true);
    const {
      data,
      error
    } = await supabase.from("qualifications").insert({
      ...v,
      company_id: profile.company_id
    }).select().single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    localStorage.removeItem(DRAFT_KEY);
    toast.success("WPQ created.");
    nav({
      to: "/app/qualifications/$qualId",
      params: {
        qualId: data.id
      }
    });
  };
  const ranges = deriveQualificationRanges({
    code: v.code_family ?? "ASME IX",
    process: v.process ?? "",
    testCouponThicknessMm: Number(v.test_thickness_mm) || void 0,
    testCouponDiameterMm: Number(v.test_diameter_mm) || void 0,
    testPosition: v.position_qualified,
    isPipe: v.test_coupon_type?.toLowerCase().includes("pipe")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/qualifications", className: "hover:text-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
        " Qualifications"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "New WPQ" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 overflow-x-auto pb-1", children: STEPS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => i <= step && setStep(i), className: `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition
              ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-success/15 text-success border border-success/30" : "bg-muted text-muted-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-5 rounded-full bg-background/30 flex items-center justify-center text-[10px]", children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }) : i + 1 }),
      label
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 space-y-5", children: [
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Welder identity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Welder name *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.welder_name ?? "", onChange: (e) => set("welder_name", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Employee ID *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.employee_id ?? "", onChange: (e) => set("employee_id", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Stamp number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.stamp_number ?? "", onChange: (e) => set("stamp_number", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "WPQ number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.wpq_number ?? "", onChange: (e) => set("wpq_number", e.target.value), placeholder: "WPQ-2026-001" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Welder test number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.welder_test_number ?? "", onChange: (e) => set("welder_test_number", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Revision", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.revision ?? "Rev 0", onChange: (e) => set("revision", e.target.value) }) })
      ] }) }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Process & code", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Process *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.process ?? "", onChange: (e) => set("process", e.target.value), placeholder: "GTAW" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Process type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm", value: v.process_type ?? "Manual", onChange: (e) => set("process_type", e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Manual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Semi-Automatic" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Mechanized" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Automatic" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Code family", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm", value: v.code_family ?? "ASME IX", onChange: (e) => set("code_family", e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "ASME IX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AWS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "EN ISO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AS/NZS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "JIS" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Standard / Edition *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.standard ?? "", onChange: (e) => set("standard", e.target.value), placeholder: "ASME IX 2023" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "WPS reference", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.wps_number ?? "", onChange: (e) => set("wps_number", e.target.value) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "PQR reference", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.pqr_number ?? "", onChange: (e) => set("pqr_number", e.target.value) }) })
      ] }) }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Test coupon & qualification range", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Coupon type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.test_coupon_type ?? "", onChange: (e) => set("test_coupon_type", e.target.value), placeholder: "Pipe 6 in. Sch 80" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.position_qualified ?? "", onChange: (e) => set("position_qualified", e.target.value), placeholder: "6G" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Coupon thickness (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: v.test_thickness_mm ?? "", onChange: (e) => set("test_thickness_mm", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Coupon diameter (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: v.test_diameter_mm ?? "", onChange: (e) => set("test_diameter_mm", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Qualification date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: v.qualification_date ?? "", onChange: (e) => set("qualification_date", e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Expiry date *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: v.expiry_date ?? "", onChange: (e) => set("expiry_date", e.target.value) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 p-3 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground mb-1", children: "Auto-derived qualification ranges (preview)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Base thickness: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatRange(ranges.baseThickness) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Deposit thickness: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatRange(ranges.depositThickness) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Diameter: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatRange(ranges.diameter) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Positions qualified: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: ranges.positions.join(", ") || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground italic", children: ranges.notes.join(" ") })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Variables", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "The full QW-4xx variables matrix can be edited after creating the WPQ — we pre-seed the standard ASME IX rows on the detail page." }) }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Result", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Result", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm", value: v.result ?? "Satisfactory", onChange: (e) => set("result", e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Satisfactory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Unsatisfactory" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm", value: v.status ?? "Active", onChange: (e) => set("status", e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Suspended" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Remarks", className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.remarks ?? "", onChange: (e) => set("remarks", e.target.value) }) }),
        v.result === "Unsatisfactory" && /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Rejection reason", className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.rejection_reason ?? "", onChange: (e) => set("rejection_reason", e.target.value) }) })
      ] }) }),
      step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Review", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3 text-sm", children: Object.entries(v).filter(([, val]) => val).map(([k, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/40 pb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: String(val) })
      ] }, k)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: saveDraft, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 me-1" }),
          " Save draft"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          step > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: prev, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 me-1" }),
            " Back"
          ] }),
          step < STEPS.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: next, children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ms-1" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Create WPQ" })
        ] })
      ] })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold tracking-tight", children: title }),
    children
  ] });
}
function F({
  label,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-1.5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  WpqWizard as component
};
