import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchers } from "@/lib/collab/use-watchers";
import type { CollabEntityType } from "@/lib/collab/types";
import { toast } from "sonner";

export function WatchButton({
  entityType,
  entityId,
  size = "sm",
}: {
  entityType: CollabEntityType;
  entityId: string;
  size?: "sm" | "default";
}) {
  const { count, isWatching, toggle, isLoading } = useWatchers(entityType, entityId);
  const Icon = isWatching ? Eye : EyeOff;
  return (
    <Button
      type="button"
      variant={isWatching ? "default" : "outline"}
      size={size}
      disabled={isLoading}
      onClick={async () => {
        try {
          await toggle();
          toast.success(isWatching ? "Stopped watching" : "Now watching this record");
        } catch (e: any) {
          toast.error(e?.message ?? "Failed");
        }
      }}
      title={isWatching ? "Stop watching this record" : "Get notified about updates"}
    >
      <Icon className="size-4 me-1.5" />
      {isWatching ? "Watching" : "Watch"}
      <span className="ms-1.5 text-xs opacity-70">· {count}</span>
    </Button>
  );
}
