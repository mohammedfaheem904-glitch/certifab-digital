import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { B as Button, T as TriangleAlert, s as supabase, b as useAuth, g as useQueryClient, t as toast, L as Link, Y as Route, a as useNavigate } from "./router-DGN8uIPq.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { S as Skeleton } from "./skeleton-DxehOMK1.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BSpN8byK.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { e as evaluateQualification } from "./qualification-validation-UvV6Q-LD.js";
import { f as formatRange, d as deriveQualificationRanges } from "./qualification-intelligence-CQ5mpNJP.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { I as Info } from "./info-Dh0_vR51.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { F as FileUploader } from "./FileUploader-DKjT1GVP.js";
import { c as continuityBroken, a as continuityWarning, d as deriveQualStatus } from "./qualification-status-CLO5y49_.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { S as SignatureCanvas, E as Eraser, P as PenLine, B as Briefcase, G as GitPullRequestArrow } from "./index-D9KR7IQA.js";
import { Q as QRCodeSVG, R as ReportShell, S as SectionTitle, K as KvTable } from "./ReportShell-DFFKdsOP.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { P as Progress } from "./progress-DVwsDxkn.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { q as qualReadinessScore, c as recommendForQualification, d as qualVerdict, O as OperationalBanner, R as RecommendedActionsCard, Q as QuickActionDialogs } from "./QuickActionDialogs-0ReW3zqE.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { O as OctagonAlert } from "./octagon-alert-CjvTeUly.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { Q as QrCode } from "./qr-code-BAr1PEWv.js";
import { S as Save } from "./save-Br-gy0vX.js";
import { U as Undo2 } from "./undo-2--cZR7gWA.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-DH7MMPOO.js";
import "./index-Df5iUNGq.js";
import "./index-BuCuGgC7.js";
import "./index-DybbMtR3.js";
import "./file-spreadsheet-CPXneq8K.js";
import "./chevron-down-s9OCIUw0.js";
import "./dialog-Bm3dO2Bl.js";
import "./index-BlRkZP9l.js";
import "./x-CQcD6R0Y.js";
import "./textarea-CjRfI2z5.js";
import "./search-DlrNhFVp.js";
function QualificationComplianceReport({ qualification }) {
  const [plan, setPlan] = reactExports.useState({});
  const [planEnabled, setPlanEnabled] = reactExports.useState(false);
  const report = reactExports.useMemo(
    () => evaluateQualification(qualification, planEnabled ? plan : void 0),
    [qualification, plan, planEnabled]
  );
  const grouped = report.findings.reduce((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});
  const riskTone = report.riskLevel === "High" ? "bg-destructive/10 text-destructive border-destructive/30" : report.riskLevel === "Medium" ? "bg-warning/10 text-warning border-warning/30" : "bg-success/10 text-success border-success/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Compliance score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-semibold tracking-tight mt-1", children: [
          report.score,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base text-muted-foreground", children: "/100" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-3 py-1.5 rounded-md border text-xs font-medium inline-flex items-center gap-1.5 ${riskTone}`, children: [
        report.riskLevel === "Low" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-4" }),
        "Risk: ",
        report.riskLevel
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        report.findings.filter((f) => f.severity === "critical").length,
        " critical ·",
        " ",
        report.findings.filter((f) => f.severity === "warning").length,
        " warnings ·",
        " ",
        report.findings.filter((f) => f.severity === "info").length,
        " info"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Derived qualification coverage" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Base thickness", value: formatRange(report.ranges.baseThickness) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Deposit thickness", value: formatRange(report.ranges.depositThickness) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Diameter", value: formatRange(report.ranges.diameter) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Positions", value: report.ranges.positions.join(", ") || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Material groups", value: report.ranges.materialGroups.join(", ") || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Backing", value: report.ranges.backing }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Product form", value: report.ranges.productForm }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Processes", value: report.ranges.processes.join(" + ") || "—" })
      ] }),
      report.ranges.notes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 text-xs text-muted-foreground list-disc ms-5 space-y-0.5", children: report.ranges.notes.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: n }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Production plan check" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: planEnabled ? "default" : "outline", onClick: () => setPlanEnabled((s) => !s), children: planEnabled ? "Active" : "Run check" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter the production weld parameters to verify if this WPQ covers the job (process, thickness, OD, position, backing, P-Number)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Process", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: plan.process ?? "", onChange: (e) => setPlan((s) => ({ ...s, process: e.target.value })), placeholder: "GTAW" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Thickness (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: plan.thicknessMm ?? "", onChange: (e) => setPlan((s) => ({ ...s, thicknessMm: Number(e.target.value) || void 0 })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Pipe OD (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: plan.diameterMm ?? "", onChange: (e) => setPlan((s) => ({ ...s, diameterMm: Number(e.target.value) || void 0, isPipe: true })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: plan.position ?? "", onChange: (e) => setPlan((s) => ({ ...s, position: e.target.value.toUpperCase() })), placeholder: "6G" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "P-Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: plan.pNumber ?? "", onChange: (e) => setPlan((s) => ({ ...s, pNumber: Number(e.target.value) || void 0 })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Backing", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm",
            value: plan.withBacking == null ? "" : plan.withBacking ? "yes" : "no",
            onChange: (e) => setPlan((s) => ({ ...s, withBacking: e.target.value === "" ? void 0 : e.target.value === "yes" })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yes", children: "With backing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "no", children: "Without backing" })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      Object.entries(grouped).map(([cat, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3", children: cat }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: items.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FindingRow, { f }, f.id)) })
      ] }, cat)),
      report.findings.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No compliance findings — qualification record is clean." })
    ] })
  ] });
}
function FindingRow({ f }) {
  const Icon = f.severity === "critical" ? TriangleAlert : f.severity === "warning" ? TriangleAlert : f.severity === "pass" ? CircleCheck : Info;
  const tone = f.severity === "critical" ? "text-destructive bg-destructive/5 border-destructive/30" : f.severity === "warning" ? "text-warning bg-warning/5 border-warning/30" : f.severity === "pass" ? "text-success bg-success/5 border-success/30" : "text-muted-foreground bg-muted/30 border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `rounded-md border p-3 flex gap-3 ${tone}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 mt-0.5 shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground/80", children: f.message }),
      f.codeRef && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono opacity-80", children: [
        "Ref: ",
        f.codeRef
      ] }),
      f.remediation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Action:" }),
        " ",
        f.remediation
      ] })
    ] })
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm mt-0.5 break-words", children: value })
  ] });
}
function PF({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
function useQualificationBundle(qualId) {
  const enabled = !!qualId;
  const qualification = useQuery({
    queryKey: ["qualification", qualId],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.from("qualifications").select("*").eq("id", qualId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const variables = useQuery({
    queryKey: ["qualification_variables", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase.from("qualification_variables").select("*").eq("qualification_id", qualId).order("sort_order", { ascending: true });
      return data ?? [];
    }
  });
  const tests = useQuery({
    queryKey: ["qualification_tests", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase.from("qualification_tests").select("*").eq("qualification_id", qualId).order("created_at", { ascending: true });
      return data ?? [];
    }
  });
  const signatures = useQuery({
    queryKey: ["qualification_signatures", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase.from("qualification_signatures").select("*").eq("qualification_id", qualId).order("signed_at", { ascending: true });
      return data ?? [];
    }
  });
  const continuity = useQuery({
    queryKey: ["qualification_continuity", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase.from("qualification_continuity").select("*").eq("qualification_id", qualId).order("activity_date", { ascending: false });
      return data ?? [];
    }
  });
  const attachments = useQuery({
    queryKey: ["qualification_attachments", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase.from("qualification_attachments").select("*").eq("qualification_id", qualId).order("created_at", { ascending: false });
      return data ?? [];
    }
  });
  const audit = useQuery({
    queryKey: ["qualification_audit", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase.from("audit_logs").select("*").eq("table_name", "qualifications").eq("record_id", qualId).order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    }
  });
  return { qualification, variables, tests, signatures, continuity, attachments, audit };
}
const CODE_REFS = ["QW-402", "QW-403", "QW-404", "QW-405", "QW-408", "QW-409", "QW-410", "ISO 9606"];
const PRESETS = [
  { key: "p_no", label: "P-Number (Base)", ref: "QW-403" },
  { key: "f_no", label: "F-Number (Filler)", ref: "QW-404" },
  { key: "thickness", label: "Coupon Thickness", ref: "QW-403" },
  { key: "diameter", label: "Pipe Diameter", ref: "QW-403" },
  { key: "position", label: "Position", ref: "QW-405" },
  { key: "progression", label: "Progression", ref: "QW-405" },
  { key: "backing", label: "Backing", ref: "QW-402" },
  { key: "current", label: "Current / Polarity", ref: "QW-409" }
];
function QualificationVariablesMatrix({
  qualificationId,
  rows,
  onChange,
  readOnly = false
}) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const update = async (id, patch) => {
    const { error } = await supabase.from("qualification_variables").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };
  const remove = async (id) => {
    const { error } = await supabase.from("qualification_variables").delete().eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };
  const addRow = async (preset) => {
    if (!profile?.company_id) return;
    setBusy(true);
    const { error } = await supabase.from("qualification_variables").insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      variable_key: preset?.key ?? `var_${Date.now()}`,
      variable_label: preset?.label ?? "New variable",
      code_reference: preset?.ref ?? "QW-402",
      sort_order: rows.length
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      onChange();
      qc.invalidateQueries({ queryKey: ["qualification_variables", qualificationId] });
    }
  };
  const seedDefaults = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const payload = PRESETS.map((p, i) => ({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      variable_key: p.key,
      variable_label: p.label,
      code_reference: p.ref,
      sort_order: i
    }));
    const { error } = await supabase.from("qualification_variables").insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Variable" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Code Ref" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Qualified With" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Qualified For (Range)" }),
        !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { className: "w-10", children: " " })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 5, className: "px-4 py-8 text-center text-sm text-muted-foreground", children: [
          "No variables yet.",
          !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "link", onClick: seedDefaults, disabled: busy, children: "Insert ASME IX defaults" })
        ] }) }),
        rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              defaultValue: r.variable_label,
              disabled: readOnly,
              onBlur: (e) => e.target.value !== r.variable_label && update(r.id, { variable_label: e.target.value }),
              className: "h-8 text-sm"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              disabled: readOnly,
              defaultValue: r.code_reference ?? "QW-402",
              onChange: (e) => update(r.id, { code_reference: e.target.value }),
              className: "h-8 rounded-md border bg-transparent px-2 text-xs",
              children: CODE_REFS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              defaultValue: r.qualified_with ?? "",
              disabled: readOnly,
              onBlur: (e) => e.target.value !== (r.qualified_with ?? "") && update(r.id, { qualified_with: e.target.value }),
              className: "h-8 text-sm"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              defaultValue: r.qualified_for ?? "",
              disabled: readOnly,
              onBlur: (e) => e.target.value !== (r.qualified_for ?? "") && update(r.id, { qualified_for: e.target.value }),
              className: "h-8 text-sm"
            }
          ) }),
          !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-muted-foreground" }) }) })
        ] }, r.id))
      ] })
    ] }) }),
    !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => addRow(), disabled: busy, children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Add row"
      ] }),
      PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => addRow(p), disabled: busy, children: [
        "+ ",
        p.label
      ] }, p.key))
    ] })
  ] });
}
function Th({ children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `text-start font-medium px-3 py-2 ${className}`, children });
}
const NDT = ["VT", "MT", "PT", "RT", "UT"];
const DT = ["Macro", "Root Bend", "Face Bend", "Side Bend", "Fillet Break", "Tensile", "Nick Break", "Hardness"];
const RESULTS = ["Acceptable", "Not Acceptable", "N/A"];
function QualificationTestsTable({
  qualificationId,
  rows,
  onChange
}) {
  const { profile } = useAuth();
  const [tab, setTab] = reactExports.useState("ndt");
  const ndt = rows.filter((r) => r.category === "ndt");
  const dt = rows.filter((r) => r.category === "destructive");
  const add = async (category, test_type) => {
    if (!profile?.company_id) return;
    const { error } = await supabase.from("qualification_tests").insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      category,
      test_type,
      result: "N/A"
    });
    if (error) toast.error(error.message);
    else onChange();
  };
  const update = async (id, patch) => {
    const { error } = await supabase.from("qualification_tests").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };
  const remove = async (id) => {
    const { error } = await supabase.from("qualification_tests").delete().eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };
  const renderTable = (data, options, category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-3 py-2", children: "Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-3 py-2", children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-3 py-2", children: "Report #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-3 py-2", children: "Inspector" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-3 py-2", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 6, className: "px-4 py-6 text-center text-muted-foreground text-sm", children: [
          "No ",
          category === "ndt" ? "NDT" : "destructive",
          " tests recorded."
        ] }) }),
        data.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium", children: r.test_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              defaultValue: r.result ?? "N/A",
              onChange: (e) => update(r.id, { result: e.target.value }),
              className: "h-8 rounded-md border bg-transparent px-2 text-xs",
              children: RESULTS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "h-8 text-sm",
              defaultValue: r.report_number ?? "",
              onBlur: (e) => update(r.id, { report_number: e.target.value })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "h-8 text-sm",
              defaultValue: r.inspector_name ?? "",
              onBlur: (e) => update(r.id, { inspector_name: e.target.value })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              className: "h-8 text-sm",
              defaultValue: r.test_date ?? "",
              onBlur: (e) => update(r.id, { test_date: e.target.value || null })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 text-muted-foreground" }) }) })
        ] }, r.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: options.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => add(category, t), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3 me-1" }),
      " ",
      t
    ] }, t)) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (v) => setTab(v), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "ndt", children: [
        "NDT (",
        ndt.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "destructive", children: [
        "Destructive (",
        dt.length,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ndt", children: renderTable(ndt, NDT, "ndt") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "destructive", children: renderTable(dt, DT, "destructive") })
  ] });
}
function ContinuityTimeline({
  qualificationId,
  rows,
  onChange
}) {
  const { profile, user } = useAuth();
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [process, setProcess] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const last = rows[0]?.activity_date ?? null;
  const broken = continuityBroken(last);
  const warning = continuityWarning(last);
  const add = async () => {
    if (!profile?.company_id) return;
    const { error } = await supabase.from("qualification_continuity").insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      activity_date: date,
      process: process || null,
      notes: notes || null,
      created_by: user?.id ?? null
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setProcess("");
    setNotes("");
    onChange();
    toast.success("Continuity entry added.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-md border p-3 flex items-center gap-3 text-sm
        ${broken ? "border-destructive/40 bg-destructive/10 text-destructive" : warning ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`, children: [
      broken ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }) : warning ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        broken && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Continuity broken — last activity over 6 months ago. Welder must re-qualify per ASME IX QW-322." }),
        !broken && warning && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Continuity at risk — log activity within 30 days to maintain qualification." }),
        !broken && !warning && last && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Continuity OK — last activity ",
          fmtEngDate(last),
          "."
        ] }),
        !last && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "No continuity activity logged yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border p-4 grid sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Activity date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Process" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: process, onChange: (e) => setProcess(e.target.value), placeholder: "GTAW" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Project / weld evidence" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: add, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 me-1" }),
        " Log activity"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "relative border-s border-border ms-2 space-y-4", children: [
      rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground ms-4", children: "No continuity entries yet." }),
      rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ms-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -start-[22px] mt-1.5 size-3 rounded-full bg-primary/70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: fmtEngDate(r.activity_date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          r.process ?? "—",
          r.notes ? ` · ${r.notes}` : ""
        ] })
      ] }, r.id))
    ] })
  ] });
}
const ROLES = [
  "QC Engineer",
  "QA/QC Manager",
  "Welding Engineer",
  "Witness",
  "Examiner",
  "Client Representative"
];
function SignaturePad({
  qualificationId,
  signatures,
  onChange
}) {
  const { profile, user } = useAuth();
  const ref = reactExports.useRef(null);
  const [name, setName] = reactExports.useState(profile?.display_name ?? "");
  const [role, setRole] = reactExports.useState(ROLES[0]);
  const [busy, setBusy] = reactExports.useState(false);
  const save = async () => {
    if (!profile?.company_id || !ref.current || ref.current.isEmpty()) {
      toast.error("Please draw a signature.");
      return;
    }
    if (!name.trim()) {
      toast.error("Name required.");
      return;
    }
    setBusy(true);
    const dataUrl = ref.current.toDataURL("image/png");
    const { error } = await supabase.from("qualification_signatures").insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      role,
      name: name.trim(),
      signature_data_url: dataUrl,
      actor_id: user?.id ?? null
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    ref.current.clear();
    toast.success("Signature recorded.");
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    signatures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: signatures.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border p-3 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.role }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: s.name }),
      s.signature_data_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.signature_data_url, alt: "signature", className: "mt-2 h-16 object-contain bg-white rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1", children: new Date(s.signed_at).toLocaleString() })
    ] }, s.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Signatory name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm",
              value: role,
              onChange: (e) => setRole(e.target.value),
              children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: r }, r))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-dashed border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SignatureCanvas,
        {
          ref,
          penColor: "black",
          backgroundColor: "white",
          canvasProps: { className: "w-full h-32 rounded-md" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => ref.current?.clear(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { className: "size-4 me-1" }),
          " Clear"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: save, disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "size-4 me-1" }),
          " Sign & save"
        ] })
      ] })
    ] })
  ] });
}
function QrCodeBlock({
  value,
  size = 96,
  caption
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex flex-col items-center gap-1.5 rounded-md border border-border/60 bg-background p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeSVG, { value, size, level: "M", includeMargin: false }),
    caption && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground tracking-wide uppercase", children: caption })
  ] });
}
const QW_VARIABLES = [
  { key: "p_no", label: "P-Number (Base Metal Group)", ref: "QW-403" },
  { key: "pipe_diameter", label: "Pipe Diameter", ref: "QW-403" },
  { key: "backing", label: "Backing", ref: "QW-402" },
  { key: "inert_gas_backing", label: "Inert Gas Backing", ref: "QW-408" },
  { key: "f_no", label: "F-Number (Filler)", ref: "QW-404" },
  { key: "aws_spec", label: "AWS Specification", ref: "QW-404" },
  { key: "insert_ring", label: "Consumable Insert", ref: "QW-402" },
  { key: "weld_deposit", label: "T Weld Deposit Thickness", ref: "QW-403" },
  { key: "test_specimen", label: "Test Specimen", ref: "QW-452" },
  { key: "position", label: "Position", ref: "QW-405" },
  { key: "progression", label: "Vertical Progression", ref: "QW-405" },
  { key: "polarity", label: "Current / Polarity", ref: "QW-409" },
  { key: "sfa", label: "SFA Classification", ref: "QW-404" },
  { key: "filler_metal", label: "Filler Metal Form", ref: "QW-404" },
  { key: "transfer_mode", label: "Transfer Mode (GMAW)", ref: "QW-409" },
  { key: "joint_type", label: "Joint Type", ref: "QW-402" }
];
const NDT_TESTS = ["VT", "MT", "PT", "RT", "UT"];
const DT_TESTS = ["Macro", "Root Bend", "Face Bend", "Side Bend", "Fillet Break", "Tensile", "Nick Break", "Hardness"];
function WelderQualificationDocument({
  q,
  variables = [],
  tests = [],
  signatures = [],
  verifyUrl
}) {
  const status = deriveQualStatus(q);
  const expiryDays = daysUntil(q.expiry_date);
  const contBroken = continuityBroken(q.last_continuity_date);
  const contWarn = continuityWarning(q.last_continuity_date);
  const varsByKey = new Map((variables ?? []).map((v) => [v.variable_key, v]));
  const matrixRows = QW_VARIABLES.map((v) => {
    const stored = varsByKey.get(v.key);
    return {
      label: v.label,
      qualified_with: stored?.qualified_with ?? "—",
      qualified_for: stored?.qualified_for ?? "Per code",
      ref: stored?.code_reference ?? v.ref
    };
  });
  const ndtRows = NDT_TESTS.map((t) => {
    const found = tests.find((x) => x.category === "ndt" && x.test_type === t);
    return { type: t, ...found ?? {} };
  });
  const dtRows = DT_TESTS.map((t) => {
    const found = tests.find((x) => x.category === "destructive" && x.test_type === t);
    return { type: t, ...found ?? {} };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ReportShell,
    {
      title: "Welder Performance Qualification Record (WPQ)",
      subtitle: `${q.code_family ?? "ASME Section IX"} · ${q.process ?? "—"}`,
      docType: "WPQ",
      entityId: q.id,
      revision: q.revision ?? "Rev 0",
      status,
      classification: "Personnel Qualification Record — Audit Controlled",
      meta: [
        { label: "WPQ No.", value: q.wpq_number ?? q.doc_number ?? "—" },
        { label: "WPS No.", value: q.wps_number ?? "—" },
        { label: "PQR No.", value: q.pqr_number ?? "—" },
        { label: "Stamp No.", value: q.stamp_number ?? "—" }
      ],
      signatories: signatures.length > 0 ? signatures.map((s) => ({ role: s.role, name: s.name, signedOn: s.signed_at })) : [
        { role: "QC Engineer" },
        { role: "QA/QC Manager" },
        { role: "Witnessed By" },
        { role: "Examiner" },
        { role: "Client Representative" }
      ],
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-6 border-b border-border/60 pb-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
            q.welder_photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: q.welder_photo_url,
                alt: q.welder_name,
                className: "w-24 h-32 object-cover rounded border border-border/60"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-32 rounded border border-dashed border-border/60 grid place-items-center text-[10px] text-muted-foreground text-center px-1", children: "Welder Photo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: q.welder_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                "ID: ",
                q.employee_id
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                "Stamp: ",
                q.stamp_number ?? "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Test No.: ",
                q.welder_test_number ?? "—",
                " · Coupon: ",
                q.test_coupon_type ?? "—"
              ] })
            ] })
          ] }),
          verifyUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(QrCodeBlock, { value: verifyUrl, caption: "Scan to verify" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 1, title: "Welder Qualification Record" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          KvTable,
          {
            rows: [
              ["Welding Process", q.process],
              ["Process Type", q.process_type ?? "—"],
              ["Applicable Code / Standard", `${q.code_family ?? "ASME IX"} — ${q.standard ?? ""}`.trim()],
              ["Qualification Date", fmtEngDate(q.qualification_date ?? q.created_at)],
              ["Expiry Date", fmtEngDate(q.expiry_date)],
              [
                "Last Continuity Activity",
                q.last_continuity_date ? `${fmtEngDate(q.last_continuity_date)}${contBroken ? " — CONTINUITY BROKEN (>6 months)" : contWarn ? " — Approaching 6-month limit" : ""}` : "Not recorded"
              ],
              ["Qualification Status", status]
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 2, title: "Qualification Variables & Limits (QW-4xx)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Variable" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Qualified With" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Qualified For (Range)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Code Ref." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: matrixRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: r.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.qualified_with }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.qualified_for }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground", children: r.ref })
          ] }, r.label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 3, title: "Test Results — Non-Destructive (NDT)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Test" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Result" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Report No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Inspector" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ndtRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: r.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.result ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.report_number ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.inspector_name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtEngDate(r.test_date) })
          ] }, r.type)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 4, title: "Test Results — Destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Test" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Result" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Report No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Inspector" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: dtRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: r.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.result ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.report_number ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.inspector_name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtEngDate(r.test_date) })
          ] }, r.type)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 5, title: "Final Qualification Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          KvTable,
          {
            rows: [
              ["Outcome", q.result ?? (status === "Expired" ? "Unsatisfactory (Expired)" : "Satisfactory")],
              ["Remarks", q.remarks ?? "—"],
              ["Rejection Reason", q.rejection_reason ?? "—"],
              ["Re-qualification Required", expiryDays != null && expiryDays <= 30 ? "Yes — schedule before expiry" : "No"]
            ]
          }
        )
      ]
    }
  );
}
function QualificationGuidanceStrip({ qualification: q }) {
  const { roles } = useAuth();
  const [dialog, setDialog] = reactExports.useState(null);
  const affectedWelds = useQuery({
    queryKey: ["qual-impact-welds", q.id, q.welder_name],
    enabled: !!q.welder_name,
    queryFn: async () => {
      const { data } = await supabase.from("welds").select("id, project_id, workflow_status, status, welder_name").ilike("welder_name", q.welder_name).limit(500);
      return data ?? [];
    }
  });
  const replacements = useQuery({
    queryKey: ["qual-replacements", q.id, q.process],
    enabled: !!q.process,
    queryFn: async () => {
      const { data } = await supabase.from("qualifications").select("id, welder_name, employee_id, process, expiry_date, position_qualified, test_thickness_mm, status").eq("process", q.process).neq("id", q.id).order("expiry_date", { ascending: false }).limit(40);
      const today = /* @__PURE__ */ new Date();
      const couponT = Number(q.test_thickness_mm) || void 0;
      return (data ?? []).filter((r) => {
        const status = deriveQualStatus({ expiry_date: r.expiry_date, status: r.status });
        if (status === "Expired" || status === "Suspended") return false;
        if (new Date(r.expiry_date) < today) return false;
        if (couponT && r.test_thickness_mm) {
          const rt = Number(r.test_thickness_mm);
          if (Number.isFinite(rt) && rt < couponT * 0.5) return false;
        }
        return true;
      }).slice(0, 5);
    }
  });
  const impact = reactExports.useMemo(() => {
    const welds = affectedWelds.data ?? [];
    const projects = /* @__PURE__ */ new Set();
    let pending = 0;
    let blocked = 0;
    for (const w of welds) {
      if (w.project_id) projects.add(w.project_id);
      if (["Pending Validation", "Ready for Release"].includes(w.workflow_status)) pending += 1;
      if (w.workflow_status === "Blocked" || w.status === "Rejected") blocked += 1;
    }
    return {
      affectedWelds: welds.length,
      affectedProjects: projects.size,
      pendingReleases: pending,
      blockedWelds: blocked
    };
  }, [affectedWelds.data]);
  const score = reactExports.useMemo(() => qualReadinessScore(q), [q]);
  const recs = reactExports.useMemo(
    () => recommendForQualification({ qualification: q, impact, replacements: replacements.data }),
    [q, impact, replacements.data]
  );
  const verdict = qualVerdict(q, recs, score, impact);
  const topAction = recs.find((r) => r.severity === verdict.severity && r.action) ?? recs.find((r) => r.action);
  const needsReplacements = score.expiryRisk !== "None" || score.continuityHealth !== "Healthy" || score.complianceHealth === "Fail";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OperationalBanner,
      {
        verdict,
        actionLabel: topAction?.action?.label,
        onAction: topAction?.action?.kind === "open-dialog" && topAction.action.dialog ? () => setDialog({ kind: topAction.action.dialog, payload: topAction.action.payload }) : void 0,
        actionTo: topAction?.action?.kind === "navigate" ? topAction.action.to : void 0
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReadinessCard, { score }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OperationalImpactCard, { impact, loading: affectedWelds.isLoading, welderName: q.welder_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReplacementWeldersCard,
        {
          loading: replacements.isLoading,
          items: replacements.data ?? [],
          highlight: needsReplacements
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RecommendedActionsCard,
      {
        recommendations: recs,
        roles,
        onDialog: (d, p) => setDialog({ kind: d, payload: p })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionDialogs, { state: dialog, onClose: () => setDialog(null) })
  ] });
}
function ReadinessCard({ score }) {
  const bandTone = score.band === "Ready" ? "text-success" : score.band === "High Risk" ? "text-destructive" : score.band === "Expiring Soon" ? "text-warning" : "text-warning";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Qualification Readiness" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold tabular-nums", children: score.score }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "/ 100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ms-auto text-xs font-semibold ${bandTone}`, children: score.band })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: score.score, className: "h-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HealthRow, { label: "Continuity health", value: score.continuityHealth }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HealthRow, { label: "Compliance health", value: score.complianceHealth }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HealthRow, { label: "Expiry risk", value: score.expiryRisk })
    ] })
  ] });
}
function HealthRow({ label, value }) {
  const ok = ["Healthy", "Pass", "None"].includes(value);
  const warn = ["At Risk", "Warning", "30 days"].includes(value);
  const Icon = ok ? CircleCheck : warn ? TriangleAlert : OctagonAlert;
  const tone = ok ? "text-success" : warn ? "text-warning" : "text-destructive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 font-medium ${tone}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" }),
      value
    ] })
  ] });
}
function OperationalImpactCard({
  impact,
  loading,
  welderName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Operational Impact" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: welderName ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "This qualification covers ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: welderName }),
      "'s production work:"
    ] }) : "Operational footprint of this qualification:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5" }), label: "Active welds", value: impact.affectedWelds, loading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-3.5" }), label: "Projects affected", value: impact.affectedProjects, loading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GitPullRequestArrow, { className: "size-3.5" }), label: "Pending release workflows", value: impact.pendingReleases, loading, emphasize: impact.pendingReleases > 0 }),
      impact.blockedWelds > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "size-3.5" }), label: "Blocked welds", value: impact.blockedWelds, loading, emphasize: true })
    ] })
  ] });
}
function ImpactRow({
  icon,
  label,
  value,
  loading,
  emphasize
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tabular-nums font-semibold ${emphasize ? "text-warning" : "text-foreground"}`, children: loading ? "…" : value })
  ] });
}
function ReplacementWeldersCard({
  items,
  loading,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `p-4 space-y-3 ${highlight ? "border-warning/40 bg-warning/5" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Suggested Replacement Welders" }),
      highlight && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-warning/40 text-warning ms-auto", children: "Recommended" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Searching matching welders…" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No alternative welders qualified for this process with active continuity." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/app/qualifications/$qualId",
          params: { qualId: r.id },
          className: "min-w-0 truncate font-medium hover:text-primary",
          children: r.welder_name
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground shrink-0", children: [
        r.process,
        r.position_qualified ? ` · ${r.position_qualified}` : ""
      ] })
    ] }, r.id)) }),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full", children: [
      "Browse all welders ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3 ms-1.5" })
    ] }) })
  ] });
}
function QualDetail() {
  const {
    qualId
  } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const {
    roles
  } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const bundle = useQualificationBundle(qualId);
  const q = bundle.qualification.data;
  const [edit, setEdit] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  if (bundle.qualification.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
    ] });
  }
  if (!q) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "WPQ not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", onClick: () => nav({
        to: "/app/qualifications"
      }), children: "Back" })
    ] });
  }
  const merged = {
    ...q,
    ...edit
  };
  const status = deriveQualStatus(merged);
  const dirty = Object.keys(edit).length > 0;
  const setF = (k, v) => setEdit((s) => ({
    ...s,
    [k]: v
  }));
  const save = async () => {
    if (!dirty) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("qualifications").update(edit).eq("id", qualId);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEdit({});
    qc.invalidateQueries({
      queryKey: ["qualification", qualId]
    });
    qc.invalidateQueries({
      queryKey: ["qualifications"]
    });
    toast.success("Saved.");
  };
  const softDelete = async () => {
    if (!confirm("Move this WPQ to Trash? Super admins can restore it later.")) return;
    const {
      error
    } = await supabase.rpc("soft_delete_qualification", {
      _id: qualId
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Trash.");
    qc.invalidateQueries({
      queryKey: ["qualifications"]
    });
    nav({
      to: "/app/qualifications"
    });
  };
  const restore = async () => {
    const {
      error
    } = await supabase.rpc("restore_qualification", {
      _id: qualId
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Restored.");
    qc.invalidateQueries({
      queryKey: ["qualification", qualId]
    });
    qc.invalidateQueries({
      queryKey: ["qualifications"]
    });
    qc.invalidateQueries({
      queryKey: ["qualifications_trash"]
    });
  };
  const hardDelete = async () => {
    if (!confirm("Permanently delete this WPQ and ALL related records? This cannot be undone.")) return;
    const {
      error
    } = await supabase.from("qualifications").delete().eq("id", qualId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Permanently deleted.");
    nav({
      to: "/app/qualifications"
    });
  };
  const ranges = deriveQualificationRanges({
    code: merged.code_family ?? "ASME IX",
    process: merged.process ?? "",
    testCouponThicknessMm: Number(merged.test_thickness_mm) || void 0,
    testCouponDiameterMm: Number(merged.test_diameter_mm) || void 0,
    testPosition: merged.position_qualified,
    isPipe: merged.test_coupon_type?.toLowerCase().includes("pipe")
  });
  const verifyUrl = typeof window !== "undefined" ? `${window.location.origin}/verify/qualification/${q.qr_token}` : `/verify/qualification/${q.qr_token}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/qualifications", className: "hover:text-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
        " Qualifications"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: q.wpq_number ?? q.id.slice(0, 8) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: q.welder_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-muted", children: q.code_family ?? "ASME IX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-muted", children: q.revision })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
            q.wpq_number ?? "—",
            " · Employee ",
            q.employee_id,
            " · Process ",
            q.process,
            q.position_qualified && ` · Position ${q.position_qualified}`
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/verify/qualification/$token", params: {
            token: q.qr_token
          }, target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "size-4 me-1" }),
            " Verify QR"
          ] }) }),
          dirty && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: save, disabled: saving, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 me-1" }),
            " Save changes"
          ] }),
          q.deleted_at ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: restore, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "size-4 me-1" }),
              " Restore"
            ] }),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: hardDelete, className: "text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 me-1" }),
              " Delete permanently"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: softDelete, className: "text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 me-1" }),
            " Delete"
          ] })
        ] })
      ] }),
      q.deleted_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
        "This WPQ is in Trash (soft-deleted on ",
        fmtEngDate(q.deleted_at),
        "). It is hidden from standard lists and reports."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Qualified", value: q.qualification_date ? fmtEngDate(q.qualification_date) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expires", value: fmtEngDate(q.expiry_date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last activity", value: q.last_continuity_date ? fmtEngDate(q.last_continuity_date) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Result", value: q.result ?? "—" })
      ] })
    ] }),
    !q.deleted_at && /* @__PURE__ */ jsxRuntimeExports.jsx(QualificationGuidanceStrip, { qualification: merged }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "overview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex-wrap h-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "compliance", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 me-1" }),
          " Compliance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "variables", children: "Variables" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "tests", children: [
          "Tests (",
          bundle.tests.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "continuity", children: [
          "Continuity (",
          bundle.continuity.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "signatures", children: [
          "Signatures (",
          bundle.signatures.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "attachments", children: [
          "Attachments (",
          bundle.attachments.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "audit", children: [
          "Audit (",
          bundle.audit.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "certificate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 me-1" }),
          " Certificate"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "overview", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 grid sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Welder name", value: merged.welder_name, onChange: (v) => setF("welder_name", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Employee ID", value: merged.employee_id, onChange: (v) => setF("employee_id", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "WPQ number", value: merged.wpq_number, onChange: (v) => setF("wpq_number", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Stamp number", value: merged.stamp_number, onChange: (v) => setF("stamp_number", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Process", value: merged.process, onChange: (v) => setF("process", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Position", value: merged.position_qualified, onChange: (v) => setF("position_qualified", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Standard", value: merged.standard, onChange: (v) => setF("standard", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Code family", value: merged.code_family, onChange: (v) => setF("code_family", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Test coupon", value: merged.test_coupon_type, onChange: (v) => setF("test_coupon_type", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Coupon thickness (mm)", value: merged.test_thickness_mm, onChange: (v) => setF("test_thickness_mm", v), type: "number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Coupon diameter (mm)", value: merged.test_diameter_mm, onChange: (v) => setF("test_diameter_mm", v), type: "number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Qualification date", value: merged.qualification_date, onChange: (v) => setF("qualification_date", v), type: "date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Expiry date", value: merged.expiry_date, onChange: (v) => setF("expiry_date", v), type: "date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Revision", value: merged.revision, onChange: (v) => setF("revision", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Edit, { label: "Remarks", value: merged.remarks, onChange: (v) => setF("remarks", v), className: "sm:col-span-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Auto-derived qualification ranges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { label: "Base thickness", value: formatRange(ranges.baseThickness) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { label: "Deposit thickness", value: formatRange(ranges.depositThickness) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { label: "Diameter", value: formatRange(ranges.diameter) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { label: "Positions qualified", value: ranges.positions.join(", ") || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground italic mt-3", children: ranges.notes.join(" ") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "compliance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QualificationComplianceReport, { qualification: merged }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "variables", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QualificationVariablesMatrix, { qualificationId: qualId, rows: bundle.variables.data ?? [], onChange: () => qc.invalidateQueries({
        queryKey: ["qualification_variables", qualId]
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tests", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QualificationTestsTable, { qualificationId: qualId, rows: bundle.tests.data ?? [], onChange: () => qc.invalidateQueries({
        queryKey: ["qualification_tests", qualId]
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "continuity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContinuityTimeline, { qualificationId: qualId, rows: bundle.continuity.data ?? [], onChange: () => {
        qc.invalidateQueries({
          queryKey: ["qualification_continuity", qualId]
        });
        qc.invalidateQueries({
          queryKey: ["qualification", qualId]
        });
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signatures", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SignaturePad, { qualificationId: qualId, signatures: bundle.signatures.data ?? [], onChange: () => qc.invalidateQueries({
        queryKey: ["qualification_signatures", qualId]
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "attachments", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileUploader, { bucket: "qualification-files", folder: qualId, table: "qualification_attachments", recordIdColumn: "qualification_id", recordId: qualId, hint: "Test reports, photos, NDT films, certificates." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm divide-y divide-border rounded-md border border-border", children: [
          (bundle.attachments.data ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-4 py-2 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.filename }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              a.size_bytes ? `${(a.size_bytes / 1024).toFixed(0)} KB` : "",
              " · ",
              fmtEngDate(a.created_at)
            ] })
          ] }, a.id)),
          (bundle.attachments.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-4 py-6 text-center text-muted-foreground", children: "No attachments yet." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "audit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "relative border-s border-border ms-2 space-y-4", children: [
        (bundle.audit.data ?? []).map((e) => {
          const before = e.before ?? {};
          const after = e.after ?? {};
          const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)]));
          const changed = keys.filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
          const tone = e.action === "DELETE" ? "bg-destructive" : e.action === "INSERT" ? "bg-emerald-500" : "bg-primary/70";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ms-4 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -start-[22px] mt-1.5 size-3 rounded-full ${tone}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: e.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(e.created_at).toLocaleString() })
            ] }),
            e.action === "UPDATE" && changed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded border border-border bg-muted/20 text-xs divide-y divide-border", children: [
              changed.slice(0, 12).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[140px_1fr_1fr] gap-2 px-2 py-1.5 items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-muted-foreground", children: k }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono break-all text-destructive/80 line-through", children: fmtVal(before[k]) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono break-all text-emerald-600 dark:text-emerald-400", children: fmtVal(after[k]) })
              ] }, k)),
              changed.length > 12 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-1.5 text-muted-foreground italic", children: [
                "+",
                changed.length - 12,
                " more changes…"
              ] })
            ] })
          ] }, e.id);
        }),
        (bundle.audit.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground ms-4", children: "No audit entries." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "certificate", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WelderQualificationDocument, { q, variables: bundle.variables.data ?? [], tests: bundle.tests.data ?? [], signatures: bundle.signatures.data ?? [], verifyUrl }) })
    ] })
  ] });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-medium", children: value })
  ] });
}
function Edit({
  label,
  value,
  onChange,
  type = "text",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-1.5 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type, value: value ?? "", onChange: (e) => onChange(e.target.value) })
  ] });
}
function Range({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm mt-0.5", children: value })
  ] });
}
function fmtVal(v) {
  if (v == null || v === "") return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
export {
  QualDetail as component
};
