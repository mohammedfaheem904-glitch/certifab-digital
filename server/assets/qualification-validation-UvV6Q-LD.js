import { d as deriveQualificationRanges, i as isWithinRange, f as formatRange } from "./qualification-intelligence-CQ5mpNJP.js";
import { d as deriveQualStatus, c as continuityBroken, a as continuityWarning } from "./qualification-status-CLO5y49_.js";
function evaluateQualification(q, plan) {
  const findings = [];
  const code = q.code_family || "ASME IX";
  const isPipe = (q.test_coupon_type ?? "").toLowerCase().includes("pipe");
  const t = num(q.test_thickness_mm);
  const d = num(q.test_diameter_mm);
  const ranges = deriveQualificationRanges({
    code,
    process: q.process ?? "",
    testCouponThicknessMm: t,
    testCouponDiameterMm: d,
    testPosition: q.position_qualified ?? void 0,
    pNumber: q.p_number ?? void 0,
    isoGroup: q.iso_group ?? void 0,
    withBacking: !!q.with_backing,
    isPipe
  });
  const status = deriveQualStatus({
    status: q.status,
    expiry_date: q.expiry_date,
    last_continuity_date: q.last_continuity_date
  });
  if (status === "Expired") {
    findings.push({
      id: "status-expired",
      severity: "critical",
      category: "Status",
      title: "Qualification has expired",
      message: `The expiry date (${q.expiry_date ?? "—"}) is in the past. Per ASME IX QW-322 / ISO 9606-1 §9.3, the welder is no longer qualified for new production welds under this WPQ.`,
      codeRef: "ASME IX QW-322 / ISO 9606-1 §9.3",
      remediation: "Schedule a re-qualification or extension test before assigning new production work."
    });
  } else if (status === "Expiring Soon") {
    findings.push({
      id: "status-expiring",
      severity: "warning",
      category: "Status",
      title: "Qualification expires within 30 days",
      message: `Expiry date ${q.expiry_date} is within the 30-day warning window.`,
      remediation: "Plan a continuity weld or re-test before the expiry date to avoid gaps in coverage."
    });
  } else if (status === "Suspended") {
    findings.push({
      id: "status-suspended",
      severity: "critical",
      category: "Status",
      title: "Qualification is suspended",
      message: "Welder qualification is currently suspended and may not be used for production welding.",
      remediation: "Resolve the suspension cause and lift the suspension before resuming production work."
    });
  }
  if ((q.result ?? "").toLowerCase() === "unsatisfactory") {
    findings.push({
      id: "result-fail",
      severity: "critical",
      category: "Status",
      title: "Test result is Unsatisfactory",
      message: "The recorded WPQ result is Unsatisfactory — this record does not constitute a valid qualification.",
      remediation: "Mark the record as Suspended or schedule a retest under a new WPQ number."
    });
  }
  if (continuityBroken(q.last_continuity_date)) {
    findings.push({
      id: "continuity-broken",
      severity: "critical",
      category: "Continuity",
      title: "6-month continuity broken",
      message: `No welding activity in this process has been logged for more than 6 months (last activity: ${q.last_continuity_date ?? "never"}). The qualification is no longer valid until re-established by a successful production or coupon weld.`,
      codeRef: "ASME IX QW-322.2",
      remediation: "Log a fresh continuity weld in this process or perform a renewal test."
    });
  } else if (continuityWarning(q.last_continuity_date)) {
    findings.push({
      id: "continuity-warning",
      severity: "warning",
      category: "Continuity",
      title: "Continuity nearing 6-month limit",
      message: `Last welding activity was over 5 months ago (${q.last_continuity_date}). Schedule a continuity weld within the next 30 days to keep the qualification active.`,
      codeRef: "ASME IX QW-322.2",
      remediation: "Log a continuity weld or assign a short production task in this process."
    });
  }
  if (!t) {
    findings.push({
      id: "data-thickness",
      severity: "warning",
      category: "Data Quality",
      title: "Coupon thickness missing",
      message: "Without a recorded coupon thickness, the qualified base/deposit thickness range cannot be derived.",
      remediation: "Edit the WPQ and enter the actual coupon thickness used during the test."
    });
  }
  if (isPipe && !d) {
    findings.push({
      id: "data-diameter",
      severity: "warning",
      category: "Data Quality",
      title: "Coupon diameter missing on pipe test",
      message: "Pipe tests require the coupon outside diameter to derive QW-452.3 diameter coverage.",
      remediation: "Record the pipe coupon OD on the WPQ."
    });
  }
  if (!q.position_qualified) {
    findings.push({
      id: "data-position",
      severity: "warning",
      category: "Data Quality",
      title: "Position not recorded",
      message: "Position qualification cannot be determined without the tested position (e.g. 6G, 3G+4G)."
    });
  }
  if (code === "ASME IX" && !q.p_number) {
    findings.push({
      id: "data-pnumber",
      severity: "info",
      category: "Material",
      title: "P-Number not recorded",
      message: "Adding the base metal P-Number unlocks transferability rules per QW-423.1.",
      remediation: "Set the test coupon P-Number on the WPQ to enable material group derivation."
    });
  }
  if (code === "EN ISO" && !q.iso_group) {
    findings.push({
      id: "data-iso-group",
      severity: "info",
      category: "Material",
      title: "ISO 9606 material group not recorded",
      message: "Set the ISO 9606-1 Table 3 material group to derive group transferability."
    });
  }
  if (!q.pqr_number && code === "ASME IX") {
    findings.push({
      id: "data-pqr",
      severity: "info",
      category: "Data Quality",
      title: "Supporting PQR not linked",
      message: "ASME IX qualifications are normally traceable to a supporting PQR. Linking it improves auditability."
    });
  }
  if (!q.process) {
    findings.push({
      id: "process-missing",
      severity: "critical",
      category: "Process",
      title: "Welding process not specified",
      message: "Each qualification must record the welding process (QW-403). Without it, no production work can be assigned.",
      codeRef: "ASME IX QW-403"
    });
  }
  if (code === "ASME IX") {
    if (q.with_backing) {
      findings.push({
        id: "backing-with",
        severity: "info",
        category: "Backing",
        title: "Tested with backing",
        message: "Per QW-350, this test does NOT qualify production welds made without backing. Plan a without-backing test if required.",
        codeRef: "ASME IX QW-350"
      });
    } else {
      findings.push({
        id: "backing-without",
        severity: "pass",
        category: "Backing",
        title: "Tested without backing",
        message: "Without-backing test qualifies both with- and without-backing production welds (QW-350).",
        codeRef: "ASME IX QW-350"
      });
    }
  }
  if (plan) {
    if (plan.process && q.process && plan.process !== q.process) {
      findings.push({
        id: "plan-process",
        severity: "critical",
        category: "Process",
        title: `Production process ${plan.process} not covered`,
        message: `This WPQ qualifies process ${q.process}; the planned production weld uses ${plan.process}.`,
        remediation: `Use a WPQ qualifying ${plan.process} or test the welder on this process.`
      });
    }
    if (plan.thicknessMm != null) {
      if (!isWithinRange(plan.thicknessMm, ranges.baseThickness)) {
        findings.push({
          id: "plan-thickness",
          severity: "critical",
          category: "Range",
          title: "Production thickness out of qualified range",
          message: `Production thickness ${plan.thicknessMm} mm falls outside the qualified base-metal range (${formatRange(ranges.baseThickness)}).`,
          codeRef: "ASME IX QW-452.1(b)",
          remediation: "Re-qualify on a coupon thickness that covers the production range."
        });
      } else {
        findings.push({
          id: "plan-thickness-pass",
          severity: "pass",
          category: "Range",
          title: "Thickness covered",
          message: `Production thickness ${plan.thicknessMm} mm is within the qualified range ${formatRange(ranges.baseThickness)}.`
        });
      }
    }
    if (plan.diameterMm != null && plan.isPipe) {
      if (!isWithinRange(plan.diameterMm, ranges.diameter)) {
        findings.push({
          id: "plan-diameter",
          severity: "warning",
          category: "Range",
          title: "Production diameter outside qualified range",
          message: `Production OD ${plan.diameterMm} mm is outside the qualified diameter range (${formatRange(ranges.diameter)}).`,
          codeRef: "ASME IX QW-452.3"
        });
      }
    }
    if (plan.position && !ranges.positions.includes(plan.position)) {
      findings.push({
        id: "plan-position",
        severity: "critical",
        category: "Position",
        title: `Position ${plan.position} not qualified`,
        message: `This WPQ qualifies positions [${ranges.positions.join(", ") || "—"}]. Production position ${plan.position} is not covered.`,
        codeRef: "ASME IX QW-461.9",
        remediation: "Use a 6G or combination position test to cover all production positions."
      });
    }
    if (plan.withBacking === false && q.with_backing) {
      findings.push({
        id: "plan-backing",
        severity: "critical",
        category: "Backing",
        title: "Production weld without backing not qualified",
        message: "WPQ was tested with backing; production welds without backing are not qualified.",
        codeRef: "ASME IX QW-350"
      });
    }
    if (plan.pNumber && code === "ASME IX" && q.p_number) {
      const allowed = ranges.materialGroups.map((g) => g.replace("P-", ""));
      if (!allowed.includes(String(plan.pNumber))) {
        findings.push({
          id: "plan-pnumber",
          severity: "warning",
          category: "Material",
          title: `P-${plan.pNumber} not directly qualified`,
          message: `Production P-Number P-${plan.pNumber} is not within the transferability list (${ranges.materialGroups.join(", ") || "—"}) per QW-423.1.`,
          codeRef: "ASME IX QW-423.1"
        });
      }
    }
  }
  const coverageGaps = [];
  if (ranges.baseThickness.max != null && ranges.baseThickness.max < 19)
    coverageGaps.push(`base thickness capped at ${ranges.baseThickness.max} mm`);
  if (ranges.diameter.min != null && ranges.diameter.min > 25 && ranges.diameter.max == null)
    coverageGaps.push(`pipe OD only covered ≥ ${ranges.diameter.min} mm`);
  if (ranges.positions.length === 1)
    coverageGaps.push(`only single position (${ranges.positions[0]}) qualified`);
  if (coverageGaps.length) {
    findings.push({
      id: "coverage-gap",
      severity: "info",
      category: "Coverage",
      title: "Coverage limitations to be aware of",
      message: `This qualification has limited coverage: ${coverageGaps.join("; ")}.`,
      remediation: "If broader coverage is needed, plan a 6G test or thicker coupon to extend the qualified ranges."
    });
  }
  let score = 100;
  for (const f of findings) {
    if (f.severity === "critical") score -= 25;
    else if (f.severity === "warning") score -= 8;
    else if (f.severity === "info") score -= 1;
  }
  score = Math.max(0, score);
  const riskLevel = findings.some((f) => f.severity === "critical") ? "High" : findings.some((f) => f.severity === "warning") ? "Medium" : "Low";
  return { ranges, findings, score, riskLevel };
}
function num(v) {
  if (v == null || v === "") return void 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : void 0;
}
export {
  evaluateQualification as e
};
