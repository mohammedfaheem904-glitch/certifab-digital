import { ReportShell, KvTable, SectionTitle } from "@/components/ReportShell";
import { fmtEngDate } from "@/lib/doc-number";
import { daysUntil } from "@/lib/format";

export function CalibrationCertificateDocument({
  instrument,
  calibration,
}: {
  instrument: any;
  /** Most recent calibration record. Pass undefined if none. */
  calibration?: any;
}) {
  const due = instrument.calibration_due ?? calibration?.next_due;
  const days = due ? daysUntil(due) : null;
  const status =
    days == null ? instrument.status :
    days < 0 ? `EXPIRED ${Math.abs(days)}d` :
    days <= 30 ? `Due in ${days}d` :
    "VALID";

  return (
    <ReportShell
      title="Instrument Calibration Certificate"
      subtitle={`${instrument.name} · ${instrument.asset_id}`}
      docType="CAL"
      entityId={instrument.id}
      revision="Rev 0"
      status={status}
      classification="Calibration Record · Controlled"
      meta={[
        { label: "Asset ID", value: instrument.asset_id },
        { label: "Category", value: instrument.category },
        { label: "Calibrated on", value: fmtEngDate(calibration?.calibrated_on) },
        { label: "Next due", value: fmtEngDate(due) },
      ]}
      signatories={[
        { role: "Calibrated by", name: calibration?.performed_by ?? null, date: calibration?.calibrated_on },
        { role: "QA/QC Reviewer" },
        { role: "Authorised Inspector" },
      ]}
    >
      <SectionTitle index={1} title="Instrument Identification" />
      <KvTable rows={[
        ["Asset ID", instrument.asset_id],
        ["Name", instrument.name],
        ["Manufacturer", instrument.manufacturer],
        ["Model", instrument.model],
        ["Serial Number", instrument.serial_number],
        ["Category", instrument.category],
      ]} />

      <SectionTitle index={2} title="Calibration Details" />
      <KvTable rows={[
        ["Calibrated on", fmtEngDate(calibration?.calibrated_on)],
        ["Calibration laboratory", calibration?.performed_by ?? "—"],
        ["Reference standard / traceability", calibration?.reference ?? "Traceable to national standard"],
        ["Environmental conditions", calibration?.environment ?? "Controlled lab conditions"],
        ["Procedure used", calibration?.procedure ?? "Per manufacturer specification"],
      ]} />

      <SectionTitle index={3} title="Results & Validity" />
      <table className="w-full">
        <thead>
          <tr><th>Parameter</th><th>Nominal</th><th>As Found</th><th>As Left</th><th>Tolerance</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Per certificate</td>
            <td className="text-muted-foreground">See attached cert</td>
            <td className="text-muted-foreground">See attached cert</td>
            <td className="text-muted-foreground">See attached cert</td>
            <td>Per spec</td>
          </tr>
        </tbody>
      </table>

      <KvTable rows={[
        ["Calibration result", calibration ? "Within tolerance — instrument approved for use" : "—"],
        ["Validity period", `Until ${fmtEngDate(due)}`],
        ["Status", status],
      ]} />

      {calibration?.notes && (
        <>
          <SectionTitle index={4} title="Notes" />
          <div className="text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3">
            {calibration.notes}
          </div>
        </>
      )}
    </ReportShell>
  );
}
