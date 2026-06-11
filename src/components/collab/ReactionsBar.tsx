import { REACTIONS, REACTION_LABELS, type Reaction } from "@/lib/collab/types";
import { toggleReaction } from "@/lib/collab/use-comments";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  commentId: string;
  reactions: { emoji: Reaction; count: number; mine: boolean }[];
  compact?: boolean;
};

export function ReactionsBar({ commentId, reactions, compact }: Props) {
  const counts = new Map(reactions.map((r) => [r.emoji, r]));

  const handle = async (e: Reaction) => {
    try {
      await toggleReaction(commentId, e);
    } catch (err: any) {
      toast.error(err?.message ?? "Could not react");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {REACTIONS.map((e) => {
        const r = counts.get(e);
        const active = !!r?.mine;
        const has = (r?.count ?? 0) > 0;
        if (compact && !has) return null;
        return (
          <button
            key={e}
            type="button"
            onClick={() => handle(e)}
            title={REACTION_LABELS[e]}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
              active
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60",
            )}
          >
            <span>{e}</span>
            {has && <span className="font-medium">{r!.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
