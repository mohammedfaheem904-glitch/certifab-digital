import { RelationalTable } from "./RelationalTable";

export function PositionsTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Welding positions"
      description="Qualified positions and ranges (QW-405)."
      table="wps_positions"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No positions defined yet."
      columns={[
        { key: "position", label: "Position", placeholder: "e.g. 6G, 3G, 2F" },
        { key: "qualified_range", label: "Qualified range", placeholder: "All / Flat+Horizontal" },
        { key: "progression", label: "Progression", kind: "select", selectOptions: ["Uphill (Vertical Up)", "Downhill (Vertical Down)"], placeholder: "— Select —" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}

export function PreheatTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Preheat & interpass"
      description="Preheat ranges and methods (QW-406)."
      table="wps_preheat_entries"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No preheat entries yet."
      columns={[
        { key: "applicability", label: "Applies to", placeholder: "All / Root only" },
        { key: "preheat_min_c", label: "Preheat min (°C)", type: "number" },
        { key: "preheat_max_c", label: "Preheat max (°C)", type: "number" },
        { key: "interpass_max_c", label: "Interpass max (°C)", type: "number" },
        { key: "preheat_method", label: "Method", placeholder: "Torch / Induction" },
        { key: "maintenance", label: "Maintenance", placeholder: "Maintain throughout welding" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}

export function TechniquesTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Technique"
      description="Welding technique parameters (QW-410)."
      table="wps_techniques"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No technique entries yet."
      columns={[
        { key: "process", label: "Process", placeholder: "GTAW / SMAW…" },
        { key: "string_or_weave", label: "String / Weave", kind: "select", selectOptions: ["Stringer Bead", "Weave Bead", "Oscillation", "Whip and Pause"], placeholder: "— Select —" },
        { key: "cleaning_method", label: "Cleaning", kind: "select", selectOptions: ["Wire Brushing", "Grinding", "Chipping", "Solvent Cleaning", "None"], placeholder: "— Select —" },
        { key: "back_gouging", label: "Back gouging", kind: "select", selectOptions: ["None", "Grinding", "CAC-A", "Plasma Gouging", "Machining"], placeholder: "— Select —" },
        { key: "peening", label: "Peening" },
        { key: "pass_type", label: "Pass type" },
        { key: "electrode_mode", label: "Electrode mode" },
        { key: "automation", label: "Automation", kind: "select", selectOptions: ["Manual", "Semi-Automatic", "Mechanized", "Automatic"], placeholder: "— Select —" },
        { key: "oscillation", label: "Oscillation" },
        { key: "multi_or_single_pass", label: "Single / Multi pass" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}

export function ShieldingGasesTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Shielding & purge gases"
      description="Gas composition, flow rates and purge details (QW-408)."
      table="wps_shielding_gases"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No gas entries yet."
      columns={[
        { key: "process", label: "Process", placeholder: "GTAW / GMAW…" },
        { key: "gas_type", label: "Gas type", placeholder: "Ar / Ar+CO2" },
        { key: "composition", label: "Composition", placeholder: "Ar 80% / CO2 20%" },
        { key: "flow_rate_lpm", label: "Flow (l/min)", type: "number" },
        { key: "purge_gas", label: "Purge gas" },
        { key: "purge_flow_lpm", label: "Purge flow (l/min)", type: "number" },
        { key: "trailing_gas", label: "Trailing gas" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}

export function PwhtTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Post weld heat treatment"
      description="PWHT temperature, hold time and rates (QW-407)."
      table="wps_pwht"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No PWHT entries — leave empty if not required."
      columns={[
        { key: "applicability", label: "Applies to", placeholder: "All / Conditional" },
        { key: "temperature_c", label: "Temp (°C)", type: "number" },
        { key: "hold_time_min", label: "Hold (min)", type: "number" },
        { key: "heating_rate", label: "Heating rate", placeholder: "°C/h" },
        { key: "cooling_rate", label: "Cooling rate", placeholder: "°C/h" },
        { key: "atmosphere", label: "Atmosphere" },
        { key: "notes", label: "Notes" },
      ]}
    />
  );
}

export function NotesTable({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  return (
    <RelationalTable
      title="Engineering notes"
      description="Categorised notes for engineering, QA/QC and field crews."
      table="wps_notes"
      procedureId={procedureId}
      canEdit={canEdit}
      emptyMessage="No notes yet."
      columns={[
        { key: "category", label: "Category", placeholder: "engineering / qa / field" },
        { key: "body", label: "Note" },
      ]}
    />
  );
}
