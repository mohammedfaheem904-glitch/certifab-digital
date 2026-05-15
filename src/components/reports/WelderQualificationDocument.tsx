import { ReportShell, KvTable, SectionTitle } from "@/components/ReportShell";
import { fmtEngDate } from "@/lib/doc-number";
import { deriveQualStatus, continuityBroken, continuityWarning } from "@/lib/qualification-status";
import { QrCodeBlock } from "@/components/QrCodeBlock";
import { daysUntil } from "@/lib/format";

const QW_VARIABLES: Array<{ key: string; label: string; ref: string }> = [
  { key: "p_no", label: "P-Number (Base Metal Group)", ref: "QW-403" },
  { key: "pipe_diameter", label: "Pipe Diameter", ref: "QW-403" },
  { key: "backing", label: "Backing", ref: "QW-402" },
  { key: "inert_gas_backing", label: "Inert Gas Backing", ref: "QW-408" },
  { key: "f_no", label: "F-Number (Filler)", ref: "QW-404" },
  { key: "aws_spec", label: "AWS Specification", ref: "QW-404" },
  { key: "insert_ring", label: "Consumable Insert", ref: "QW-402" },
  { key: "weld_deposit", label: "T Weld Deposit Thickness", ref: "QW-403" },
  { key: "test_specimen", label: "Test Specimen", ref: "QW-452" },
  { key: "position", label: "Position", ref: "QW-405" },
  { key: "progression", label: "Vertical Progression", ref: "QW-405" },
  { key: "polarity", label: "Current / Polarity", ref: "QW-409" },
  { key: "sfa", label: "SFA Classification", ref: "QW-404" },
  { key: "filler_metal", label: "Filler Metal Form", ref: "QW-404" },
  { key: "transfer_mode", label: "Transfer Mode (GMAW)", ref: "QW-409" },
  { key: "joint_type", label: "Joint Type", ref: "QW-402" },
];

const NDT_TESTS = ["VT", "MT", "PT", "RT", "UT"];
const DT_TESTS = ["Macro", "Root Bend", "Face Bend", "Side Bend", "Fillet Break", "Tensile", "Nick Break", "Hardness"];

