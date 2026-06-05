import { supabase } from "@/integrations/supabase/client";
import { buildWpsPayload, buildChildSeeds } from "./pqr-promotion";

/**
 * Promote a Passed PQR (and its linked pWPS) into a Draft WPS row in
 * `procedures`. Idempotent: returns the existing `resulting_wps_id` if
 * already promoted. Requires the caller to be a company editor (enforced
 * by RLS on `procedures` / `pqrs` / `pwps`).
 */
export async function promotePqrToWps(pqrId: string): Promise<{ procedureId: string; created: boolean }> {
  const { data: pqr, error: pqrErr } = await (supabase.from("pqrs" as any) as any)
    .select("*")
    .eq("id", pqrId)
    .maybeSingle();
  if (pqrErr) throw pqrErr;
  if (!pqr) throw new Error("PQR not found");
  if (pqr.overall_result !== "Pass" && pqr.overall_result !== "Passed") throw new Error("PQR must be Passed before promotion");
  if (!pqr.pwps_id) throw new Error("PQR has no linked pWPS");

  if (pqr.resulting_wps_id) {
    return { procedureId: pqr.resulting_wps_id, created: false };
  }

  const { data: pwps, error: pwpsErr } = await (supabase.from("pwps" as any) as any)
    .select("*")
    .eq("id", pqr.pwps_id)
    .maybeSingle();
  if (pwpsErr) throw pwpsErr;
  if (!pwps) throw new Error("Linked pWPS not found");

  const payload = buildWpsPayload({ companyId: pqr.company_id, pwps, pqr });

  const { data: created, error: insErr } = await (supabase.from("procedures") as any)
    .insert(payload)
    .select("id")
    .single();
  if (insErr) throw insErr;

  const procedureId = created.id as string;

  // Seed WPS child/detail tables from pWPS scalars so the new WPS inherits
  // the full dataset (best-effort — individual failures must not orphan the
  // procedure row).
  const seeds = buildChildSeeds({ companyId: pqr.company_id, procedureId, pwps, pqr });
  await Promise.all(
    Object.entries(seeds).map(async ([table, row]) => {
      if (!row) return;
      const { error } = await (supabase.from(table as any) as any).insert(row);
      if (error) console.warn(`[pqr-promotion] seed ${table} failed:`, error.message);
    }),
  );

  // Backlinks (best-effort)
  await Promise.all([
    (supabase.from("pqrs" as any) as any)
      .update({ resulting_wps_id: procedureId })
      .eq("id", pqr.id),
    (supabase.from("pwps" as any) as any)
      .update({
        converted_to_procedure_id: procedureId,
        converted_at: new Date().toISOString(),
        status: "Converted",
      })
      .eq("id", pwps.id),
    (supabase.from("procedure_links" as any) as any).insert({
      company_id: pqr.company_id,
      source_type: "pqr",
      source_id: pqr.id,
      target_type: "procedure",
      target_id: procedureId,
      relationship: "qualified_by",
    }),
  ]);

  return { procedureId, created: true };
}
