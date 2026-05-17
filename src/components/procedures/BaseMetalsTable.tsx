import { RelationalTable } from "./RelationalTable";

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
        { key: "material_spec", label: "Material spec", placeholder: "e.g. SA-516 Gr 70" },
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
