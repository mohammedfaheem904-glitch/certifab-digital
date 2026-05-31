import { s as supabase } from "./router-DGN8uIPq.js";
import "./server-BEiNT1sm.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function deriveWpsCode(pwpsNo) {
  if (!pwpsNo) return `WPS-${Date.now().toString(36).toUpperCase()}`;
  const cleaned = pwpsNo.replace(/^p?wps[-_ ]*/i, "");
  return `WPS-${cleaned || pwpsNo}`;
}
function buildWpsPayload(args) {
  const { companyId, pwps, pqr } = args;
  const ranges = pqr.qualified_ranges ?? {};
  const code = deriveWpsCode(pwps.pwps_no);
  const pick = (qualified, fallback) => qualified !== void 0 && qualified !== null ? qualified : fallback ?? null;
  return {
    company_id: companyId,
    status: "Draft",
    revision: "Rev 0",
    procedure_type: "WPS",
    code,
    wps_no: code,
    pqr_no: pqr.pqr_no ?? null,
    pwps_id: pwps.id,
    pqr_id: pqr.id,
    standard: pwps.standard ?? "",
    process: pwps.process ?? "",
    joint_type: pwps.joint_type ?? null,
    groove_type: pwps.groove_type ?? null,
    position: pick(ranges.position, pwps.position),
    position_qualified: pick(ranges.position, pwps.position),
    base_material: pwps.base_material ?? null,
    filler_material: pwps.filler_material ?? null,
    shielding_gas: pwps.shielding_gas ?? null,
    preheat_min_c: pwps.preheat_min_c ?? null,
    interpass_max_c: pwps.interpass_max_c ?? null,
    pwht: pwps.pwht ?? null,
    voltage_min: pwps.voltage_min ?? null,
    voltage_max: pwps.voltage_max ?? null,
    current_min: pwps.current_min ?? null,
    current_max: pwps.current_max ?? null,
    travel_speed_min: pwps.travel_speed_min ?? null,
    travel_speed_max: pwps.travel_speed_max ?? null,
    heat_input_min: pick(ranges.heat_input_min, pwps.heat_input_min),
    heat_input_max: pick(ranges.heat_input_max, pwps.heat_input_max),
    thickness_range: pwps.thickness_min_mm != null && pwps.thickness_max_mm != null ? `${pick(ranges.thickness_min_mm, pwps.thickness_min_mm)}–${pick(ranges.thickness_max_mm, pwps.thickness_max_mm)} mm` : null,
    technique_notes: pwps.technique_notes ?? null,
    notes: `Auto-generated from ${pwps.pwps_no} qualified by ${pqr.pqr_no} on ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.`
  };
}
async function promotePqrToWps(pqrId) {
  const { data: pqr, error: pqrErr } = await supabase.from("pqrs").select("*").eq("id", pqrId).maybeSingle();
  if (pqrErr) throw pqrErr;
  if (!pqr) throw new Error("PQR not found");
  if (pqr.overall_result !== "Pass" && pqr.overall_result !== "Passed") throw new Error("PQR must be Passed before promotion");
  if (!pqr.pwps_id) throw new Error("PQR has no linked pWPS");
  if (pqr.resulting_wps_id) {
    return { procedureId: pqr.resulting_wps_id, created: false };
  }
  const { data: pwps, error: pwpsErr } = await supabase.from("pwps").select("*").eq("id", pqr.pwps_id).maybeSingle();
  if (pwpsErr) throw pwpsErr;
  if (!pwps) throw new Error("Linked pWPS not found");
  const payload = buildWpsPayload({ companyId: pqr.company_id, pwps, pqr });
  const { data: created, error: insErr } = await supabase.from("procedures").insert(payload).select("id").single();
  if (insErr) throw insErr;
  const procedureId = created.id;
  await Promise.all([
    supabase.from("pqrs").update({ resulting_wps_id: procedureId }).eq("id", pqr.id),
    supabase.from("pwps").update({
      converted_to_procedure_id: procedureId,
      converted_at: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Converted"
    }).eq("id", pwps.id),
    supabase.from("procedure_links").insert({
      company_id: pqr.company_id,
      source_type: "pqr",
      source_id: pqr.id,
      target_type: "procedure",
      target_id: procedureId,
      relationship: "qualified_by"
    })
  ]);
  return { procedureId, created: true };
}
export {
  promotePqrToWps
};
