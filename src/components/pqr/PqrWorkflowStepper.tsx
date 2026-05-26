import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "done" | "active" | "todo";
export type StepperStep = { id: string; label: string; status: StepStatus };

export function PqrWorkflowStepper({ steps }: { steps: StepperStep[] }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 shrink-0">
          <div
            className={cn(
              "size-7 rounded-full grid place-items-center text-xs font-medium border",
              s.status === "done" && "bg-success text-success-foreground border-success",
              s.status === "active" && "bg-primary text-primary-foreground border-primary",
              s.status === "todo" && "bg-muted text-muted-foreground border-border",
            )}
          >
            {s.status === "done" ? <Check className="size-3.5" /> : i + 1}
          </div>
          <span className={cn("text-xs", s.status === "active" ? "font-semibold" : "text-muted-foreground")}>{s.label}</span>
          {i < steps.length - 1 && <div className="w-6 h-px bg-border mx-1" />}
        </div>
      ))}
    </div>
  );
}
