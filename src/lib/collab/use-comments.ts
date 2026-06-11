import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import type {
  AppRole,
  CollabEntityType,
  Comment,
  CommentWithMeta,
  Reaction,
} from "./types";
import { REACTIONS } from "./types";

const db = supabase as any;

type RawAttachment = {
  id: string;
  comment_id: string;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
};
type RawReaction = { comment_id: string; user_id: string; emoji: string };
type RawMention = { comment_id: string; mentioned_user_id: string | null; mentioned_role: AppRole | null };
type RawProfile = { id: string; display_name: string | null; avatar_url: string | null };

export function useComments(entityType: CollabEntityType, entityId: string | null | undefined) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const enabled = !!entityId && !!profile?.company_id;
  const myId = user?.id ?? null;

  const q = useQuery<CommentWithMeta[]>({
    queryKey: ["comments", entityType, entityId],
    enabled,
    queryFn: async () => {
      const { data: rows, error } = await db
        .from("comments")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const comments = (rows ?? []) as Comment[];
      if (!comments.length) return [];

      const ids = comments.map((c) => c.id);
      const authorIds = Array.from(new Set(comments.map((c) => c.author_id).filter(Boolean)));

      const [attRes, reactRes, mentionRes, profRes, roleRes] = await Promise.all([
        db.from("comment_attachments").select("*").in("comment_id", ids),
        db.from("comment_reactions").select("comment_id, user_id, emoji").in("comment_id", ids),
        db.from("mentions").select("comment_id, mentioned_user_id, mentioned_role").in("comment_id", ids),
        authorIds.length
          ? db.from("profiles").select("id, display_name, avatar_url").in("id", authorIds)
          : Promise.resolve({ data: [] }),
        authorIds.length
          ? db.from("user_roles").select("user_id, role").in("user_id", authorIds)
          : Promise.resolve({ data: [] }),
      ]);

      const attachments = (attRes.data ?? []) as RawAttachment[];
      const reactions = (reactRes.data ?? []) as RawReaction[];
      const mentions = (mentionRes.data ?? []) as RawMention[];
      const profiles = (profRes.data ?? []) as RawProfile[];
      const userRoles = (roleRes.data ?? []) as { user_id: string; role: AppRole }[];

      const profileById = new Map(profiles.map((p) => [p.id, p]));
      const roleByUser = new Map<string, AppRole>();
      for (const r of userRoles) if (!roleByUser.has(r.user_id)) roleByUser.set(r.user_id, r.role);

      const enriched: CommentWithMeta[] = comments.map((c) => {
        const cReacts = reactions.filter((r) => r.comment_id === c.id);
        const reactionsMap: Record<string, { count: number; mine: boolean }> = {};
        for (const r of cReacts) {
          const k = r.emoji;
          if (!reactionsMap[k]) reactionsMap[k] = { count: 0, mine: false };
          reactionsMap[k].count++;
          if (r.user_id === myId) reactionsMap[k].mine = true;
        }
        const reactionList = REACTIONS
          .map((e) => ({ emoji: e, count: reactionsMap[e]?.count ?? 0, mine: !!reactionsMap[e]?.mine }))
          .filter((r) => r.count > 0);

        const prof = profileById.get(c.author_id);
        return {
          ...c,
          author_name: prof?.display_name ?? null,
          author_avatar: prof?.avatar_url ?? null,
          author_role: roleByUser.get(c.author_id) ?? null,
          reactions: reactionList as { emoji: Reaction; count: number; mine: boolean }[],
          attachments: attachments.filter((a) => a.comment_id === c.id),
          mentions: mentions
            .filter((m) => m.comment_id === c.id)
            .map((m) => ({ user_id: m.mentioned_user_id, role: m.mentioned_role })),
          children: [],
        };
      });

      // Build tree
      const byId = new Map(enriched.map((c) => [c.id, c]));
      const roots: CommentWithMeta[] = [];
      for (const c of enriched) {
        if (c.parent_id && byId.has(c.parent_id)) {
          byId.get(c.parent_id)!.children.push(c);
        } else {
          roots.push(c);
        }
      }
      return roots;
    },
  });

  // Realtime
  useEffect(() => {
    if (!enabled) return;
    const topic = `collab-${entityType}-${entityId}-${crypto.randomUUID()}`;
    const ch = supabase
      .channel(topic)
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "comments", filter: `entity_id=eq.${entityId}` },
        () => qc.invalidateQueries({ queryKey: ["comments", entityType, entityId] }),
      )
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "comment_reactions" },
        () => qc.invalidateQueries({ queryKey: ["comments", entityType, entityId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [enabled, entityType, entityId, qc]);

  const flatCount = useMemo(() => {
    let n = 0;
    const walk = (list: CommentWithMeta[]) => list.forEach((c) => { n++; walk(c.children); });
    walk(q.data ?? []);
    return n;
  }, [q.data]);

  return { ...q, flatCount };
}

export async function postComment(args: {
  entityType: CollabEntityType;
  entityId: string;
  parentId?: string | null;
  bodyMd: string;
  bodyPlain: string;
  category?: string | null;
  mentionUserIds?: string[];
  mentionRoles?: AppRole[];
  attachments?: { path: string; name: string; mime: string | null; size: number | null }[];
}) {
  const { data, error } = await db.rpc("post_comment", {
    _entity_type: args.entityType,
    _entity_id: args.entityId,
    _parent_id: args.parentId ?? null,
    _body_md: args.bodyMd,
    _body_plain: args.bodyPlain,
    _category: args.category ?? null,
    _mention_user_ids: args.mentionUserIds ?? [],
    _mention_roles: args.mentionRoles ?? [],
    _attachments: args.attachments ?? [],
  });
  if (error) throw error;
  return data as string;
}

export async function toggleReaction(commentId: string, emoji: Reaction) {
  const { error } = await db.rpc("toggle_reaction", { _comment_id: commentId, _emoji: emoji });
  if (error) throw error;
}

export async function editComment(commentId: string, bodyMd: string, bodyPlain: string) {
  const { error } = await db
    .from("comments")
    .update({ body_md: bodyMd, body_plain: bodyPlain, edited_at: new Date().toISOString() })
    .eq("id", commentId);
  if (error) throw error;
}

export async function deleteComment(commentId: string) {
  const { error } = await db.from("comments").delete().eq("id", commentId);
  if (error) throw error;
}
