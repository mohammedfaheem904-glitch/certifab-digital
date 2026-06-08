import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Search, FileEdit, CheckCircle2, Wrench, CheckCheck, Eye, Lock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useIsEditor } from "@/lib/use-role";

type ActionDef = {
  key: string;
  label: string;
  icon: any;
  to: string;
  fromStatuses: string[];
  variant?: "default" | "outline" | "destructive";
};

const ACTIONS: ActionDef[] = [
  { key: "investigate", label: "Start Investigation", icon: Search, to: "Under Investigation", fromStatuses: ["Open", "Draft"] },
  { key: "propose-ca", label: "Propose Corrective Action", icon: FileEdit, to: "Corrective Action Proposed", fromStatuses: ["Under Investigation", "Root Cause", "Open"] },
  { key: "send-approval", label: "Send for Approval", icon: Eye, to: "Awaiting Approval", fromStatuses: ["Corrective Action Proposed", "CA Pending"] },
  { key: "approve-ca", label: "Approve Corrective Action", icon: CheckCircle2, to: "Rework Required", fromStatuses: ["Awaiting Approval", "In Review"] },
  { key: "mark-repaired", label: "Mark Rework Complete", icon: CheckCheck, to: "Repaired", fromStatuses: ["Rework Required"] },
  { key: "request-reinspect", label: "Request Re-Inspection", icon: Wrench, to: "Re-Inspection Required", fromStatuses: ["Repaired"] },
  { key: "close", label: "Close NCR", icon: Lock, to: "Closed", fromStatuses: ["Re-Inspection Required", "Repaired", "In Review", "Awaiting Approval"], variant: "default" },
  { key: "reject", label: "Reject", icon: XCircle, to: "Rejected", fromStatuses: ["Open", "Draft", "Under Investigation", "Root Cause", "Corrective Action Proposed", "Awaiting Approval", "In Review"], variant: "destructive" },
];

export function NcrActionBar({ ncr, onChanged }: { ncr: any; onChanged: () => void }) {
  const qc = useQueryClient();
  const isEditor = useIsEditor();
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (a: ActionDef) => {
    setBusy(a.key);
    const { error } = await (supabase.rpc as any)("transition_ncr", {
      _id: ncr.id,
      _to: a.to,
      _reason: null,
      _comment: `Action: ${a.label}`,
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Moved to ${a.to}`);
    qc.invalidateQueries({ queryKey: ["ncr", ncr.id] });
    qc.invalidateQueries({ queryKey: ["ncr_events", ncr.id] });
    onChanged();
  };

  const available = ACTIONS.filter((a) => a.fromStatuses.includes(ncr.status));
  const terminal = ["Closed", "Rejected", "Accepted As-Is"].includes(ncr.status);

  if (!isEditor) {
    return (
      <div className="sticky bottom-0 z-20 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="text-xs text-muted-foreground text-center">Read-only — editor role required to advance this NCR.</div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-20 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground me-1">Next actions:</span>
        {terminal && <span className="text-xs">NCR is {ncr.status.toLowerCase()} — no further actions.</span>}
        {!terminal && available.length === 0 && (
          <span className="text-xs text-muted-foreground">No quick action available for status "{ncr.status}". Use the Governance tab.</span>
        )}
        {available.map((a) => {
          const Icon = a.icon;
          const isBusy = busy === a.key;
          return (
            <Button key={a.key} size="sm" variant={a.variant ?? "outline"} disabled={busy !== null} onClick={() => run(a)}>
              {isBusy ? <Loader2 className="size-3.5 me-1.5 animate-spin" /> : <Icon className="size-3.5 me-1.5" />}
              {a.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
