import { RelationalTable } from "./RelationalTable";

export function FillerMetalsTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Filler metals"
      description="Consumables used. Add one row per consumable; multiple processes are supported."
      table="wps_filler_metals"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No filler metals yet."
      columns={[
        { key: "process", label: "Process", placeholder: "e.g. GTAW" },
        { key: "filler_type", label: "Type" },
        { key: "sfa_no", label: "SFA No" },
        { key: "aws_classification", label: "AWS class" },
        { key: "electrode_brand", label: "Brand" },
        { key: "f_no", label: "F-No" },
        { key: "a_no", label: "A-No" },
        { key: "electrode_diameter_mm", label: "Dia (mm)", type: "number" },
        { key: "qualified_thickness_mm", label: "Qual. thk (mm)", type: "number" },
        { key: "flux_wire_class", label: "Flux/wire class" },
        { key: "flux_brand", label: "Flux brand" },
        { key: "consumable_insert", label: "Insert" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}
