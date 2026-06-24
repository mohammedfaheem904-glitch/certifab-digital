import { RelationalTable } from "./RelationalTable";
import {
  FILLER_CLASSIFICATIONS,
  lookupFillerClassification,
} from "@/lib/filler-classifications";

const FILLER_CLASS_OPTIONS = FILLER_CLASSIFICATIONS.map((c) => ({
  value: c.code,
  label: c.code,
  description: `F-No ${c.f_no} · A-No ${c.a_no ?? "N/A"} — ${c.group}`,
  keywords: c.group,
}));

const FILLER_DIAMETER_OPTIONS = [
  "0.8", "1.0", "1.2", "1.6", "2.0", "2.4", "2.5", "3.2", "4.0", "5.0", "6.0",
].map((v) => ({ value: v, label: `${v} mm`, keywords: "diameter mm" }));

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
        {
          key: "aws_classification",
          label: "AWS class",
          kind: "combobox",
          options: FILLER_CLASS_OPTIONS,
          placeholder: "Select classification…",
          onOptionSelected: (opt) => {
            const entry = lookupFillerClassification(opt.value);
            return entry ? { f_no: entry.f_no, a_no: entry.a_no } : {};
          },
        },
        { key: "electrode_brand", label: "Brand" },
        { key: "f_no", label: "F-No" },
        { key: "a_no", label: "A-No" },
        {
          key: "electrode_diameter_mm",
          label: "Dia (mm)",
          kind: "combobox",
          options: FILLER_DIAMETER_OPTIONS,
          placeholder: "Select diameter…",
        },
        { key: "qualified_thickness_mm", label: "Qual. thk (mm)", type: "number" },
        { key: "flux_wire_class", label: "Flux/wire class" },
        { key: "flux_brand", label: "Flux brand" },
        { key: "consumable_insert", label: "Insert" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}
