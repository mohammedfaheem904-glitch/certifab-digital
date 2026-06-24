import { RelationalTable } from "./RelationalTable";
import { FILLER_DIAMETER_OPTIONS } from "@/lib/filler-diameters";
import { WELD_LAYER_OPTIONS } from "@/lib/weld-pass-layers";


export function ElectricalCharacteristicsTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Electrical characteristics"
      description="Pass-by-pass parameter ranges. These are the authoritative limits used for weld validation."
      table="wps_electrical_characteristics"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No electrical parameters defined. Add a row per weld pass / layer."
      columns={[
        {
          key: "weld_layer",
          label: "Layer / pass",
          kind: "combobox",
          options: WELD_LAYER_OPTIONS,
          placeholder: "Select layer / pass…",
        },

        { key: "process", label: "Process" },
        { key: "filler_class", label: "Filler class" },
        {
          key: "electrode_diameter_mm",
          label: "Dia (mm)",
          kind: "combobox",
          options: FILLER_DIAMETER_OPTIONS,
          placeholder: "Select diameter…",
        },
        { key: "polarity", label: "Polarity" },
        { key: "amperage_min", label: "Amps min", type: "number" },
        { key: "amperage_max", label: "Amps max", type: "number" },
        { key: "voltage_min", label: "Volts min", type: "number" },
        { key: "voltage_max", label: "Volts max", type: "number" },
        { key: "travel_speed_min", label: "Travel min (mm/min)", type: "number" },
        { key: "travel_speed_max", label: "Travel max (mm/min)", type: "number" },
        { key: "heat_input_min", label: "HI min (kJ/mm)", type: "number" },
        { key: "heat_input_max", label: "HI max (kJ/mm)", type: "number" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}
