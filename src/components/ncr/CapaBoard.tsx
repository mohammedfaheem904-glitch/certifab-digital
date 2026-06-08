import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function agingTone(c: any): { dot: string; label: string } {
  if (c.status === "Completed" || c.status === "Verified") return { dot: "bg-success", label: "Done" };
  if (!c.target_date) return { dot: "bg-muted-foreground/40", label: "No due date" };
  const days = Math.ceil((new Date(c.target_date).getTime() - Date.now()) / 86_400_000);
  if (days < -30) return { dot: "bg-destructive", label: `${Math.abs(days)}d overdue` };
  if (days < 0) return { dot: "bg-warning", label: `${Math.abs(days)}d overdue` };
  if (days <= 7) return { dot: "bg-warning", label: `Due in ${days}d` };
  return { dot: "bg-success", label: `Due in ${days}d` };
}

export function CapaBoard({ ncrId, companyId, capas: capasProp }: { ncrId: string; companyId: string | null; capas?: any[] }) {
  const qc = useQueryClient();
  const { data: capas = capasProp ?? [] } = useQuery<any[]>({
    queryKey: ["capa", ncrId],
    enabled: !!companyId && !capasProp,
    initialData: capasProp,
    queryFn: async () => {
      const { data } = await (supabase.from("capa_actions" as any) as any)
        .select("*").eq("ncr_id", ncrId).order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const now = new Date();
  const open = capas.filter((c) => ["Proposed", "Approved", "In Progress"].includes(c.status) && (!c.target_date || new Date(c.target_date) >= now));
  const overdue = capas.filter((c) => ["Proposed", "Approved", "In Progress"].includes(c.status) && c.target_date && new Date(c.target_date) < now);
  const completed = capas.filter((c) => ["Completed", "Verified", "Cancelled"].includes(c.status));

  const setStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "Completed") patch.completed_at = new Date().toISOString();
    if (status === "Verified") patch.effectiveness_verified_at = new Date().toISOString();
    const { error } = await (supabase.from("capa_actions" as any) as any).update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["capa", ncrId] });
  };

  const setEvidence = async (id: string, completion_evidence: string) => {
    const { error } = await (supabase.from("capa_actions" as any) as any).update({ completion_evidence }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["capa", ncrId] });
  };

  const setEffectiveness = async (id: string, effectiveness_notes: string) => {
    const { error } = await (supabase.from("capa_actions" as any) as any).update({ effectiveness_notes }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["capa", ncrId] });
  };

  return (
    <div className="space-y-4">
      <NewCapaForm ncrId={ncrId} companyId={companyId} onDone={() => qc.invalidateQueries({ queryKey: ["capa", ncrId] })} />
      <div className="grid md:grid-cols-3 gap-3">
        <Column title="Open" tone="info" count={open.length}>
          {open.map((c) => <CapaCard key={c.id} c={c} onStatus={setStatus} onEvidence={setEvidence} onEffectiveness={setEffectiveness} />)}
          {open.length === 0 && <Empty>No open actions.</Empty>}
        </Column>
        <Column title="Overdue" tone="destructive" count={overdue.length}>
          {overdue.map((c) => <CapaCard key={c.id} c={c} onStatus={setStatus} onEvidence={setEvidence} onEffectiveness={setEffectiveness} />)}
          {overdue.length === 0 && <Empty>None overdue.</Empty>}
        </Column>
        <Column title="Completed" tone="success" count={completed.length}>
          {completed.map((c) => <CapaCard key={c.id} c={c} onStatus={setStatus} onEvidence={setEvidence} onEffectiveness={setEffectiveness} />)}
          {completed.length === 0 && <Empty>Nothing completed yet.</Empty>}
        </Column>
      </div>
    </div>
  );
}

function Column({ title, count, tone, children }: { title: string; count: number; tone: "info" | "destructive" | "success"; children: React.ReactNode }) {
  const cls = { info: "bg-primary/10 text-primary", destructive: "bg-destructive/10 text-destructive", success: "bg-success/10 text-success" }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{title}</h4>
        <Badge variant="outline" className={cls}>{count}</Badge>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded">{children}</div>;
}

function CapaCard({ c, onStatus, onEvidence, onEffectiveness }: { c: any; onStatus: (id: string, s: string) => void; onEvidence: (id: string, v: string) => void; onEffectiveness: (id: string, v: string) => void }) {
  const aging = agingTone(c);
  const [evidence, setEvi] = useState(c.completion_evidence ?? "");
  const [eff, setEff] = useState(c.effectiveness_notes ?? "");
  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("size-2 rounded-full", aging.dot)} title={aging.label} />
          <Badge variant="outline">{c.action_type}</Badge>
        </div>
        <Select value={c.status} onValueChange={(v) => onStatus(c.id, v)}>
          <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{["Proposed", "Approved", "In Progress", "Completed", "Verified", "Cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="text-sm">{c.description}</div>
      <div className="text-[11px] text-muted-foreground flex flex-wrap gap-x-3">
        {c.owner_name && <span>Owner: {c.owner_name}</span>}
        {c.target_date && <span>Due: {c.target_date}</span>}
        <span>{aging.label}</span>
      </div>
      {(c.status === "Completed" || c.status === "Verified") && (
        <>
          <Input
            placeholder="Completion evidence (link / reference)"
            value={evidence}
            onChange={(e) => setEvi(e.target.value)}
            onBlur={() => evidence !== (c.completion_evidence ?? "") && onEvidence(c.id, evidence)}
            className="h-8 text-xs"
          />
          <Textarea
            placeholder="Effectiveness review notes…"
            rows={2}
            value={eff}
            onChange={(e) => setEff(e.target.value)}
            onBlur={() => eff !== (c.effectiveness_notes ?? "") && onEffectiveness(c.id, eff)}
            className="text-xs"
          />
        </>
      )}
    </div>
  );
}

function NewCapaForm({ ncrId, companyId, onDone }: { ncrId: string; companyId: string | null; onDone: () => void }) {
  const [type, setType] = useState("Corrective");
  const [desc, setDesc] = useState("");
  const [owner, setOwner] = useState("");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!companyId || !desc) return toast.error("Description required.");
    setBusy(true);
    const { error } = await (supabase.from("capa_actions" as any) as any).insert({
      company_id: companyId, ncr_id: ncrId,
      action_type: type, description: desc,
      owner_name: owner || null, target_date: due || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDesc(""); setOwner(""); setDue("");
    onDone();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <h4 className="text-sm font-medium">Add CAPA action</h4>
      <div className="grid md:grid-cols-4 gap-2">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{["Corrective", "Preventive", "Containment"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        <Button size="sm" onClick={add} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="size-4 me-1" />Add</>}</Button>
      </div>
      <Textarea rows={2} placeholder="Action description…" value={desc} onChange={(e) => setDesc(e.target.value)} />
    </div>
  );
}
