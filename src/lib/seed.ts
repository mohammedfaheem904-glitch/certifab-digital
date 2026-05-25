import { supabase } from "@/integrations/supabase/client";

const today = () => new Date();
const dStr = (offsetDays: number) =>
  new Date(today().getTime() + offsetDays * 86400000).toISOString().slice(0, 10);

/** Seeds rich demo data for a freshly created tenant. Skips if any project exists. */
export async function seedDemoData(companyId: string) {
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyId);
  if ((count ?? 0) > 0) return { skipped: true };

  // ----- Projects -----
  const projects = [
    { code: "GOSP-7", name: "Aramco GOSP-7", client: "Saudi Aramco", location: "Khurais, KSA", status: "Active" as const, start_date: dStr(-180), end_date: dStr(180) },
    { code: "PL-22B", name: "ADNOC Pipeline 22B", client: "ADNOC", location: "Ruwais, UAE", status: "Active" as const, start_date: dStr(-120), end_date: dStr(220) },
    { code: "REF-01", name: "Sabic Refinery Expansion", client: "SABIC", location: "Jubail, KSA", status: "Active" as const, start_date: dStr(-90), end_date: dStr(280) },
    { code: "LNG-T4", name: "Qatar LNG Train 4", client: "QatarEnergy", location: "Ras Laffan, QA", status: "Planning" as const, start_date: dStr(30), end_date: dStr(420) },
  ].map((p) => ({ ...p, company_id: companyId }));
  const { data: ins } = await supabase.from("projects").insert(projects).select("id, code");
  const byCode = Object.fromEntries((ins ?? []).map((p) => [p.code, p.id as string]));

  // ----- Procedures -----
  const procs = [
    { code: "WPS-SAW-014", standard: "ASME IX", process: "SAW", thickness_range: "8–40 mm", revision: "Rev 3", status: "Approved" as const, base_material: "ASTM A106 Gr B", filler_material: "F7A2-EM12K", joint_type: "Butt", position: "1G", heat_input_min: 1.0, heat_input_max: 2.5 },
    { code: "WPS-GTAW-008", standard: "EN ISO 15614-1", process: "GTAW", thickness_range: "1.5–12 mm", revision: "Rev 2", status: "Approved" as const, base_material: "ASTM A312 TP316L", filler_material: "ER316L", joint_type: "Butt", position: "6G", heat_input_min: 0.6, heat_input_max: 1.8 },
    { code: "WPS-SMAW-021", standard: "AWS D1.1", process: "SMAW", thickness_range: "3–25 mm", revision: "Rev 1", status: "Review" as const, base_material: "ASTM A36", filler_material: "E7018", joint_type: "Fillet", position: "3F", heat_input_min: 0.8, heat_input_max: 2.2 },
    { code: "WPS-FCAW-017", standard: "ASME IX", process: "FCAW", thickness_range: "5–30 mm", revision: "Rev 4", status: "Approved" as const, base_material: "ASTM A516 Gr 70", filler_material: "E71T-1", joint_type: "Butt", position: "2G", heat_input_min: 0.9, heat_input_max: 2.4 },
    { code: "pWPS-GMAW-031", standard: "EN ISO 15609", process: "GMAW", thickness_range: "2–10 mm", revision: "Rev 0", status: "Draft" as const, base_material: "S355J2", filler_material: "ER70S-6", joint_type: "Butt", position: "1G", heat_input_min: 0.7, heat_input_max: 2.0 },
  ].map((p) => ({ ...p, company_id: companyId }));
  const { data: insertedProcs } = await supabase.from("procedures").insert(procs).select("id, code");
  const procByCode = Object.fromEntries((insertedProcs ?? []).map((p) => [p.code, p.id as string]));

  // ----- Qualifications -----
  const quals = [
    { welder_name: "Mohammed Al-Harbi", employee_id: "EMP-1042", process: "SAW / GTAW", standard: "ASME IX", expiry_date: dStr(120), status: "Active" as const },
    { welder_name: "Ravi Kumar", employee_id: "EMP-1187", process: "GTAW", standard: "EN ISO 9606-1", expiry_date: dStr(22), status: "Expiring Soon" as const },
    { welder_name: "Joao Silva", employee_id: "EMP-1233", process: "SMAW", standard: "AWS D1.1", expiry_date: dStr(-15), status: "Expired" as const },
    { welder_name: "Khanh Nguyen", employee_id: "EMP-1301", process: "FCAW", standard: "ASME IX", expiry_date: dStr(260), status: "Active" as const },
    { welder_name: "Ahmed Ibrahim", employee_id: "EMP-1355", process: "GTAW", standard: "EN ISO 9606-1", expiry_date: dStr(18), status: "Expiring Soon" as const },
    { welder_name: "Pedro Costa", employee_id: "EMP-1402", process: "SMAW / FCAW", standard: "AWS D1.1", expiry_date: dStr(190), status: "Active" as const },
    { welder_name: "Hassan Saeed", employee_id: "EMP-1455", process: "SAW", standard: "ASME IX", expiry_date: dStr(310), status: "Active" as const },
    { welder_name: "Bilal Yusuf", employee_id: "EMP-1488", process: "GTAW / SMAW", standard: "EN ISO 9606-1", expiry_date: dStr(-45), status: "Expired" as const },
  ].map((q) => ({ ...q, company_id: companyId }));
  await supabase.from("qualifications").insert(quals);

  // ----- Welds (rich traceability) -----
  const welders = ["M. Al-Harbi", "R. Kumar", "J. Silva", "K. Nguyen", "A. Ibrahim", "P. Costa", "H. Saeed", "B. Yusuf"];
  const projectCodes = Object.keys(byCode);
  const procCodes = Object.keys(procByCode);
  const statuses: ("Accepted" | "Rejected" | "Repair" | "Pending")[] = [
    "Accepted", "Accepted", "Accepted", "Accepted", "Accepted", "Accepted", "Accepted",
    "Repair", "Pending", "Rejected",
  ];
  const baseMats = ["ASTM A106 Gr B", "ASTM A312 TP316L", "ASTM A516 Gr 70", "S355J2"];
  const fillers = ["ER70S-6", "E7018", "ER316L", "E71T-1"];
  const jointTypes = ["Butt", "Fillet", "Socket", "Branch"];
  const drawings = ["DWG-PIP-001", "DWG-PIP-002", "DWG-STR-014", "DWG-VES-007"];
  const lines = ["L-101-A1", "L-101-A2", "L-204-B1", "L-308-C2", "L-412-D3"];
  const spools = ["SP-014", "SP-022", "SP-031", "SP-045", "SP-061"];

  const welds: any[] = [];
  for (let i = 0; i < 80; i++) {
    const project = projectCodes[i % projectCodes.length];
    const proc = procCodes[i % procCodes.length];
    const dayOffset = -Math.floor(i / 6);
    welds.push({
      company_id: companyId,
      weld_no: `WL-2410-${(500 + i).toString().padStart(4, "0")}`,
      welder_name: welders[i % welders.length],
      project_id: byCode[project],
      procedure_id: procByCode[proc],
      heat_input: `${(0.9 + (i % 12) * 0.08).toFixed(2)} kJ/mm`,
      status: statuses[i % statuses.length],
      weld_date: dStr(dayOffset),
      joint_no: `J-${((i % 30) + 1).toString().padStart(2, "0")}`,
      spool_no: spools[i % spools.length],
      drawing_ref: drawings[i % drawings.length],
      line_no: lines[i % lines.length],
      base_material: baseMats[i % baseMats.length],
      heat_number: `H-${23000 + (i * 7) % 999}`,
      filler_metal: fillers[i % fillers.length],
      joint_type: jointTypes[i % jointTypes.length],
      inspection_status: i % 5 === 0 ? "Pending" : "Cleared",
    });
  }
  const { data: insertedWelds } = await supabase.from("welds").insert(welds).select("id, weld_no, status, project_id");
  const weldByNo = Object.fromEntries((insertedWelds ?? []).map((w) => [w.weld_no, w.id as string]));

  // ----- Inspections -----
  const ndtTypes = ["VT", "PT", "MT", "RT", "UT"];
  const defects = ["Porosity cluster", "Lack of fusion", "Undercut > 0.5mm", "Crack indication", "Slag inclusion", null, null, null];
  const severities = ["Low", "Medium", "High", "Critical"];
  const inspections: any[] = [];
  (insertedWelds ?? []).slice(0, 30).forEach((w, i) => {
    const defect = defects[i % defects.length];
    inspections.push({
      company_id: companyId,
      weld_id: w.id,
      project_id: w.project_id,
      inspection_type: ndtTypes[i % ndtTypes.length],
      defect_type: defect,
      severity: defect ? severities[i % severities.length] : null,
      status: defect ? "Open" : "Cleared",
      inspector_name: ["I. Khalid", "S. Ahmed", "T. Reyes"][i % 3],
      inspected_at: new Date(today().getTime() - i * 86400000).toISOString(),
    });
  });
  await supabase.from("inspections").insert(inspections);

  // ----- NCRs -----
  const rejectedWelds = (insertedWelds ?? []).filter((w) => w.status === "Rejected" || w.status === "Repair");
  const ncrs = rejectedWelds.slice(0, 8).map((w, i) => ({
    company_id: companyId,
    ncr_no: `NCR-${(230 + i).toString().padStart(4, "0")}`,
    title: ["Porosity cluster exceeding code", "Lack of fusion at root", "Crack indication on cap", "Excessive undercut", "Incomplete penetration", "Slag inclusion below surface", "Misalignment exceeds tolerance", "PWHT not performed"][i],
    description: "Detected during NDT inspection. Requires evaluation per project quality plan.",
    severity: (["High", "Medium", "Critical", "Low", "High", "Medium", "Low", "High"] as const)[i],
    status: (["Open", "Root Cause", "CA Pending", "Open", "In Review", "Closed", "Open", "Root Cause"] as const)[i],
    weld_id: w.id,
    project_id: w.project_id,
    raised_by_name: ["I. Khalid", "S. Ahmed", "T. Reyes"][i % 3],
    assigned_to_name: ["QA Manager", "Welding Engineer", "Site Inspector"][i % 3],
    due_date: dStr(7 + i * 3),
  }));
  if (ncrs.length) await supabase.from("ncrs").insert(ncrs);

  // ----- Equipment (legacy) -----
  const equipment = [
    { asset_id: "MIG-204", model: "Lincoln PowerWave S500", status: "Operational" as const, calibration_due: dStr(120) },
    { asset_id: "TIG-117", model: "Miller Dynasty 400", status: "Operational" as const, calibration_due: dStr(40) },
    { asset_id: "STK-088", model: "ESAB Warrior 500i", status: "Maintenance" as const, calibration_due: dStr(15) },
    { asset_id: "SAW-012", model: "Lincoln Idealarc DC-1000", status: "Operational" as const, calibration_due: dStr(95) },
    { asset_id: "TIG-145", model: "Fronius MagicWave 4000", status: "Calibration Due" as const, calibration_due: dStr(-5) },
  ].map((e) => ({ ...e, company_id: companyId }));
  await supabase.from("equipment").insert(equipment);

  // ----- QA/QC Instruments -----
  const instruments = [
    { asset_id: "UT-014", name: "Olympus EPOCH 650", category: "UT", model: "EPOCH 650", serial_number: "E650-22841", manufacturer: "Olympus", calibration_due: dStr(75), status: "Active" as const },
    { asset_id: "UT-021", name: "GE Phasor XS", category: "UT", model: "Phasor XS", serial_number: "PXS-9912", manufacturer: "GE", calibration_due: dStr(20), status: "Active" as const },
    { asset_id: "RT-008", name: "Yxlon SMART EVO", category: "RT", model: "SMART EVO 200", serial_number: "YX-44218", manufacturer: "Yxlon", calibration_due: dStr(150), status: "Active" as const },
    { asset_id: "WG-101", name: "Cambridge Welding Gauge", category: "Welding Gauge", model: "WG-2", serial_number: "CWG-1101", manufacturer: "GAL Gage", calibration_due: dStr(45), status: "Active" as const },
    { asset_id: "WG-102", name: "Bridge Cam Gauge", category: "Welding Gauge", model: "BCG", serial_number: "BCG-2230", manufacturer: "GAL Gage", calibration_due: dStr(-10), status: "Calibration Due" as const },
    { asset_id: "PG-204", name: "Wika Pressure Gauge", category: "Pressure Gauge", model: "232.50.100", serial_number: "WK-77231", manufacturer: "WIKA", calibration_due: dStr(180), status: "Active" as const },
    { asset_id: "TM-118", name: "Fluke Surface Thermometer", category: "Temperature", model: "62 MAX+", serial_number: "FL-66312", manufacturer: "Fluke", calibration_due: dStr(25), status: "Active" as const },
    { asset_id: "CT-031", name: "Elcometer 456 Coating", category: "Coating", model: "456C-FNF", serial_number: "EL-88121", manufacturer: "Elcometer", calibration_due: dStr(110), status: "Active" as const },
    { asset_id: "HT-044", name: "Equotip Hardness Tester", category: "Hardness", model: "Bambino 2", serial_number: "EQ-55401", manufacturer: "Proceq", calibration_due: dStr(8), status: "Active" as const },
  ].map((i) => ({ ...i, company_id: companyId }));
  const { data: insertedInsts } = await supabase.from("instruments").insert(instruments).select("id, asset_id");

  // ----- Calibration history (per instrument, last 2-3 records) -----
  const cals: any[] = [];
  (insertedInsts ?? []).forEach((inst, idx) => {
    for (let k = 1; k <= 3; k++) {
      cals.push({
        company_id: companyId,
        instrument_id: inst.id,
        calibrated_on: dStr(-365 * k + idx * 5),
        next_due: dStr(-365 * (k - 1) + idx * 5),
        performed_by: ["Intertek", "SGS", "TÜV Rheinland", "Bureau Veritas"][k % 4],
        notes: k === 1 ? "Latest periodic calibration. All readings within tolerance." : "Prior cycle.",
      });
    }
  });
  if (cals.length) await supabase.from("instrument_calibrations").insert(cals);

  return { skipped: false };
}
