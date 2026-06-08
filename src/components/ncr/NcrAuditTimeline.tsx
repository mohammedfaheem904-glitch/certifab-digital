import { Badge } from "@/components/ui/badge";
import {
  CirclePlus, Search, FileEdit, CheckCircle2, Wrench, CheckCheck, Eye, Lock, RotateCcw, Flag,
} from "lucide-react";

const EVENT_ICON: Record<string, any> = {
  created: CirclePlus,
  raised: CirclePlus,
  status_advance: Flag,
  investigation_started: Search,
  ca_proposed: FileEdit,
  ca_updated: FileEdit,
  capa_added: FileEdit,
  awaiting_approval: Eye,
  approved: CheckCircle2,
  rework_assigned: Wrench,
  rework_started: Wrench,
  rework_completed: CheckCheck,
  repaired: CheckCheck,
  re_inspection_requested: RotateCcw,
  re_inspection: RotateCcw,
  re_inspection_result: RotateCcw,
  closed: Lock,
  rejected: Lock,
};

const EVENT_LABEL: Record<string, string> = {
  created: "Created",
  raised: "Raised",
  status_advance: "Status advanced",
  investigation_started: "Investigation started",
  ca_proposed: "Corrective action proposed",
  ca_updated: "Corrective action updated",
  capa_added: "CAPA added",
  awaiting_approval: "Awaiting approval",
  approved: "Approved",
  rework_assigned: "Rework assigned",
  rework_started: "Rework started",
  rework_completed: "Rework completed",
  repaired: "Repaired",
  re_inspection_requested: "Re-inspection requested",
  re_inspection: "Re-inspection",
  re_inspection_result: "Re-inspection result",
  closed: "Closed",
  rejected: "Rejected",
};

export function NcrAuditTimeline({ events }: { events: any[] }) {
  const sorted = [...(events ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  if (sorted.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-10">No audit events yet.</div>;
  }
  return (
    <ol className="relative border-s-2 border-border ms-3 space-y-4 py-2">
      {sorted.map((e) => {
        const Icon = EVENT_ICON[e.kind] ?? Flag;
        const label = EVENT_LABEL[e.kind] ?? e.kind.replace(/_/g, " ");
        const result = e.payload?.result;
        return (
          <li key={e.id} className="ms-6 relative">
            <div className="absolute -start-[34px] mt-0.5 size-7 rounded-full bg-card border-2 border-primary/40 grid place-items-center">
              <Icon className="size-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{label}</span>
              {result && <Badge variant="outline">{result}</Badge>}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {e.actor_name && <>{e.actor_name} · </>}
              {new Date(e.created_at).toLocaleString()}
            </div>
            {e.comment && <div className="text-xs mt-1 text-foreground/80">{e.comment}</div>}
          </li>
        );
      })}
    </ol>
  );
}
