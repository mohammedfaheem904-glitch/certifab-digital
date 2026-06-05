import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ModulePage } from "@/components/ModulePage";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ChevronRight, Eye, Trash2, LayoutDashboard, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PWPS_STATUS_TONE, type PwpsStatus } from "@/lib/pwps-workflow";
import { toast } from "sonner";
import { exportCsv, exportExcel } from "@/lib/export";

type Row = {
  id: string;
  pwps_no: string;
  title: string | null;
  revision: string;
  status: PwpsStatus;
  code_family: string;
  standard: string | null;
  process: string | null;
  position: string | null;
  base_material: string | null;
  created_at: string;
};

export const Route = createFileRoute("/app/pwps/")({
  component: PwpsIndexPage,
});

const STATUSES: PwpsStatus[] = ["Draft", "Under Qualification", "Testing", "Pending Validation", "Qualified", "Rejected", "Converted"];

function PwpsIndexPage() {
  const { profile, roles } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");
  const nav = useNavigate();
  const qc = useQueryClient();

  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fCode, setFCode] = useState("");
  const [fProcess, setFProcess] = useState("");
  const [fPosition, setFPosition] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery<Row[]>({
    queryKey: ["pwps", cid],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pwps" as any) as any)
        .select("*").eq("company_id", cid!).is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const allRows = data ?? [];
  const codes = useMemo(() => Array.from(new Set(allRows.map((r) => r.code_family).filter(Boolean))), [allRows]);
  const processes = useMemo(() => Array.from(new Set(allRows.map((r) => r.process).filter(Boolean) as string[])), [allRows]);
  const positions = useMemo(() => Array.from(new Set(allRows.map((r) => r.position).filter(Boolean) as string[])), [allRows]);

  const filtered = allRows.filter((p) => {
    if (fStatus && p.status !== fStatus) return false;
    if (fCode && p.code_family !== fCode) return false;
    if (fProcess && p.process !== fProcess) return false;
    if (fPosition && p.position !== fPosition) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.pwps_no, p.title, p.standard, p.process, p.status, p.code_family].filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });

  const hasFilters = !!(fStatus || fCode || fProcess || fPosition);
  const clearFilters = () => { setFStatus(""); setFCode(""); setFProcess(""); setFPosition(""); };

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(filtered.map((r) => r.id)) : new Set());
  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
  };

  const exportRows = (rows: Row[]) => rows.map((r) => ({
    "pWPS No": r.pwps_no, Title: r.title ?? "", Revision: r.revision, Status: r.status,
    Code: r.code_family, Standard: r.standard ?? "", Process: r.process ?? "",
    Position: r.position ?? "", "Base Material": r.base_material ?? "",
    Created: new Date(r.created_at).toISOString().slice(0, 10),
  }));

  const toExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;

  const moveToTrash = async (ids: string[]) => {
    if (!confirm(`Move ${ids.length} record${ids.length > 1 ? "s" : ""} to trash?`)) return;
    setBusy(true);
    const results = await Promise.all(ids.map((id) => (supabase.rpc as any)("soft_delete_pwps", { _id: id })));
    setBusy(false);
    const errs = results.filter((r: any) => r.error);
    if (errs.length) toast.error(`Failed for ${errs.length} record(s): ${errs[0].error.message}`);
    else toast.success(`Moved ${ids.length} to trash.`);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["pwps", cid] });
  };

  return (
    <ModulePage
      title="Welding Procedure Specification (WPS)"
      subtitle="Candidate welding procedures undergoing qualification. A pWPS becomes a production WPS only after a PQR passes."
      action={
        <div className="flex items-center gap-2">
          <Link to="/app/pwps/dashboard"><Button variant="outline" size="sm"><LayoutDashboard className="size-4 me-1" /> Dashboard</Button></Link>
          {isAdmin && <Link to="/app/pwps/trash"><Button variant="outline" size="sm"><Trash2 className="size-4 me-1" /> Trash</Button></Link>}
          <NewRecordDialog table="pwps" title="New Welding Procedure Specification" trigger="New WPS" defaults={{ revision: "Rev 0", status: "Draft", code_family: "ASME IX" }}>
            {({ values, set }) => (
              <div className="grid grid-cols-2 gap-3">
                <F label="WPS number"><Input required value={values.pwps_no ?? ""} onChange={(e) => set("pwps_no", e.target.value)} placeholder="WPS-GTAW-001" /></F>
                <F label="Title"><Input value={values.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="GTAW root + SMAW fill, P-1 to P-1" /></F>
                <F label="Code family"><Input value={values.code_family ?? "ASME IX"} onChange={(e) => set("code_family", e.target.value)} /></F>
                <F label="Standard"><Input value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX 2023" /></F>
                <F label="Process">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.process ?? ""} onChange={(e) => set("process", e.target.value)}>
                    <option value="">— Select process —</option>
                    <option value="SMAW">SMAW (Shielded Metal Arc Welding)</option>
                    <option value="GMAW">GMAW (Gas Metal Arc Welding)</option>
                    <option value="FCAW">FCAW (Flux-Cored Arc Welding)</option>
                    <option value="SAW">SAW (Submerged Arc Welding)</option>
                    <option value="GTAW">GTAW (Gas Tungsten Arc Welding)</option>
                    <option value="PAW">PAW (Plasma Arc Welding)</option>
                    <option value="ESW">ESW (Electroslag Welding)</option>
                    <option value="EGW">EGW (Electrogas Welding)</option>
                    <option value="OAW">OAW (Oxyacetylene Welding)</option>
                    <option value="LBW">LBW (Laser Beam Welding)</option>
                    <option value="EBW">EBW (Electron Beam Welding)</option>
                    <option value="RW">RW (Resistance Welding)</option>
                    <option value="BRAZING">Brazing</option>
                  </select>
                </F>
                <F label="Joint type">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.joint_type ?? ""} onChange={(e) => set("joint_type", e.target.value)}>
                    <option value="">— Select joint type —</option>
                    <option value="Butt Joint">Butt Joint</option>
                    <option value="Lap Joint">Lap Joint</option>
                    <option value="T-Joint">T-Joint</option>
                    <option value="Corner Joint">Corner Joint</option>
                    <option value="Edge Joint">Edge Joint</option>
                    <option value="Flare Bevel Joint">Flare Bevel Joint</option>
                    <option value="Flare V-Groove Joint">Flare V-Groove Joint</option>
                    <option value="Slot Joint">Slot Joint</option>
                    <option value="Plug Joint">Plug Joint</option>
                    <option value="Scarf Joint">Scarf Joint</option>
                    <option value="Seam Joint">Seam Joint</option>
                    <option value="Spot Joint">Spot Joint</option>
                    <option value="Other">Other</option>
                  </select>
                </F>
                <F label="Groove type">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.groove_type ?? ""} onChange={(e) => set("groove_type", e.target.value)}>
                    <option value="">— Select groove type —</option>
                    <option value="Square Groove">Square Groove</option>
                    <option value="V-Groove">V-Groove</option>
                    <option value="Bevel Groove">Bevel Groove</option>
                    <option value="U-Groove">U-Groove</option>
                    <option value="J-Groove">J-Groove</option>
                    <option value="Flare-V Groove">Flare-V Groove</option>
                    <option value="Flare-Bevel Groove">Flare-Bevel Groove</option>
                    <option value="Scarf Groove">Scarf Groove</option>
                    <option value="Other">Other</option>
                  </select>
                </F>
                <F label="Position">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.position ?? ""} onChange={(e) => set("position", e.target.value)}>
                    <option value="">— Select position —</option>
                    <option value="1G (Flat Groove)">1G (Flat Groove)</option>
                    <option value="2G (Horizontal Groove)">2G (Horizontal Groove)</option>
                    <option value="3G (Vertical Groove)">3G (Vertical Groove)</option>
                    <option value="4G (Overhead Groove)">4G (Overhead Groove)</option>
                    <option value="5G (Fixed Horizontal Pipe)">5G (Fixed Horizontal Pipe)</option>
                    <option value="6G (Fixed 45° Pipe)">6G (Fixed 45° Pipe)</option>
                    <option value="1F (Flat Fillet)">1F (Flat Fillet)</option>
                    <option value="2F (Horizontal Fillet)">2F (Horizontal Fillet)</option>
                    <option value="3F (Vertical Fillet)">3F (Vertical Fillet)</option>
                    <option value="4F (Overhead Fillet)">4F (Overhead Fillet)</option>
                    <option value="5F (Fixed Horizontal Pipe Fillet)">5F (Fixed Horizontal Pipe Fillet)</option>
                  </select>
                </F>
                <F label="Base material"><Input value={values.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} placeholder="SA-106 Gr B" /></F>
                <F label="P-Number"><Input value={values.p_number ?? ""} onChange={(e) => set("p_number", e.target.value)} placeholder="P-1" /></F>
                <F label="Group No."><Input value={values.group_number ?? ""} onChange={(e) => set("group_number", e.target.value)} placeholder="1" /></F>
                <F label="Filler classification"><Input value={values.filler_classification ?? ""} onChange={(e) => set("filler_classification", e.target.value)} placeholder="ER70S-2" /></F>
                <F label="Thickness min (mm)"><Input type="number" step="0.1" value={values.thickness_min_mm ?? ""} onChange={(e) => set("thickness_min_mm", parseFloat(e.target.value) || null)} /></F>
                <F label="Thickness max (mm)"><Input type="number" step="0.1" value={values.thickness_max_mm ?? ""} onChange={(e) => set("thickness_max_mm", parseFloat(e.target.value) || null)} /></F>
              </div>
            )}
          </NewRecordDialog>
        </div>
      }
    >
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search by number, title, process…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs bg-background/60" />
          <Sel value={fStatus} onChange={setFStatus} placeholder="All statuses" options={STATUSES} />
          <Sel value={fCode} onChange={setFCode} placeholder="All codes" options={codes} />
          <Sel value={fProcess} onChange={setFProcess} placeholder="All processes" options={processes} />
          <Sel value={fPosition} onChange={setFPosition} placeholder="All positions" options={positions} />
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="size-3.5 me-1" /> Clear</Button>}
          <div className="ms-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => exportCsv(`pwps-${selected.size > 0 ? "selected" : "filtered"}`, exportRows(toExport))} disabled={toExport.length === 0}>
              <Download className="size-3.5 me-1" /> CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportExcel(`pwps-${selected.size > 0 ? "selected" : "filtered"}`, "pWPS", exportRows(toExport))} disabled={toExport.length === 0}>
              <Download className="size-3.5 me-1" /> XLSX
            </Button>
          </div>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs">
            <span className="font-medium">{selected.size} selected</span>
            <div className="ms-auto flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={busy} onClick={() => moveToTrash(Array.from(selected))} className="text-destructive">
                <Trash2 className="size-3.5 me-1" /> Move to trash
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2.5 w-8"><Checkbox checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id))} onCheckedChange={(c) => toggleAll(!!c)} /></th>
              <Th>WPS No.</Th><Th>Title</Th><Th>Code</Th><Th>Process</Th><Th>Position</Th><Th>Revision</Th><Th>Status</Th>
              <th className="text-end font-medium px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={9}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && filtered.length === 0 && <Empty colSpan={9}>No Welding Procedure Specification match.</Empty>}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.has(p.id)} onCheckedChange={(c) => toggleOne(p.id, !!c)} />
                </td>
                <td className="px-5 py-3 font-medium cursor-pointer" onClick={() => nav({ to: "/app/pwps/$pwpsId", params: { pwpsId: p.id } })}>{p.pwps_no}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.title ?? "—"}</td>
                <td className="px-5 py-3">{p.code_family}</td>
                <td className="px-5 py-3">{p.process ?? "—"}</td>
                <td className="px-5 py-3">{p.position ?? "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.revision}</td>
                <td className="px-5 py-3">
                  <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", PWPS_STATUS_TONE[p.status] ?? "")}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => nav({ to: "/app/pwps/$pwpsId", params: { pwpsId: p.id } })} aria-label="Open WPS"><Eye className="size-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={busy} onClick={() => moveToTrash([p.id])} aria-label="Move to trash"><Trash2 className="size-4" /></Button>
                    <ChevronRight className="size-4 ms-1 text-muted-foreground" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Sel({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
