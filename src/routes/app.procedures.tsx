import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronRight } from "lucide-react";
import { useState } from "react";

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
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const filtered = (data ?? []).filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.code, p.standard, p.process, p.revision, p.status]
      .filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });

  return (
    <ModulePage
      title="Welding Procedures (WPS / pWPS / PQR)"
      subtitle="Create, revise and approve welding procedure specifications across ASME, EN ISO, AWS, AS/NZS and JIS."
      action={
        <NewRecordDialog
          table="procedures"
          quota="procedures"
          title="New welding procedure"
          trigger="New WPS"
          defaults={{ revision: "Rev 0", status: "Draft" }}
        >
          {({ values, set }) => (
            <div className="grid grid-cols-2 gap-3">
              <F label="Code"><Input required value={values.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="WPS-GTAW-042" /></F>
              <F label="Standard"><Input required value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX" /></F>
              <F label="Process"><Input required value={values.process ?? ""} onChange={(e) => set("process", e.target.value)} placeholder="GTAW" /></F>
              <F label="Revision"><Input value={values.revision ?? ""} onChange={(e) => set("revision", e.target.value)} /></F>
              <F label="Thickness range"><Input value={values.thickness_range ?? ""} onChange={(e) => set("thickness_range", e.target.value)} placeholder="3–25 mm" /></F>
              <F label="Joint type"><Input value={values.joint_type ?? ""} onChange={(e) => set("joint_type", e.target.value)} placeholder="Butt" /></F>
              <F label="Position"><Input value={values.position ?? ""} onChange={(e) => set("position", e.target.value)} placeholder="6G" /></F>
              <F label="Base material"><Input value={values.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} placeholder="P-No 1 Gr 1" /></F>
              <F label="Filler material"><Input value={values.filler_material ?? ""} onChange={(e) => set("filler_material", e.target.value)} placeholder="ER70S-2" /></F>
              <F label="Shielding gas"><Input value={values.shielding_gas ?? ""} onChange={(e) => set("shielding_gas", e.target.value)} placeholder="Ar 100%" /></F>
              <F label="Voltage min"><Input type="number" value={values.voltage_min ?? ""} onChange={(e) => set("voltage_min", parseFloat(e.target.value) || null)} /></F>
              <F label="Voltage max"><Input type="number" value={values.voltage_max ?? ""} onChange={(e) => set("voltage_max", parseFloat(e.target.value) || null)} /></F>
              <F label="Current min"><Input type="number" value={values.current_min ?? ""} onChange={(e) => set("current_min", parseFloat(e.target.value) || null)} /></F>
              <F label="Current max"><Input type="number" value={values.current_max ?? ""} onChange={(e) => set("current_max", parseFloat(e.target.value) || null)} /></F>
              <F label="Heat input min (kJ/mm)"><Input type="number" step="0.01" value={values.heat_input_min ?? ""} onChange={(e) => set("heat_input_min", parseFloat(e.target.value) || null)} /></F>
              <F label="Heat input max (kJ/mm)"><Input type="number" step="0.01" value={values.heat_input_max ?? ""} onChange={(e) => set("heat_input_max", parseFloat(e.target.value) || null)} /></F>
            </div>
          )}
        </NewRecordDialog>
      }
    >
      <div className="p-3 border-b border-border">
        <Input placeholder="Search by code, standard, process, status…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm bg-background/60" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>Code</Th><Th>Standard</Th><Th>Process</Th><Th>Thickness</Th><Th>Revision</Th><Th>Status</Th><Th>{" "}</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={7}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && filtered.length === 0 && <Empty colSpan={7}>No procedures yet — try “Seed demo data” in the header.</Empty>}
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => nav({ to: "/app/procedures/$procedureId", params: { procedureId: p.id } })}
                className="border-t border-border/60 hover:bg-muted/20 cursor-pointer"
              >
                <td className="px-5 py-3 font-medium">{p.code}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.standard}</td>
                <td className="px-5 py-3">{p.process}</td>
                <td className="px-5 py-3">{p.thickness_range}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.revision}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3 text-end text-muted-foreground"><ChevronRight className="size-4 inline" /></td>
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
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>
  );
}
