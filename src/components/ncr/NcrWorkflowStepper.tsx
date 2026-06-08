import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "Open", label: "Open", eventKinds: ["created", "raised"] },
  { key: "Under Investigation", label: "Under Investigation", eventKinds: ["investigation_started"] },
  { key: "Corrective Action Proposed", label: "CA Proposed", eventKinds: ["capa_added", "ca_proposed"] },
  { key: "Awaiting Approval", label: "Awaiting Approval", eventKinds: ["awaiting_approval"] },
  { key: "Rework Required", label: "Rework Required", eventKinds: ["rework_assigned", "rework_started"] },
  { key: "Repaired", label: "Repaired", eventKinds: ["rework_completed", "repaired"] },
  { key: "Re-Inspection Required", label: "Re-Inspection", eventKinds: ["re_inspection_requested", "re_inspection"] },
  { key: "Closed", label: "Closed", eventKinds: ["closed"] },
] as const;

// All known statuses → index in stage progression
const STATUS_INDEX: Record<string, number> = {
  Draft: 0,
  Open: 0,
  "Under Investigation": 1,
  "Root Cause": 1,
  "Corrective Action Proposed": 2,
  "CA Pending": 2,
  "Awaiting Approval": 3,
  "In Review": 3,
  "Rework Required": 4,
  Repaired: 5,
  "Re-Inspection Required": 6,
  Closed: 7,
  "Accepted As-Is": 7,
  Rejected: 7,
};

export function NcrWorkflowStepper({ ncr, events }: { ncr: any; events: any[] }) {
  const currentIdx = STATUS_INDEX[ncr.status] ?? 0;
  const sortedEvents = [...(events ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const findEvent = (kinds: readonly string[]) =>
    sortedEvents.find((e) => kinds.includes(e.kind));

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-medium text-muted-foreground mb-3">NCR Workflow</div>
      <ol className="flex items-start gap-1 overflow-x-auto pb-1">
        {STAGES.map((stage, i) => {
          const state = i < currentIdx ? "done" : i === currentIdx ? "current" : "pending";
          const evt = findEvent(stage.eventKinds);
          const Icon = state === "done" ? Check : state === "current" ? Clock : Circle;
          return (
            <li key={stage.key} className="flex items-start gap-1 min-w-0 flex-1">
              <div className="flex flex-col items-center gap-1 min-w-[88px]">
                <div
                  className={cn(
                    "size-7 rounded-full grid place-items-center border-2",
                    state === "done" && "bg-success/15 border-success text-success",
                    state === "current" && "bg-primary/15 border-primary text-primary animate-pulse",
                    state === "pending" && "bg-muted/40 border-border text-muted-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <div className="text-center">
                  <div className={cn("text-[11px] font-medium leading-tight", state === "pending" && "text-muted-foreground")}>
                    {stage.label}
                  </div>
                  {evt && (
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {evt.actor_name && <div className="truncate max-w-[88px]">{evt.actor_name}</div>}
                      <div>{new Date(evt.created_at).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mt-3.5 rounded",
                    i < currentIdx ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
