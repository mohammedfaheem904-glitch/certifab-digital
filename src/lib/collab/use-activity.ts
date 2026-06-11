import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type { ActivityEvent, CollabEntityType } from "./types";

const db = supabase as any;

export function useActivity(entityType: CollabEntityType, entityId: string | null | undefined, limit = 100) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const enabled = !!entityId && !!profile?.company_id;

  const q = useQuery<ActivityEvent[]>({
    queryKey: ["activity", entityType, entityId, limit],
    enabled,
    queryFn: async () => {
      const { data, error } = await db
        .from("activity_events")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as ActivityEvent[];
    },
  });

  useEffect(() => {
    if (!enabled) return;
    const ch = supabase
      .channel(`activity-${entityType}-${entityId}`)
      .on(
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "activity_events", filter: `entity_id=eq.${entityId}` },
        () => qc.invalidateQueries({ queryKey: ["activity", entityType, entityId, limit] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [enabled, entityType, entityId, limit, qc]);

  return q;
}

export function useGlobalActivity(filters: {
  module?: CollabEntityType | "all";
  userId?: string | null;
  search?: string;
  limit?: number;
}) {
  const { profile } = useAuth();
  const enabled = !!profile?.company_id;
  return useQuery<ActivityEvent[]>({
    queryKey: ["global-activity", profile?.company_id, filters],
    enabled,
    queryFn: async () => {
      let q = db
        .from("activity_events")
        .select("*")
        .eq("company_id", profile!.company_id)
        .order("created_at", { ascending: false })
        .limit(filters.limit ?? 100);
      if (filters.module && filters.module !== "all") q = q.eq("entity_type", filters.module);
      if (filters.userId) q = q.eq("actor_id", filters.userId);
      if (filters.search) q = q.ilike("summary", `%${filters.search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ActivityEvent[];
    },
  });
}
