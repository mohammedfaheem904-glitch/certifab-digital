import { ReportShell, KvTable, SectionTitle } from "@/components/ReportShell";
import { fmtEngDate } from "@/lib/doc-number";

export function WeldTraceabilityDocument({
  weld,
  inspections = [],
  ncrs = [],
  events = [],
  procedure,
  project,
}: {
  weld: any;
  inspections?: any[];
  ncrs?: any[];
  events?: any[];
  procedure?: any;
  project?: any;
}) {
  return (
    <ReportShell
      title="Weld Traceability Report"
      subtitle={`Weld ${weld.weld_no}`}
      docType="WTR"
      entityId={weld.id}
      revision="Rev 0"
      status={weld.status}
      classification="Traceability Record · Controlled"
      projectMeta={project ? [
        { label: "Project", value: project.name },
        { label: "Project code", value: project.code },
        { label: "Client", value: project.client ?? "—" },
        { label: "Location", value: project.location ?? "—" },
      ] : undefined}
      traceability={[
        { label: "Weld No.", value: weld.weld_no },
        { label: "Joint No.", value: weld.joint_no ?? "—" },
        { label: "Spool No.", value: weld.spool_no ?? "—" },
        { label: "Drawing Ref.", value: weld.drawing_ref ?? "—" },
        { label: "Line No.", value: weld.line_no ?? "—" },
        { label: "Heat No.", value: weld.heat_number ?? "—" },
        { label: "Welder", value: weld.welder_name ?? "—" },
        { label: "Weld date", value: fmtEngDate(weld.weld_date) },
      ]}
      signatories={[
        { role: "Welder", name: weld.welder_name },
        { role: "QA/QC Inspector" },
        { role: "Project Manager" },
      ]}
    >
      <SectionTitle index={1} title="Weld Identification" />
      <KvTable rows={[
        ["Weld number", weld.weld_no],
        ["Joint type", weld.joint_type ?? "—"],
        ["Base material", weld.base_material ?? "—"],
        ["Filler metal", weld.filler_metal ?? "—"],
        ["Heat input recorded", weld.heat_input ?? "—"],
        ["Welding date", fmtEngDate(weld.weld_date)],
      ]} />

      {procedure && (
        <>
          <SectionTitle index={2} title="Applicable Welding Procedure" />
          <KvTable rows={[
            ["WPS code", procedure.code],
            ["Standard", procedure.standard],
            ["Process", procedure.process],
            ["Revision", procedure.revision],
            ["Approved on", fmtEngDate(procedure.approved_at)],
          ]} />
        </>
      )}

      <SectionTitle index={procedure ? 3 : 2} title="Inspection Summary" />
      <table className="w-full">
        <thead>
          <tr><th>Date</th><th>Type</th><th>Inspector</th><th>Defect</th><th>Severity</th><th>Result</th></tr>
        </thead>
        <tbody>
          {inspections.length === 0 && (
            <tr><td colSpan={6} className="text-center text-muted-foreground">No inspections recorded against this weld.</td></tr>
          )}
          {inspections.map((i) => (
            <tr key={i.id}>
              <td>{fmtEngDate(i.inspected_at)}</td>
              <td className="font-medium">{i.inspection_type}</td>
              <td>{i.inspector_name ?? "—"}</td>
              <td>{i.defect_type ?? "—"}</td>
              <td>{i.severity ?? "—"}</td>
              <td className="font-medium uppercase">{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionTitle index={procedure ? 4 : 3} title="Non-Conformance Records" />
      <table className="w-full">
        <thead>
          <tr><th>NCR No.</th><th>Title</th><th>Severity</th><th>Status</th><th>Due</th></tr>
        </thead>
        <tbody>
          {ncrs.length === 0 && (
            <tr><td colSpan={5} className="text-center text-muted-foreground">No NCRs raised — weld accepted as-is.</td></tr>
          )}
          {ncrs.map((n) => (
            <tr key={n.id}>
              <td className="font-mono">{n.ncr_no}</td>
              <td>{n.title}</td>
              <td>{n.severity ?? "—"}</td>
              <td className="uppercase">{n.status}</td>
              <td>{fmtEngDate(n.due_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionTitle index={procedure ? 5 : 4} title="Lifecycle Events" />
      <table className="w-full">
        <thead>
          <tr><th>Date / Time</th><th>Event</th><th>Actor</th><th>Details</th></tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr><td colSpan={4} className="text-center text-muted-foreground">No lifecycle events.</td></tr>
          )}
          {events.map((e) => (
            <tr key={e.id}>
              <td className="font-mono text-[9pt]">{new Date(e.created_at).toLocaleString()}</td>
              <td className="uppercase">{e.kind?.replace(/_/g, " ")}</td>
              <td>{e.actor_name ?? "—"}</td>
              <td className="font-mono text-[8.5pt] whitespace-pre-wrap">{e.payload ? JSON.stringify(e.payload) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportShell>
  );
}
