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
  weld_no: string;
  welder_name: string | null;
  heat_input: string | null;
  status: string;
  weld_date: string;
};

export const Route = createFileRoute("/app/welds")({
  component: WeldsPage,
});

function WeldsPage() {
  const { data, isLoading } = useCompanyRows<Row>("welds", { order: { column: "weld_date" } });
  return (
    <ModulePage
      title="Weld Traceability Log"
      subtitle="Every weld linked to its WPS, welder, project and inspection result."
      action={
        <NewRecordDialog table="welds" title="Log a weld" trigger="Log Weld" defaults={{ status: "Pending" }}>
          {({ values, set }) => (
            <>
              <F label="Weld No."><Input required value={values.weld_no ?? ""} onChange={(e) => set("weld_no", e.target.value)} placeholder="WL-2410-0500" /></F>
              <F label="Welder"><Input value={values.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} /></F>
              <F label="Heat input"><Input value={values.heat_input ?? ""} onChange={(e) => set("heat_input", e.target.value)} placeholder="1.42 kJ/mm" /></F>
              <F label="Date"><Input type="date" value={values.weld_date ?? ""} onChange={(e) => set("weld_date", e.target.value)} /></F>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr><Th>Weld No.</Th><Th>Welder</Th><Th>Heat input</Th><Th>Date</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={5}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && (data?.length ?? 0) === 0 && <Empty colSpan={5}>No welds logged yet.</Empty>}
            {data?.map((w) => (
              <tr key={w.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{w.weld_no}</td>
                <td className="px-5 py-3">{w.welder_name}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.heat_input}</td>
                <td className="px-5 py-3">{w.weld_date}</td>
                <td className="px-5 py-3"><StatusBadge status={w.status} /></td>
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
