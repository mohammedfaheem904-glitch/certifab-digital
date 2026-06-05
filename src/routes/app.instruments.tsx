import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Activity, AlertTriangle, CheckCircle2, Download, Eye, Trash2, Plus, Trash, RotateCcw,
} from "lucide-react";
import { daysUntil } from "@/lib/format";
import { exportExcel } from "@/lib/export";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const CATEGORIES = ["UT", "RT", "Welding Gauge", "Coating", "Pressure Gauge", "Temperature", "NDT", "Other"];
const STATUSES = ["Active", "Maintenance", "Retired"];
const DUE_FILTERS = [
  { v: "all", label: "All due states" },
  { v: "overdue", label: "Overdue" },
  { v: "30", label: "Due in 30 days" },
  { v: "90", label: "Due in 90 days" },
  { v: "ok", label: "OK (>90d)" },
  { v: "none", label: "No due date" },
];

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
  const qc = useQueryClient();
  const nav = useNavigate();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [due, setDue] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  const rows = useMemo(() => (data ?? []).filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (status !== "all" && r.status !== status) return false;
    const d = daysUntil(r.calibration_due);
    if (due === "overdue" && !(d != null && d < 0)) return false;
    if (due === "30" && !(d != null && d >= 0 && d <= 30)) return false;
    if (due === "90" && !(d != null && d >= 0 && d <= 90)) return false;
    if (due === "ok" && !(d != null && d > 90)) return false;
    if (due === "none" && d != null) return false;
    if (search && !`${r.asset_id} ${r.name} ${r.serial_number ?? ""} ${r.manufacturer ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [data, cat, status, due, search]);

  const total = rows.length;
  const overdue = rows.filter((r) => (daysUntil(r.calibration_due) ?? 999) < 0).length;
  const dueSoon = rows.filter((r) => { const d = daysUntil(r.calibration_due); return d != null && d >= 0 && d <= 30; }).length;
  const active = total - overdue - dueSoon;

  const allFilteredSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () => {
    if (allFilteredSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const exportRows = (list: Row[]) => {
    if (list.length === 0) return toast.message("Nothing to export.");
    exportExcel("instruments", "Instruments", list.map((r) => ({
      "Asset ID": r.asset_id, Name: r.name, Category: r.category, Model: r.model ?? "",
      Serial: r.serial_number ?? "", Manufacturer: r.manufacturer ?? "",
      "Calibration due": r.calibration_due ?? "", Status: r.status,
    })));
    toast.success(`Exported ${list.length} instrument(s).`);
  };

  const moveToTrash = async (ids: string[]) => {
    if (!confirm(`Move ${ids.length} instrument(s) to trash?`)) return;
    setBusy("bulk");
    let ok = 0, fail = 0;
    for (const id of ids) {
      const { error } = await (supabase.rpc as any)("soft_delete_instrument", { _id: id });
      if (error) fail++; else ok++;
    }
    setBusy(null);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["instruments"] });
    if (fail) toast.error(`${fail} failed, ${ok} moved to trash.`);
    else toast.success(`${ok} moved to trash.`);
  };

  return (
    <ModulePage
      title="QA/QC Instruments"
      subtitle="UT, RT, gauges, coating & temperature instruments — with calibration tracking and QR verification."
      action={
        <div className="flex items-center gap-2">
          <Link to="/app/instruments/trash">
            <Button variant="outline" size="sm"><Trash className="size-4 me-1" /> Trash</Button>
          </Link>
          <RegisterInstrumentDialog onDone={() => qc.invalidateQueries({ queryKey: ["instruments"] })} />
        </div>
      }
    >
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border">
        <Stat icon={CheckCircle2} label="Active" value={active} tone="success" />
        <Stat icon={Activity} label="Due in 30d" value={dueSoon} tone="warning" />
        <Stat icon={AlertTriangle} label="Overdue" value={overdue} tone="destructive" />
        <Stat icon={Activity} label="Total" value={total} tone="info" />
      </div>

      <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center">
        <Input placeholder="Search asset, model, serial…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs h-9" />
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={due} onValueChange={setDue}>
          <SelectTrigger className="w-48 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {DUE_FILTERS.map((d) => <SelectItem key={d.v} value={d.v}>{d.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {(cat !== "all" || status !== "all" || due !== "all" || search) && (
          <Button variant="ghost" size="sm" onClick={() => { setCat("all"); setStatus("all"); setDue("all"); setSearch(""); }}>
            Reset
          </Button>
        )}
        <div className="ms-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => exportRows(rows)} disabled={rows.length === 0}>
            <Download className="size-4 me-1" /> Export ({rows.length})
          </Button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2 text-sm">
          <span>{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => exportRows(rows.filter((r) => selected.has(r.id)))}>
            <Download className="size-4 me-1" /> Export selected
          </Button>
          <Button size="sm" variant="outline" className="text-destructive" disabled={busy === "bulk"} onClick={() => moveToTrash(Array.from(selected))}>
            <Trash2 className="size-4 me-1" /> Move to trash
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="w-10 ps-5 py-2.5"><Checkbox checked={allFilteredSelected} onCheckedChange={toggleAll} /></th>
              <Th>Asset</Th><Th>Name</Th><Th>Category</Th><Th>Serial</Th><Th>Calibration due</Th><Th>Status</Th>
              <th className="text-end font-medium pe-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No instruments match.</td></tr>}
            {rows.map((r) => {
              const d = daysUntil(r.calibration_due);
              const calBadge =
                d == null ? <span className="text-xs text-muted-foreground">—</span> :
                d < 0 ? <Pill tone="destructive">Overdue {Math.abs(d)}d</Pill> :
                d <= 30 ? <Pill tone="warning">Due in {d}d</Pill> :
                <Pill tone="success">{d}d</Pill>;
              return (
                <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                  <td className="ps-5 py-3"><Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleOne(r.id)} /></td>
                  <td className="px-5 py-3 font-medium">
                    <Link to="/app/instruments/$instrumentId" params={{ instrumentId: r.id }} className="hover:text-primary">{r.asset_id}</Link>
                  </td>
                  <td className="px-5 py-3">{r.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.category}</td>
                  <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{r.serial_number ?? "—"}</td>
                  <td className="px-5 py-3">{r.calibration_due ?? "—"} {calBadge}</td>
                  <td className="px-5 py-3 text-xs">{r.status}</td>
                  <td className="pe-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" title="View details" onClick={() => nav({ to: "/app/instruments/$instrumentId", params: { instrumentId: r.id } })}>
                        <Eye className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Move to trash" className="text-destructive hover:text-destructive" disabled={busy === r.id} onClick={() => moveToTrash([r.id])}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function RegisterInstrumentDialog({ onDone }: { onDone: () => void }) {
  const { profile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<Record<string, any>>({ status: "Active", category: "Welding Gauge", quantity: 1 });
  const [cert, setCert] = useState<File | null>(null);
  const set = (k: string, val: any) => setV((s) => ({ ...s, [k]: val }));

  const reset = () => { setV({ status: "Active", category: "Welding Gauge", quantity: 1 }); setCert(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.company_id) return toast.error("No workspace.");
    if (!v.asset_id || !v.name) return toast.error("Asset ID and Name are required.");
    const qty = Math.max(1, Math.min(100, Number(v.quantity) || 1));
    setBusy(true);

    const baseRow = {
      company_id: profile.company_id,
      name: v.name,
      category: v.category,
      model: v.model || null,
      serial_number: v.serial_number || null,
      manufacturer: v.manufacturer || null,
      calibration_due: v.calibration_due || null,
      status: v.status,
    };
    const inserts = Array.from({ length: qty }, (_, i) => ({
      ...baseRow,
      asset_id: qty === 1 ? v.asset_id : `${v.asset_id}-${i + 1}`,
    }));

    const { data, error } = await supabase.from("instruments").insert(inserts).select("id, asset_id");
    if (error) { setBusy(false); return toast.error(error.message); }

    if (cert && data) {
      for (const inst of data) {
        const path = `${profile.company_id}/${inst.id}/cert-initial-${Date.now()}-${cert.name}`;
        const { error: upErr } = await supabase.storage.from("instrument-files").upload(path, cert);
        if (upErr) { toast.error(`Cert upload failed for ${inst.asset_id}: ${upErr.message}`); continue; }
        await supabase.from("instrument_calibrations").insert({
          company_id: profile.company_id,
          instrument_id: inst.id,
          calibrated_on: new Date().toISOString().slice(0, 10),
          next_due: v.calibration_due || null,
          performed_by: v.cert_performed_by || null,
          notes: "Initial calibration certificate (registration).",
          certificate_path: path,
          created_by: user?.id ?? null,
        });
      }
    }

    setBusy(false);
    setOpen(false);
    reset();
    toast.success(`Registered ${qty} instrument(s).`);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
          <Plus className="size-4 me-1" /> Register Instrument
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader><DialogTitle>Register instrument</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pe-1">
            <div className="grid grid-cols-2 gap-3">
              <F label="Asset ID *"><Input required value={v.asset_id ?? ""} onChange={(e) => set("asset_id", e.target.value)} placeholder="UT-014" /></F>
              <F label="Quantity">
                <Input type="number" min={1} max={100} value={v.quantity ?? 1} onChange={(e) => set("quantity", e.target.value)} />
              </F>
            </div>
            {Number(v.quantity) > 1 && (
              <div className="text-[11px] text-muted-foreground -mt-1">
                Will create {v.quantity} rows with asset IDs <span className="font-mono">{v.asset_id || "ID"}-1 … {v.asset_id || "ID"}-{v.quantity}</span>.
              </div>
            )}
            <F label="Name *"><Input required value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Olympus EPOCH 650" /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Category">
                <Select value={v.category ?? "Welding Gauge"} onValueChange={(val) => set("category", val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Status">
                <Select value={v.status ?? "Active"} onValueChange={(val) => set("status", val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Model"><Input value={v.model ?? ""} onChange={(e) => set("model", e.target.value)} /></F>
              <F label="Manufacturer"><Input value={v.manufacturer ?? ""} onChange={(e) => set("manufacturer", e.target.value)} /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Serial number"><Input value={v.serial_number ?? ""} onChange={(e) => set("serial_number", e.target.value)} /></F>
              <F label="Calibration due"><Input type="date" value={v.calibration_due ?? ""} onChange={(e) => set("calibration_due", e.target.value)} /></F>
            </div>
            <div className="border-t border-border pt-3 space-y-3">
              <div className="text-xs font-medium">Calibration certificate (optional)</div>
              <F label="Certificate file (PDF/image)">
                <Input type="file" accept="application/pdf,image/*" onChange={(e) => setCert(e.target.files?.[0] ?? null)} />
              </F>
              {cert && (
                <F label="Performed by">
                  <Input value={v.cert_performed_by ?? ""} onChange={(e) => set("cert_performed_by", e.target.value)} placeholder="Lab / technician" />
                </F>
              )}
              <div className="text-[11px] text-muted-foreground">
                When provided, an initial calibration record is created for each instrument with this certificate attached.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Register"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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

// Suppress unused-import lint for icons reserved for future actions
void RotateCcw;
