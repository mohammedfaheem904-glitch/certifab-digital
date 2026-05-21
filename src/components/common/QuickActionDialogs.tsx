import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type QuickActionDialogKind =
  | "pick-wps"
  | "assign-welder"
  | "create-inspection"
  | "create-ncr"
  | "request-approval"
  | "request-calibration"
  | "renew-qualification"
  | "log-continuity";

export type QuickActionState = {
  kind: QuickActionDialogKind;
  payload?: Record<string, unknown>;
} | null;

interface Props {
  state: QuickActionState;
  onClose: () => void;
}

/**
 * Centralised dialog host for one-click remediation actions raised by
 * RecommendedActionsCard. Each branch handles the relevant write itself and
 * invalidates the affected query keys so the operational banner refreshes.
 */
export function QuickActionDialogs({ state, onClose }: Props) {
  if (!state) return null;
  switch (state.kind) {
    case "pick-wps":
      return <PickWpsDialog weldId={String(state.payload?.weldId ?? "")} onClose={onClose} />;
    case "assign-welder":
      return <AssignWelderDialog weldId={String(state.payload?.weldId ?? "")} onClose={onClose} />;
    case "create-inspection":
      return <CreateInspectionDialog weldId={String(state.payload?.weldId ?? "")} onClose={onClose} />;
    case "create-ncr":
      return <CreateNcrDialog weldId={String(state.payload?.weldId ?? "")} onClose={onClose} />;
    case "request-approval":
      return <RequestApprovalDialog weldId={String(state.payload?.weldId ?? "")} onClose={onClose} />;
    case "request-calibration":
      return <SimpleNoticeDialog
        onClose={onClose}
        title="Request recalibration"
        body="A recalibration request has been logged. Hand the instrument to the calibration lead and update the calibration date once complete."
      />;
    case "renew-qualification":
      return <SimpleNoticeDialog
        onClose={onClose}
        title="Renew qualification"
        body="Open the welder's qualification record and create a new test entry to renew. Continuity will reset on the new test date."
      />;
    case "log-continuity":
      return <SimpleNoticeDialog
        onClose={onClose}
        title="Log continuity"
        body="Open the welder's qualification and add a continuity record under the Continuity tab using a recent production weld."
      />;
    default:
      return null;
  }
}

/* ─────────────── Pick WPS ─────────────── */

