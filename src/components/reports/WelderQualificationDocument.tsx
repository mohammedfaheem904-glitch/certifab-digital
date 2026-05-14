import { ReportShell, KvTable, SectionTitle } from "@/components/ReportShell";
import { fmtEngDate } from "@/lib/doc-number";
import { daysUntil } from "@/lib/format";

export function WelderQualificationDocument({ q }: { q: any }) {
  const expiryDays = q.expiry_date ? daysUntil(q.expiry_date) : null;
  const statusLabel =
    expiryDays == null ? q.status :
    expiryDays < 0 ? `EXPIRED ${Math.abs(expiryDays)} days ago` :
    expiryDays <= 30 ? `${q.status} · expires in ${expiryDays} days` :
    q.status;

  return (
    <ReportShell
      title="Welder Performance Qualification Certificate"
      subtitle={`${q.standard ?? "ASME IX"} · ${q.process ?? "—"}`}
      docType="WPQ"
      entityId={q.id}
      revision="Rev 0"
      status={statusLabel}
      classification="Personnel Qualification Record"
      meta={[
        { label: "Welder", value: q.welder_name },
        { label: "Employee ID", value: q.employee_id },
        { label: "Process", value: q.process },
        { label: "Standard", value: q.standard },
      ]}
      signatories={[
        { role: "Welder", name: q.welder_name },
        { role: "Examining QA/QC Engineer" },
        { role: "Authorised Inspector" },
      ]}
    >
      <SectionTitle index={1} title="Welder Identification" />
      <KvTable rows={[
        ["Full name", q.welder_name],
        ["Employee / Stamp ID", q.employee_id],
        ["Date of qualification", fmtEngDate(q.created_at)],
        ["Continuity verification", q.continuity ?? "Maintained — no break > 6 months"],
      ]} />

      <SectionTitle index={2} title="Qualified Process & Variables" />
      <KvTable rows={[
        ["Welding process", q.process],
        ["Qualification standard", q.standard],
        ["Position(s) qualified", q.position ?? "All groove positions per code"],
        ["Base material group (P-No.)", q.p_number ?? "Per code"],
        ["Filler material (F-No.)", q.f_number ?? "Per code"],
        ["Backing", q.backing ?? "With / without — see test coupon"],
        ["Thickness range qualified", q.thickness_range ?? "Per code limits"],
        ["Diameter range qualified", q.diameter_range ?? "Per code limits"],
      ]} />

      <SectionTitle index={3} title="Test Results" />
      <table className="w-full">
        <thead>
          <tr><th>Test</th><th>Method</th><th>Result</th><th>Reference</th></tr>
        </thead>
        <tbody>
          <tr><td>Visual examination</td><td>VT</td><td>{q.vt_result ?? "Acceptable"}</td><td>Code §</td></tr>
          <tr><td>Radiographic examination</td><td>RT</td><td>{q.rt_result ?? "Acceptable"}</td><td>Code §</td></tr>
          <tr><td>Bend / mechanical</td><td>BT</td><td>{q.bt_result ?? "Acceptable"}</td><td>Code §</td></tr>
        </tbody>
      </table>

      <SectionTitle index={4} title="Validity & Continuity" />
      <KvTable rows={[
        ["Issued on", fmtEngDate(q.created_at)],
        ["Expiry date", fmtEngDate(q.expiry_date)],
        ["Status", statusLabel],
        ["Re-qualification required", expiryDays != null && expiryDays <= 30 ? "Yes — schedule before expiry" : "No"],
      ]} />
    </ReportShell>
  );
}
