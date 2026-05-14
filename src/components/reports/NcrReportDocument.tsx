import { ReportShell, KvTable, SectionTitle, type ApprovalEntry } from "@/components/ReportShell";
import { fmtEngDate } from "@/lib/doc-number";

export function NcrReportDocument({ ncr, events = [] }: { ncr: any; events?: any[] }) {
  const approvals: ApprovalEntry[] = events.map((e) => ({
    action: e.kind?.replace(/_/g, " ") ?? "event",
    actor_name: e.actor_name ?? null,
    actor_role: null,
    signed_at: e.created_at,
    comment: e.comment ?? null,
  }));

  return (
    <ReportShell
      title="Non-Conformance Report"
      subtitle={ncr.title}
      docType="NCR"
      entityId={ncr.id}
      revision="Rev 0"
      status={ncr.status}
      classification="Quality Record · Controlled"
      meta={[
        { label: "NCR No.", value: ncr.ncr_no },
        { label: "Severity", value: ncr.severity ?? "—" },
        { label: "Raised on", value: fmtEngDate(ncr.created_at) },
        { label: "Due date", value: fmtEngDate(ncr.due_date) },
      ]}
      approvalHistory={approvals}
      signatories={[
        { role: "Raised by", name: ncr.raised_by_name, date: ncr.created_at },
        { role: "QA/QC Manager" },
        { role: "Closed by", name: ncr.closed_by, date: ncr.closed_at },
      ]}
    >
      <SectionTitle index={1} title="Identification" />
      <KvTable rows={[
        ["NCR Number", ncr.ncr_no],
        ["Title", ncr.title],
        ["Severity", ncr.severity ?? "—"],
        ["Status", ncr.status],
        ["Raised by", ncr.raised_by_name ?? "—"],
        ["Assigned to", ncr.assigned_to_name ?? "—"],
      ]} />

      <SectionTitle index={2} title="Description of Non-Conformance" />
      <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]">
        {ncr.description ?? "—"}
      </div>

      <SectionTitle index={3} title="Root Cause Analysis" />
      <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]">
        {ncr.root_cause ?? "—"}
      </div>

      <SectionTitle index={4} title="Corrective Action" />
      <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]">
        {ncr.corrective_action ?? "—"}
      </div>

      <SectionTitle index={5} title="Preventive Action" />
      <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]">
        {ncr.preventive_action ?? "—"}
      </div>

      <SectionTitle index={6} title="Closure" />
      <KvTable rows={[
        ["Closed on", fmtEngDate(ncr.closed_at)],
        ["Closed by", ncr.closed_by ?? "—"],
        ["Verification of effectiveness", ncr.status === "Closed" ? "Verified" : "Pending"],
      ]} />
    </ReportShell>
  );
}
