import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Row = { id: string; asset_id: string; model: string; status: string; calibration_due: string | null };

export const Route = createFileRoute("/app/equipment")({
  component: EquipmentPage,
});

function EquipmentPage() {
  const { data, isLoading } = useCompanyRows<Row>("equipment", { order: { column: "calibration_due", ascending: true } });
  return (
    <ModulePage
      title="Fleet & Equipment"
      subtitle="Welding machines, calibration schedules and maintenance status across the yard."
      action={
        <NewRecordDialog table="equipment" title="Register machine" trigger="Register Machine" defaults={{ status: "Operational" }}>
          {({ values, set }) => (
            <>
              <F label="Asset ID"><Input required value={values.asset_id ?? ""} onChange={(e) => set("asset_id", e.target.value)} placeholder="MIG-205" /></F>
              <F label="Model"><Input required value={values.model ?? ""} onChange={(e) => set("model", e.target.value)} /></F>
              <F label="Calibration due"><Input type="date" value={values.calibration_due ?? ""} onChange={(e) => set("calibration_due", e.target.value)} /></F>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr><Th>Asset</Th><Th>Model</Th><Th>Calibration due</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={4}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && (data?.length ?? 0) === 0 && <Empty colSpan={4}>No equipment registered.</Empty>}
            {data?.map((e) => (
              <tr key={e.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{e.asset_id}</td>
                <td className="px-5 py-3">{e.model}</td>
                <td className="px-5 py-3 text-muted-foreground">{e.calibration_due}</td>
                <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
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
