import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModulePage } from "@/components/ModulePage";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { daysUntil } from "@/lib/format";

const CATEGORIES = ["UT", "RT", "Welding Gauge", "Coating", "Pressure Gauge", "Temperature", "NDT", "Other"];

type Row = {
  id: string;
  asset_id: string;
  name: string;
  category: string;
  model: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  calibration_due: string | null;
  status: string;
  qr_token: string;
};

export const Route = createFileRoute("/app/instruments")({
  component: InstrumentsPage,
});

function InstrumentsPage() {
  const { data, isLoading } = useCompanyRows<Row>("instruments", { order: { column: "calibration_due", ascending: true } });
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const rows = (data ?? []).filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (search && !`${r.asset_id} ${r.name} ${r.serial_number ?? ""} ${r.manufacturer ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = rows.length;
  const overdue = rows.filter((r) => (daysUntil(r.calibration_due) ?? 999) < 0).length;
  const dueSoon = rows.filter((r) => { const d = daysUntil(r.calibration_due); return d != null && d >= 0 && d <= 30; }).length;
  const active = total - overdue - dueSoon;

  return (
    <ModulePage
      title="QA/QC Instruments"
      subtitle="UT, RT, gauges, coating & temperature instruments — with calibration tracking and QR verification."
      action={
        <NewRecordDialog table="instruments" title="Register instrument" trigger="Register Instrument" defaults={{ status: "Active", category: "Welding Gauge" }}>
          {({ values, set }) => (
            <>
              <F label="Asset ID"><Input required value={values.asset_id ?? ""} onChange={(e) => set("asset_id", e.target.value)} placeholder="UT-014" /></F>
              <F label="Name"><Input required value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Olympus EPOCH 650" /></F>
              <F label="Category">
                <Select value={values.category ?? "Welding Gauge"} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Model"><Input value={values.model ?? ""} onChange={(e) => set("model", e.target.value)} /></F>
              <F label="Serial number"><Input value={values.serial_number ?? ""} onChange={(e) => set("serial_number", e.target.value)} /></F>
              <F label="Manufacturer"><Input value={values.manufacturer ?? ""} onChange={(e) => set("manufacturer", e.target.value)} /></F>
              <F label="Calibration due"><Input type="date" value={values.calibration_due ?? ""} onChange={(e) => set("calibration_due", e.target.value)} /></F>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border">
        <Stat icon={CheckCircle2} label="Active" value={active} tone="success" />
        <Stat icon={Activity} label="Due in 30d" value={dueSoon} tone="warning" />
        <Stat icon={AlertTriangle} label="Overdue" value={overdue} tone="destructive" />
        <Stat icon={Activity} label="Total" value={total} tone="info" />
      </div>

      <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center">
        <Input placeholder="Search asset, model, serial…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm h-9" />
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr><Th>Asset</Th><Th>Name</Th><Th>Category</Th><Th>Serial</Th><Th>Calibration due</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No instruments registered.</td></tr>}
            {rows.map((r) => {
              const d = daysUntil(r.calibration_due);
              const calBadge =
                d == null ? <span className="text-xs text-muted-foreground">—</span> :
                d < 0 ? <Pill tone="destructive">Overdue {Math.abs(d)}d</Pill> :
                d <= 30 ? <Pill tone="warning">Due in {d}d</Pill> :
                <Pill tone="success">{d}d</Pill>;
              return (
                <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                  <td className="px-5 py-3 font-medium">
                    <Link to="/verify/instrument/$token" params={{ token: r.qr_token }} className="hover:text-primary">{r.asset_id}</Link>
                  </td>
                  <td className="px-5 py-3">{r.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.category}</td>
                  <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{r.serial_number ?? "—"}</td>
                  <td className="px-5 py-3">{r.calibration_due ?? "—"} {calBadge}</td>
                  <td className="px-5 py-3 text-xs">{r.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "success" | "warning" | "destructive" | "info" }) {
  const cls = { success: "text-success bg-success/10", warning: "text-warning bg-warning/10", destructive: "text-destructive bg-destructive/10", info: "text-info bg-info/10" }[tone];
  return (
    <div className="rounded-lg border border-border p-3 flex items-center gap-3">
      <div className={`size-9 rounded-md grid place-items-center ${cls}`}><Icon className="size-4" /></div>
      <div>
        <div className="text-xl font-semibold leading-tight">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
function Pill({ tone, children }: { tone: "success" | "warning" | "destructive"; children: React.ReactNode }) {
  const cls = { success: "bg-success/10 text-success", warning: "bg-warning/10 text-warning", destructive: "bg-destructive/10 text-destructive" }[tone];
  return <span className={`ms-2 text-[10px] px-1.5 py-0.5 rounded ${cls}`}>{children}</span>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
