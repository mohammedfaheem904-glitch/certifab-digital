import { createFileRoute, notFound } from "@tanstack/react-router";
import { ReportShell } from "@/components/ReportShell";
import { useCompanyRows } from "@/lib/use-company-rows";
import { exportExcel } from "@/lib/export";
import { Loader2 } from "lucide-react";
import { daysUntil } from "@/lib/format";

export const Route = createFileRoute("/app/reports/$slug")({
  component: ReportPage,
});

const TITLES: Record<string, string> = {
  qualifications: "Welder Qualifications Register",
  procedures: "WPS / PQR Register",
  welds: "Weld Traceability Report",
  inspections: "Inspection Outcomes Report",
  ncrs: "NCR Register",
  calibration: "Equipment & Instruments Calibration",
};

function ReportPage() {
  const { slug } = Route.useParams();
  if (!TITLES[slug]) throw notFound();

  switch (slug) {
    case "qualifications": return <QualificationsReport />;
    case "procedures": return <ProceduresReport />;
    case "welds": return <WeldsReport />;
    case "inspections": return <InspectionsReport />;
    case "ncrs": return <NcrsReport />;
    case "calibration": return <CalibrationReport />;
  }
  return null;
}

const DOC_TYPES: Record<string, string> = {
  qualifications: "WQR", procedures: "WPS-REG", welds: "WTR",
  inspections: "INS", ncrs: "NCR", calibration: "CAL",
};

function Wrap({ slug, title, rows, isLoading, columns, onExportRows }: any) {
  return (
    <ReportShell
      title={title}
      subtitle={`${rows.length} record${rows.length === 1 ? "" : "s"}`}
      docType={DOC_TYPES[slug] ?? "RPT"}
      revision="Rev 1"
      status="ISSUED"
      meta={[
        { label: "Report type", value: title },
        { label: "Records", value: String(rows.length) },
        { label: "Period", value: "All time" },
        { label: "Confidentiality", value: "Internal · Controlled" },
      ]}
      onExportExcel={() => exportExcel(title, "Report", onExportRows ? onExportRows() : rows)}
    >
      <table className="w-full text-sm">
        <thead>
          <tr>{columns.map((c: any) => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {isLoading && <tr><td colSpan={columns.length} className="text-center text-muted-foreground py-6"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
          {!isLoading && rows.length === 0 && <tr><td colSpan={columns.length} className="text-center text-muted-foreground py-6">No records.</td></tr>}
          {rows.map((r: any, i: number) => (
            <tr key={r.id ?? i}>
              {columns.map((c: any) => <td key={c.key}>{c.render ? c.render(r) : (r[c.key] ?? "—")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </ReportShell>
  );
}

function QualificationsReport() {
  const { data, isLoading } = useCompanyRows<any>("qualifications", { order: { column: "expiry_date", ascending: true } });
  const rows = data ?? [];
  return <Wrap slug="qualifications" title={TITLES.qualifications} isLoading={isLoading} rows={rows}
    columns={[
      { key: "welder_name", label: "Welder" },
      { key: "employee_id", label: "Employee ID" },
      { key: "process", label: "Process" },
      { key: "standard", label: "Standard" },
      { key: "expiry_date", label: "Expiry" },
      { key: "status", label: "Status", render: (r: any) => {
        const d = daysUntil(r.expiry_date);
        return d == null ? r.status : d < 0 ? `Expired ${Math.abs(d)}d ago` : d <= 30 ? `Expires in ${d}d` : r.status;
      }},
    ]} />;
}

function ProceduresReport() {
  const { data, isLoading } = useCompanyRows<any>("procedures", { order: { column: "code", ascending: true } });
  return <Wrap slug="procedures" title={TITLES.procedures} isLoading={isLoading} rows={data ?? []}
    columns={[
      { key: "code", label: "Code" },
      { key: "standard", label: "Standard" },
      { key: "process", label: "Process" },
      { key: "thickness_range", label: "Thickness" },
      { key: "revision", label: "Rev" },
      { key: "status", label: "Status" },
    ]} />;
}

function WeldsReport() {
  const { data, isLoading } = useCompanyRows<any>("welds", { order: { column: "weld_date", ascending: false } });
  return <Wrap slug="welds" title={TITLES.welds} isLoading={isLoading} rows={data ?? []}
    columns={[
      { key: "weld_no", label: "Weld No." },
      { key: "welder_name", label: "Welder" },
      { key: "heat_input", label: "Heat input" },
      { key: "weld_date", label: "Date" },
      { key: "status", label: "Status" },
    ]} />;
}

function InspectionsReport() {
  const { data, isLoading } = useCompanyRows<any>("inspections", { order: { column: "inspected_at", ascending: false } });
  return <Wrap slug="inspections" title={TITLES.inspections} isLoading={isLoading} rows={data ?? []}
    columns={[
      { key: "inspection_type", label: "Type" },
      { key: "ncr_code", label: "NCR" },
      { key: "defect_type", label: "Defect" },
      { key: "severity", label: "Severity" },
      { key: "status", label: "Status" },
      { key: "inspector_name", label: "Inspector" },
    ]} />;
}

function NcrsReport() {
  const { data, isLoading } = useCompanyRows<any>("inspections", { order: { column: "inspected_at", ascending: false } });
  const rows = (data ?? []).filter((r: any) => r.ncr_code);
  return <Wrap slug="ncrs" title={TITLES.ncrs} isLoading={isLoading} rows={rows}
    columns={[
      { key: "ncr_code", label: "NCR" },
      { key: "inspection_type", label: "Detected via" },
      { key: "defect_type", label: "Defect" },
      { key: "severity", label: "Severity" },
      { key: "status", label: "Status" },
    ]} />;
}

function CalibrationReport() {
  const { data: equipment, isLoading: l1 } = useCompanyRows<any>("equipment", { order: { column: "calibration_due", ascending: true } });
  const { data: instruments, isLoading: l2 } = useCompanyRows<any>("instruments", { order: { column: "calibration_due", ascending: true } });
  const rows = [
    ...(equipment ?? []).map((e: any) => ({ id: `e-${e.id}`, kind: "Welding machine", asset: e.asset_id, name: e.model, due: e.calibration_due, status: e.status })),
    ...(instruments ?? []).map((i: any) => ({ id: `i-${i.id}`, kind: "QA/QC instrument", asset: i.asset_id, name: i.name, due: i.calibration_due, status: i.status })),
  ];
  return <Wrap slug="calibration" title={TITLES.calibration} isLoading={l1 || l2} rows={rows}
    columns={[
      { key: "kind", label: "Kind" },
      { key: "asset", label: "Asset ID" },
      { key: "name", label: "Name / Model" },
      { key: "due", label: "Calibration due", render: (r: any) => {
        const d = daysUntil(r.due);
        if (d == null) return r.due ?? "—";
        const tag = d < 0 ? ` (overdue ${Math.abs(d)}d)` : d <= 30 ? ` (due ${d}d)` : "";
        return `${r.due}${tag}`;
      }},
      { key: "status", label: "Status" },
    ]} />;
}
