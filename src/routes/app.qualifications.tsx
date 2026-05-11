import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Row = {
  id: string;
  welder_name: string;
  employee_id: string;
  process: string;
  standard: string;
  expiry_date: string;
  status: string;
};

export const Route = createFileRoute("/app/qualifications")({
  component: QualificationsPage,
});

function QualificationsPage() {
  const { data, isLoading } = useCompanyRows<Row>("qualifications", { order: { column: "expiry_date", ascending: true } });

  return (
    <ModulePage
      title="Welder Qualifications"
      subtitle="Track personnel certifications, expiry alerts and continuity requirements."
      action={
        <NewRecordDialog table="qualifications" title="New welder qualification" trigger="New Welder" defaults={{ status: "Active" }}>
          {({ values, set }) => (
            <>
              <F label="Welder name"><Input required value={values.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} /></F>
              <F label="Employee ID"><Input required value={values.employee_id ?? ""} onChange={(e) => set("employee_id", e.target.value)} /></F>
              <F label="Process"><Input required value={values.process ?? ""} onChange={(e) => set("process", e.target.value)} placeholder="GTAW" /></F>
              <F label="Standard"><Input required value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX" /></F>
              <F label="Expiry date"><Input type="date" required value={values.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value)} /></F>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr><Th>Welder</Th><Th>Employee</Th><Th>Process</Th><Th>Standard</Th><Th>Expiry</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={6}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && (data?.length ?? 0) === 0 && <Empty colSpan={6}>No qualifications yet.</Empty>}
            {data?.map((q) => (
              <tr key={q.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{q.welder_name}</td>
                <td className="px-5 py-3 text-muted-foreground">{q.employee_id}</td>
                <td className="px-5 py-3">{q.process}</td>
                <td className="px-5 py-3 text-muted-foreground">{q.standard}</td>
                <td className="px-5 py-3">{q.expiry_date}</td>
                <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