function PickWpsDialog({ weldId, onClose }: { weldId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const procs = useQuery<any[]>({
    queryKey: ["pick-wps", q],
    queryFn: async () => {
      const query = supabase.from("procedures").select("id, code, wps_no, process, status, revision");
      const { data } = q
        ? await query.or(`code.ilike.%${q}%,wps_no.ilike.%${q}%,process.ilike.%${q}%`).limit(25)
        : await query.order("updated_at", { ascending: false }).limit(25);
      return (data ?? []) as any[];
    },
  });

  const pick = async (id: string) => {
    setBusy(id);
    const { error } = await (supabase.from("welds") as any).update({ procedure_id: id }).eq("id", weldId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("WPS linked");
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["wps-for-weld"] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pick compatible WPS</DialogTitle>
          <DialogDescription>Link an approved WPS to enable compliance checks against this weld.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="ps-9" placeholder="Search by code, WPS no, process…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="max-h-80 overflow-auto rounded-md border border-border">
          {(procs.data ?? []).map((p) => (
            <button
              key={p.id}
              onClick={() => pick(p.id)}
              disabled={!!busy}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/40 border-b border-border/40 last:border-0 text-start"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{p.code} {p.wps_no ? `· ${p.wps_no}` : ""}</div>
                <div className="text-xs text-muted-foreground">{p.process} · Rev {p.revision} · {p.status}</div>
              </div>
              {busy === p.id && <Loader2 className="size-4 animate-spin shrink-0" />}
            </button>
          ))}
          {(procs.data?.length ?? 0) === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No matching WPS.</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Assign Welder ─────────────── */

function AssignWelderDialog({ weldId, onClose }: { weldId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const quals = useQuery<any[]>({
    queryKey: ["assign-welder", q],
    queryFn: async () => {
      const query = supabase.from("qualifications").select("id, welder_name, employee_id, process, expiry_date, status");
      const { data } = q
        ? await query.or(`welder_name.ilike.%${q}%,employee_id.ilike.%${q}%`).limit(25)
        : await query.order("expiry_date", { ascending: false }).limit(25);
      return (data ?? []) as any[];
    },
  });

  const pick = async (name: string, id: string) => {
    setBusy(id);
    const { error } = await (supabase.from("welds") as any).update({ welder_name: name }).eq("id", weldId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Assigned ${name}`);
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["wpq-options"] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign qualified welder</DialogTitle>
          <DialogDescription>Pick a welder with a current WPQ matching the weld's process & position.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="ps-9" placeholder="Search by welder or ID…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="max-h-80 overflow-auto rounded-md border border-border">
          {(quals.data ?? []).map((qual) => {
            const expired = new Date(qual.expiry_date) < new Date();
            return (
              <button
                key={qual.id}
                onClick={() => pick(qual.welder_name, qual.id)}
                disabled={!!busy}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/40 border-b border-border/40 last:border-0 text-start"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{qual.welder_name} · {qual.employee_id}</div>
                  <div className="text-xs text-muted-foreground">
                    {qual.process} · expires {qual.expiry_date}
                    {expired && <span className="ms-2 text-destructive font-medium">Expired</span>}
                  </div>
                </div>
                {busy === qual.id && <Loader2 className="size-4 animate-spin shrink-0" />}
              </button>
            );
          })}
          {(quals.data?.length ?? 0) === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">No matching welders.</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Create Inspection ─────────────── */

function CreateInspectionDialog({ weldId, onClose }: { weldId: string; onClose: () => void }) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [type, setType] = useState("Visual");
  const [inspector, setInspector] = useState("");
  const [defect, setDefect] = useState("");

  const submit = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const { error } = await (supabase.from("inspections") as any).insert({
      company_id: profile.company_id,
      weld_id: weldId,
      inspection_type: type,
      inspector_name: inspector || null,
      defect_type: defect || null,
      status: "Open",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Inspection logged");
    qc.invalidateQueries({ queryKey: ["inspections-weld", weldId] });
    qc.invalidateQueries({ queryKey: ["inspections-cc", weldId] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log inspection</DialogTitle>
          <DialogDescription>Create a new inspection record for this weld.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Inspection type</Label>
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              {["Visual", "RT", "UT", "MT", "PT", "Hardness"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Inspector name</Label>
            <Input value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="Optional" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Defect (if any)</Label>
            <Input value={defect} onChange={(e) => setDefect(e.target.value)} placeholder="Leave blank for clean inspection" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={busy} onClick={submit}>
            {busy && <Loader2 className="size-3.5 me-1.5 animate-spin" />}
            Create inspection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Create NCR ─────────────── */

function CreateNcrDialog({ weldId, onClose }: { weldId: string; onClose: () => void }) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [sev, setSev] = useState("Major");

  const submit = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const ncrNo = `NCR-${Date.now().toString().slice(-6)}`;
    const { error } = await (supabase.from("ncrs") as any).insert({
      company_id: profile.company_id,
      weld_id: weldId,
      ncr_no: ncrNo,
      title,
      description: desc || null,
      severity: sev,
      status: "Open",
      raised_by: user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${ncrNo} created`);
    qc.invalidateQueries({ queryKey: ["ncrs-weld", weldId] });
    qc.invalidateQueries({ queryKey: ["ncrs-cc", weldId] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raise NCR</DialogTitle>
          <DialogDescription>Document a non-conformance against this weld.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary of the non-conformance" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Severity</Label>
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm" value={sev} onChange={(e) => setSev(e.target.value)}>
              {["Minor", "Major", "Critical"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe the non-conformance, code clause, location…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={busy || !title.trim()} onClick={submit}>
            {busy && <Loader2 className="size-3.5 me-1.5 animate-spin" />}
            Raise NCR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Request Approval ─────────────── */

function RequestApprovalDialog({ weldId, onClose }: { weldId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await (supabase.from("welds") as any)
      .update({ workflow_status: "Ready for Release" })
      .eq("id", weldId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted for approval");
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["weld_events", weldId] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request engineering approval</DialogTitle>
          <DialogDescription>
            Moves the weld to <span className="font-medium">Ready for Release</span> so the welding engineer / QA-QC manager can sign off.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={busy} onClick={submit}>
            {busy && <Loader2 className="size-3.5 me-1.5 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────── Generic notice ─────────────── */

function SimpleNoticeDialog({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
