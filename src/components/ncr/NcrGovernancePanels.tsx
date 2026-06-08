import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Wrench, FlaskConical } from "lucide-react";
import { toast } from "sonner";

const NCR_STATUSES = [
  "Draft", "Open", "Under Investigation", "Root Cause",
  "Corrective Action Proposed", "Awaiting Approval", "CA Pending",
  "Rework Required", "Repaired", "Re-Inspection Required", "In Review",
  "Accepted As-Is", "Closed", "Rejected",
] as const;

export function NcrTransitionBar({ ncr, onChanged }: { ncr: any; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [to, setTo] = useState<string>("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const submit = async () => {
    if (!to) return toast.error("Select a target status.");
    setBusy(true);
    const { error } = await (supabase.rpc as any)("transition_ncr", {
      _id: ncr.id, _to: to, _reason: reason || null, _comment: comment || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Transitioned to ${to}.`);
    setTo(""); setReason(""); setComment("");
    onChanged();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Governed transition</h3>
        <Badge variant="outline">Current: {ncr.status}</Badge>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Move to</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger><SelectValue placeholder="Select status…" /></SelectTrigger>
            <SelectContent>
              {NCR_STATUSES.filter((s) => s !== ncr.status).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs">Reason (required for Reject / Accept As-Is)</Label>
          <Input value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Comment</Label>
        <Textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={submit} disabled={busy || !to}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : "Transition"}
        </Button>
      </div>
      <div className="text-[11px] text-muted-foreground">
        Server-side enforced: Approver role required for Awaiting Approval, Closed, Accepted As-Is, Rejected.
      </div>
    </div>
  );
}

export function RcaPanel({ ncrId, companyId, onChanged }: { ncrId: string; companyId: string | null; onChanged: () => void }) {
  const { data } = useQuery<any[]>({
    queryKey: ["rca", ncrId], enabled: !!companyId,
    queryFn: async () => {
      const { data } = await (supabase.from("rca_analyses" as any) as any)
        .select("*").eq("ncr_id", ncrId).order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const [method, setMethod] = useState("5 Why");
  const [primary, setPrimary] = useState("");
  const [detail, setDetail] = useState("");
  const [evidence, setEvidence] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!companyId || !primary) return toast.error("Primary cause required.");
    setBusy(true);
    const { error } = await (supabase.from("rca_analyses" as any) as any).insert({
      company_id: companyId, ncr_id: ncrId, method,
      primary_cause: primary, primary_cause_detail: detail || null, evidence: evidence || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("RCA recorded.");
    setPrimary(""); setDetail(""); setEvidence("");
    onChanged();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2"><FlaskConical className="size-4 text-primary" /><h3 className="text-sm font-medium">Root cause analysis</h3></div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["5 Why", "Fishbone", "Custom"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Primary cause category</Label>
          <Select value={primary} onValueChange={setPrimary}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              {["Human Error", "Procedure Issue", "Material Issue", "Equipment Issue", "Environmental Issue", "Training Deficiency", "Other"].map((c) =>
                <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Primary cause detail</Label>
        <Textarea rows={2} value={detail} onChange={(e) => setDetail(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Evidence</Label>
        <Textarea rows={2} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={add} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="size-4 me-1" />Add RCA</>}</Button>
      </div>

      <ul className="divide-y divide-border/60">
        {(data ?? []).map((r: any) => (
          <li key={r.id} className="py-3">
            <div className="flex items-center gap-2"><Badge variant="outline">{r.method}</Badge><span className="text-sm font-medium">{r.primary_cause ?? "—"}</span></div>
            {r.primary_cause_detail && <div className="text-xs mt-1">{r.primary_cause_detail}</div>}
            {r.evidence && <div className="text-xs text-muted-foreground mt-1">Evidence: {r.evidence}</div>}
            <div className="text-[11px] text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CapaPanel({ ncrId, companyId, onChanged }: { ncrId: string; companyId: string | null; onChanged: () => void }) {
  const qc = useQueryClient();
  const { data } = useQuery<any[]>({
    queryKey: ["capa", ncrId], enabled: !!companyId,
    queryFn: async () => {
      const { data } = await (supabase.from("capa_actions" as any) as any)
        .select("*").eq("ncr_id", ncrId).order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

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
    qc.invalidateQueries({ queryKey: ["capa", ncrId] });
    onChanged();
  };

  const setStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "Completed") patch.completed_at = new Date().toISOString();
    if (status === "Verified") patch.effectiveness_verified_at = new Date().toISOString();
    const { error } = await (supabase.from("capa_actions" as any) as any).update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["capa", ncrId] });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h3 className="text-sm font-medium">Corrective &amp; Preventive Actions</h3>

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

      <ul className="divide-y divide-border/60">
        {(data ?? []).map((a: any) => (
          <li key={a.id} className="py-3 flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{a.action_type}</Badge>
                <span className="text-sm font-medium">{a.description}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {a.owner_name && <>Owner: {a.owner_name} · </>}
                {a.target_date && <>Due: {a.target_date}</>}
              </div>
            </div>
            <Select value={a.status} onValueChange={(v) => setStatus(a.id, v)}>
              <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Proposed", "Approved", "In Progress", "Completed", "Verified", "Cancelled"].map((s) =>
                  <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </li>
        ))}
        {(data?.length ?? 0) === 0 && <div className="text-sm text-muted-foreground py-3">No CAPA actions yet.</div>}
      </ul>
    </div>
  );
}

export function ReworkPanel({ ncr, onChanged }: { ncr: any; onChanged: () => void }) {
  const qc = useQueryClient();
  const { data } = useQuery<any[]>({
    queryKey: ["rework", ncr.id], enabled: !!ncr.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("rework_jobs" as any) as any)
        .select("*").eq("ncr_id", ncr.id).order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const procs = useQuery<any[]>({
    queryKey: ["procedures_for_rework"],
    enabled: !!ncr.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("procedures" as any) as any)
        .select("id,wps_no,code,process").is("deleted_at", null).order("wps_no").limit(200);
      return (data ?? []) as any[];
    },
  });

  const [wpsId, setWpsId] = useState("");
  const [welder, setWelder] = useState("");
  const [method, setMethod] = useState("");
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (!method) return toast.error("Repair method required.");
    setBusy(true);
    const { error } = await (supabase.rpc as any)("start_rework", {
      _ncr_id: ncr.id, _wps_id: wpsId || null, _welder_name: welder || null, _method: method,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Rework started.");
    setWpsId(""); setWelder(""); setMethod("");
    qc.invalidateQueries({ queryKey: ["rework", ncr.id] });
    onChanged();
  };

  const complete = async (id: string) => {
    const { data: insId, error } = await (supabase.rpc as any)("complete_rework_and_reinspect", { _rework_id: id, _notes: null });
    if (error) return toast.error(error.message);
    toast.success(`Re-inspection ${String(insId).slice(0, 8)} created.`);
    qc.invalidateQueries({ queryKey: ["rework", ncr.id] });
    onChanged();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2"><Wrench className="size-4 text-primary" /><h3 className="text-sm font-medium">Rework &amp; re-inspection</h3></div>

      <div className="grid md:grid-cols-3 gap-2">
        <Select value={wpsId} onValueChange={setWpsId}>
          <SelectTrigger><SelectValue placeholder="Rework WPS" /></SelectTrigger>
          <SelectContent>
            {(procs.data ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.wps_no ?? p.code} — {p.process}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Welder" value={welder} onChange={(e) => setWelder(e.target.value)} />
        <Input placeholder="Repair method" value={method} onChange={(e) => setMethod(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={start} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Start rework"}</Button>
      </div>

      <ul className="divide-y divide-border/60">
        {(data ?? []).map((r: any) => (
          <li key={r.id} className="py-3 flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{r.status}</Badge>
                <span className="text-sm font-medium">{r.repair_method ?? "—"}</span>
                {r.welder_name && <span className="text-xs text-muted-foreground">Welder: {r.welder_name}</span>}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Started {r.started_at ? new Date(r.started_at).toLocaleString() : "—"}
                {r.completed_at && <> · Completed {new Date(r.completed_at).toLocaleString()}</>}
                {r.reinspection_id && <> · Re-inspection {String(r.reinspection_id).slice(0, 8)}</>}
              </div>
            </div>
            {r.status === "In Progress" && (
              <Button size="sm" variant="outline" onClick={() => complete(r.id)}>Complete &amp; re-inspect</Button>
            )}
          </li>
        ))}
        {(data?.length ?? 0) === 0 && <div className="text-sm text-muted-foreground py-3">No rework jobs yet.</div>}
      </ul>
    </div>
  );
}
