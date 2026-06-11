import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { CollabEntityType } from "./types";

const db = supabase as any;

export function useWatchers(entityType: CollabEntityType, entityId: string | null | undefined) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const enabled = !!entityId && !!profile?.company_id;
  const myId = user?.id ?? null;

  const q = useQuery({
    queryKey: ["watchers", entityType, entityId],
    enabled,
    queryFn: async () => {
      const { data, error } = await db
        .from("watchers")
        .select("user_id")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId);
      if (error) throw error;
      return (data ?? []) as { user_id: string }[];
    },
  });

  const watchers = q.data ?? [];
  const isWatching = !!myId && watchers.some((w) => w.user_id === myId);

  const toggle = async () => {
    const { error } = await db.rpc("toggle_watch", { _entity_type: entityType, _entity_id: entityId });
    if (error) throw error;
    qc.invalidateQueries({ queryKey: ["watchers", entityType, entityId] });
  };

  return { count: watchers.length, isWatching, toggle, isLoading: q.isLoading };
}
