import { e as exportCsv, a as exportExcel } from "./export-BKxIOV_6.js";
const PRINT_MODES = [
  { id: "client", label: "Client Copy", description: "Approved release for external client distribution.", hide: ["technique_notes", "thermal_notes"] },
  { id: "internal", label: "Internal Engineering", description: "Complete engineering view with all sections and notes." },
  { id: "review", label: "Technical Review", description: "Draft watermark; for engineering review only.", watermark: "FOR REVIEW" },
  { id: "approval", label: "Approval Package", description: "Includes approval block, signatures, revision history." },
  { id: "shop_floor", label: "Shop Floor Copy", description: "Compact, high-contrast layout for production workshops.", hide: ["signatures"] }
];
function bulkExportProceduresCsv(rows, filename = "wps-export") {
  const flat = rows.map((p) => ({
    code: p.code,
    wps_no: p.wps_no ?? "",
    pqr_no: p.pqr_no ?? "",
    standard: p.standard,
    process: p.process,
    revision: p.revision,
    status: p.status,
    position: p.position_qualified ?? p.position ?? "",
    thickness_range: p.thickness_range ?? "",
    base_material: p.base_material ?? "",
    filler_material: p.filler_material ?? "",
    shielding_gas: p.shielding_gas ?? "",
    preheat_min_c: p.preheat_min_c ?? p.preheat_temp ?? "",
    interpass_max_c: p.interpass_max_c ?? p.interpass_temp ?? "",
    pwht: p.pwht ?? "",
    voltage_range: p.voltage_min != null ? `${p.voltage_min}-${p.voltage_max ?? ""}` : "",
    current_range: p.current_min != null ? `${p.current_min}-${p.current_max ?? ""}` : "",
    heat_input_range: p.heat_input_min != null ? `${p.heat_input_min}-${p.heat_input_max ?? ""}` : "",
    approved_at: p.approved_at ?? "",
    updated_at: p.updated_at ?? ""
  }));
  exportCsv(filename, flat);
}
async function bulkExportProceduresXlsx(rows, filename = "wps-export") {
  const flat = rows.map((p) => ({
    Code: p.code,
    "WPS No": p.wps_no ?? "",
    "PQR No": p.pqr_no ?? "",
    Standard: p.standard,
    Process: p.process,
    Revision: p.revision,
    Status: p.status,
    Position: p.position_qualified ?? p.position ?? "",
    "Thickness Range": p.thickness_range ?? "",
    "Base Material": p.base_material ?? "",
    "Filler Material": p.filler_material ?? "",
    "Shielding Gas": p.shielding_gas ?? "",
    "Preheat min (°C)": p.preheat_min_c ?? p.preheat_temp ?? "",
    "Interpass max (°C)": p.interpass_max_c ?? p.interpass_temp ?? "",
    PWHT: p.pwht ?? "",
    "Voltage min": p.voltage_min ?? "",
    "Voltage max": p.voltage_max ?? "",
    "Current min": p.current_min ?? "",
    "Current max": p.current_max ?? "",
    "Heat input min": p.heat_input_min ?? "",
    "Heat input max": p.heat_input_max ?? "",
    Approved: p.approved_at ?? "",
    Updated: p.updated_at ?? ""
  }));
  await exportExcel(filename, "WPS Procedures", flat);
}
function scoreProcedureHeader(p) {
  const reasons = [];
  let penalty = 0;
  if (!p.pqr_no) {
    reasons.push("No supporting PQR linked");
    penalty += 25;
  }
  if (!p.position_qualified && !p.position) {
    reasons.push("Position not qualified");
    penalty += 8;
  }
  if (!p.base_material) {
    reasons.push("Base material missing");
    penalty += 12;
  }
  if (!p.filler_material) {
    reasons.push("Filler material missing");
    penalty += 10;
  }
  if (p.voltage_min == null || p.current_min == null) {
    reasons.push("Electrical parameters incomplete");
    penalty += 15;
  }
  if (p.heat_input_min == null && p.heat_input_max == null) {
    reasons.push("Heat input window not defined");
    penalty += 6;
  }
  if (p.status === "Draft") {
    reasons.push("Still in Draft");
    penalty += 4;
  }
  if (p.status === "Rejected") {
    reasons.push("Procedure rejected");
    penalty += 40;
  }
  if (!p.approved_at && (p.status === "Approved" || p.status === "Released")) {
    reasons.push("Approval timestamp missing");
    penalty += 8;
  }
  const score = Math.max(0, 100 - penalty);
  const bucket = score >= 85 ? "Ready" : score >= 65 ? "Attention" : score >= 40 ? "High Risk" : "Critical";
  return { score, bucket, reasons };
}
function distribution(rows, key) {
  const m = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const raw = r[key];
    const k = raw == null || raw === "" ? "—" : String(raw);
    if (key === "process" && /[+,/]/.test(k)) {
      for (const part of k.split(/[+,/]/).map((s) => s.trim()).filter(Boolean)) {
        m.set(part, (m.get(part) ?? 0) + 1);
      }
    } else {
      m.set(k, (m.get(k) ?? 0) + 1);
    }
  }
  return Array.from(m, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}
export {
  PRINT_MODES as P,
  bulkExportProceduresXlsx as a,
  bulkExportProceduresCsv as b,
  distribution as d,
  scoreProcedureHeader as s
};
