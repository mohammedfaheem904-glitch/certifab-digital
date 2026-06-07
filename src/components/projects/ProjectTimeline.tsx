import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CircleDot, ArrowRight, MessageSquare, Sparkles } from "lucide-react";

type Event = {
  id: string;
  kind: string;
  actor_id: string | null;
  actor_name: string | null;
  payload: any;
  created_at: string;
};

export function ProjectTimeline({ projectId }: { projectId: string }) {
  const { data, isLoading } = useQuery<Event[]>({
    queryKey: ["project_events", projectId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("project_events" as any) as any)
        .select("id, kind, actor_id, actor_name, payload, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Event[];
    },
  });

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" /> Loading timeline…</div>;
  }
  if (!data || data.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">No workflow activity yet.</div>;
  }

  return (
    <ol className="relative border-s border-border ms-3 space-y-4">
      {data.map((e) => {
        const Icon = e.kind === "created" ? Sparkles : e.kind === "comment" ? MessageSquare : CircleDot;
        return (
          <li key={e.id} className="ms-6">
            <span className="absolute -start-3 grid place-items-center size-6 rounded-full bg-card border border-border">
              <Icon className="size-3 text-muted-foreground" />
            </span>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {e.kind === "workflow_transition" && (
                <span className="font-medium inline-flex items-center gap-1.5">
                  {e.payload?.from ?? "—"} <ArrowRight className="size-3.5 text-muted-foreground" /> {e.payload?.to ?? "—"}
                </span>
              )}
              {e.kind === "created" && <span className="font-medium">Project created</span>}
              {e.kind === "comment" && <span className="font-medium">Comment</span>}
              <span className="text-xs text-muted-foreground">· {new Date(e.created_at).toLocaleString()}</span>
            </div>
            {e.payload?.reason && (
              <div className="text-xs text-muted-foreground mt-1"><span className="font-medium">Reason:</span> {e.payload.reason}</div>
            )}
            {e.payload?.comment && (
              <div className="text-xs text-muted-foreground mt-1">{e.payload.comment}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
