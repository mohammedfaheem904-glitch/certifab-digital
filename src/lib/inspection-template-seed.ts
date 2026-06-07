import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_INSPECTION_TEMPLATES } from "./inspection-templates";

/**
 * Ensure default inspection templates exist for this company.
 * Idempotent: only inserts the templates that are missing (by inspection_type).
 */
export async function seedDefaultTemplates(companyId: string) {
  const { data: existing } = await (supabase.from("inspection_templates" as any) as any)
    .select("inspection_type")
    .eq("company_id", companyId);
  const seeded = new Set<string>((existing ?? []).map((r: any) => r.inspection_type));

  for (const t of DEFAULT_INSPECTION_TEMPLATES) {
    if (seeded.has(t.inspection_type)) continue;
    const { data: inserted, error } = await (supabase.from("inspection_templates" as any) as any)
      .insert({
        company_id: companyId,
        name: t.name,
        inspection_type: t.inspection_type,
        discipline: t.discipline ?? null,
        code_reference: t.code_reference ?? null,
        description: t.description ?? null,
        is_default: true,
      })
      .select("id")
      .maybeSingle();
    if (error || !inserted?.id) continue;
    const fields = t.fields.map((f, i) => ({
      company_id: companyId,
      template_id: inserted.id,
      section: f.section ?? null,
      sort_order: i,
      label: f.label,
      field_type: f.field_type,
      required: !!f.required,
      unit: f.unit ?? null,
      tolerance_min: f.tolerance_min ?? null,
      tolerance_max: f.tolerance_max ?? null,
      code_reference: f.code_reference ?? null,
      helper_text: f.helper_text ?? null,
    }));
    if (fields.length) {
      await (supabase.from("inspection_template_fields" as any) as any).insert(fields);
    }
  }
}
