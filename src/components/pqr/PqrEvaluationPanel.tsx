import { CheckCircle2, XCircle, AlertTriangle, Loader2, ShieldCheck, ArrowUpRightFromSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { promotePqrToWps } from "@/lib/pqr-promotion.client";
import type { EvaluationResult } from "@/lib/pqr-evaluation";

const ICON: Record<string, any> = {
  pass: <CheckCircle2 className="size-4 text-success" />,
  fail: <XCircle className="size-4 text-destructive" />,
  warn: <AlertTriangle className="size-4 text-warning" />,
};

export function PqrEvaluationPanel({
  pqrId,
  pqr,
  evaluation,
  canEdit,
}: {
  pqrId: string;
  pqr: any;
  evaluation: EvaluationResult;
  canEdit: boolean;
}) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [failReason, setFailReason] = useState("");
  const alreadyPassed = pqr?.overall_result === "Pass";
  const alreadyFailed = pqr?.overall_result === "Fail";

  const markPassed = async () => {
    if (!evaluation.ready) return toast.error("Resolve blockers before passing.");
    setBusy(true);
    const { error } = await (supabase.from("pqrs" as any) as any)
      .update({
        overall_result: "Pass",
        status: "Passed",
        qualification_date: new Date().toISOString().slice(0, 10),
        evaluator_id: user?.id ?? null,
        evaluator_name: profile?.display_name ?? null,
        evaluation_snapshot: evaluation,
      })
      .eq("id", pqrId);
    if (error) { setBusy(false); return toast.error(error.message); }

    try {
      const { procedureId, created } = await promotePqrToWps(pqrId);
      toast.success(created ? "PQR Passed — Draft WPS created in Procedures." : "PQR Passed — WPS already existed.");
      qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
      qc.invalidateQueries({ queryKey: ["pqrs"] });
      qc.invalidateQueries({ queryKey: ["company-rows", "procedures"] });
      nav({ to: "/app/procedures/$procedureId", params: { procedureId } });
    } catch (e: any) {
      toast.error(`Saved as Pass, but WPS creation failed: ${e.message}`);
      qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    } finally {
      setBusy(false);
    }
  };

  const markFailed = async () => {
    setBusy(true);
    const { error } = await (supabase.from("pqrs" as any) as any)
      .update({
        overall_result: "Fail",
        status: "Failed",
        evaluator_id: user?.id ?? null,
        evaluator_name: profile?.display_name ?? null,
        evaluation_snapshot: evaluation,
        remarks: failReason ? `${pqr.remarks ? pqr.remarks + "\n\n" : ""}Failure reason: ${failReason}` : pqr.remarks,
      })
      .eq("id", pqrId);
    setBusy(false);
    setFailOpen(false);
    if (error) return toast.error(error.message);
    toast.success("PQR marked as Failed.");
    qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    qc.invalidateQueries({ queryKey: ["pqrs"] });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="size-4" /> Qualification readiness</CardTitle>
          {evaluation.ready ? (
            <Badge variant="outline" className="bg-success/15 text-success border-success/30">Ready to sign</Badge>
          ) : (
            <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30">{evaluation.blockers.length} blocker(s)</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {evaluation.checklist.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-sm py-1 border-b last:border-b-0">
              {ICON[c.status]}
              <div className="flex-1">
                <div>{c.label}</div>
                {c.detail && <div className="text-xs text-muted-foreground">{c.detail}</div>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {(evaluation.blockers.length > 0 || evaluation.warnings.length > 0) && (
        <Card>
          <CardHeader><CardTitle className="text-base">Issues</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {evaluation.blockers.map((b, i) => (
              <div key={`b${i}`} className="flex items-start gap-2"><XCircle className="size-4 text-destructive mt-0.5" /><span>{b}</span></div>
            ))}
            {evaluation.warnings.map((w, i) => (
              <div key={`w${i}`} className="flex items-start gap-2"><AlertTriangle className="size-4 text-warning mt-0.5" /><span>{w}</span></div>
            ))}
          </CardContent>
        </Card>
      )}

      {alreadyPassed ? (
        <div className="rounded-md border bg-success/5 border-success/30 p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-success flex items-center gap-2"><CheckCircle2 className="size-4" /> PQR already passed</div>
            <div className="text-xs text-muted-foreground mt-0.5">Qualified on {pqr.qualification_date} by {pqr.evaluator_name ?? "evaluator"}.</div>
          </div>
          {pqr.resulting_wps_id && (
            <Button variant="outline" onClick={() => nav({ to: "/app/procedures/$procedureId", params: { procedureId: pqr.resulting_wps_id } })}>
              <ArrowUpRightFromSquare className="size-4 me-1" /> Open resulting WPS
            </Button>
          )}
        </div>
      ) : alreadyFailed ? (
        <div className="rounded-md border bg-destructive/5 border-destructive/30 p-4">
          <div className="font-medium text-destructive flex items-center gap-2"><XCircle className="size-4" /> PQR marked Failed</div>
          <div className="text-xs text-muted-foreground mt-0.5">Remediate findings, then create a new revision.</div>
        </div>
      ) : (
        canEdit && (
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" className="text-destructive border-destructive/40" onClick={() => setFailOpen(true)} disabled={busy}>
              <XCircle className="size-4 me-1" /> Force Fail
            </Button>
            <Button onClick={markPassed} disabled={busy || !evaluation.ready}>
              {busy ? <Loader2 className="size-4 animate-spin me-1" /> : <CheckCircle2 className="size-4 me-1" />}
              Pass & Sign · Promote to WPS
            </Button>
          </div>
        )
      )}

      <Dialog open={failOpen} onOpenChange={setFailOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Mark PQR as Failed</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">A failure reason will be added to the remarks and surfaced on the linked pWPS.</p>
            <Textarea rows={4} placeholder="Reason / next steps" value={failReason} onChange={(e) => setFailReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFailOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={markFailed} disabled={busy}>Mark Failed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
