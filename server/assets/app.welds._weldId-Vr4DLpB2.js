import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, T as TriangleAlert, B as Button, s as supabase, L as Link, j as cn, b as useAuth, g as useQueryClient, t as toast, W as Route, a as useNavigate } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BSpN8byK.js";
import { S as Skeleton } from "./skeleton-DxehOMK1.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { F as FileUploader } from "./FileUploader-DKjT1GVP.js";
import { R as ReportShell, S as SectionTitle, K as KvTable } from "./ReportShell-DFFKdsOP.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent, r as recommendForWeld, w as weldVerdict, O as OperationalBanner, R as RecommendedActionsCard, Q as QuickActionDialogs } from "./QuickActionDialogs-0ReW3zqE.js";
import { d as deriveQualificationRanges, i as isWithinRange, f as formatRange } from "./qualification-intelligence-CQ5mpNJP.js";
import { e as evaluateQualification } from "./qualification-validation-UvV6Q-LD.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { W as WandSparkles } from "./wand-sparkles-BIB6Kyai.js";
import { C as CircleAlert, H as History } from "./history-Dvokmw1t.js";
import { I as Info } from "./info-Dh0_vR51.js";
import { C as ChevronDown } from "./chevron-down-s9OCIUw0.js";
import { L as Layers } from "./layers-ndoH4caN.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import { C as ClipboardCheck } from "./clipboard-check-uPHKjRWU.js";
import { O as OctagonAlert } from "./octagon-alert-CjvTeUly.js";
import { W as Wrench } from "./wrench-CmqB68Gm.js";
import { E as ExternalLink } from "./external-link-6vGs1pBo.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { W as WeldStatusBadge, a as WORKFLOW_STAGES, B as BRANCH_STATES, s as stageIndex, b as allowedTransitions } from "./WeldStatusBadge-B_9QG7hG.js";
import { C as Check } from "./check-DS8b9zeL.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { Q as QrCode } from "./qr-code-BAr1PEWv.js";
import { C as ChevronRight } from "./chevron-right-DA67_Mf_.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-DH7MMPOO.js";
import "./index-Df5iUNGq.js";
import "./index-BuCuGgC7.js";
import "./file-spreadsheet-CPXneq8K.js";
import "./qualification-status-CLO5y49_.js";
import "./format-gAjFLL1B.js";
import "./sparkles-ksLz2psn.js";
import "./search-DlrNhFVp.js";
import "./circle-x-CEG87Cnk.js";
import "./index-BlRkZP9l.js";
import "./x-CQcD6R0Y.js";
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
];
const CircleDot = createLucideIcon("circle-dot", __iconNode$6);
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "9", x2: "15", y1: "15", y2: "9", key: "1dfufj" }]
];
const CircleSlash = createLucideIcon("circle-slash", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M9 15h6", key: "cctwl0" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }]
];
const FilePlus = createLucideIcon("file-plus", __iconNode$4);
const __iconNode$3 = [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
];
const Network = createLucideIcon("network", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3", key: "mhlwft" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const ShieldQuestionMark = createLucideIcon("shield-question-mark", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13", key: "i9gjdv" }],
  [
    "path",
    {
      d: "M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z",
      key: "1vzg3v"
    }
  ],
  ["path", { d: "M5 22h14", key: "ehvnwv" }]
];
const Stamp = createLucideIcon("stamp", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function WeldTraceabilityDocument({
  weld,
  inspections = [],
  ncrs = [],
  events = [],
  procedure,
  project
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ReportShell,
    {
      title: "Weld Traceability Report",
      subtitle: `Weld ${weld.weld_no}`,
      docType: "WTR",
      entityId: weld.id,
      revision: "Rev 0",
      status: weld.status,
      classification: "Traceability Record · Controlled",
      projectMeta: project ? [
        { label: "Project", value: project.name },
        { label: "Project code", value: project.code },
        { label: "Client", value: project.client ?? "—" },
        { label: "Location", value: project.location ?? "—" }
      ] : void 0,
      traceability: [
        { label: "Weld No.", value: weld.weld_no },
        { label: "Joint No.", value: weld.joint_no ?? "—" },
        { label: "Spool No.", value: weld.spool_no ?? "—" },
        { label: "Drawing Ref.", value: weld.drawing_ref ?? "—" },
        { label: "Line No.", value: weld.line_no ?? "—" },
        { label: "Heat No.", value: weld.heat_number ?? "—" },
        { label: "Welder", value: weld.welder_name ?? "—" },
        { label: "Weld date", value: fmtEngDate(weld.weld_date) }
      ],
      signatories: [
        { role: "Welder", name: weld.welder_name },
        { role: "QA/QC Inspector" },
        { role: "Project Manager" }
      ],
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 1, title: "Weld Identification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KvTable, { rows: [
          ["Weld number", weld.weld_no],
          ["Joint type", weld.joint_type ?? "—"],
          ["Base material", weld.base_material ?? "—"],
          ["Filler metal", weld.filler_metal ?? "—"],
          ["Heat input recorded", weld.heat_input ?? "—"],
          ["Welding date", fmtEngDate(weld.weld_date)]
        ] }),
        procedure && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 2, title: "Applicable Welding Procedure" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KvTable, { rows: [
            ["WPS code", procedure.code],
            ["Standard", procedure.standard],
            ["Process", procedure.process],
            ["Revision", procedure.revision],
            ["Approved on", fmtEngDate(procedure.approved_at)]
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: procedure ? 3 : 2, title: "Inspection Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Inspector" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Defect" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Result" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            inspections.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "text-center text-muted-foreground", children: "No inspections recorded against this weld." }) }),
            inspections.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtEngDate(i.inspected_at) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: i.inspection_type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i.inspector_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i.defect_type ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i.severity ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium uppercase", children: i.status })
            ] }, i.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: procedure ? 4 : 3, title: "Non-Conformance Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "NCR No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Due" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            ncrs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "text-center text-muted-foreground", children: "No NCRs raised — weld accepted as-is." }) }),
            ncrs.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: n.ncr_no }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: n.severity ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "uppercase", children: n.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: fmtEngDate(n.due_date) })
            ] }, n.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: procedure ? 5 : 4, title: "Lifecycle Events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date / Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Event" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Details" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            events.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "text-center text-muted-foreground", children: "No lifecycle events." }) }),
            events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-[9pt]", children: new Date(e.created_at).toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "uppercase", children: e.kind?.replace(/_/g, " ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.actor_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-[8.5pt] whitespace-pre-wrap", children: e.payload ? JSON.stringify(e.payload) : "—" })
            ] }, e.id))
          ] })
        ] })
      ]
    }
  );
}
function evaluateWeldCompatibility(input) {
  const { weld, wps, wpq } = input;
  const findings = [];
  if (!wps) {
    findings.push(f(
      "wps-missing",
      "critical",
      "WPS Match",
      "No WPS linked to this weld",
      "A welding procedure specification (WPS) is required for traceability and compliance — this weld currently has no procedure assigned.",
      "ASME IX QW-200.2",
      "Link an approved WPS that covers the joint, material and process before authorising production welding."
    ));
  } else {
    if (wps.status && wps.status.toLowerCase() !== "approved") {
      findings.push(f(
        "wps-not-approved",
        "critical",
        "WPS Match",
        `Linked WPS is in ${wps.status} status`,
        "Production welding may only be performed under an Approved WPS. The currently linked procedure has not completed approval.",
        "ASME IX QW-200.2",
        "Either complete WPS approval or link an alternative approved procedure."
      ));
    }
    if (weld.joint_type && wps.joint_type && norm$1(weld.joint_type) !== norm$1(wps.joint_type)) {
      findings.push(f(
        "wps-joint",
        "warning",
        "WPS Match",
        "Joint type differs from the WPS",
        `Weld joint type "${weld.joint_type}" does not match the WPS joint type "${wps.joint_type}".`,
        void 0,
        "Confirm with the welding engineer whether this WPS is intended to cover the as-built joint, or use a more specific WPS."
      ));
    }
    if (weld.base_material && wps.base_material && !materialMatch(weld.base_material, wps.base_material)) {
      findings.push(f(
        "wps-base",
        "warning",
        "Material",
        "Base material differs from the WPS",
        `Weld base material "${weld.base_material}" is not aligned with the WPS base material "${wps.base_material}".`,
        "ASME IX QW-403"
      ));
    }
    if (weld.filler_metal && wps.filler_material && !materialMatch(weld.filler_metal, wps.filler_material)) {
      findings.push(f(
        "wps-filler",
        "warning",
        "Material",
        "Filler metal differs from the WPS",
        `Weld filler "${weld.filler_metal}" is not aligned with the WPS filler "${wps.filler_material}".`
      ));
    }
    if (weld.position && wps.position && !positionCovered(weld.position, wps.position)) {
      findings.push(f(
        "wps-position",
        "warning",
        "Position",
        `Production position ${weld.position} not listed on the WPS`,
        `The WPS covers position "${wps.position}". Verify the WPS qualification includes the as-built position.`,
        "ASME IX QW-461"
      ));
    }
    if (weld.thicknessMm != null && wps.thickness_range) {
      const within = thicknessWithinText(weld.thicknessMm, wps.thickness_range);
      if (within === false) {
        findings.push(f(
          "wps-thk",
          "critical",
          "Range",
          "Production thickness outside WPS range",
          `Weld thickness ${weld.thicknessMm} mm is outside the WPS thickness range "${wps.thickness_range}".`,
          "ASME IX QW-451",
          "Use a WPS qualified for this thickness or escalate to the welding engineer."
        ));
      }
    }
    if (wps.heat_input_max != null) {
      const hi = parseHeatInput(weld.heat_input);
      if (hi != null && hi > wps.heat_input_max) {
        findings.push(f(
          "wps-heat-high",
          "critical",
          "Range",
          "Heat input above WPS maximum",
          `Recorded heat input ${hi.toFixed(2)} kJ/mm exceeds the WPS maximum ${wps.heat_input_max} kJ/mm.`,
          "ASME IX QW-409"
        ));
      } else if (hi != null && wps.heat_input_min != null && hi < wps.heat_input_min) {
        findings.push(f(
          "wps-heat-low",
          "warning",
          "Range",
          "Heat input below WPS minimum",
          `Recorded heat input ${hi.toFixed(2)} kJ/mm is below the WPS minimum ${wps.heat_input_min} kJ/mm.`,
          "ASME IX QW-409"
        ));
      }
    }
  }
  if (!wpq) {
    findings.push(f(
      "wpq-missing",
      "critical",
      "Welder Qualification",
      "No WPQ linked to this weld",
      "Welder qualification record is missing — the welder cannot be confirmed as qualified for this production weld.",
      "ASME IX QW-301",
      "Assign a qualified welder and link their WPQ to this weld."
    ));
  } else {
    const wpqReport = evaluateQualification(wpq, {
      process: wps?.process ?? wpq.process ?? void 0,
      thicknessMm: weld.thicknessMm,
      diameterMm: weld.diameterMm,
      isPipe: weld.isPipe,
      position: weld.position,
      withBacking: weld.withBacking,
      pNumber: weld.pNumber,
      isoGroup: weld.isoGroup
    });
    for (const wf of wpqReport.findings) {
      const isPlan = wf.id.startsWith("plan-");
      const isStatus = [
        "status-expired",
        "status-expiring",
        "status-suspended",
        "result-fail",
        "continuity-broken",
        "continuity-warning"
      ].includes(wf.id);
      if (isPlan || isStatus) {
        findings.push({ ...wf, id: `wpq-${wf.id}` });
      }
    }
  }
  if (wps && wpq) {
    if (wps.process && wpq.process && norm$1(wps.process) !== norm$1(wpq.process)) {
      findings.push(f(
        "crs-process",
        "critical",
        "Process",
        `WPS process ${wps.process} not covered by WPQ ${wpq.process}`,
        "The selected WPS uses a welding process that is not on the welder's qualification record.",
        "ASME IX QW-301.2",
        "Either pick a WPS using the welder's qualified process, or qualify the welder on the required process."
      ));
    }
    if (wps.standard && wpq.standard && norm$1(wps.standard) !== norm$1(wpq.standard)) {
      findings.push(f(
        "crs-standard",
        "info",
        "WPS Match",
        "WPS and WPQ reference different standards",
        `WPS standard is "${wps.standard}", WPQ standard is "${wpq.standard}". Verify equivalence.`
      ));
    }
    if (wps.base_material && wpq.test_coupon_type && !materialMatch(wps.base_material, wpq.test_coupon_type)) {
      findings.push(f(
        "crs-material",
        "info",
        "Material",
        "WPS base material vs. WPQ coupon — verify P-Number coverage",
        `WPS base "${wps.base_material}" should map to a P-Number / group covered by the welder's qualification "${wpq.test_coupon_type}".`,
        "ASME IX QW-423"
      ));
    }
  }
  if (wpq) {
    const ranges = deriveQualificationRanges({
      code: wpq.code_family ?? "ASME IX",
      process: wpq.process ?? "",
      testCouponThicknessMm: numOrUndef(wpq.test_thickness_mm),
      testCouponDiameterMm: numOrUndef(wpq.test_diameter_mm),
      testPosition: wpq.position_qualified ?? void 0,
      withBacking: !!wpq.with_backing,
      isPipe: (wpq.test_coupon_type ?? "").toLowerCase().includes("pipe")
    });
    if (weld.thicknessMm != null && !isWithinRange(weld.thicknessMm, ranges.baseThickness)) {
      findings.push(f(
        "cov-thk",
        "critical",
        "Coverage Gap",
        "Welder not qualified for this thickness",
        `Weld thickness ${weld.thicknessMm} mm is outside the welder's qualified base-metal range (${formatRange(ranges.baseThickness)}).`,
        "ASME IX QW-452.1(b)",
        "Use a welder qualified on a thicker coupon, or qualify the assigned welder on a coupon that covers this thickness."
      ));
    }
    if (weld.position && ranges.positions.length > 0 && !ranges.positions.some((p) => p.toUpperCase().startsWith(weld.position.toUpperCase()))) {
      findings.push(f(
        "cov-pos",
        "critical",
        "Coverage Gap",
        `Welder not qualified for position ${weld.position}`,
        `WPQ qualifies positions [${ranges.positions.join(", ")}]; production position ${weld.position} is not covered.`,
        "ASME IX QW-461.9"
      ));
    }
  }
  if (weld.thicknessMm == null) {
    findings.push(f(
      "data-thk",
      "warning",
      "Data Quality",
      "Weld thickness not provided",
      "Without the production thickness, range-based compliance checks cannot be evaluated.",
      void 0,
      "Enter the weld thickness in the production parameters panel."
    ));
  }
  if (weld.position == null) {
    findings.push(f(
      "data-pos",
      "warning",
      "Data Quality",
      "Production position not provided",
      "Position-based qualification checks require the production weld position (e.g. 6G, 3F)."
    ));
  }
  const subscores = {
    wpsToWeld: scoreFor(findings, ["WPS Match", "Range", "Material", "Position"]),
    wpqToWeld: scoreFor(findings, ["Welder Qualification", "Continuity", "Status", "Coverage Gap", "Backing"]),
    wpsToWpq: scoreFor(findings, ["Process", "WPS Match", "Material"], (id) => id.startsWith("crs-"))
  };
  const overallScore = Math.round(
    subscores.wpsToWeld * 0.35 + subscores.wpqToWeld * 0.45 + subscores.wpsToWpq * 0.2
  );
  const hasCritical = findings.some((f2) => f2.severity === "critical");
  const hasWarning = findings.some((f2) => f2.severity === "warning");
  const riskLevel = hasCritical ? "High" : hasWarning ? "Medium" : "Low";
  const readiness = hasCritical ? "Hold — do not weld" : hasWarning ? "Conditional — review required" : "Ready to weld";
  const summary = readiness === "Ready to weld" ? "All compatibility checks passed." : `${findings.filter((x) => x.severity === "critical").length} critical and ${findings.filter((x) => x.severity === "warning").length} warning items detected.`;
  return { findings, subscores, overallScore, riskLevel, readiness, summary };
}
function f(id, severity, category, title, message, codeRef, remediation) {
  return { id, severity, category, title, message, codeRef, remediation };
}
function norm$1(s) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function materialMatch(a, b) {
  const A = norm$1(a);
  const B = norm$1(b);
  if (A === B) return true;
  return A.includes(B) || B.includes(A);
}
function positionCovered(weldPos, wpsPos) {
  const w = norm$1(weldPos);
  const p = norm$1(wpsPos);
  if (w === p) return true;
  if (p.includes("all")) return true;
  if (p.includes(w)) return true;
  return false;
}
function thicknessWithinText(t, range) {
  const r = range.replace(",", ".");
  const inches = /in\b|"|inch/i.test(r);
  const mul = inches ? 25.4 : 1;
  const bothNums = r.match(/(-?\d+(?:\.\d+)?)\s*(?:[-–to]+)\s*(-?\d+(?:\.\d+)?)/i);
  if (bothNums) {
    const min = Number(bothNums[1]) * mul;
    const max = Number(bothNums[2]) * mul;
    return t >= min && t <= max;
  }
  const minOnly = r.match(/(?:>=|≥|min|>\s*=?)\s*(-?\d+(?:\.\d+)?)/i);
  if (minOnly) return t >= Number(minOnly[1]) * mul;
  const maxOnly = r.match(/(?:<=|≤|max|<\s*=?)\s*(-?\d+(?:\.\d+)?)/i);
  if (maxOnly) return t <= Number(maxOnly[1]) * mul;
  return null;
}
function parseHeatInput(s) {
  if (!s) return null;
  const m = String(s).match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}
