import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  allowedTransitions, type WeldWorkflowStatus, type Transition,
} from "@/lib/weld-workflow";

interface Props {
  weldId: string;
  weldNo: string;
  status: WeldWorkflowStatus;
  canEdit: boolean;
}

export function WeldActionBar({ weldId, weldNo, status, canEdit }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [pending, setPending] = useState<Transition | null>(null);
  const [reason, setReason] = useState("");

  const transitions = allowedTransitions(status);

  const runTransition = async (t: Transition, providedReason?: string) => {
    setBusy(t.to);
    const now = new Date().toISOString();
    const patch: Record<string, any> = { workflow_status: t.to };

    // Side-effect fields per target state
    if (t.to === "Pending Validation") patch.submitted_for_validation_at = now;
    if (t.to === "Approved") { patch.approved_at = now; patch.approved_by = user?.id ?? null; patch.status = "Accepted"; }
    if (t.to === "Released") { patch.released_at = now; patch.released_by = user?.id ?? null; patch.status = "Accepted"; }
    if (t.to === "Rejected") {
      patch.rejected_at = now; patch.rejected_by = user?.id ?? null;
      patch.rejection_reason = providedReason ?? null; patch.status = "Rejected";
    }
    if (t.to === "Blocked") patch.blocked_reason = providedReason ?? null;
    if (t.to === "Draft") {
      patch.rejection_reason = null; patch.blocked_reason = null;
      patch.status = "Pending";
    }
    if (t.to === "NCR Open") patch.status = "Repair";

    const { error } = await (supabase.from("welds") as any).update(patch).eq("id", weldId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`${weldNo} → ${t.to}`);
    qc.invalidateQueries({ queryKey: ["weld", weldId] });
    qc.invalidateQueries({ queryKey: ["weld_events", weldId] });
  };

  const handleClick = (t: Transition) => {
    if (t.needsReason) {
      setPending(t); setReason("");
    } else {
      runTransition(t);
    }
  };

  if (!canEdit) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
        Read-only — request editor permissions to advance this weld.
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 sm:mx-0 px-4 sm:px-5 py-3 rounded-none sm:rounded-xl border-b sm:border border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Available actions for <span className="font-medium text-foreground">{status}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {transitions.map((t) => (
              <Button
                key={t.to + t.label}
                variant={t.variant ?? "default"}
                size="sm"
                disabled={!!busy}
                onClick={() => handleClick(t)}
              >
                {busy === t.to && <Loader2 className="size-3.5 me-1.5 animate-spin" />}
                {t.label}
              </Button>
            ))}
            {transitions.length === 0 && (
              <span className="text-xs text-muted-foreground">No transitions from this state.</span>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.label} — {weldNo}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-xs">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Document why this weld is being moved to this state…"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>Cancel</Button>
            <Button
              variant={pending?.variant ?? "default"}
              disabled={!reason.trim() || !!busy}
              onClick={async () => {
                if (!pending) return;
                const t = pending;
                setPending(null);
                await runTransition(t, reason.trim());
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
