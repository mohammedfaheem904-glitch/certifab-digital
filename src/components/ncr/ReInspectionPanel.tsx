import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

type Result = "Pass" | "Fail" | "Conditional";

const RESULT_CFG: Record<Result, { icon: any; tone: string; nextStatus: string }> = {
  Pass: { icon: CheckCircle2, tone: "bg-success/10 text-success border-success/30 hover:bg-success/20", nextStatus: "Closed" },
  Fail: { icon: XCircle, tone: "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20", nextStatus: "Rework Required" },
  Conditional: { icon: AlertCircle, tone: "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20", nextStatus: "Accepted As-Is" },
};

export function ReInspectionPanel({ ncr, events, onChanged }: { ncr: any; events: any[]; onChanged: () => void }) {
  const qc = useQueryClient();
  const { profile, user } = useAuth();
  const [open, setOpen] = useState<Result | null>(null);
  const [inspector, setInspector] = useState(profile?.display_name ?? "");
  const [comments, setComments] = useState("");
  const [attachment, setAttachment] = useState("");
  const [busy, setBusy] = useState(false);

  const history = (events ?? []).filter((e) => e.kind === "re_inspection_result");

  const submit = async () => {
    if (!open || !profile?.company_id) return;
    setBusy(true);
    // 1. log re-inspection event
    const { error: evErr } = await (supabase.from("ncr_events" as any) as any).insert({
      company_id: profile.company_id,
      ncr_id: ncr.id,
      kind: "re_inspection_result",
      actor_id: user?.id ?? null,
      actor_name: inspector || profile.display_name,
      comment: comments || null,
      payload: { result: open, inspector, attachment: attachment || null },
    });
    if (evErr) { setBusy(false); return toast.error(evErr.message); }

    // 2. advance NCR status
    const { error: trErr } = await (supabase.rpc as any)("transition_ncr", {
      _id: ncr.id, _to: RESULT_CFG[open].nextStatus, _reason: comments || null, _comment: `Re-inspection: ${open}`,
    });
    setBusy(false);
    if (trErr) return toast.error(trErr.message);
    toast.success(`Re-inspection recorded: ${open}`);
    setOpen(null); setComments(""); setAttachment("");
    qc.invalidateQueries({ queryKey: ["ncr", ncr.id] });
    qc.invalidateQueries({ queryKey: ["ncr_events", ncr.id] });
    onChanged();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h3 className="text-sm font-medium">Re-Inspection</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Record the verification outcome after rework or corrective action.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(Object.keys(RESULT_CFG) as Result[]).map((r) => {
          const Icon = RESULT_CFG[r].icon;
          return (
            <Button key={r} variant="outline" className={`h-auto py-3 ${RESULT_CFG[r].tone}`} onClick={() => setOpen(r)}>
              <Icon className="size-4 me-1.5" />
              {r === "Conditional" ? "Conditional Acceptance" : r}
            </Button>
          );
        })}
      </div>

      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">History</div>
          <ul className="divide-y divide-border/60">
            {history.map((e) => (
              <li key={e.id} className="py-2 flex items-start gap-2">
                <Badge variant="outline">{e.payload?.result ?? "—"}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-xs">{e.actor_name ?? "—"} · {new Date(e.created_at).toLocaleString()}</div>
                  {e.comment && <div className="text-xs text-muted-foreground mt-0.5">{e.comment}</div>}
                  {e.payload?.attachment && <a href={e.payload.attachment} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Attachment</a>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Re-Inspection: {open}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Inspector</Label>
              <Input value={inspector} onChange={(e) => setInspector(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Comments</Label>
              <Textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Findings, scope, conditions…" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Attachment URL (optional)</Label>
              <Input value={attachment} onChange={(e) => setAttachment(e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : `Record ${open}`}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
