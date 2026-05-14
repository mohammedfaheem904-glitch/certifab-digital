import { ReportShell, KvTable, SectionTitle, type ApprovalEntry, type RevisionEntry } from "@/components/ReportShell";

function range(min: any, max: any, unit: string) {
  if (min == null && max == null) return "—";
  return `${min ?? "—"} – ${max ?? "—"} ${unit}`;
}

export type WpsDocumentProps = {
  proc: any;
  approvals?: ApprovalEntry[];
  revisions?: RevisionEntry[];
  kind?: "WPS" | "PQR";
};

export function WpsDocument({ proc, approvals = [], revisions = [], kind = "WPS" }: WpsDocumentProps) {
  const title = kind === "PQR"
    ? "Procedure Qualification Record"
    : "Welding Procedure Specification";

  const subtitle = `${proc.standard ?? "ASME IX"} · ${proc.process ?? "—"} · ${proc.code}`;

  const signatories = [
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
        { label: "Code / Identification", value: proc.code },
        { label: "Welding Process", value: proc.process },
        { label: "Standard / Code", value: proc.standard },
        { label: "Effective Date", value: proc.approved_at?.slice(0, 10) ?? "—" },
      ]}
      revisionHistory={revisions}
      approvalHistory={approvals}
      signatories={signatories}
      auditRefs={[
        { label: "WPS Code", value: proc.code },
        { label: "Revision", value: proc.revision },
        { label: "Status", value: proc.status },
      ]}
    >
      <SectionTitle index={1} title="Joint Design & Configuration" />
      <KvTable rows={[
        ["Joint type", proc.joint_type],
        ["Welding position", proc.position],
        ["Thickness range qualified", proc.thickness_range],
        ["Backing", proc.backing ?? "—"],
        ["Joint preparation", proc.joint_prep ?? "Per drawing reference"],
      ]} />

      <SectionTitle index={2} title="Base & Filler Materials" />
      <KvTable rows={[
        ["Base material specification", proc.base_material],
        ["P-Number / Group", proc.p_number ?? "—"],
        ["Filler material classification", proc.filler_material],
        ["F-Number / A-Number", proc.f_number ?? "—"],
        ["Shielding gas / flux", proc.shielding_gas],
        ["Gas flow rate", proc.gas_flow ?? "—"],
      ]} />

      <SectionTitle index={3} title="Preheat & Post-Weld Heat Treatment" />
      <KvTable rows={[
        ["Minimum preheat temperature", proc.preheat_temp],
        ["Interpass temperature (max)", proc.interpass_temp],
        ["PWHT requirements", proc.pwht],
      ]} />

      <SectionTitle index={4} title="Electrical & Mechanical Variables" />
      <table className="w-full">
        <thead>
          <tr><th>Variable</th><th>Minimum</th><th>Maximum</th><th>Units</th></tr>
        </thead>
        <tbody>
          <tr><td>Voltage</td><td className="font-mono">{proc.voltage_min ?? "—"}</td><td className="font-mono">{proc.voltage_max ?? "—"}</td><td>V</td></tr>
          <tr><td>Current</td><td className="font-mono">{proc.current_min ?? "—"}</td><td className="font-mono">{proc.current_max ?? "—"}</td><td>A</td></tr>
          <tr><td>Travel speed</td><td className="font-mono">{proc.travel_speed_min ?? "—"}</td><td className="font-mono">{proc.travel_speed_max ?? "—"}</td><td>mm/min</td></tr>
          <tr><td>Heat input</td><td className="font-mono">{proc.heat_input_min ?? "—"}</td><td className="font-mono">{proc.heat_input_max ?? "—"}</td><td>kJ/mm</td></tr>
        </tbody>
      </table>

      <SectionTitle index={5} title="Essential Variables Summary" />
      <KvTable rows={[
        ["Operating range", range(proc.heat_input_min, proc.heat_input_max, "kJ/mm")],
        ["Voltage range", range(proc.voltage_min, proc.voltage_max, "V")],
        ["Current range", range(proc.current_min, proc.current_max, "A")],
        ["Travel speed", range(proc.travel_speed_min, proc.travel_speed_max, "mm/min")],
      ]} />

      {proc.notes && (
        <>
          <SectionTitle index={6} title="Technical Notes & Special Requirements" />
          <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 bg-muted/40">{proc.notes}</div>
        </>
      )}
    </ReportShell>
  );
}