function numOrUndef(v) {
  if (v == null || v === "") return void 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : void 0;
}
function scoreFor(findings, categories, predicate) {
  let score = 100;
  for (const f2 of findings) {
    if (predicate && !predicate(f2.id)) continue;
    if (!predicate && !categories.includes(f2.category)) continue;
    if (f2.severity === "critical") score -= 30;
    else if (f2.severity === "warning") score -= 10;
    else if (f2.severity === "info") score -= 2;
  }
  return Math.max(0, score);
}
function evaluateReleaseReadiness(input) {
  const { weld, wps, wpq, inspections = [], ncrs = [], instruments = [], requiredInspections = ["Visual"] } = input;
  const match = evaluateWeldCompatibility({ weld, wps, wpq });
  const findings = [...match.findings];
  const missingInspections = requiredInspections.filter(
    (t) => !inspections.some((i) => norm(i.inspection_type) === norm(t))
  );
  for (const m of missingInspections) {
    findings.push({
      id: `insp-missing-${m}`,
      severity: "critical",
      category: "WPS Match",
      title: `Missing mandatory ${m} inspection`,
      message: `Release requires a ${m} inspection record against this weld — none has been logged.`,
      remediation: `Schedule and record a ${m} inspection before release.`
    });
  }
  const openInspections = inspections.filter((i) => (i.status ?? "").toLowerCase() === "open");
  if (openInspections.length > 0) {
    findings.push({
      id: "insp-open",
      severity: "warning",
      category: "WPS Match",
      title: `${openInspections.length} open inspection${openInspections.length > 1 ? "s" : ""}`,
      message: "Inspections are still open — close them before authorising release."
    });
  }
  const failedInspections = inspections.filter(
    (i) => ["reject", "rejected", "fail", "failed"].includes((i.severity ?? "").toLowerCase()) || ["reject", "rejected", "fail"].includes((i.status ?? "").toLowerCase())
  );
  if (failedInspections.length > 0) {
    findings.push({
      id: "insp-fail",
      severity: "critical",
      category: "WPS Match",
      title: `${failedInspections.length} failed inspection${failedInspections.length > 1 ? "s" : ""}`,
      message: "One or more inspections recorded a reject / fail outcome.",
      remediation: "Raise an NCR (if not already) and complete corrective action before release."
    });
  }
  const openNcrs = ncrs.filter((n) => !["closed", "verified"].includes((n.status ?? "").toLowerCase()));
  if (openNcrs.length > 0) {
    findings.push({
      id: "ncr-open",
      severity: "critical",
      category: "WPS Match",
      title: `${openNcrs.length} open NCR${openNcrs.length > 1 ? "s" : ""}`,
      message: "Production weld cannot be released while NCRs against it remain open.",
      remediation: "Close NCRs through the standard CAPA workflow."
    });
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const expiredCal = instruments.filter((i) => i.calibration_due && i.calibration_due < today);
  const soonCal = instruments.filter((i) => {
    if (!i.calibration_due || i.calibration_due < today) return false;
    const diff = (new Date(i.calibration_due).getTime() - Date.now()) / 864e5;
    return diff <= 30;
  });
  for (const ins of expiredCal) {
    findings.push({
      id: `cal-exp-${ins.id}`,
      severity: "critical",
      category: "WPS Match",
      title: `Calibration expired — ${ins.asset_id ?? ins.name}`,
      message: `Instrument calibration expired on ${ins.calibration_due}. Measurements recorded under expired calibration are not admissible.`,
      remediation: "Recalibrate the instrument and re-verify the affected measurements."
    });
  }
  for (const ins of soonCal) {
    findings.push({
      id: `cal-soon-${ins.id}`,
      severity: "warning",
      category: "WPS Match",
      title: `Calibration due soon — ${ins.asset_id ?? ins.name}`,
      message: `Instrument calibration expires on ${ins.calibration_due}.`
    });
  }
  const ws = weld.workflow_status ?? "Draft";
  if (!weld.approved_at && !["Approved", "Released"].includes(ws)) {
    findings.push({
      id: "approval-pending",
      severity: "warning",
      category: "WPS Match",
      title: "Engineering approval pending",
      message: "This weld has not been approved by the welding engineer / QA-QC manager yet."
    });
  }
  const blockers = findings.filter((f2) => f2.severity === "critical");
  const warnings = findings.filter((f2) => f2.severity === "warning");
  const informational = findings.filter((f2) => f2.severity === "info" || f2.severity === "pass");
  let score = 100;
  score -= blockers.length * 25;
  score -= warnings.length * 8;
  score -= informational.length * 2;
  score = Math.max(0, Math.min(100, score));
  const verdict = ws === "Released" ? "Release Ready" : ws === "Approved" ? "Approved" : blockers.length > 0 ? "Blocked" : warnings.length > 0 ? "Warning" : "Ready for Release";
  const summary = verdict === "Blocked" ? `${blockers.length} blocker${blockers.length > 1 ? "s" : ""} must be cleared before release` : verdict === "Warning" ? `${warnings.length} warning${warnings.length > 1 ? "s" : ""} require engineering review` : verdict === "Ready for Release" ? "All operational checks satisfied — ready for engineering sign-off" : verdict === "Approved" ? "Approved by engineering — pending release" : "Released to production records";
  const tiles = [
    {
      key: "wps",
      label: "WPS",
      status: wps ? match.subscores.wpsToWeld >= 90 ? "ok" : match.subscores.wpsToWeld >= 60 ? "warn" : "fail" : "fail",
      value: wps ? `${match.subscores.wpsToWeld}/100` : "Missing",
      hint: wps ? `${wps.code ?? "—"} · ${wps.status ?? "—"}` : "Link a WPS to enable compliance checks"
    },
    {
      key: "wpq",
      label: "Welder WPQ",
      status: wpq ? match.subscores.wpqToWeld >= 90 ? "ok" : match.subscores.wpqToWeld >= 60 ? "warn" : "fail" : "fail",
      value: wpq ? `${match.subscores.wpqToWeld}/100` : "Missing",
      hint: wpq?.process ? `Process ${wpq.process}` : "Select the welder's qualification"
    },
    {
      key: "insp",
      label: "Inspections",
      status: failedInspections.length ? "fail" : missingInspections.length || openInspections.length ? "warn" : inspections.length ? "ok" : "warn",
      value: `${inspections.length} logged`,
      hint: missingInspections.length ? `Missing: ${missingInspections.join(", ")}` : openInspections.length ? `${openInspections.length} open` : "Closed"
    },
    {
      key: "ncr",
      label: "NCRs",
      status: openNcrs.length ? "fail" : ncrs.length ? "ok" : "ok",
      value: openNcrs.length ? `${openNcrs.length} open` : ncrs.length ? `${ncrs.length} closed` : "0",
      hint: openNcrs.length ? "Blocking release" : "Clear"
    },
    {
      key: "cal",
      label: "Calibration",
      status: expiredCal.length ? "fail" : soonCal.length ? "warn" : instruments.length ? "ok" : "neutral",
      value: expiredCal.length ? `${expiredCal.length} expired` : soonCal.length ? `${soonCal.length} due soon` : "OK",
      hint: instruments.length ? `${instruments.length} instrument${instruments.length > 1 ? "s" : ""} linked` : "No instruments linked"
    },
    {
      key: "appr",
      label: "Approval",
      status: weld.approved_at || ["Approved", "Released"].includes(ws) ? "ok" : "warn",
      value: weld.approved_at ? "Approved" : ws,
      hint: weld.approved_at ? new Date(weld.approved_at).toLocaleDateString() : "Pending engineering sign-off"
    }
  ];
  return { score, verdict, summary, tiles, blockers, warnings, informational, matchReport: match };
}
function norm(s) {
  return (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}
function ReleaseReadinessGauge({ readiness }) {
  const { score, verdict, summary, blockers, warnings } = readiness;
  const tone = verdict === "Blocked" ? "destructive" : verdict === "Warning" ? "warning" : "success";
  const ringColor = tone === "destructive" ? "stroke-destructive" : tone === "warning" ? "stroke-warning" : "stroke-success";
  const bgTone = tone === "destructive" ? "border-destructive/40 bg-destructive/5" : tone === "warning" ? "border-warning/40 bg-warning/5" : "border-success/40 bg-success/5";
  const Icon = tone === "destructive" ? ShieldAlert : tone === "warning" ? ShieldQuestionMark : ShieldCheck;
  const c = 2 * Math.PI * 52;
  const offset = c - score / 100 * c;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl border ${bgTone} p-6`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative size-32 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 120 120", className: "size-32 -rotate-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "60", cy: "60", r: "52", className: "fill-none stroke-border", strokeWidth: "10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "60",
            cy: "60",
            r: "52",
            className: `fill-none ${ringColor} transition-all duration-700`,
            strokeWidth: "10",
            strokeLinecap: "round",
            strokeDasharray: c,
            strokeDashoffset: offset
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-semibold tabular-nums", children: score }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Readiness" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-5 ${tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-success"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold tracking-tight", children: verdict })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: summary }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: "destructive", icon: TriangleAlert, count: blockers.length, label: "blockers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: "warning", icon: TriangleAlert, count: warnings.length, label: "warnings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { tone: "success", icon: CircleCheck, count: readiness.matchReport.findings.filter((f2) => f2.severity === "pass").length, label: "checks passed" })
      ] })
    ] })
  ] }) });
}
function Pill({
  tone,
  icon: Icon,
  count,
  label
}) {
  const cls = tone === "destructive" ? "border-destructive/40 text-destructive bg-destructive/10" : tone === "warning" ? "border-warning/40 text-warning bg-warning/10" : "border-success/40 text-success bg-success/10";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" }),
    " ",
    count,
    " ",
    label
  ] });
}
function ComplianceCenter({ weld }) {
  const [wpqId, setWpqId] = reactExports.useState("");
  const [params, setParams] = reactExports.useState({});
  const wps = useQuery({
    queryKey: ["wps-for-weld", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data;
    }
  });
  const wpqs = useQuery({
    queryKey: ["wpq-options", weld.welder_name],
    queryFn: async () => {
      const q = supabase.from("qualifications").select("*");
      const { data } = weld.welder_name ? await q.ilike("welder_name", `%${weld.welder_name}%`).order("created_at", { ascending: false }) : await q.order("created_at", { ascending: false }).limit(25);
      return data ?? [];
    }
  });
  const inspections = useQuery({
    queryKey: ["inspections-cc", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weld.id);
      return data ?? [];
    }
  });
  const ncrs = useQuery({
    queryKey: ["ncrs-cc", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("ncrs").select("*").eq("weld_id", weld.id);
      return data ?? [];
    }
  });
  const instruments = useQuery({
    queryKey: ["instr-cc", weld.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("instruments").select("*").order("calibration_due", { ascending: true }).limit(6);
      return data ?? [];
    }
  });
  const autoWpqId = wpqs.data?.[0]?.id ?? "";
  const effectiveId = wpqId || autoWpqId;
  const wpq = wpqs.data?.find((q) => q.id === effectiveId) ?? null;
  const readiness = reactExports.useMemo(() => evaluateReleaseReadiness({
    weld: { ...weld, ...params },
    wps: wps.data ?? null,
    wpq,
    inspections: inspections.data ?? [],
    ncrs: ncrs.data ?? [],
    instruments: instruments.data ?? []
  }), [weld, params, wps.data, wpq, inspections.data, ncrs.data, instruments.data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReleaseReadinessGauge, { readiness }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2", children: readiness.tiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: t }, t.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "size-4 text-primary" }),
          " Production parameters"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => {
          setParams({});
          setWpqId("");
        }, children: "Reset" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Welder qualification (WPQ)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm",
            value: effectiveId,
            onChange: (e) => setWpqId(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select WPQ —" }),
              (wpqs.data ?? []).map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: q.id, children: [
                q.welder_name,
                " · ",
                q.wpq_number ?? q.employee_id,
                " · ",
                q.process
              ] }, q.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Thickness (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: params.thicknessMm ?? "", onChange: (e) => setParams((s) => ({ ...s, thicknessMm: Number(e.target.value) || void 0 })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Pipe OD (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: params.diameterMm ?? "", onChange: (e) => setParams((s) => ({ ...s, diameterMm: Number(e.target.value) || void 0, isPipe: !!Number(e.target.value) })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: params.position ?? "", onChange: (e) => setParams((s) => ({ ...s, position: e.target.value.toUpperCase() })), placeholder: "6G" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "P-Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: params.pNumber ?? "", onChange: (e) => setParams((s) => ({ ...s, pNumber: Number(e.target.value) || void 0 })) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PF, { label: "Backing", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm",
            value: params.withBacking == null ? "" : params.withBacking ? "yes" : "no",
            onChange: (e) => setParams((s) => ({ ...s, withBacking: e.target.value === "" ? void 0 : e.target.value === "yes" })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yes", children: "With backing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "no", children: "Without backing" })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindingsGroup,
      {
        title: "Release Blockers",
        tone: "destructive",
        items: readiness.blockers,
        emptyLabel: "No release blockers detected"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindingsGroup,
      {
        title: "Warnings — Engineering Review",
        tone: "warning",
        items: readiness.warnings,
        emptyLabel: "No warnings"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindingsGroup,
      {
        title: "Informational & Advisory Notes",
        tone: "info",
        items: readiness.informational,
        emptyLabel: "No advisory items",
        defaultClosed: true
      }
    )
  ] });
}
function Tile({ tile }) {
  const cfg = tile.status === "fail" ? { cls: "border-destructive/40 bg-destructive/5", text: "text-destructive", Icon: CircleSlash } : tile.status === "warn" ? { cls: "border-warning/40 bg-warning/5", text: "text-warning", Icon: CircleAlert } : tile.status === "ok" ? { cls: "border-success/40 bg-success/5", text: "text-success", Icon: CircleCheck } : { cls: "border-border bg-muted/20", text: "text-muted-foreground", Icon: CircleDot };
  const Icon = cfg.Icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border ${cfg.cls} p-3`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: tile.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-3.5 ${cfg.text}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-base font-semibold mt-1 ${cfg.text}`, children: tile.value }),
    tile.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5 leading-tight truncate", children: tile.hint })
  ] });
}
function FindingsGroup({
  title,
  tone,
  items,
  emptyLabel,
  defaultClosed
}) {
  const palette = tone === "destructive" ? { border: "border-destructive/40", bg: "bg-destructive/5", text: "text-destructive", Icon: TriangleAlert } : tone === "warning" ? { border: "border-warning/40", bg: "bg-warning/5", text: "text-warning", Icon: TriangleAlert } : { border: "border-border", bg: "bg-muted/30", text: "text-muted-foreground", Icon: Info };
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 flex items-center gap-3 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-success" }),
      " ",
      emptyLabel
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Collapsible, { defaultOpen: !defaultClosed, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `border ${palette.border} ${palette.bg}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CollapsibleTrigger, { className: "w-full flex items-center justify-between p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(palette.Icon, { className: `size-4 ${palette.text}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-semibold ${palette.text}`, children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs rounded-full border px-2 py-0.5 ${palette.border} ${palette.text}`, children: items.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 p-4 pt-0", children: items.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsx(FindingRow, { f: f2 }, f2.id)) }) })
  ] }) });
}
function FindingRow({ f: f2 }) {
  const [open, setOpen] = reactExports.useState(false);
  const tone = f2.severity === "critical" ? "border-destructive/30 bg-background/40" : f2.severity === "warning" ? "border-warning/30 bg-background/40" : f2.severity === "pass" ? "border-success/30 bg-background/40" : "border-border bg-background/40";
  const dot = f2.severity === "critical" ? "bg-destructive" : f2.severity === "warning" ? "bg-warning" : f2.severity === "pass" ? "bg-success" : "bg-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `rounded-md border ${tone}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((s) => !s), className: "w-full flex items-start gap-3 p-3 text-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-1.5 size-2 rounded-full ${dot} shrink-0` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: f2.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: f2.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 mt-1", children: f2.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-4 text-muted-foreground transition-transform shrink-0 mt-1 ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 pt-0 text-sm space-y-2 border-t border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/85 leading-relaxed pt-3", children: f2.message }),
      f2.codeRef && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-muted-foreground", children: "Code reference: " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: f2.codeRef })
      ] }),
      f2.remediation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs rounded-md border border-primary/30 bg-primary/5 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "Recommended action: " }),
        f2.remediation
      ] })
    ] })
  ] });
}
function PF({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
function TraceabilityGraph({ weld }) {
  const wps = useQuery({
    queryKey: ["trace-wps", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data;
    }
  });
  const wpq = useQuery({
    queryKey: ["trace-wpq", weld.welder_name],
    enabled: !!weld.welder_name,
    queryFn: async () => {
      const { data } = await supabase.from("qualifications").select("*").ilike("welder_name", `%${weld.welder_name}%`).order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    }
  });
  const inspections = useQuery({
    queryKey: ["trace-insp", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weld.id).order("inspected_at", { ascending: false });
      return data ?? [];
    }
  });
  const ncrs = useQuery({
    queryKey: ["trace-ncr", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("ncrs").select("*").eq("weld_id", weld.id);
      return data ?? [];
    }
  });
  const approvals = useQuery({
    queryKey: ["trace-appr", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedure_approvals").select("*").eq("procedure_id", weld.procedure_id).order("signed_at", { ascending: false });
      return data ?? [];
    }
  });
  const instruments = useQuery({
    queryKey: ["trace-instr"],
    queryFn: async () => {
      const { data } = await supabase.from("instruments").select("*").order("calibration_due").limit(4);
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "End-to-end traceability for this weld. Click any card to open the underlying engineering record." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FlowRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Node,
        {
          icon: Layers,
          tone: "primary",
          label: "Production Weld",
          title: weld.weld_no,
          subtitle: `${weld.weld_date} · ${weld.welder_name ?? "—"}`,
          rows: [
            ["Line", weld.line_no ?? "—"],
            ["Spool", weld.spool_no ?? "—"],
            ["Drawing", weld.drawing_ref ?? "—"]
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Node,
        {
          icon: FileText,
          tone: "info",
          label: "WPS",
          title: wps.data?.code ?? wps.data?.wps_no ?? "Not linked",
          subtitle: wps.data ? `${wps.data.process} · ${wps.data.standard}` : "Link a procedure",
          to: wps.data ? "/app/procedures/$procedureId" : void 0,
          params: wps.data ? { procedureId: wps.data.id } : void 0,
          rows: wps.data ? [
            ["Status", wps.data.status],
            ["Revision", wps.data.revision],
            ["Position", wps.data.position_qualified ?? "—"]
          ] : [],
          missing: !wps.data
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Node,
        {
          icon: ShieldCheck,
          tone: "success",
          label: "WPQ",
          title: wpq.data?.wpq_number ?? "Not linked",
          subtitle: wpq.data ? `${wpq.data.process} · ${wpq.data.position_qualified ?? "—"}` : "No matching qualification",
          to: wpq.data ? "/app/qualifications/$qualId" : void 0,
          params: wpq.data ? { qualId: wpq.data.id } : void 0,
          rows: wpq.data ? [
            ["Status", wpq.data.status],
            ["Expires", wpq.data.expiry_date ?? "—"],
            ["Continuity", wpq.data.last_continuity_date ?? "—"]
          ] : [],
          missing: !wpq.data
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Node,
        {
          icon: User,
          tone: "neutral",
          label: "Welder",
          title: weld.welder_name ?? "—",
          subtitle: wpq.data?.employee_id ?? "No employee ID",
          rows: [
            ["Stamp", wpq.data?.stamp_number ?? "—"]
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FlowRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Node,
        {
          icon: Layers,
          tone: "neutral",
          label: "Base Material",
          title: weld.base_material ?? "—",
          subtitle: `Heat ${weld.heat_number ?? "—"}`,
          rows: [["Filler", weld.filler_metal ?? "—"]]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GroupNode,
        {
          icon: ClipboardCheck,
          tone: "info",
          label: "Inspections",
          count: inspections.data?.length ?? 0,
          items: (inspections.data ?? []).slice(0, 4).map((i) => ({
            id: i.id,
            title: i.inspection_type,
            sub: `${i.severity ?? "—"} · ${new Date(i.inspected_at).toLocaleDateString()}`
          })),
          emptyLabel: "No inspections logged"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GroupNode,
        {
          icon: OctagonAlert,
          tone: (ncrs.data ?? []).some((n) => !["Closed", "Verified"].includes(n.status)) ? "destructive" : "success",
          label: "NCRs",
          count: ncrs.data?.length ?? 0,
          items: (ncrs.data ?? []).slice(0, 4).map((n) => ({
            id: n.id,
            title: n.ncr_no,
            sub: `${n.status} · ${n.severity ?? "—"}`,
            to: "/app/ncrs/$ncrId",
            params: { ncrId: n.id }
          })),
          emptyLabel: "No NCRs raised"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GroupNode,
        {
          icon: Wrench,
          tone: "neutral",
          label: "Calibration",
          count: instruments.data?.length ?? 0,
          items: (instruments.data ?? []).slice(0, 4).map((i) => ({
            id: i.id,
            title: i.asset_id,
            sub: `Due ${i.calibration_due ?? "—"}`,
            to: "/app/instruments/$instrumentId",
            params: { instrumentId: i.id }
          })),
          emptyLabel: "No instruments linked"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GroupNode,
        {
          icon: Stamp,
          tone: "success",
          label: "Approvals",
          count: approvals.data?.length ?? 0,
          items: (approvals.data ?? []).slice(0, 4).map((a) => ({
            id: a.id,
            title: a.actor_name ?? a.actor_role ?? "Signatory",
            sub: `${a.action} · ${new Date(a.signed_at).toLocaleDateString()}`
          })),
          emptyLabel: "No approvals on linked WPS"
        }
      )
    ] })
  ] });
}
function FlowRow({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch gap-2 overflow-x-auto pb-2 -mx-1 px-1", children });
}
function Arrow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-muted-foreground/60 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }) });
}
const toneCls = (t) => t === "primary" ? "border-primary/40 bg-primary/5" : t === "info" ? "border-accent/40 bg-accent/5" : t === "success" ? "border-success/40 bg-success/5" : t === "destructive" ? "border-destructive/40 bg-destructive/5" : t === "warning" ? "border-warning/40 bg-warning/5" : "border-border bg-card";
const toneText = (t) => t === "primary" ? "text-primary" : t === "info" ? "text-accent" : t === "success" ? "text-success" : t === "destructive" ? "text-destructive" : t === "warning" ? "text-warning" : "text-muted-foreground";
function Node({ icon: Icon, tone, label, title, subtitle, rows = [], to, params, missing }) {
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `min-w-[200px] w-[200px] p-3 border ${toneCls(missing ? "warning" : tone)} ${to ? "transition hover:shadow-md hover:-translate-y-px cursor-pointer" : ""} h-full`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-3.5 ${toneText(missing ? "warning" : tone)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label })
      ] }),
      to && /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-sm font-semibold leading-tight truncate", children: title }),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: subtitle }),
    rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-0.5 border-t border-border/60 pt-2", children: rows.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2 text-[11px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-right", children: v ?? "—" })
    ] }, k)) })
  ] });
  if (to) return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, params, children: inner });
  return inner;
}
function GroupNode({
  icon: Icon,
  tone,
  label,
  count,
  items,
  emptyLabel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `min-w-[220px] w-[220px] p-3 border ${toneCls(tone)} h-full`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-3.5 ${toneText(tone)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-semibold ${toneText(tone)}`, children: count })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground italic", children: emptyLabel }),
      items.map((it) => {
        const row = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border/60 bg-background/40 px-2 py-1.5 text-xs hover:bg-background transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: it.title }),
          it.sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground truncate", children: it.sub })
        ] });
        return it.to ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: it.to, params: it.params, className: "block", children: row }, it.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: row }, it.id);
      })
    ] })
  ] });
}
function WeldWorkflowStepper({ status }) {
  const s = status;
  const branch = BRANCH_STATES.includes(s);
  const idx = stageIndex(branch ? "Awaiting Inspection" : s);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 sm:p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Workflow stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold mt-0.5", children: status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WeldStatusBadge, { status, size: "md" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex items-center w-full overflow-x-auto", children: WORKFLOW_STAGES.map((stage, i) => {
      const done = !branch && i < idx;
      const current = !branch && i === idx;
      const upcoming = !done && !current;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: cn(
            "flex items-center shrink-0",
            i < WORKFLOW_STAGES.length - 1 ? "flex-1 min-w-[120px]" : ""
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "size-8 rounded-full grid place-items-center border-2 transition-colors",
                    done && "bg-success border-success text-success-foreground",
                    current && "border-primary text-primary bg-primary/10",
                    upcoming && "border-border text-muted-foreground bg-background"
                  ),
                  children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: i + 1 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "mt-1.5 text-[11px] leading-tight max-w-[110px]",
                    current ? "text-foreground font-medium" : "text-muted-foreground"
                  ),
                  children: stage
                }
              )
            ] }),
            i < WORKFLOW_STAGES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "flex-1 h-0.5 mx-1 sm:mx-2 rounded transition-colors",
                  done ? "bg-success" : "bg-border"
                )
              }
            )
          ]
        },
        stage
      );
    }) }),
    branch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive", children: [
      "Workflow paused at ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: status }),
      " — resolve before continuing."
    ] })
  ] });
}
function WeldActionBar({ weldId, weldNo, status, canEdit }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(null);
  const [pending, setPending] = reactExports.useState(null);
  const [reason, setReason] = reactExports.useState("");
  const transitions = allowedTransitions(status);
  const runTransition = async (t, providedReason) => {
    setBusy(t.to);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const patch = { workflow_status: t.to };
    if (t.to === "Pending Validation") patch.submitted_for_validation_at = now;
    if (t.to === "Approved") {
      patch.approved_at = now;
      patch.approved_by = user?.id ?? null;
      patch.status = "Accepted";
    }
    if (t.to === "Released") {
      patch.released_at = now;
      patch.released_by = user?.id ?? null;
      patch.status = "Accepted";
    }
    if (t.to === "Rejected") {
      patch.rejected_at = now;
      patch.rejected_by = user?.id ?? null;
      patch.rejection_reason = providedReason ?? null;
      patch.status = "Rejected";
    }
    if (t.to === "Blocked") patch.blocked_reason = providedReason ?? null;
    if (t.to === "Draft") {
      patch.rejection_reason = null;
      patch.blocked_reason = null;
      patch.status = "Pending";
    }
    if (t.to === "NCR Open") patch.status = "Repair";
    const { error } = await supabase.from("welds").update(patch).eq("id", weldId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`${weldNo} → ${t.to}`);
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["weld_events", weldId] });
  };
  const handleClick = (t) => {
    if (t.needsReason) {
      setPending(t);
      setReason("");
    } else {
      runTransition(t);
    }
  };
  if (!canEdit) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground", children: "Read-only — request editor permissions to advance this weld." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-20 -mx-4 sm:mx-0 px-4 sm:px-5 py-3 rounded-none sm:rounded-xl border-b sm:border border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "Available actions for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        transitions.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: t.variant ?? "default",
            size: "sm",
            disabled: !!busy,
            onClick: () => handleClick(t),
            children: [
              busy === t.to && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 me-1.5 animate-spin" }),
              t.label
            ]
          },
          t.to + t.label
        )),
        transitions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "No transitions from this state." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!pending, onOpenChange: (o) => !o && setPending(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        pending?.label,
        " — ",
        weldNo
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reason", className: "text-xs", children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "reason",
            value: reason,
            onChange: (e) => setReason(e.target.value),
            placeholder: "Document why this weld is being moved to this state…",
            rows: 4
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPending(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: pending?.variant ?? "default",
            disabled: !reason.trim() || !!busy,
            onClick: async () => {
              if (!pending) return;
              const t = pending;
              setPending(null);
              await runTransition(t, reason.trim());
            },
            children: "Confirm"
          }
        )
      ] })
    ] }) })
  ] });
}
const KIND_ICON = {
  created: FilePlus,
  status_change: ArrowRight,
  workflow_transition: Activity,
  blocked: ShieldAlert,
  approved: ShieldCheck
};
function eventLabel(e) {
  if (e.kind === "workflow_transition") {
    const from = e.payload?.from, to = e.payload?.to;
    return {
      title: `Workflow → ${to ?? "?"}`,
      detail: from ? `from ${from}` : void 0
    };
  }
  if (e.kind === "status_change") {
    return {
      title: `Status → ${e.payload?.to ?? "?"}`,
      detail: e.payload?.from ? `from ${e.payload.from}` : void 0
    };
  }
  if (e.kind === "created") return { title: "Weld created" };
  return { title: e.kind.replace(/_/g, " ") };
}
function WeldTimeline({ events }) {
  if (events.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground", children: "No activity yet — the timeline updates as the weld moves through the workflow." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative border-s border-border ms-2 space-y-5", children: events.map((e) => {
    const Icon = KIND_ICON[e.kind] ?? CircleDot;
    const { title, detail } = eventLabel(e);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ms-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -start-3 mt-0.5 size-6 rounded-full bg-card border border-border grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
        new Date(e.created_at).toLocaleString(),
        detail && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: detail })
        ] }),
        e.actor_name && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: e.actor_name })
        ] })
      ] }),
      e.payload?.reason && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs rounded-md bg-muted/40 px-2 py-1 border border-border/60", children: e.payload.reason })
    ] }, e.id);
  }) }) });
}
function WeldGuidanceStrip({ weld }) {
  const { roles } = useAuth();
  const [dialog, setDialog] = reactExports.useState(null);
  const wps = useQuery({
    queryKey: ["wps-for-weld", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data;
    }
  });
  const wpqs = useQuery({
    queryKey: ["wpq-options", weld.welder_name],
    queryFn: async () => {
      const q = supabase.from("qualifications").select("*");
      const { data } = weld.welder_name ? await q.ilike("welder_name", `%${weld.welder_name}%`).order("created_at", { ascending: false }) : await q.order("created_at", { ascending: false }).limit(1);
      return data ?? [];
    }
  });
  const inspections = useQuery({
    queryKey: ["inspections-cc", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weld.id);
      return data ?? [];
    }
  });
  const ncrs = useQuery({
    queryKey: ["ncrs-cc", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("ncrs").select("*").eq("weld_id", weld.id);
      return data ?? [];
    }
  });
  const instruments = useQuery({
    queryKey: ["instr-cc", weld.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("instruments").select("*").order("calibration_due", { ascending: true }).limit(6);
      return data ?? [];
    }
  });
  const readiness = reactExports.useMemo(
    () => evaluateReleaseReadiness({
      weld,
      wps: wps.data ?? null,
      wpq: wpqs.data?.[0] ?? null,
      inspections: inspections.data ?? [],
      ncrs: ncrs.data ?? [],
      instruments: instruments.data ?? []
    }),
    [weld, wps.data, wpqs.data, inspections.data, ncrs.data, instruments.data]
  );
  const recs = reactExports.useMemo(
    () => recommendForWeld({ weldId: weld.id, weld, readiness }),
    [weld, readiness]
  );
  const verdict = weldVerdict(readiness, recs);
  const topAction = recs.find((r) => r.severity === verdict.severity && r.action) ?? recs.find((r) => r.action);
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
function WeldDetail() {
  const {
    weldId
  } = Route.useParams();
  const nav = useNavigate();
  const {
    profile,
    roles
  } = useAuth();
  const canEdit = roles.some((r) => ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r));
  const weld = useQuery({
    queryKey: ["weld", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("welds").select("*").eq("id", weldId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const events = useQuery({
    queryKey: ["weld_events", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("weld_events").select("*").eq("weld_id", weldId).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const inspections = useQuery({
    queryKey: ["inspections-weld", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("inspections").select("*").eq("weld_id", weldId).order("inspected_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const ncrs = useQuery({
    queryKey: ["ncrs-weld", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("ncrs").select("*").eq("weld_id", weldId);
      return data ?? [];
    }
  });
  if (weld.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
  ] });
  if (!weld.data) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Weld not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", onClick: () => nav({
      to: "/app/welds"
    }), children: "Back to welds" })
  ] });
  const w = weld.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/welds", className: "hover:text-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
        " Welds"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: w.weld_no })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WeldActionBar, { weldId, weldNo: w.weld_no, status: w.workflow_status ?? "Draft", canEdit }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WeldGuidanceStrip, { weld: w }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WeldWorkflowStepper, { status: w.workflow_status ?? "Draft" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: w.weld_no }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(WeldStatusBadge, { status: w.workflow_status ?? "Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: w.status }),
            w.inspection_status && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: w.inspection_status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
            "Welder ",
            w.welder_name ?? "—",
            " · ",
            w.weld_date
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/verify/weld/$token", params: {
          token: w.qr_token
        }, target: "_blank", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "size-4 me-1" }),
          " QR Verify"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { children: w.drawing_ref ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Chip, { children: [
          "Line ",
          w.line_no ?? "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Chip, { children: [
          "Spool ",
          w.spool_no ?? "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Chip, { children: [
          "Joint ",
          w.joint_no ?? "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { className: "text-foreground", children: w.weld_no })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Joint type", value: w.joint_type ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Base material", value: w.base_material ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Heat number", value: w.heat_number ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Filler metal", value: w.filler_metal ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Heat input", value: w.heat_input ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "WPS", value: w.procedure_id ? "Linked" : "—" })
      ] }),
      (w.rejection_reason || w.blocked_reason) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-destructive", children: w.blocked_reason ? "Blocked: " : "Rejected: " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: w.blocked_reason ?? w.rejection_reason })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "compliance", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "print:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "compliance", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 me-1.5" }),
          "Compliance Center"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "traceability", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "size-4 me-1.5" }),
          "Traceability"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "inspections", children: [
          "Inspections (",
          inspections.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "ncrs", children: [
          "NCRs (",
          ncrs.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "timeline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-4 me-1.5" }),
          "Timeline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "attachments", children: "Attachments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "certificate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 me-1.5" }),
          "Traceability Report"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "compliance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComplianceCenter, { weld: w }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "traceability", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TraceabilityGraph, { weld: w }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "inspections", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Defect" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Severity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (inspections.data ?? []).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: new Date(i.inspected_at).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: i.inspection_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: i.defect_type ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: i.severity ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: i.status })
          ] }, i.id)),
          (inspections.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10 text-center text-muted-foreground", children: "No inspections." }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ncrs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "NCR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Severity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Due" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (ncrs.data ?? []).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/ncrs/$ncrId", params: {
              ncrId: n.id
            }, className: "hover:text-primary", children: n.ncr_no }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: n.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: n.severity ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs", children: n.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-xs text-muted-foreground", children: n.due_date ?? "—" })
          ] }, n.id)),
          (ncrs.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-5 py-10 text-center text-muted-foreground", children: "No NCRs against this weld." }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timeline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeldTimeline, { events: events.data ?? [] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "attachments", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileUploader, { bucket: "weld-attachments", folder: `${weldId}`, table: "weld_attachments", recordIdColumn: "weld_id", recordId: weldId, hint: "Photos, RT films, sketches.", accept: "image/*,application/pdf" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "certificate", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeldTraceabilityDocument, { weld: w, inspections: inspections.data ?? [], ncrs: ncrs.data ?? [], events: events.data ?? [] }) })
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
function Chip({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded bg-muted/40 ${className}`, children });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-5 py-2.5", children });
}
export {
  WeldDetail as component
};
