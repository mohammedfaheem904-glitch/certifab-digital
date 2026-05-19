import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WORKFLOW_STAGES, BRANCH_STATES, stageIndex,
  type WeldWorkflowStatus,
} from "@/lib/weld-workflow";
import { WeldStatusBadge } from "./WeldStatusBadge";

interface Props {
  status: WeldWorkflowStatus | string;
}

export function WeldWorkflowStepper({ status }: Props) {
  const s = (status as WeldWorkflowStatus);
  const branch = BRANCH_STATES.includes(s);
  const idx = stageIndex(branch ? "Awaiting Inspection" : s);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Workflow stage</div>
          <div className="text-base font-semibold mt-0.5">{status}</div>
        </div>
        <WeldStatusBadge status={status} size="md" />
      </div>

      {/* Horizontal stepper */}
      <ol className="flex items-center w-full overflow-x-auto">
        {WORKFLOW_STAGES.map((stage, i) => {
          const done = !branch && i < idx;
          const current = !branch && i === idx;
          const upcoming = !done && !current;
          return (
            <li
              key={stage}
              className={cn(
                "flex items-center shrink-0",
                i < WORKFLOW_STAGES.length - 1 ? "flex-1 min-w-[120px]" : "",
              )}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "size-8 rounded-full grid place-items-center border-2 transition-colors",
                    done && "bg-success border-success text-success-foreground",
                    current && "border-primary text-primary bg-primary/10",
                    upcoming && "border-border text-muted-foreground bg-background",
                  )}
                >
                  {done ? <Check className="size-4" /> : <span className="text-xs font-semibold">{i + 1}</span>}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[11px] leading-tight max-w-[110px]",
                    current ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                >
                  {stage}
                </span>
              </div>
              {i < WORKFLOW_STAGES.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1 sm:mx-2 rounded transition-colors",
                    done ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {branch && (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          Workflow paused at <span className="font-semibold">{status}</span> — resolve before continuing.
        </div>
      )}
    </div>
  );
}
