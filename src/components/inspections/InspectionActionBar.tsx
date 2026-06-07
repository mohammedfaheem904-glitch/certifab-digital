import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { allowedTransitions, type InspectionWorkflowStatus } from "@/lib/inspection-workflow";
import { Loader2, ArrowRight } from "lucide-react";

interface Props {
  status: string;
  busy?: boolean;
  onTransition: (next: InspectionWorkflowStatus, comment?: string) => Promise<void> | void;
}

const REQUIRES_COMMENT: InspectionWorkflowStatus[] = ["Rejected", "NCR Raised", "Re-Inspection Required"];

export function InspectionActionBar({ status, busy, onTransition }: Props) {
  const next = allowedTransitions(status);
  const [pending, setPending] = useState<InspectionWorkflowStatus | null>(null);
  const [comment, setComment] = useState("");

  if (next.length === 0) {
    return <div className="text-xs text-muted-foreground">Inspection closed — no further actions.</div>;
  }

  const trigger = async (n: InspectionWorkflowStatus) => {
    if (REQUIRES_COMMENT.includes(n)) {
      setPending(n);
      return;
    }
    await onTransition(n);
  };

  const confirm = async () => {
    if (!pending) return;
    await onTransition(pending, comment.trim() || undefined);
    setPending(null);
    setComment("");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {next.map((n) => {
          const isDestructive = ["Rejected", "NCR Raised"].includes(n);
          const isPrimary = ["Accepted", "Closed", "In Progress", "Pending Review", "Assigned"].includes(n);
          return (
            <Button
              key={n}
              size="sm"
              variant={isDestructive ? "outline" : isPrimary ? "default" : "outline"}
              disabled={busy}
              onClick={() => trigger(n)}
              className={isPrimary ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]" : isDestructive ? "border-destructive/40 text-destructive hover:bg-destructive/10" : ""}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <><ArrowRight className="size-3.5 me-1.5" />{n}</>}
            </Button>
          );
        })}
      </div>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move inspection to "{pending}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-xs">Reason / comment (recorded in audit trail)</Label>
            <Textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Provide context for this transition…" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
            <Button onClick={confirm} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
