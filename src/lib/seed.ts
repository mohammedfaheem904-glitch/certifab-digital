import { supabase } from "@/integrations/supabase/client";

/** Seeds demo data for a freshly created tenant. Idempotent-ish: skips if any project exists. */
export async function seedDemoData(companyId: string) {
  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyId);
  if ((count ?? 0) > 0) return { skipped: true };

  const projects = [
    { code: "GOSP-7", name: "Aramco GOSP-7", client: "Saudi Aramco", location: "Khurais, KSA", status: "Active" as const },
    { code: "PL-22B", name: "ADNOC Pipeline 22B", client: "ADNOC", location: "Ruwais, UAE", status: "Active" as const },
    { code: "REF-01", name: "Sabic Refinery", client: "SABIC", location: "Jubail, KSA", status: "Active" as const },
    { code: "LNG-T4", name: "Qatar LNG-T4", client: "QatarEnergy", location: "Ras Laffan, QA", status: "Planning" as const },
  ].map((p) => ({ ...p, company_id: companyId }));
  const { data: ins } = await supabase.from("projects").insert(projects).select("id, code");
  const byCode = Object.fromEntries((ins ?? []).map((p) => [p.code, p.id]));

  const procs = [
    { code: "WPS-SAW-014", standard: "ASME IX", process: "SAW", thickness_range: "8–40 mm", revision: "Rev 3", status: "Approved" as const },
    { code: "WPS-GTAW-008", standard: "EN ISO 15614-1", process: "GTAW", thickness_range: "1.5–12 mm", revision: "Rev 2", status: "Approved" as const },
    { code: "WPS-SMAW-021", standard: "AWS D1.1", process: "SMAW", thickness_range: "3–25 mm", revision: "Rev 1", status: "Review" as const },
    { code: "WPS-FCAW-017", standard: "ASME IX", process: "FCAW", thickness_range: "5–30 mm", revision: "Rev 4", status: "Approved" as const },
    { code: "pWPS-GMAW-031", standard: "EN ISO 15609", process: "GMAW", thickness_range: "2–10 mm", revision: "Rev 0", status: "Draft" as const },
  ].map((p) => ({ ...p, company_id: companyId }));
  await supabase.from("procedures").insert(procs);

  const quals = [
    { welder_name: "Mohammed Al-Harbi", employee_id: "EMP-1042", process: "SAW / GTAW", standard: "ASME IX", expiry_date: "2026-08-12", status: "Active" as const },
    { welder_name: "Ravi Kumar", employee_id: "EMP-1187", process: "GTAW", standard: "EN ISO 9606-1", expiry_date: "2026-06-02", status: "Expiring Soon" as const },
    { welder_name: "Joao Silva", employee_id: "EMP-1233", process: "SMAW", standard: "AWS D1.1", expiry_date: "2025-11-20", status: "Expired" as const },
    { welder_name: "Khanh Nguyen", employee_id: "EMP-1301", process: "FCAW", standard: "ASME IX", expiry_date: "2027-02-14", status: "Active" as const },
    { welder_name: "Ahmed Ibrahim", employee_id: "EMP-1355", process: "GTAW", standard: "EN ISO 9606-1", expiry_date: "2026-05-29", status: "Expiring Soon" as const },
  ].map((q) => ({ ...q, company_id: companyId }));
  await supabase.from("qualifications").insert(quals);

  const welds = [
    { weld_no: "WL-2410-0451", project_id: byCode["GOSP-7"], welder_name: "M. Al-Harbi", heat_input: "1.42 kJ/mm", status: "Accepted" as const },
    { weld_no: "WL-2410-0450", project_id: byCode["PL-22B"], welder_name: "R. Kumar", heat_input: "0.98 kJ/mm", status: "Accepted" as const },
    { weld_no: "WL-2410-0449", project_id: byCode["REF-01"], welder_name: "J. Silva", heat_input: "1.81 kJ/mm", status: "Repair" as const },
    { weld_no: "WL-2410-0448", project_id: byCode["GOSP-7"], welder_name: "K. Nguyen", heat_input: "1.55 kJ/mm", status: "Rejected" as const },
    { weld_no: "WL-2410-0447", project_id: byCode["LNG-T4"], welder_name: "A. Ibrahim", heat_input: "1.04 kJ/mm", status: "Accepted" as const },
  ].map((w) => ({ ...w, company_id: companyId }));
  const { data: insertedWelds } = await supabase.from("welds").insert(welds).select("id, weld_no");
  const weldByNo = Object.fromEntries((insertedWelds ?? []).map((w) => [w.weld_no, w.id]));

  const inspections = [
    { ncr_code: "NCR-0231", weld_id: weldByNo["WL-2410-0448"], project_id: byCode["GOSP-7"], inspection_type: "RT", defect_type: "Porosity cluster", severity: "High" as const, status: "Open" },
    { ncr_code: "NCR-0230", weld_id: weldByNo["WL-2410-0449"], project_id: byCode["REF-01"], inspection_type: "UT", defect_type: "Lack of fusion", severity: "Medium" as const, status: "Open" },
    { ncr_code: "NCR-0228", weld_id: null, project_id: byCode["PL-22B"], inspection_type: "RT", defect_type: "Crack indication", severity: "Critical" as const, status: "Open" },
  ].map((i) => ({ ...i, company_id: companyId }));
  await supabase.from("inspections").insert(inspections);

  const equipment = [
    { asset_id: "MIG-204", model: "Lincoln PowerWave S500", status: "Operational" as const, calibration_due: "2026-09-12" },
    { asset_id: "TIG-117", model: "Miller Dynasty 400", status: "Operational" as const, calibration_due: "2026-06-03" },
    { asset_id: "STK-088", model: "ESAB Warrior 500i", status: "Maintenance" as const, calibration_due: "2026-05-20" },
    { asset_id: "SAW-012", model: "Lincoln Idealarc DC-1000", status: "Operational" as const, calibration_due: "2026-07-30" },
    { asset_id: "TIG-145", model: "Fronius MagicWave 4000", status: "Calibration Due" as const, calibration_due: "2026-05-08" },
  ].map((e) => ({ ...e, company_id: companyId }));
  await supabase.from("equipment").insert(equipment);

  return { skipped: false };
}
