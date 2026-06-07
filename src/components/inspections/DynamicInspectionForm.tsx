import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { seedDefaultTemplates } from "@/lib/inspection-template-seed";
import { toast } from "sonner";

interface Props {
  companyId: string;
  inspectionId: string;
  inspectionType: string;
  currentTemplateId: string | null;
  items: any[];
  refresh: () => void;
}

export function DynamicInspectionForm({ companyId, inspectionId, inspectionType, currentTemplateId, items, refresh }: Props) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const templates = useQuery<any[]>({
    queryKey: ["inspection_templates", companyId, inspectionType],
    queryFn: async () => {
      const { data } = await (supabase.from("inspection_templates" as any) as any)
        .select("*").eq("company_id", companyId).eq("active", true).order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const matchTemplates = (templates.data ?? []).filter((t) => t.inspection_type === inspectionType);

  const applyTemplate = async (templateId: string) => {
    setBusy(true);
    const { data: fields, error } = await (supabase.from("inspection_template_fields" as any) as any)
      .select("*").eq("template_id", templateId).order("sort_order", { ascending: true });
    if (error) { toast.error(error.message); setBusy(false); return; }

    // Remove existing template-bound items and re-create from the template
    await (supabase.from("inspection_checklist_items" as any) as any)
      .delete().eq("inspection_id", inspectionId).not("template_field_id", "is", null);

    if (fields && fields.length) {
      const rows = fields.map((f: any, i: number) => ({
        company_id: companyId,
        inspection_id: inspectionId,
        template_field_id: f.id,
        section: f.section,
        sort_order: i,
        label: f.label,
        field_type: f.field_type,
        required: f.required,
        unit: f.unit,
        tolerance_min: f.tolerance_min,
        tolerance_max: f.tolerance_max,
        code_reference: f.code_reference,
      }));
      await (supabase.from("inspection_checklist_items" as any) as any).insert(rows);
    }
    await (supabase.from("inspections" as any) as any).update({ template_id: templateId }).eq("id", inspectionId);
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["inspection", inspectionId] });
    refresh();
    toast.success("Template applied — form ready for execution.");
  };

  const seedAndApply = async () => {
    setBusy(true);
    await seedDefaultTemplates(companyId);
    await templates.refetch();
    setBusy(false);
    toast.success("Default templates seeded — pick one to apply.");
  };

  const setValue = async (id: string, patch: any) => {
    await (supabase.from("inspection_checklist_items" as any) as any).update(patch).eq("id", id);
    refresh();
  };

  // Group items by section
  const grouped: Record<string, any[]> = {};
  items.forEach((it) => {
    const k = it.section ?? "General";
    (grouped[k] ||= []).push(it);
  });
  const sections = Object.keys(grouped);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px] space-y-1.5">
          <Label className="text-xs">Apply a template ({inspectionType})</Label>
          <Select onValueChange={applyTemplate} disabled={busy}>
            <SelectTrigger><SelectValue placeholder={matchTemplates.length ? "Pick a template…" : "No templates for this type"} /></SelectTrigger>
            <SelectContent>
              {matchTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}{t.is_default ? " · default" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {matchTemplates.length === 0 && (
          <Button variant="outline" size="sm" onClick={seedAndApply} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <><Sparkles className="size-4 me-1" /> Seed defaults</>}
          </Button>
        )}
        {currentTemplateId && <Badge variant="outline" className="text-[10px]">Template applied</Badge>}
      </div>

      {sections.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No checklist yet — apply a template to generate engineering fields automatically.
        </div>
      )}

      {sections.map((sec) => (
        <div key={sec} className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{sec}</div>
          <ul className="divide-y divide-border/60 border border-border/60 rounded-lg">
            {grouped[sec].map((it) => (
              <li key={it.id} className="p-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <div className="text-sm font-medium">
                    {it.label}
                    {it.required && <span className="text-destructive ms-1">*</span>}
                  </div>
                  <div className="text-[10px] text-muted-foreground flex flex-wrap gap-2">
                    <span>{it.field_type.replace("_", " ")}</span>
                    {it.unit && <span>· unit: {it.unit}</span>}
                    {(it.tolerance_min != null || it.tolerance_max != null) && (
                      <span>· tol: {it.tolerance_min ?? "—"} … {it.tolerance_max ?? "—"} {it.unit ?? ""}</span>
                    )}
                    {it.code_reference && <span>· {it.code_reference}</span>}
                  </div>
                </div>
                <FieldInput item={it} onChange={(patch) => setValue(it.id, patch)} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FieldInput({ item, onChange }: { item: any; onChange: (patch: any) => void }) {
  if (item.field_type === "pass_fail") {
    return (
      <Select value={item.result ?? undefined} onValueChange={(v) => onChange({ result: v })}>
        <SelectTrigger className="w-32 h-8"><SelectValue placeholder="—" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Pass">Pass</SelectItem>
          <SelectItem value="Fail">Fail</SelectItem>
          <SelectItem value="N/A">N/A</SelectItem>
        </SelectContent>
      </Select>
    );
  }
  if (item.field_type === "text") {
    return <Textarea rows={1} className="w-64 min-h-8" defaultValue={item.value_text ?? ""} onBlur={(e) => e.target.value !== (item.value_text ?? "") && onChange({ value_text: e.target.value || null })} />;
  }
  if (item.field_type === "number" || item.field_type === "measurement") {
    const oot =
      item.value_number != null &&
      ((item.tolerance_min != null && item.value_number < item.tolerance_min) ||
        (item.tolerance_max != null && item.value_number > item.tolerance_max));
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          step="any"
          className={`w-32 h-8 ${oot ? "border-destructive text-destructive" : ""}`}
          defaultValue={item.value_number ?? ""}
          onBlur={(e) => onChange({ value_number: e.target.value === "" ? null : Number(e.target.value) })}
        />
        {item.unit && <span className="text-xs text-muted-foreground">{item.unit}</span>}
        {oot && <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]" variant="outline">out of tol</Badge>}
      </div>
    );
  }
  if (item.field_type === "checkbox") {
    return <input type="checkbox" className="size-4" defaultChecked={!!item.value_bool} onChange={(e) => onChange({ value_bool: e.target.checked })} />;
  }
  if (item.field_type === "attachment") {
    return <Input className="w-64 h-8" placeholder="Attachment URL or note" defaultValue={item.attachment_path ?? ""} onBlur={(e) => e.target.value !== (item.attachment_path ?? "") && onChange({ attachment_path: e.target.value || null })} />;
  }
  return null;
}
