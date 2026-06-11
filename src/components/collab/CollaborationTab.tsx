import { useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Activity } from "lucide-react";
import { CommentList } from "./CommentList";
import { CommentComposer } from "./CommentComposer";
import { ActivityFeed } from "./ActivityFeed";
import { WatchButton } from "./WatchButton";
import { useComments } from "@/lib/collab/use-comments";
import type { CollabEntityType } from "@/lib/collab/types";

export function CollaborationTab({
  entityType,
  entityId,
}: {
  entityType: CollabEntityType;
  entityId: string;
}) {
  const search = (useSearch({ strict: false }) ?? {}) as Record<string, any>;
  const highlight = (search.comment as string) ?? null;
  const { flatCount } = useComments(entityType, entityId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {flatCount} {flatCount === 1 ? "comment" : "comments"}
        </div>
        <WatchButton entityType={entityType} entityId={entityId} />
      </div>
      <Tabs defaultValue="discussion">
        <TabsList>
          <TabsTrigger value="discussion"><MessageSquare className="size-4 me-1.5" /> Discussion</TabsTrigger>
          <TabsTrigger value="activity"><Activity className="size-4 me-1.5" /> Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="discussion" className="space-y-4 mt-4">
          <CommentComposer entityType={entityType} entityId={entityId} />
          <CommentList entityType={entityType} entityId={entityId} highlightedCommentId={highlight} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ActivityFeed entityType={entityType} entityId={entityId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
