import { cn } from "@/lib/utils";
import { PROJECT_STATUS_TONE, type ProjectWorkflowStatus } from "@/lib/project-workflow";

export function ProjectWorkflowBadge({
  status,
  size = "sm",
  className,
}: {
  status: ProjectWorkflowStatus | string;
  size?: "sm" | "md";
  className?: string;
}) {
  const tone = (PROJECT_STATUS_TONE as any)[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        tone,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