export function WelderQualificationDocument({
  q,
  variables = [],
  tests = [],
  signatures = [],
  verifyUrl,
}: {
  q: any;
  variables?: Array<any>;
  tests?: Array<any>;
  signatures?: Array<any>;
  verifyUrl?: string;
}) {
  const status = deriveQualStatus(q);
  const expiryDays = daysUntil(q.expiry_date);
  const contBroken = continuityBroken(q.last_continuity_date);
  const contWarn = continuityWarning(q.last_continuity_date);

  // Merge code-defined matrix with stored variables
  const varsByKey = new Map((variables ?? []).map((v) => [v.variable_key, v]));
  const matrixRows = QW_VARIABLES.map((v) => {
    const stored = varsByKey.get(v.key);
    return {
      label: v.label,
      qualified_with: stored?.qualified_with ?? "—",
      qualified_for: stored?.qualified_for ?? "Per code",
      ref: stored?.code_reference ?? v.ref,
    };
  });

  const ndtRows = NDT_TESTS.map((t) => {
    const found = tests.find((x) => x.category === "ndt" && x.test_type === t);
    return { type: t, ...(found ?? {}) };
  });
  const dtRows = DT_TESTS.map((t) => {
    const found = tests.find((x) => x.category === "destructive" && x.test_type === t);
    return { type: t, ...(found ?? {}) };
  });

  return (
    <ReportShell
      title="Welder Performance Qualification Record (WPQ)"
      subtitle={`${q.code_family ?? "ASME Section IX"} · ${q.process ?? "—"}`}
      docType="WPQ"
      entityId={q.id}
      revision={q.revision ?? "Rev 0"}
      status={status}
      classification="Personnel Qualification Record — Audit Controlled"
      meta={[
        { label: "WPQ No.", value: q.wpq_number ?? q.doc_number ?? "—" },
        { label: "WPS No.", value: q.wps_number ?? "—" },
        { label: "PQR No.", value: q.pqr_number ?? "—" },
        { label: "Stamp No.", value: q.stamp_number ?? "—" },
      ]}
      signatories={
        signatures.length > 0
          ? signatures.map((s) => ({ role: s.role, name: s.name, signedOn: s.signed_at }))
          : [
              { role: "QC Engineer" },
              { role: "QA/QC Manager" },
              { role: "Witnessed By" },
              { role: "Examiner" },
              { role: "Client Representative" },
            ]
      }
    >
      {/* Header strip with welder photo + QR */}
      <div className="flex items-start justify-between gap-6 border-b border-border/60 pb-4 mb-4">
        <div className="flex gap-4">
          {q.welder_photo_url ? (
            <img
              src={q.welder_photo_url}
              alt={q.welder_name}
              className="w-24 h-32 object-cover rounded border border-border/60"
            />
          ) : (
            <div className="w-24 h-32 rounded border border-dashed border-border/60 grid place-items-center text-[10px] text-muted-foreground text-center px-1">
              Welder Photo
            </div>
          )}
          <div className="space-y-1">
            <div className="text-lg font-semibold">{q.welder_name}</div>
            <div className="text-sm text-muted-foreground">ID: {q.employee_id}</div>
            <div className="text-sm text-muted-foreground">Stamp: {q.stamp_number ?? "—"}</div>
            <div className="text-xs text-muted-foreground">
              Test No.: {q.welder_test_number ?? "—"} · Coupon: {q.test_coupon_type ?? "—"}
            </div>
          </div>
        </div>
        {verifyUrl && <QrCodeBlock value={verifyUrl} caption="Scan to verify" />}
      </div>

      <SectionTitle index={1} title="Welder Qualification Record" />
      <KvTable
        rows={[
          ["Welding Process", q.process],
          ["Process Type", q.process_type ?? "—"],
          ["Applicable Code / Standard", `${q.code_family ?? "ASME IX"} — ${q.standard ?? ""}`.trim()],
          ["Qualification Date", fmtEngDate(q.qualification_date ?? q.created_at)],
          ["Expiry Date", fmtEngDate(q.expiry_date)],
          [
            "Last Continuity Activity",
            q.last_continuity_date
              ? `${fmtEngDate(q.last_continuity_date)}${contBroken ? " — CONTINUITY BROKEN (>6 months)" : contWarn ? " — Approaching 6-month limit" : ""}`
              : "Not recorded",
          ],
          ["Qualification Status", status],
        ]}
      />

      <SectionTitle index={2} title="Qualification Variables & Limits (QW-4xx)" />
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left">Variable</th>
            <th className="text-left">Qualified With</th>
            <th className="text-left">Qualified For (Range)</th>
            <th className="text-left">Code Ref.</th>
          </tr>
        </thead>
        <tbody>
          {matrixRows.map((r) => (
            <tr key={r.label}>
              <td className="font-medium">{r.label}</td>
              <td>{r.qualified_with}</td>
              <td>{r.qualified_for}</td>
              <td className="text-muted-foreground">{r.ref}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionTitle index={3} title="Test Results — Non-Destructive (NDT)" />
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th>Test</th><th>Result</th><th>Report No.</th><th>Inspector</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {ndtRows.map((r) => (
            <tr key={r.type}>
              <td className="font-medium">{r.type}</td>
              <td>{r.result ?? "—"}</td>
              <td>{r.report_number ?? "—"}</td>
              <td>{r.inspector_name ?? "—"}</td>
              <td>{fmtEngDate(r.test_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionTitle index={4} title="Test Results — Destructive" />
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th>Test</th><th>Result</th><th>Report No.</th><th>Inspector</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dtRows.map((r) => (
            <tr key={r.type}>
              <td className="font-medium">{r.type}</td>
              <td>{r.result ?? "—"}</td>
              <td>{r.report_number ?? "—"}</td>
              <td>{r.inspector_name ?? "—"}</td>
              <td>{fmtEngDate(r.test_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionTitle index={5} title="Final Qualification Result" />
      <KvTable
        rows={[
          ["Outcome", q.result ?? (status === "Expired" ? "Unsatisfactory (Expired)" : "Satisfactory")],
          ["Remarks", q.remarks ?? "—"],
          ["Rejection Reason", q.rejection_reason ?? "—"],
          ["Re-qualification Required", expiryDays != null && expiryDays <= 30 ? "Yes — schedule before expiry" : "No"],
        ]}
      />
    </ReportShell>
  );
}
