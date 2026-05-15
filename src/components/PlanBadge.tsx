import { Crown, Sparkles, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanDefinition } from "@/lib/plans";

const TONE: Record<string, string> = {
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/15 text-primary border-primary/30",
  gold: "bg-warning/15 text-warning border-warning/30",
};

const ICON: Record<string, any> = {
  free: Leaf,
  professional: Sparkles,
  enterprise: Crown,
};

export function PlanBadge({
  plan,
  className,
  size = "sm",
  internal = false,
}: {
  plan: PlanDefinition;
  className?: string;
  size?: "xs" | "sm";
  /** When true, renders an "Internal" owner badge instead of the plan badge. */
  internal?: boolean;
}) {
  if (internal) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium border-warning/40 bg-warning/15 text-warning",
          size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
          className,
        )}
        title="Internal owner workspace — plan limits bypassed"
      >
        <Crown className={size === "xs" ? "size-2.5" : "size-3"} />
        Internal · Owner
      </span>
    );
  }
  const Icon = ICON[plan.id] ?? Sparkles;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        TONE[plan.badgeTone],
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className,
      )}
      title={`${plan.name} plan`}
    >
      <Icon className={size === "xs" ? "size-2.5" : "size-3"} />
      {plan.name}
    </span>
  );
}
