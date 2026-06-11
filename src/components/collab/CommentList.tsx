import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useComments } from "@/lib/collab/use-comments";
import { CommentItem } from "./CommentItem";
import type { CollabEntityType } from "@/lib/collab/types";
import { MessageSquare } from "lucide-react";

type Props = {
  entityType: CollabEntityType;
  entityId: string;
  highlightedCommentId?: string | null;
  filterCategory?: string | null;
};

export function CommentList({ entityType, entityId, highlightedCommentId, filterCategory }: Props) {
  const q = useComments(entityType, entityId);

  useEffect(() => {
    if (highlightedCommentId) {
      const el = document.getElementById(`comment-${highlightedCommentId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightedCommentId, q.data]);

  if (q.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  let roots = q.data ?? [];
  if (filterCategory) roots = roots.filter((c) => c.category === filterCategory);
  if (roots.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        <MessageSquare className="size-5 mx-auto mb-2 opacity-50" />
        No comments yet. Start the discussion.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {roots.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          entityType={entityType}
          entityId={entityId}
          depth={0}
          highlighted={highlightedCommentId ?? null}
        />
      ))}
    </div>
  );
}
