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
  ncr_code: string | null;
  inspection_type: string;
  defect_type: string | null;
  severity: string | null;
  status: string;
};

export const Route = createFileRoute("/app/inspections")({
  component: InspectionsPage,
});

function InspectionsPage() {
  const { data, isLoading } = useCompanyRows<Row>("inspections", { order: { column: "inspected_at" } });
  return (
    <ModulePage
      title="Inspections & Non-Conformances"
      subtitle="VT · PT · MT · RT · UT — defect tracking, repair workflow and acceptance reports."
      action={
        <NewRecordDialog table="inspections" title="New inspection / NCR" trigger="New Inspection" defaults={{ status: "Open", inspection_type: "VT" }}>
          {({ values, set }) => (
            <>
              <F label="NCR code (optional)"><Input value={values.ncr_code ?? ""} onChange={(e) => set("ncr_code", e.target.value)} placeholder="NCR-0232" /></F>
              <F label="Inspection type"><Input required value={values.inspection_type ?? ""} onChange={(e) => set("inspection_type", e.target.value)} placeholder="RT" /></F>
              <F label="Defect"><Input value={values.defect_type ?? ""} onChange={(e) => set("defect_type", e.target.value)} placeholder="Porosity cluster" /></F>
              <F label="Severity"><Input value={values.severity ?? ""} onChange={(e) => set("severity", e.target.value)} placeholder="High" /></F>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr><Th>NCR</Th><Th>Type</Th><Th>Defect</Th><Th>Severity</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={5}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && (data?.length ?? 0) === 0 && <Empty colSpan={5}>No inspections logged yet.</Empty>}
            {data?.map((n) => (
              <tr key={n.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{n.ncr_code ?? "—"}</td>
                <td className="px-5 py-3">{n.inspection_type}</td>
                <td className="px-5 py-3">{n.defect_type}</td>
                <td className="px-5 py-3">{n.severity && <StatusBadge status={n.severity} />}</td>
                <td className="px-5 py-3 text-muted-foreground">{n.status}</td>
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
