import { ReportShell, KvTable, SectionTitle } from "@/components/ReportShell";
import { fmtEngDate } from "@/lib/doc-number";

export function InspectionReportDocument({ ins, weld, project }: { ins: any; weld?: any; project?: any }) {
  return (
    <ReportShell
      title={`${ins.inspection_type ?? "VT"} Inspection Report`}
      subtitle={ins.ncr_code ? `Linked NCR: ${ins.ncr_code}` : undefined}
      docType={ins.inspection_type ?? "INS"}
      entityId={ins.id}
      revision="Rev 0"
      status={ins.status}
      classification="Inspection Record · Controlled"
      projectMeta={project ? [
        { label: "Project", value: project.name },
        { label: "Project code", value: project.code },
        { label: "Client", value: project.client ?? "—" },
        { label: "Location", value: project.location ?? "—" },
      ] : undefined}
      traceability={weld ? [
        { label: "Weld No.", value: weld.weld_no },
        { label: "Joint", value: weld.joint_no ?? "—" },
        { label: "Spool", value: weld.spool_no ?? "—" },
        { label: "Drawing", value: weld.drawing_ref ?? "—" },
        { label: "Line", value: weld.line_no ?? "—" },
        { label: "Heat No.", value: weld.heat_number ?? "—" },
        { label: "Welder", value: weld.welder_name ?? "—" },
        { label: "Base material", value: weld.base_material ?? "—" },
      ] : undefined}
      signatories={[
        { role: "Inspector", name: ins.inspector_name, date: ins.inspected_at },
        { role: "QA/QC Manager" },
        { role: "Client / Third Party" },
      ]}
    >
      <SectionTitle index={1} title="Inspection Details" />
      <KvTable rows={[
        ["Inspection type", ins.inspection_type],
        ["Inspection method / procedure", ins.method ?? "Per applicable WPS / NDT procedure"],
        ["Performed on", fmtEngDate(ins.inspected_at)],
        ["Inspector name", ins.inspector_name ?? "—"],
        ["Inspector qualification", ins.inspector_cert ?? "ASNT Level II / ISO 9712"],
      ]} />

      <SectionTitle index={2} title="Findings" />
      <table className="w-full">
        <thead>
          <tr><th>Defect type</th><th>Severity</th><th>Location</th><th>Disposition</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>{ins.defect_type ?? "None observed"}</td>
            <td>{ins.severity ?? "—"}</td>
            <td>{ins.location ?? "—"}</td>
            <td className="uppercase font-medium">{ins.status === "Accepted" ? "Accepted" : ins.status === "Open" ? "Repair / Re-inspect" : ins.status}</td>
          </tr>
        </tbody>
      </table>

      <SectionTitle index={3} title="Acceptance Criteria & Result" />
      <KvTable rows={[
        ["Acceptance code", ins.acceptance_code ?? "ASME B31.3 / AWS D1.1"],
        ["Result", ins.status],
        ["NCR raised", ins.ncr_code ?? "None"],
        ["Re-inspection required", ins.status === "Open" ? "Yes" : "No"],
      ]} />
    </ReportShell>
  );
}
