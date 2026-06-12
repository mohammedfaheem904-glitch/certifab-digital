import { RelationalTable, type ComboOption } from "./RelationalTable";
import { BASE_MATERIALS, formatBaseMaterial } from "@/lib/wps-base-materials";

const MATERIAL_OPTIONS: ComboOption[] = BASE_MATERIALS.map((m) => {
  const label = formatBaseMaterial(m);
  const pg = m.group_no ? `P-No.${m.p_no} Gr.${m.group_no}` : `P-No.${m.p_no}`;
  return {
    value: label,
    label,
    description: `${pg} · ${m.family} · ${m.description}`,
    keywords: `${m.uns} ${m.p_no} ${m.group_no} ${m.family} ${m.description}`,
  };
});

export function BaseMetalsTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Base metals"
      description="Material specifications and qualified ranges. Supports multiple combinations."
      table="wps_base_metals"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No base metal entries yet. Add one to define qualified material ranges."
      columns={[
        {
          key: "material_spec",
          label: "Material spec",
          placeholder: "Select or type a material",
          kind: "combobox",
          options: MATERIAL_OPTIONS,
          onOptionSelected: (opt, row) => {
            const m = BASE_MATERIALS.find((x) => formatBaseMaterial(x) === opt.value);
            if (!m) return {};
            const patch: Record<string, any> = {
              p_no: m.p_no || null,
              group_no: m.group_no || null,
            };
            if (!row.to_p_no) patch.to_p_no = m.p_no || null;
            if (!row.to_group_no) patch.to_group_no = m.group_no || null;
            return patch;
          },
        },
        { key: "p_no", label: "P-No" },
        { key: "group_no", label: "Group" },
        { key: "to_p_no", label: "To P-No" },
        { key: "to_group_no", label: "To Group" },
        { key: "thickness_min_mm", label: "Thk min (mm)", type: "number" },
        { key: "thickness_max_mm", label: "Thk max (mm)", type: "number" },
        { key: "diameter_min_mm", label: "Dia min (mm)", type: "number" },
        { key: "diameter_max_mm", label: "Dia max (mm)", type: "number" },
        { key: "groove_applicability", label: "Groove applicability" },
        { key: "pass_thickness_limit_mm", label: "Pass thk limit (mm)", type: "number" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}
