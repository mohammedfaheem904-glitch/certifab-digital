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
  allowedProjectTransitions,
  type ProjectTransition,
  type ProjectWorkflowStatus,
} from "@/lib/project-workflow";

interface Props {
  projectId: string;
  projectCode: string;
  status: ProjectWorkflowStatus;
}

export function ProjectActionBar({ projectId, projectCode, status }: Props) {
  const { roles } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [pending, setPending] = useState<ProjectTransition | null>(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const roleFlags = {
    isEditor: roles.some((r) => ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r)),
    isApprover: roles.includes("qa_qc_manager") || roles.includes("super_admin"),
    isSuperAdmin: roles.includes("super_admin"),
  };

  const transitions = allowedProjectTransitions(status, roleFlags);

  const runTransition = async (t: ProjectTransition, providedReason?: string, providedComment?: string) => {
    setBusy(t.to);
    const { error } = await (supabase.rpc as any)("transition_project", {
      _id: projectId,
      _to: t.to,
      _reason: providedReason ?? null,
      _comment: providedComment ?? null,
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`${projectCode} → ${t.to}`);
    qc.invalidateQueries({ queryKey: ["project", projectId] });
    qc.invalidateQueries({ queryKey: ["project_events", projectId] });
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const handleClick = (t: ProjectTransition) => {
    if (t.needsReason) {
      setPending(t); setReason(""); setComment("");
    } else {
      // Optional comment dialog for approver actions
      if (t.role === "approver" || t.role === "super_admin") {
        setPending(t); setReason(""); setComment("");
      } else {
        runTransition(t);
      }
    }
  };

  if (transitions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
        No transitions available from <span className="font-medium text-foreground">{status}</span> for your role.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card px-4 sm:px-5 py-3 shadow-sm">
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
          </div>
        </div>
      </div>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.label} — {projectCode}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {pending?.needsReason && (
              <div className="space-y-1.5">
                <Label htmlFor="reason" className="text-xs">Reason <span className="text-destructive">*</span></Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Document why this project is moving to this state…"
                  rows={3}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="comment" className="text-xs">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a note for the workflow log…"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>Cancel</Button>
            <Button
              variant={pending?.variant ?? "default"}
              disabled={(pending?.needsReason && !reason.trim()) || !!busy}
              onClick={async () => {
                if (!pending) return;
                const t = pending;
                setPending(null);
                await runTransition(t, reason.trim() || undefined, comment.trim() || undefined);
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
