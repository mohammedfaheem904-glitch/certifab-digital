import { RelationalTable } from "./RelationalTable";
import {
  FILLER_CLASSIFICATIONS,
  SFA_NO_OPTIONS,
  lookupFillerClassification,
  lookupAwsClassesForSfa,
  isValidAwsSfaPair,
} from "@/lib/filler-classifications";
import { FILLER_DIAMETER_OPTIONS } from "@/lib/filler-diameters";

const FILLER_CLASS_OPTIONS = FILLER_CLASSIFICATIONS.map((c) => ({
  value: c.code,
  label: c.code,
  description: `F-No ${c.f_no} · A-No ${c.a_no ?? "N/A"} · ${c.sfa_no} — ${c.group}`,
  keywords: `${c.group} ${c.sfa_no}`,
}));

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
        {
          key: "sfa_no",
          label: "SFA No",
          kind: "combobox",
          placeholder: "Select SFA…",
          // Per-row: if AWS class is set, restrict SFA options to the catalog match.
          options: (row) => {
            const aws = row?.aws_classification?.trim();
            if (aws) {
              const entry = lookupFillerClassification(aws);
              if (entry) {
                return [
                  {
                    value: entry.sfa_no,
                    label: entry.sfa_no,
                    description: `Matches AWS ${aws}`,
                  },
                ];
              }
            }
            return SFA_NO_OPTIONS;
          },
          onOptionSelected: (opt, row) => {
            // If only one AWS class belongs to this SFA, autofill it.
            const codes = lookupAwsClassesForSfa(opt.value);
            if (codes.length === 1 && !row?.aws_classification) {
              const entry = lookupFillerClassification(codes[0]);
              return entry
                ? { aws_classification: codes[0], f_no: entry.f_no, a_no: entry.a_no }
                : { aws_classification: codes[0] };
            }
            return {};
          },
          validate: (row) =>
            isValidAwsSfaPair(row?.aws_classification, row?.sfa_no)
              ? null
              : "AWS / SFA mismatch per ASME II-C",
        },
        {
          key: "aws_classification",
          label: "AWS class",
          kind: "combobox",
          options: FILLER_CLASS_OPTIONS,
          placeholder: "Select classification…",
          onOptionSelected: (opt) => {
            const entry = lookupFillerClassification(opt.value);
            return entry
              ? { f_no: entry.f_no, a_no: entry.a_no, sfa_no: entry.sfa_no }
              : {};
          },
          validate: (row) =>
            isValidAwsSfaPair(row?.aws_classification, row?.sfa_no)
              ? null
              : "AWS / SFA mismatch per ASME II-C",
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
