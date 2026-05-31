import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { p as useComposedRefs, L as Link, B as Button, T as TriangleAlert, a as useNavigate, g as useQueryClient, b as useAuth, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { I as Info } from "./info-Dh0_vR51.js";
import { O as OctagonAlert } from "./octagon-alert-CjvTeUly.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { a as useControllableState, P as Primitive, u as useId, c as composeEventHandlers, b as useLayoutEffect2, e as createContextScope } from "./Combination-DU9AdJ2b.js";
import { P as Presence } from "./index-BuCuGgC7.js";
import { d as deriveQualStatus, c as continuityBroken, a as continuityWarning } from "./qualification-status-CLO5y49_.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
import { C as ChevronDown } from "./chevron-down-s9OCIUw0.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogDescription, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { S as Search } from "./search-DlrNhFVp.js";
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: COLLAPSIBLE_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: useId(),
        open,
        onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-state": getState(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible$1.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME = "CollapsibleTrigger";
var CollapsibleTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "CollapsibleContent";
var CollapsibleContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME, props.__scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent$1.displayName = CONTENT_NAME;
var CollapsibleContentImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible);
  const [isPresent, setIsPresent] = reactExports.useState(present);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = reactExports.useRef(0);
  const height = heightRef.current;
  const widthRef = reactExports.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = reactExports.useRef(isOpen);
  const originalStylesRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  useLayoutEffect2(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-state": getState(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState(open) {
  return open ? "open" : "closed";
}
var Root = Collapsible$1;
const Collapsible = Root;
const CollapsibleTrigger = CollapsibleTrigger$1;
const CollapsibleContent = CollapsibleContent$1;
const sevOrder = { critical: 3, warning: 2, info: 1, ok: 0 };
function highestSeverity(recs) {
  return recs.reduce(
    (acc, r) => sevOrder[r.severity] > sevOrder[acc] ? r.severity : acc,
    "ok"
  );
}
function sortRecs(recs) {
  return [...recs].sort((a, b) => sevOrder[b.severity] - sevOrder[a.severity]);
}
function recommendForWeld(input) {
  const { weldId, weld, readiness } = input;
  const recs = [];
  for (const f of readiness.blockers) {
    recs.push({
      id: `weld-${weldId}-${f.id}`,
      severity: "critical",
      title: f.title,
      why: f.message,
      rule: f.codeRef,
      impact: "Production weld cannot be released — release authorisation will fail QA/QC review.",
      remediation: f.remediation ?? "Resolve the blocking condition and re-run the compliance check.",
      action: mapFindingAction(f.id, weldId),
      roles: ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"]
    });
  }
  for (const f of readiness.warnings) {
    recs.push({
      id: `weld-${weldId}-${f.id}`,
      severity: "warning",
      title: f.title,
      why: f.message,
      rule: f.codeRef,
      impact: "Engineering review required before this weld can progress to approval.",
      remediation: f.remediation ?? "Review the highlighted condition with the welding engineer.",
      action: mapFindingAction(f.id, weldId),
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  const ws = weld.workflow_status ?? "Draft";
  if (ws === "Ready for Release" && readiness.blockers.length === 0) {
    recs.push({
      id: `weld-${weldId}-approval`,
      severity: "info",
      title: "Request engineering approval",
      why: "All operational checks have passed — the weld is awaiting sign-off from the welding engineer / QA-QC manager.",
      impact: "Without approval the weld cannot be released to production records.",
      remediation: "Submit the weld for approval from the action bar.",
      action: { label: "Submit for approval", kind: "open-dialog", dialog: "request-approval", payload: { weldId } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (!weld.procedure_id) {
    recs.push({
      id: `weld-${weldId}-link-wps`,
      severity: "critical",
      title: "Link a compatible WPS",
      why: "No WPS is linked to this weld, so essential-variable compliance cannot be evaluated.",
      rule: "ASME IX QW-200",
      impact: "Release readiness cannot be calculated; the weld will be flagged in every report.",
      remediation: "Pick a WPS qualified for the weld's process, material and thickness.",
      action: { label: "Pick compatible WPS", kind: "open-dialog", dialog: "pick-wps", payload: { weldId } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (!weld.welder_name) {
    recs.push({
      id: `weld-${weldId}-assign-welder`,
      severity: "warning",
      title: "Assign a qualified welder",
      why: "No welder is assigned to this weld, so WPQ matching is impossible.",
      impact: "Continuity tracking and qualification coverage cannot be enforced.",
      remediation: "Assign a welder whose WPQ covers the WPS process, position and thickness range.",
      action: { label: "Assign welder", kind: "open-dialog", dialog: "assign-welder", payload: { weldId } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  return sortRecs(recs);
}
function mapFindingAction(findingId, weldId) {
  if (findingId === "insp-open") {
    return { label: "Close inspection", kind: "navigate", to: "/app/inspections" };
  }
  if (findingId === "insp-fail" || findingId.startsWith("insp-missing-")) {
    return { label: "Log inspection", kind: "open-dialog", dialog: "create-inspection", payload: { weldId } };
  }
  if (findingId === "ncr-open") {
    return { label: "Open NCRs", kind: "navigate", to: "/app/ncrs" };
  }
  if (findingId.startsWith("cal-")) {
    return { label: "Request recalibration", kind: "navigate", to: "/app/instruments" };
  }
  if (findingId === "approval-pending") {
    return { label: "Request approval", kind: "open-dialog", dialog: "request-approval", payload: { weldId } };
  }
  return void 0;
}
function weldVerdict(readiness, recs) {
  const sev = highestSeverity(recs);
  if (readiness.verdict === "Release Ready") {
    return { severity: "ok", label: "Released", summary: "Weld is released to production records." };
  }
  if (readiness.verdict === "Approved") {
    return { severity: "ok", label: "Approved", summary: "Approved by engineering — pending release." };
  }
  if (sev === "critical") {
    return {
      severity: "critical",
      label: "Critical Risk",
      summary: `${readiness.blockers.length} blocker${readiness.blockers.length === 1 ? "" : "s"} prevent release.`,
      next: recs.find((r) => r.severity === "critical")?.title
    };
  }
  if (sev === "warning") {
    return {
      severity: "warning",
      label: "Attention Required",
      summary: `${readiness.warnings.length} warning${readiness.warnings.length === 1 ? "" : "s"} require engineering review.`,
      next: recs.find((r) => r.severity === "warning")?.title
    };
  }
  if (sev === "info") {
    return {
      severity: "info",
      label: "Pending Review",
      summary: readiness.summary,
      next: recs[0]?.title
    };
  }
  return { severity: "ok", label: "Ready for Release", summary: "All operational checks satisfied." };
}
function qualReadinessScore(q) {
  const status = deriveQualStatus({
    expiry_date: q.expiry_date,
    status: q.status,
    last_continuity_date: q.last_continuity_date
  });
  const broken = continuityBroken(q.last_continuity_date ?? null);
  const warn = continuityWarning(q.last_continuity_date ?? null);
  let score = 100;
  if (status === "Expired") score -= 60;
  else if (status === "Expiring Soon") score -= 25;
  else if (status === "Suspended") score -= 80;
  if (broken) score -= 40;
  else if (warn) score -= 12;
  if (!q.position_qualified) score -= 4;
  if (!q.test_thickness_mm) score -= 4;
  score = Math.max(0, Math.min(100, score));
  const continuityHealth = broken ? "Broken" : warn ? "At Risk" : "Healthy";
  const expiryRisk = status === "Expired" ? "Expired" : status === "Expiring Soon" ? "30 days" : "None";
  const complianceHealth = status === "Expired" || status === "Suspended" || broken ? "Fail" : status === "Expiring Soon" || warn ? "Warning" : "Pass";
  let band = "Ready";
  if (score < 40) band = "High Risk";
  else if (status === "Expiring Soon") band = "Expiring Soon";
  else if (score < 80) band = "Attention Required";
  return { score, band, continuityHealth, complianceHealth, expiryRisk };
}
function recommendForQualification({
  qualification: q,
  impact,
  replacements
}) {
  const recs = [];
  const status = deriveQualStatus({ expiry_date: q.expiry_date, status: q.status });
  const broken = continuityBroken(q.last_continuity_date ?? null);
  const warn = continuityWarning(q.last_continuity_date ?? null);
  const impactSuffix = impact && impact.affectedWelds + impact.pendingReleases > 0 ? ` Currently impacts ${impact.affectedWelds} active weld${impact.affectedWelds === 1 ? "" : "s"} across ${impact.affectedProjects} project${impact.affectedProjects === 1 ? "" : "s"}` + (impact.pendingReleases > 0 ? ` and ${impact.pendingReleases} pending release workflow${impact.pendingReleases === 1 ? "" : "s"}.` : ".") : "";
  const replacementHint = replacements && replacements.length > 0 ? ` Suggested replacements: ${replacements.slice(0, 3).map((r) => r.welder_name).join(", ")}.` : "";
  if (status === "Expired") {
    recs.push({
      id: `qual-${q.id}-expired`,
      severity: "critical",
      title: "Renew welder qualification",
      why: `Qualification expired on ${q.expiry_date}.${impactSuffix}`,
      rule: "ASME IX QW-322",
      impact: `Welder cannot legitimately weld on production work — any weld signed off under this WPQ may fail audit.${impactSuffix}`,
      remediation: `Re-test the welder against the same essential variables and issue a new WPQ.${replacementHint}`,
      action: { label: "Renew qualification", kind: "open-dialog", dialog: "renew-qualification", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  } else if (status === "Expiring Soon") {
    recs.push({
      id: `qual-${q.id}-expiring`,
      severity: "warning",
      title: "Qualification expiring soon",
      why: `Qualification expires on ${q.expiry_date}.${impactSuffix}`,
      rule: "ASME IX QW-322",
      impact: `Production planning should re-assign welders or schedule re-tests before expiry.${impactSuffix}`,
      remediation: `Schedule a renewal test now to avoid production interruption.${replacementHint}`,
      action: { label: "Schedule renewal", kind: "open-dialog", dialog: "renew-qualification", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (status === "Suspended") {
    recs.push({
      id: `qual-${q.id}-suspended`,
      severity: "critical",
      title: "Qualification is suspended",
      why: `This WPQ is currently suspended.${impactSuffix}`,
      rule: "ASME IX QW-322",
      impact: `Welder cannot perform production work under this qualification until reinstated.${impactSuffix}`,
      remediation: `Resolve the suspension cause and reinstate, or re-qualify the welder.${replacementHint}`,
      roles: ["super_admin", "qa_qc_manager"]
    });
  }
  if (broken) {
    recs.push({
      id: `qual-${q.id}-continuity-broken`,
      severity: "critical",
      title: "Continuity broken",
      why: `No welding activity logged in over 6 months (last activity ${q.last_continuity_date ?? "never recorded"}).${impactSuffix}`,
      rule: "ASME IX QW-322.1",
      impact: `Qualification is suspended for the affected process(es) until requalified.${impactSuffix}`,
      remediation: `Log production welding evidence (or schedule a renewal test) to restore continuity.${replacementHint}`,
      action: { label: "Log continuity", kind: "open-dialog", dialog: "log-continuity", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  } else if (warn) {
    recs.push({
      id: `qual-${q.id}-continuity-warn`,
      severity: "warning",
      title: "Continuity at risk",
      why: `Last welding activity recorded on ${q.last_continuity_date}. Continuity expires after 6 months without activity.`,
      rule: "ASME IX QW-322.1",
      impact: "Without an evidence log soon, the qualification will be suspended automatically.",
      remediation: "Log a recent production weld to extend continuity.",
      action: { label: "Log continuity", kind: "open-dialog", dialog: "log-continuity", payload: { qualId: q.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (!q.position_qualified) {
    recs.push({
      id: `qual-${q.id}-no-position`,
      severity: "info",
      title: "Position not recorded",
      why: "Position qualification is missing — coverage cannot be derived per QW-461.9.",
      rule: "ASME IX QW-461.9",
      impact: "Compliance reports will flag this WPQ as incomplete for position coverage.",
      remediation: "Edit the WPQ and record the tested position (e.g. 6G, 3G+4G).",
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  return sortRecs(recs);
}
function qualVerdict(q, recs, score, impact) {
  const sev = highestSeverity(recs);
  const impactPhrase = impact && impact.affectedWelds + impact.pendingReleases > 0 ? ` Impacts ${impact.affectedWelds} weld${impact.affectedWelds === 1 ? "" : "s"} / ${impact.affectedProjects} project${impact.affectedProjects === 1 ? "" : "s"}` + (impact.pendingReleases > 0 ? `, ${impact.pendingReleases} pending release.` : ".") : "";
  if (sev === "critical") {
    return {
      severity: "critical",
      label: score.band === "High Risk" ? "High Risk" : "Critical Risk",
      summary: `Qualification is not valid for production work.${impactPhrase}`,
      next: recs.find((r) => r.severity === "critical")?.title
    };
  }
  if (sev === "warning") {
    return {
      severity: "warning",
      label: score.band === "Expiring Soon" ? "Expiring Soon" : "Attention Required",
      summary: `Engineering review required to keep ${q.welder_name ?? "this welder"} on production.${impactPhrase}`,
      next: recs.find((r) => r.severity === "warning")?.title
    };
  }
  if (sev === "info") {
    return {
      severity: "info",
      label: "Pending Review",
      summary: `Minor data gaps to address.${impactPhrase}`,
      next: recs[0]?.title
    };
  }
  return {
    severity: "ok",
    label: "Ready",
    summary: `Qualification valid and active.${impactPhrase}`
  };
}
function wpsReadinessScore(wps, bundle, usage) {
  let score = 100;
  const status = (wps.status ?? "Draft").toLowerCase();
  if (status === "draft") score -= 20;
  else if (status === "review") score -= 10;
  else if (status === "rejected") score -= 60;
  if (bundle.joints.length === 0) score -= 10;
  if (bundle.baseMetals.length === 0) score -= 12;
  if (bundle.fillers.length === 0) score -= 12;
  if (bundle.electrical.length === 0) score -= 12;
  if (status === "approved" && bundle.signatures.length === 0) score -= 6;
  if (!wps.pqr_no) score -= 6;
  if (usage.outOfToleranceLogs > 0) score -= Math.min(15, usage.outOfToleranceLogs * 3);
  if (usage.blockedWelds > 0) score -= Math.min(15, usage.blockedWelds * 3);
  if (usage.openNcrs > 0) score -= Math.min(10, usage.openNcrs * 4);
  score = Math.max(0, Math.min(100, score));
  const approvalHealth = status === "approved" ? "Approved" : status === "review" ? "Pending" : status === "rejected" ? "Rejected" : "Draft";
  const gaps = (bundle.joints.length === 0 ? 1 : 0) + (bundle.baseMetals.length === 0 ? 1 : 0) + (bundle.fillers.length === 0 ? 1 : 0) + (bundle.electrical.length === 0 ? 1 : 0);
  const completeness = gaps === 0 ? "Complete" : gaps <= 1 ? "Gaps" : "Missing";
  const productionImpact = usage.activeWelds >= 25 || usage.pendingApprovals >= 5 ? "High" : usage.activeWelds >= 10 || usage.pendingApprovals >= 2 ? "Medium" : usage.activeWelds > 0 ? "Low" : "None";
  let band = "Approved";
  if (score < 40) band = "High Risk";
  else if (score < 70) band = "Attention Required";
  else if (status === "review") band = "In Review";
  else if (status === "draft") band = "Draft";
  return { score, band, approvalHealth, completeness, productionImpact };
}
function detectParameterDrift(wps, logs) {
  const out = [];
  for (const log of logs) {
    const v = Number(log.voltage), a = Number(log.current_amp), ts = Number(log.travel_speed), hi = Number(log.heat_input);
    const check = (metric, label, val, min, max) => {
      if (!Number.isFinite(val)) return;
      if (max != null && val > max) {
        out.push({
          id: `${log.id}-${metric}-high`,
          metric,
          label,
          recorded: val,
          min,
          max,
          severity: "critical",
          message: `${label} ${val} exceeds WPS max ${max}.`,
          weldId: log.weld_id,
          loggedAt: log.created_at
        });
      } else if (min != null && val < min) {
        out.push({
          id: `${log.id}-${metric}-low`,
          metric,
          label,
          recorded: val,
          min,
          max,
          severity: "warning",
          message: `${label} ${val} below WPS min ${min}.`,
          weldId: log.weld_id,
          loggedAt: log.created_at
        });
      }
    };
    check("voltage", "Voltage", v, wps.voltage_min, wps.voltage_max);
    check("current", "Current (A)", a, wps.current_min, wps.current_max);
    check("travel_speed", "Travel speed", ts, wps.travel_speed_min, wps.travel_speed_max);
    check("heat_input", "Heat input (kJ/mm)", hi, wps.heat_input_min, wps.heat_input_max);
  }
  return out.slice(0, 12);
}
function recommendForWps({
  wps,
  bundle,
  usage,
  compatibleWelders,
  drift = []
}) {
  const recs = [];
  const status = (wps.status ?? "Draft").toLowerCase();
  const impactSuffix = usage.activeWelds > 0 ? ` Currently impacts ${usage.activeWelds} active weld${usage.activeWelds === 1 ? "" : "s"} across ${usage.activeProjects} project${usage.activeProjects === 1 ? "" : "s"}` + (usage.pendingApprovals > 0 ? ` and ${usage.pendingApprovals} pending release${usage.pendingApprovals === 1 ? "" : "s"}.` : ".") : "";
  if (status === "draft") {
    recs.push({
      id: `wps-${wps.id}-submit`,
      severity: "info",
      title: "Submit WPS for review",
      why: "This WPS is still in Draft — production welding cannot reference it for compliance.",
      rule: "ASME IX QW-200.2",
      impact: `Any weld linked to a draft WPS will fail release readiness.${impactSuffix}`,
      remediation: "Complete the essential variables and submit the WPS for engineering review.",
      action: { label: "Submit for review", kind: "open-dialog", dialog: "request-approval", payload: { wpsId: wps.id } },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  } else if (status === "review") {
    recs.push({
      id: `wps-${wps.id}-approve`,
      severity: "info",
      title: "Awaiting approval signature",
      why: "WPS is under review and waiting for the welding engineer / QA-QC manager sign-off.",
      rule: "ASME IX QW-201",
      impact: `Production welds linked to this WPS cannot be released until approved.${impactSuffix}`,
      remediation: "Review the procedure, confirm essential variables, and approve or reject.",
      roles: ["super_admin", "qa_qc_manager"]
    });
  } else if (status === "rejected") {
    recs.push({
      id: `wps-${wps.id}-rejected`,
      severity: "critical",
      title: "WPS rejected — production blocked",
      why: "This WPS was rejected during review and cannot be used for production welding.",
      impact: `All welds linked to this WPS are non-compliant until a new revision is approved.${impactSuffix}`,
      remediation: "Issue a corrected revision, address the rejection comments, and re-submit for approval.",
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (bundle.joints.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-joints`,
      severity: "warning",
      title: "Add joint configuration",
      why: "No joint configuration is defined for this WPS.",
      rule: "ASME IX QW-402",
      impact: "Welds will not have geometry traceability and the WPS document will print incomplete.",
      remediation: "Add at least one joint with groove geometry and (optionally) a sketch.",
      roles: ["super_admin", "welding_engineer"]
    });
  }
  if (bundle.baseMetals.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-base`,
      severity: "warning",
      title: "Add base metals",
      why: "No base metals are defined — P-Number coverage cannot be derived.",
      rule: "ASME IX QW-403",
      impact: "Material compatibility checks will fail for every linked weld.",
      remediation: "Add at least one base metal with P-No and thickness range.",
      roles: ["super_admin", "welding_engineer"]
    });
  }
  if (bundle.fillers.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-filler`,
      severity: "warning",
      title: "Add filler metals",
      why: "No filler metals are defined for this procedure.",
      rule: "ASME IX QW-404",
      impact: "Consumable traceability is missing and WPS↔WPQ matching cannot resolve F-Number.",
      remediation: "Add at least one filler with AWS class / SFA No and F-No.",
      roles: ["super_admin", "welding_engineer"]
    });
  }
  if (bundle.electrical.length === 0) {
    recs.push({
      id: `wps-${wps.id}-no-electrical`,
      severity: "warning",
      title: "Add electrical parameters",
      why: "No amperage / voltage ranges are defined — parameter drift cannot be detected.",
      rule: "ASME IX QW-409",
      impact: "Heat-input and parameter compliance for every linked weld is unverifiable.",
      remediation: "Add at least one pass with amperage and voltage ranges.",
      roles: ["super_admin", "welding_engineer"]
    });
  }
  if (drift.length > 0) {
    const crit = drift.filter((d) => d.severity === "critical").length;
    recs.push({
      id: `wps-${wps.id}-drift`,
      severity: crit > 0 ? "critical" : "warning",
      title: `Parameter drift detected on ${drift.length} log${drift.length === 1 ? "" : "s"}`,
      why: `Production logs are drifting outside WPS expected ranges (${crit} critical, ${drift.length - crit} warning).`,
      rule: "ASME IX QW-409",
      impact: "Affected welds may be non-compliant and could trigger NCRs at audit.",
      remediation: "Review the highlighted logs, retrain welders, or revise the WPS ranges if production conditions changed.",
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (usage.openNcrs > 0) {
    recs.push({
      id: `wps-${wps.id}-ncrs`,
      severity: "critical",
      title: `${usage.openNcrs} open NCR${usage.openNcrs === 1 ? "" : "s"} linked to this WPS`,
      why: "Welds executed under this procedure are currently under non-conformance investigation.",
      impact: "Production may need to halt this procedure until the root cause is closed.",
      remediation: "Review the open NCRs, identify root cause, and close them with preventive actions.",
      action: { label: "Open NCRs", kind: "navigate", to: "/app/ncrs" },
      roles: ["super_admin", "qa_qc_manager"]
    });
  }
  if (usage.blockedWelds > 0) {
    recs.push({
      id: `wps-${wps.id}-blocked`,
      severity: "warning",
      title: `${usage.blockedWelds} blocked weld${usage.blockedWelds === 1 ? "" : "s"} reference this WPS`,
      why: "Production welds are blocked in the release workflow under this procedure.",
      impact: "Project schedule is exposed — release of these welds is on hold.",
      remediation: "Open the affected welds and resolve their blocking conditions, or assign an alternative WPS.",
      action: { label: "View welds", kind: "navigate", to: "/app/welds" },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  if (status === "approved" && (compatibleWelders?.length ?? 0) === 0 && usage.activeWelds > 0) {
    recs.push({
      id: `wps-${wps.id}-no-compat-welders`,
      severity: "warning",
      title: "No active welders qualified for this WPS process",
      why: "No active WPQ records match this WPS's process — production cannot be staffed compliantly.",
      rule: "ASME IX QW-301",
      impact: "Welds executed under this WPS may not be backed by a valid welder qualification.",
      remediation: "Qualify welders on this process or extend an existing WPQ before continuing production.",
      action: { label: "Browse welders", kind: "navigate", to: "/app/qualifications" },
      roles: ["super_admin", "qa_qc_manager", "welding_engineer"]
    });
  }
  return sortRecs(recs);
}
function wpsVerdict(_wps, recs, score, usage) {
  const sev = highestSeverity(recs);
  const impactPhrase = usage.activeWelds > 0 ? ` Impacts ${usage.activeWelds} weld${usage.activeWelds === 1 ? "" : "s"} / ${usage.activeProjects} project${usage.activeProjects === 1 ? "" : "s"}.` : "";
  if (sev === "critical") {
    return {
      severity: "critical",
      label: score.band === "High Risk" ? "High Risk" : "Critical Risk",
      summary: `WPS is exposing production to non-compliance.${impactPhrase}`,
      next: recs.find((r) => r.severity === "critical")?.title
    };
  }
  if (sev === "warning") {
    return {
      severity: "warning",
      label: "Attention Required",
      summary: `Engineering review required to keep this WPS production-ready.${impactPhrase}`,
      next: recs.find((r) => r.severity === "warning")?.title
    };
  }
  if (sev === "info") {
    return {
      severity: "info",
      label: score.band === "In Review" ? "In Review" : score.band === "Draft" ? "Draft" : "Pending Review",
      summary: `WPS workflow has open steps before it can drive production.${impactPhrase}`,
      next: recs[0]?.title
    };
  }
  return {
    severity: "ok",
    label: "Approved & Production-Ready",
    summary: `WPS is approved and driving production.${impactPhrase}`
  };
}
function filterRecsForRole(recs, roles) {
  if (roles.length === 0) return recs;
  return recs.filter((r) => !r.roles || r.roles.length === 0 || r.roles.some((role) => roles.includes(role)));
}
function OperationalBanner({
  verdict,
  onAction,
  actionLabel,
  actionTo
}) {
  const palette = bannerPalette(verdict.severity);
  const Icon = palette.Icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl border ${palette.border} ${palette.bg} px-4 py-3 flex items-start gap-3`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 rounded-full ${palette.iconBg} p-2`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-4 ${palette.text}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-semibold ${palette.text}`, children: verdict.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground/85", children: verdict.summary })
          ] }),
          verdict.next && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground/70", children: "Next: " }),
            verdict.next
          ] })
        ] }),
        actionLabel && (actionTo || onAction) && (actionTo ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: actionTo, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: verdict.severity === "ok" ? "outline" : "default", children: [
          actionLabel,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 ms-1.5" })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: verdict.severity === "ok" ? "outline" : "default",
            onClick: onAction,
            children: [
              actionLabel,
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 ms-1.5" })
            ]
          }
        ))
      ]
    }
  );
}
function bannerPalette(s) {
  switch (s) {
    case "critical":
      return {
        border: "border-destructive/40",
        bg: "bg-destructive/5",
        iconBg: "bg-destructive/10",
        text: "text-destructive",
        Icon: OctagonAlert
      };
    case "warning":
      return {
        border: "border-warning/40",
        bg: "bg-warning/5",
        iconBg: "bg-warning/10",
        text: "text-warning",
        Icon: TriangleAlert
      };
    case "info":
      return {
        border: "border-info/40",
        bg: "bg-info/5",
        iconBg: "bg-info/10",
        text: "text-info",
        Icon: Info
      };
    default:
      return {
        border: "border-success/40",
        bg: "bg-success/5",
        iconBg: "bg-success/10",
        text: "text-success",
        Icon: CircleCheck
      };
  }
}
function RecommendedActionsCard({
  recommendations,
  roles,
  onDialog,
  title = "Recommended Actions"
}) {
  const visible = roles ? filterRecsForRole(recommendations, roles) : recommendations;
  if (visible.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border-success/40 bg-success/5 flex items-center gap-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-success shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-success", children: "No action required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs", children: "All operational checks satisfied — nothing recommended for your role." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-auto text-xs text-muted-foreground", children: [
        visible.length,
        " item",
        visible.length === 1 ? "" : "s"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: visible.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecommendationRow, { rec: r, onDialog }, r.id)) })
  ] });
}
function RecommendationRow({
  rec,
  onDialog
}) {
  const [open, setOpen] = reactExports.useState(false);
  const nav = useNavigate();
  const palette = sevPalette(rec.severity);
  const Icon = palette.Icon;
  const handleAction = () => {
    if (!rec.action) return;
    if (rec.action.kind === "navigate" && rec.action.to) {
      nav({ to: rec.action.to, search: rec.action.search, params: rec.action.params });
    } else if (rec.action.kind === "open-dialog" && rec.action.dialog && onDialog) {
      onDialog(rec.action.dialog, rec.action.payload);
    } else if (rec.action.kind === "external" && rec.action.to) {
      window.open(rec.action.to, "_blank");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Collapsible, { open, onOpenChange: setOpen, asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: `${palette.bg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 rounded-full ${palette.iconBg} p-1.5`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-3.5 ${palette.text}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: rec.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${palette.chip}`, children: rec.severity }),
        rec.rule && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded", children: rec.rule })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: rec.why }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CollapsibleContent, { className: "mt-3 space-y-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Operational impact", tone: "warning", children: rec.impact }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Remediation", tone: "primary", children: rec.remediation }),
        rec.roles && rec.roles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground/70", children: "Who should act: " }),
          rec.roles.map(humanRole).join(", ")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex flex-col items-end gap-2", children: [
      rec.action && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: rec.severity === "critical" ? "default" : "outline", onClick: handleAction, children: [
        rec.action.label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3 ms-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1",
          children: [
            open ? "Hide details" : "Why this matters",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `size-3 transition-transform ${open ? "rotate-180" : ""}` })
          ]
        }
      ) })
    ] })
  ] }) }) });
}
function Block({
  label,
  tone,
  children
}) {
  const cls = tone === "primary" ? "border-primary/30 bg-primary/5" : "border-warning/30 bg-warning/5";
  const textTone = tone === "primary" ? "text-primary" : "text-warning";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-md border ${cls} px-3 py-2`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] uppercase tracking-wider font-semibold ${textTone}`, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground/85 mt-0.5 leading-relaxed", children })
  ] });
}
function sevPalette(s) {
  switch (s) {
    case "critical":
      return {
        bg: "bg-destructive/5",
        iconBg: "bg-destructive/15",
        text: "text-destructive",
        chip: "bg-destructive/15 text-destructive",
        Icon: OctagonAlert
      };
    case "warning":
      return {
        bg: "bg-warning/5",
        iconBg: "bg-warning/15",
        text: "text-warning",
        chip: "bg-warning/15 text-warning",
        Icon: TriangleAlert
      };
    case "info":
      return {
        bg: "bg-info/5",
        iconBg: "bg-info/15",
        text: "text-info",
        chip: "bg-info/15 text-info",
        Icon: Info
      };
    default:
      return {
        bg: "bg-success/5",
        iconBg: "bg-success/15",
        text: "text-success",
        chip: "bg-success/15 text-success",
        Icon: CircleCheck
      };
  }
}
function humanRole(r) {
  return r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function QuickActionDialogs({ state, onClose }) {
  if (!state) return null;
  switch (state.kind) {
    case "pick-wps":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PickWpsDialog, { weldId: String(state.payload?.weldId ?? ""), onClose });
    case "assign-welder":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(AssignWelderDialog, { weldId: String(state.payload?.weldId ?? ""), onClose });
    case "create-inspection":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CreateInspectionDialog, { weldId: String(state.payload?.weldId ?? ""), onClose });
    case "create-ncr":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CreateNcrDialog, { weldId: String(state.payload?.weldId ?? ""), onClose });
    case "request-approval":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(RequestApprovalDialog, { weldId: String(state.payload?.weldId ?? ""), onClose });
    case "request-calibration":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SimpleNoticeDialog,
        {
          onClose,
          title: "Request recalibration",
          body: "A recalibration request has been logged. Hand the instrument to the calibration lead and update the calibration date once complete."
        }
      );
    case "renew-qualification":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SimpleNoticeDialog,
        {
          onClose,
          title: "Renew qualification",
          body: "Open the welder's qualification record and create a new test entry to renew. Continuity will reset on the new test date."
        }
      );
    case "log-continuity":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SimpleNoticeDialog,
        {
          onClose,
          title: "Log continuity",
          body: "Open the welder's qualification and add a continuity record under the Continuity tab using a recent production weld."
        }
      );
    default:
      return null;
  }
}
function PickWpsDialog({ weldId, onClose }) {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(null);
  const procs = useQuery({
    queryKey: ["pick-wps", q],
    queryFn: async () => {
      const query = supabase.from("procedures").select("id, code, wps_no, process, status, revision");
      const { data } = q ? await query.or(`code.ilike.%${q}%,wps_no.ilike.%${q}%,process.ilike.%${q}%`).limit(25) : await query.order("updated_at", { ascending: false }).limit(25);
      return data ?? [];
    }
  });
  const pick = async (id) => {
    setBusy(id);
    const { error } = await supabase.from("welds").update({ procedure_id: id }).eq("id", weldId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("WPS linked");
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["wps-for-weld"] });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Pick compatible WPS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Link an approved WPS to enable compliance checks against this weld." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "ps-9", placeholder: "Search by code, WPS no, process…", value: q, onChange: (e) => setQ(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-80 overflow-auto rounded-md border border-border", children: [
      (procs.data ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => pick(p.id),
          disabled: !!busy,
          className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/40 border-b border-border/40 last:border-0 text-start",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium truncate", children: [
                p.code,
                " ",
                p.wps_no ? `· ${p.wps_no}` : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                p.process,
                " · Rev ",
                p.revision,
                " · ",
                p.status
              ] })
            ] }),
            busy === p.id && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin shrink-0" })
          ]
        },
        p.id
      )),
      (procs.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "No matching WPS." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Close" }) })
  ] }) });
}
function AssignWelderDialog({ weldId, onClose }) {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(null);
  const quals = useQuery({
    queryKey: ["assign-welder", q],
    queryFn: async () => {
      const query = supabase.from("qualifications").select("id, welder_name, employee_id, process, expiry_date, status");
      const { data } = q ? await query.or(`welder_name.ilike.%${q}%,employee_id.ilike.%${q}%`).limit(25) : await query.order("expiry_date", { ascending: false }).limit(25);
      return data ?? [];
    }
  });
  const pick = async (name, id) => {
    setBusy(id);
    const { error } = await supabase.from("welds").update({ welder_name: name }).eq("id", weldId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Assigned ${name}`);
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["wpq-options"] });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign qualified welder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Pick a welder with a current WPQ matching the weld's process & position." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "ps-9", placeholder: "Search by welder or ID…", value: q, onChange: (e) => setQ(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-80 overflow-auto rounded-md border border-border", children: [
      (quals.data ?? []).map((qual) => {
        const expired = new Date(qual.expiry_date) < /* @__PURE__ */ new Date();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => pick(qual.welder_name, qual.id),
            disabled: !!busy,
            className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/40 border-b border-border/40 last:border-0 text-start",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium truncate", children: [
                  qual.welder_name,
                  " · ",
                  qual.employee_id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  qual.process,
                  " · expires ",
                  qual.expiry_date,
                  expired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-2 text-destructive font-medium", children: "Expired" })
                ] })
              ] }),
              busy === qual.id && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin shrink-0" })
            ]
          },
          qual.id
        );
      }),
      (quals.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "No matching welders." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Close" }) })
  ] }) });
}
function CreateInspectionDialog({ weldId, onClose }) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const [type, setType] = reactExports.useState("Visual");
  const [inspector, setInspector] = reactExports.useState("");
  const [defect, setDefect] = reactExports.useState("");
  const submit = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const { error } = await supabase.from("inspections").insert({
      company_id: profile.company_id,
      weld_id: weldId,
      inspection_type: type,
      inspector_name: inspector || null,
      defect_type: defect || null,
      status: "Open"
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Inspection logged");
    qc.invalidateQueries({ queryKey: ["inspections-weld", weldId] });
    qc.invalidateQueries({ queryKey: ["inspections-cc", weldId] });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Log inspection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Create a new inspection record for this weld." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Inspection type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm", value: type, onChange: (e) => setType(e.target.value), children: ["Visual", "RT", "UT", "MT", "PT", "Hardness"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Inspector name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: inspector, onChange: (e) => setInspector(e.target.value), placeholder: "Optional" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Defect (if any)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: defect, onChange: (e) => setDefect(e.target.value), placeholder: "Leave blank for clean inspection" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: busy, onClick: submit, children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 me-1.5 animate-spin" }),
        "Create inspection"
      ] })
    ] })
  ] }) });
}
function CreateNcrDialog({ weldId, onClose }) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [desc, setDesc] = reactExports.useState("");
  const [sev, setSev] = reactExports.useState("Major");
  const submit = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const ncrNo = `NCR-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from("ncrs").insert({
      company_id: profile.company_id,
      weld_id: weldId,
      ncr_no: ncrNo,
      title,
      description: desc || null,
      severity: sev,
      status: "Open",
      raised_by: user?.id ?? null
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${ncrNo} created`);
    qc.invalidateQueries({ queryKey: ["ncrs-weld", weldId] });
    qc.invalidateQueries({ queryKey: ["ncrs-cc", weldId] });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Raise NCR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Document a non-conformance against this weld." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Short summary of the non-conformance" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-9 w-full rounded-md border bg-transparent px-2 text-sm", value: sev, onChange: (e) => setSev(e.target.value), children: ["Minor", "Major", "Critical"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: desc, onChange: (e) => setDesc(e.target.value), placeholder: "Describe the non-conformance, code clause, location…" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: busy || !title.trim(), onClick: submit, children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 me-1.5 animate-spin" }),
        "Raise NCR"
      ] })
    ] })
  ] }) });
}
function RequestApprovalDialog({ weldId, onClose }) {
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.from("welds").update({ workflow_status: "Ready for Release" }).eq("id", weldId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted for approval");
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["weld_events", weldId] });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Request engineering approval" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Moves the weld to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Ready for Release" }),
        " so the welding engineer / QA-QC manager can sign off."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: busy, onClick: submit, children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 me-1.5 animate-spin" }),
        "Submit"
      ] })
    ] })
  ] }) });
}
function SimpleNoticeDialog({ title, body, onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: body })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, children: "Got it" }) })
  ] }) });
}
export {
  Collapsible as C,
  OperationalBanner as O,
  QuickActionDialogs as Q,
  RecommendedActionsCard as R,
  CollapsibleTrigger as a,
  CollapsibleContent as b,
  recommendForQualification as c,
  qualVerdict as d,
  detectParameterDrift as e,
  wpsReadinessScore as f,
  recommendForWps as g,
  wpsVerdict as h,
  qualReadinessScore as q,
  recommendForWeld as r,
  weldVerdict as w
};
