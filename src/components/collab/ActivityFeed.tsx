import { Skeleton } from "@/components/ui/skeleton";
import { useActivity } from "@/lib/collab/use-activity";
import type { CollabEntityType } from "@/lib/collab/types";
import { formatDistanceToNow } from "@/lib/format";
import {
  Activity,
  MessageSquare,
  Reply,
  ArrowRightLeft,
  Plus,
  Pencil,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function ActivityFeed({
  entityType,
  entityId,
  limit = 50,
}: {
  entityType: CollabEntityType;
  entityId: string;
  limit?: number;
}) {
  const q = useActivity(entityType, entityId, limit);
  if (q.isLoading) return <Skeleton className="h-32 w-full" />;
  const rows = q.data ?? [];
  if (!rows.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No activity yet for this record.
      </div>
    );
  }
  return (
    <ol className="relative border-s border-border ms-2 space-y-3">
      {rows.map((r) => {
        const Icon = iconFor(r.kind);
        return (
          <li key={r.id} className="ms-4">
            <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" />
            <div className="flex items-start gap-2">
              <Icon className="size-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-sm">{r.summary ?? prettyKind(r.kind)}</div>
                <div className="text-xs text-muted-foreground">{formatDistanceToNow(r.created_at)}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function iconFor(kind: string) {
  if (kind === "comment_added") return MessageSquare;
  if (kind === "comment_reply") return Reply;
  if (kind === "created" || kind.endsWith("_created")) return Plus;
  if (kind.includes("transition") || kind.includes("status")) return ArrowRightLeft;
  if (kind.includes("updated")) return Pencil;
  if (kind.includes("approved") || kind.includes("closed")) return CheckCircle2;
  if (kind.includes("rejected")) return XCircle;
  return Activity;
}

function prettyKind(kind: string) {
  return kind.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
