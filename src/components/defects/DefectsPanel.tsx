import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { useNavigate } from "@tanstack/react-router";

const SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;
const DISPOSITIONS = ["Accept", "Repair", "Reject", "Use As-Is", "Pending Engineering"];

export function DefectsPanel({
  companyId, inspectionId, weldId,
}: { companyId: string | null; inspectionId: string; weldId?: string | null }) {
  const qc = useQueryClient();
  const nav = useNavigate();
  const confirm = useConfirm();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const catalog = useQuery<any[]>({
    queryKey: ["defect_catalog"],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await (supabase.from("defect_catalog" as any) as any)
        .select("*").eq("is_active", true).order("code");
      return (data ?? []) as any[];
    },
  });

  const defects = useQuery<any[]>({
    queryKey: ["inspection_defects", inspectionId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await (supabase.from("inspection_defects" as any) as any)
        .select("*").eq("inspection_id", inspectionId).order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["inspection_defects", inspectionId] });

  const remove = async (id: string) => {
    if (!(await confirm({ title: "Delete defect?", description: "This will be removed permanently.", destructive: true }))) return;
    const { error } = await (supabase.from("inspection_defects" as any) as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const toggle = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const openNcr = async () => {
    if (selected.size === 0) return toast.error("Select at least one defect.");
    const list = (defects.data ?? []).filter((d: any) => selected.has(d.id));
    const worst = list.reduce((acc: string, d: any) => {
      const order = ["Low", "Medium", "High", "Critical"];
      return order.indexOf(d.severity) > order.indexOf(acc) ? d.severity : acc;
    }, "Medium");
    const title = `${list.length} defect(s) on inspection — ${list.map((d: any) => d.defect_type).slice(0, 3).join(", ")}`;
    const { data, error } = await (supabase.rpc as any)("open_ncr_from_defect", {
      _inspection_id: inspectionId, _defect_ids: Array.from(selected), _title: title, _severity: worst,
    });
    if (error) return toast.error(error.message);
    toast.success("NCR raised from defects.");
    qc.invalidateQueries({ queryKey: ["inspection", inspectionId] });
    qc.invalidateQueries({ queryKey: ["ncrs"] });
    nav({ to: "/app/ncrs/$ncrId", params: { ncrId: data as string } });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-medium">Structured defects</h3>
          <div className="text-xs text-muted-foreground">Catalog-backed defect records with severity, code references and repair guidance.</div>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Button size="sm" variant="outline" onClick={openNcr}>
              <ShieldAlert className="size-4 me-1.5" />Raise NCR ({selected.size})
            </Button>
          )}
          <AddDefectDialog
            companyId={companyId} inspectionId={inspectionId} weldId={weldId ?? null}
            catalog={catalog.data ?? []} onDone={refresh}
          />
        </div>
      </div>

      {(defects.data?.length ?? 0) === 0 && (
        <div className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded">
          No defects logged yet.
        </div>
      )}

      <ul className="divide-y divide-border/60">
        {(defects.data ?? []).map((d: any) => (
          <li key={d.id} className="py-3 flex items-start gap-3">
            <input type="checkbox" className="mt-1 size-4" checked={selected.has(d.id)} onChange={() => toggle(d.id)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{d.defect_type}</span>
                <Badge variant="outline">{d.category}</Badge>
                <SeverityBadge severity={d.severity} />
                {d.disposition && <Badge variant="outline" className="text-muted-foreground">{d.disposition}</Badge>}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {d.location && <>📍 {d.location} · </>}
                {d.code_reference && <>📘 {d.code_reference} · </>}
                {d.measurement && <>📏 {d.measurement}</>}
              </div>
              {d.repair_recommendation && <div className="text-xs mt-1">🔧 {d.repair_recommendation}</div>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(d.id)}>
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const cls = {
    Low: "bg-muted text-muted-foreground border-border",
    Medium: "bg-warning/15 text-warning border-warning/30",
    High: "bg-info/15 text-info border-info/30",
    Critical: "bg-destructive/15 text-destructive border-destructive/30",
  }[severity] ?? "bg-muted text-muted-foreground border-border";
  return <Badge variant="outline" className={cls}>{severity}</Badge>;
}

function AddDefectDialog({
  companyId, inspectionId, weldId, catalog, onDone,
}: { companyId: string | null; inspectionId: string; weldId: string | null; catalog: any[]; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<any>({ category: "Discontinuity", severity: "Medium" });
  const set = (k: string, val: any) => setV((s: any) => ({ ...s, [k]: val }));

  const pickCatalog = (id: string) => {
    const c = catalog.find((x) => x.id === id);
    if (!c) return;
    setV((s: any) => ({
      ...s, catalog_id: id, defect_type: c.name, category: c.category,
      severity: c.default_severity, code_reference: c.code_references,
      repair_recommendation: c.repair_guidance,
    }));
  };

  const submit = async () => {
    if (!companyId || !v.defect_type) { toast.error("Defect type is required."); return; }
    setBusy(true);
    const { error } = await (supabase.from("inspection_defects" as any) as any).insert({
      company_id: companyId, inspection_id: inspectionId, weld_id: weldId,
      catalog_id: v.catalog_id ?? null, category: v.category, defect_type: v.defect_type,
      severity: v.severity, location: v.location || null, code_reference: v.code_reference || null,
      measurement: v.measurement || null, repair_recommendation: v.repair_recommendation || null,
      disposition: v.disposition || null, photo_url: v.photo_url || null, notes: v.notes || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Defect logged.");
    setV({ category: "Discontinuity", severity: "Medium" });
    setOpen(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4 me-1" />Add defect</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Log defect</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <F label="From catalog">
            <Select value={v.catalog_id ?? ""} onValueChange={pickCatalog}>
              <SelectTrigger><SelectValue placeholder="Pick a standard defect…" /></SelectTrigger>
              <SelectContent>
                {catalog.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.code} — {c.name} ({c.default_severity})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Defect type"><Input value={v.defect_type ?? ""} onChange={(e) => set("defect_type", e.target.value)} /></F>
            <F label="Category">
              <Select value={v.category} onValueChange={(x) => set("category", x)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Discontinuity", "Geometric", "Metallurgical", "Surface", "Dimensional", "Other"].map((c) =>
                    <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </F>
            <F label="Severity">
              <Select value={v.severity} onValueChange={(x) => set("severity", x)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Disposition">
              <Select value={v.disposition ?? ""} onValueChange={(x) => set("disposition", x)}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>{DISPOSITIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Location"><Input value={v.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Root, 6 o'clock" /></F>
            <F label="Measurement"><Input value={v.measurement ?? ""} onChange={(e) => set("measurement", e.target.value)} placeholder="2.5 mm × 8 mm" /></F>
          </div>
          <F label="Code reference"><Input value={v.code_reference ?? ""} onChange={(e) => set("code_reference", e.target.value)} placeholder="AWS D1.1 6.9" /></F>
          <F label="Repair recommendation"><Textarea rows={2} value={v.repair_recommendation ?? ""} onChange={(e) => set("repair_recommendation", e.target.value)} /></F>
          <F label="Photo URL"><Input value={v.photo_url ?? ""} onChange={(e) => set("photo_url", e.target.value)} placeholder="https://…" /></F>
          <F label="Notes"><Textarea rows={2} value={v.notes ?? ""} onChange={(e) => set("notes", e.target.value)} /></F>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Log defect"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
