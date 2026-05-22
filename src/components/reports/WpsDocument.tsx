import { ReportShell, KvTable, SectionTitle, type ApprovalEntry, type RevisionEntry } from "@/components/ReportShell";

function range(min: any, max: any, unit: string) {
  if (min == null && max == null) return "—";
  return `${min ?? "—"} – ${max ?? "—"} ${unit}`;
}

export type WpsChildren = {
  joints?: any[];
  baseMetals?: any[];
  fillers?: any[];
  electrical?: any[];
  signatures?: any[];
  variables?: any[];
  sketchUrls?: Record<string, string>;
};

const CAT_LABEL: Record<string, string> = {
  essential: "Essential",
  non_essential: "Non-Essential",
  supplementary_essential: "Supplementary Essential",
};

export type WpsDocumentProps = {
  proc: any;
  approvals?: ApprovalEntry[];
  revisions?: RevisionEntry[];
  children?: WpsChildren;
  kind?: "WPS" | "PQR";
};

export function WpsDocument({ proc, approvals = [], revisions = [], children, kind = "WPS" }: WpsDocumentProps) {
  const title = kind === "PQR" ? "Procedure Qualification Record" : "Welding Procedure Specification";
  const subtitle = `${proc.standard ?? "ASME IX"} · ${proc.process ?? "—"} · ${proc.code}`;
  const joints = children?.joints ?? [];
  const baseMetals = children?.baseMetals ?? [];
  const fillers = children?.fillers ?? [];
  const electrical = children?.electrical ?? [];
  const sigs = children?.signatures ?? [];
  const sketchUrls = children?.sketchUrls ?? {};

  const fallbackSignatories = [
    {
      role: "Welding Engineer",
      name: approvals.find((a) => a.action === "submitted")?.actor_name ?? null,
      date: approvals.find((a) => a.action === "submitted")?.signed_at ?? null,
      signature: proc.submitted_for_review_at ? "Electronically submitted" : null,
    },
    {
      role: "QA/QC Manager",
      name: approvals.find((a) => a.action === "reviewed")?.actor_name ?? null,
      date: approvals.find((a) => a.action === "reviewed")?.signed_at ?? proc.reviewed_at,
      signature: proc.reviewed_at ? "Electronically reviewed" : null,
    },
    {
      role: "Authorised Inspector",
      name: approvals.find((a) => a.action === "approved")?.actor_name ?? null,
      date: approvals.find((a) => a.action === "approved")?.signed_at ?? proc.approved_at,
      signature: proc.approved_at ? "Electronically approved" : null,
    },
  ];

  return (
    <ReportShell
      title={title}
      subtitle={subtitle}
      docType={kind}
      entityId={proc.id}
      revision={proc.revision ?? "Rev 0"}
      status={proc.status}
      classification="Controlled Document"
      meta={[
        { label: "WPS No.", value: proc.wps_no ?? proc.code },
        { label: "Document No.", value: proc.document_no ?? "—" },
        { label: "Supporting PQR", value: proc.pqr_no ?? "—" },
        { label: "Welding Process", value: proc.process },
        { label: "Standard / Code", value: proc.standard },
        { label: "Effective Date", value: proc.wps_date ?? proc.approved_at?.slice(0, 10) ?? "—" },
      ]}
      revisionHistory={revisions}
      approvalHistory={approvals}
      signatories={fallbackSignatories}
      auditRefs={[
        { label: "WPS Code", value: proc.code },
        { label: "Revision", value: proc.revision },
        { label: "Status", value: proc.status },
      ]}
    >
      <SectionTitle index={1} title="Joint Design & Configuration" />
      {joints.length === 0 ? (
        <KvTable rows={[
          ["Joint type", proc.joint_type],
          ["Groove type", proc.groove_type ?? "—"],
          ["Welding position", proc.position_qualified ?? proc.position],
          ["Welding progression", proc.welding_progression ?? "—"],
          ["Pipe or plate", proc.pipe_or_plate ?? "—"],
          ["Thickness range qualified", proc.thickness_range],
          ["Joint notes", proc.joint_notes ?? proc.joint_prep ?? "—"],
        ]} />
      ) : (
        <div className="space-y-3">
          {joints.map((j: any, i: number) => (
            <div key={j.id} className="border border-foreground/30 p-2">
              <div className="text-[10pt] font-semibold mb-1">{j.label ?? `Joint ${i + 1}`}</div>
              <KvTable rows={[
                ["Groove type", j.groove_type],
                ["Joint type", j.joint_type],
                ["Progression", j.welding_progression],
                ["Position", j.position_qualified],
                ["Pipe / Plate", j.pipe_or_plate],
                ["Notes", j.notes],
              ]} />
              {sketchUrls[j.id] && (
                <img src={sketchUrls[j.id]} alt="Joint sketch" className="mt-2 max-h-48 mx-auto object-contain" />
              )}
            </div>
          ))}
        </div>
      )}

      <SectionTitle index={2} title="Base Metals" />
      {baseMetals.length === 0 ? (
        <KvTable rows={[
          ["Base material specification", proc.base_material],
          ["P-Number / Group", proc.p_number ?? "—"],
        ]} />
      ) : (
        <table className="w-full">
          <thead>
            <tr><th>#</th><th>Spec</th><th>P-No</th><th>Group</th><th>To P-No</th><th>To Group</th><th>Thk (mm)</th><th>Dia (mm)</th><th>Groove</th></tr>
          </thead>
          <tbody>
            {baseMetals.map((b: any, i: number) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.material_spec ?? "—"}</td>
                <td>{b.p_no ?? "—"}</td>
                <td>{b.p_group ?? "—"}</td>
                <td>{b.to_p_no ?? "—"}</td>
                <td>{b.to_p_group ?? "—"}</td>
                <td>{range(b.thickness_min_mm, b.thickness_max_mm, "")}</td>
                <td>{range(b.diameter_min_mm, b.diameter_max_mm, "")}</td>
                <td>{b.groove_applicability ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <SectionTitle index={3} title="Filler Metals & Consumables" />
      {fillers.length === 0 ? (
        <KvTable rows={[
          ["Filler material classification", proc.filler_material],
          ["F-Number / A-Number", proc.f_number ?? "—"],
          ["Shielding gas / flux", proc.shielding_gas],
        ]} />
      ) : (
        <table className="w-full">
          <thead>
            <tr><th>#</th><th>Process</th><th>SFA</th><th>AWS Class</th><th>F-No</th><th>A-No</th><th>Dia</th><th>Brand</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {fillers.map((f: any, i: number) => (
              <tr key={f.id}>
                <td>{i + 1}</td>
                <td>{f.process ?? "—"}</td>
                <td>{f.sfa_no ?? "—"}</td>
                <td>{f.aws_classification ?? "—"}</td>
                <td>{f.f_no ?? "—"}</td>
                <td>{f.a_no ?? "—"}</td>
                <td>{f.diameter_mm ?? "—"}</td>
                <td>{f.brand ?? "—"}</td>
                <td>{f.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <SectionTitle index={4} title="Preheat & Thermal Treatment" />
      <KvTable rows={[
        ["Minimum preheat (°C)", proc.preheat_min_c ?? proc.preheat_temp],
        ["Maximum interpass (°C)", proc.interpass_max_c ?? proc.interpass_temp],
        ["Preheat method", proc.preheat_method ?? "—"],
        ["PWHT requirements", proc.pwht ?? "—"],
        ["Thermal notes", proc.thermal_notes ?? "—"],
      ]} />

      <SectionTitle index={5} title="Electrical Characteristics (Pass-by-Pass)" />
      {electrical.length === 0 ? (
        <table className="w-full">
          <thead>
            <tr><th>Variable</th><th>Minimum</th><th>Maximum</th><th>Units</th></tr>
          </thead>
          <tbody>
            <tr><td>Voltage</td><td>{proc.voltage_min ?? "—"}</td><td>{proc.voltage_max ?? "—"}</td><td>V</td></tr>
            <tr><td>Current</td><td>{proc.current_min ?? "—"}</td><td>{proc.current_max ?? "—"}</td><td>A</td></tr>
            <tr><td>Travel speed</td><td>{proc.travel_speed_min ?? "—"}</td><td>{proc.travel_speed_max ?? "—"}</td><td>mm/min</td></tr>
            <tr><td>Heat input</td><td>{proc.heat_input_min ?? "—"}</td><td>{proc.heat_input_max ?? "—"}</td><td>kJ/mm</td></tr>
          </tbody>
        </table>
      ) : (
        <table className="w-full">
          <thead>
            <tr><th>Pass/Layer</th><th>Process</th><th>Filler</th><th>Dia</th><th>Polarity</th><th>Amps</th><th>Volts</th><th>Travel</th><th>Heat input</th></tr>
          </thead>
          <tbody>
            {electrical.map((e: any) => (
              <tr key={e.id}>
                <td>{e.pass_layer ?? "—"}</td>
                <td>{e.process ?? "—"}</td>
                <td>{e.filler_classification ?? "—"}</td>
                <td>{e.diameter_mm ?? "—"}</td>
                <td>{e.polarity ?? "—"}</td>
                <td>{range(e.amperage_min, e.amperage_max, "A")}</td>
                <td>{range(e.voltage_min, e.voltage_max, "V")}</td>
                <td>{range(e.travel_speed_min, e.travel_speed_max, "mm/min")}</td>
                <td>{e.heat_input ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <SectionTitle index={6} title="Technique" />
      <KvTable rows={[
        ["String / Weave", proc.technique_string_weave ?? "—"],
        ["Cleaning method", proc.cleaning_method ?? "—"],
        ["Back gouging", proc.back_gouging ?? "—"],
        ["Peening", proc.peening ?? "—"],
        ["Pass type", proc.pass_type ?? "—"],
        ["Electrode type", proc.electrode_type ?? "—"],
        ["Automation", proc.automation ?? "—"],
        ["Technique notes", proc.technique_notes ?? "—"],
      ]} />

      {sigs.length > 0 && (
        <>
          <SectionTitle index={7} title="Digital Signatures" />
          <div className="grid grid-cols-3 gap-2">
            {sigs.map((s: any) => (
              <div key={s.id} className="border border-foreground/30 p-2">
                <div className="text-[9pt] text-muted-foreground uppercase">{s.role}</div>
                <div className="text-[10pt] font-medium">{s.name}</div>
                {s.signature_data_url && (
                  <img src={s.signature_data_url} alt="signature" className="mt-1 h-14 object-contain bg-white" />
                )}
                <div className="text-[8pt] text-muted-foreground mt-1">
                  {new Date(s.signed_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {proc.notes && (
        <>
          <SectionTitle index={8} title="Technical Notes & Special Requirements" />
          <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 bg-muted/40">{proc.notes}</div>
        </>
      )}
    </ReportShell>
  );
}
