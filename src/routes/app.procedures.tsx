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
  code: string;
  standard: string;
  process: string;
  thickness_range: string | null;
  revision: string;
  status: string;
};

export const Route = createFileRoute("/app/procedures")({
  component: ProceduresPage,
});

function ProceduresPage() {
  const { data, isLoading } = useCompanyRows<Row>("procedures", { order: { column: "created_at" } });

  return (
    <ModulePage
      title="Welding Procedures (WPS / pWPS / PQR)"
      subtitle="Create, revise and approve welding procedure specifications across ASME, EN ISO, AWS, AS/NZS and JIS."
      action={
        <NewRecordDialog table="procedures" title="New welding procedure" trigger="New WPS" defaults={{ revision: "Rev 0", status: "Draft" }}>
          {({ values, set }) => (
            <>
              <Field label="Code"><Input required value={values.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="WPS-GTAW-042" /></Field>
              <Field label="Standard"><Input required value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX" /></Field>
              <Field label="Process"><Input required value={values.process ?? ""} onChange={(e) => set("process", e.target.value)} placeholder="GTAW" /></Field>
              <Field label="Thickness range"><Input value={values.thickness_range ?? ""} onChange={(e) => set("thickness_range", e.target.value)} placeholder="3–25 mm" /></Field>
              <Field label="Revision"><Input value={values.revision ?? ""} onChange={(e) => set("revision", e.target.value)} /></Field>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>Code</Th><Th>Standard</Th><Th>Process</Th><Th>Thickness</Th><Th>Revision</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={6}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && (data?.length ?? 0) === 0 && <Empty colSpan={6}>No procedures yet — try “Seed demo data” in the header.</Empty>}
            {data?.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{p.code}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.standard}</td>
                <td className="px-5 py-3">{p.process}</td>
                <td className="px-5 py-3">{p.thickness_range}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.revision}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>
  );
}
