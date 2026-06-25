import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, MessageSquare, Pencil, Trash2, Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ReactionsBar } from "./ReactionsBar";
import { CommentComposer } from "./CommentComposer";
import { MentionText } from "./MentionText";
import { deleteComment, editComment } from "@/lib/collab/use-comments";
import { parseMentions } from "@/lib/collab/mentions";
import { formatDistanceToNow } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollabEntityType, CommentWithMeta } from "@/lib/collab/types";

type Props = {
  comment: CommentWithMeta;
  entityType: CollabEntityType;
  entityId: string;
  depth: number;
  highlighted?: string | null;
};

export function CommentItem({ comment, entityType, entityId, depth, highlighted }: Props) {
  const { user, roles } = useAuth();
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.body_md);

  const isMe = user?.id === comment.author_id;
  const isAdmin = roles.includes("super_admin");
  const indent = Math.min(depth, 5);

  const handleEditSave = async () => {
    if (!draft.trim()) return;
    try {
      const { plain } = parseMentions(draft);
      await editComment(comment.id, draft, plain);
      setEditing(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment? Replies will also be removed.")) return;
    try { await deleteComment(comment.id); } catch (e: any) { toast.error(e?.message ?? "Could not delete"); }
  };

  const initials = (comment.author_name ?? "U").split(/[ .]/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
  const isHighlighted = highlighted === comment.id;

  return (
    <div id={`comment-${comment.id}`} className="flex gap-3" style={{ marginInlineStart: `${indent * 24}px` }}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-xs bg-accent text-accent-foreground">{initials || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div
          className={`rounded-lg border bg-card p-3 transition-colors ${
            isHighlighted ? "border-primary ring-2 ring-primary/30" : "border-border"
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-foreground">{comment.author_name ?? "Unknown"}</span>
            {comment.author_role && (
              <Badge variant="outline" className="text-[10px] py-0 h-4">
                {prettyRole(comment.author_role)}
              </Badge>
            )}
            <span className="text-muted-foreground">· {formatDistanceToNow(comment.created_at)}</span>
            {comment.edited_at && <span className="text-muted-foreground italic">(edited)</span>}
            {comment.category && (
              <Badge variant="secondary" className="text-[10px]">{comment.category}</Badge>
            )}
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <Textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setDraft(comment.body_md); }}>
                  <X className="size-3.5 me-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleEditSave}><Check className="size-3.5 me-1" /> Save</Button>
              </div>
            </div>
          ) : (
            <div className="mt-1.5">
              <MentionText body={comment.body_md} />
            </div>
          )}

          {comment.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {comment.attachments.map((a) => (
                <AttachmentChip key={a.id} path={a.storage_path} name={a.file_name} />
              ))}
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <ReactionsBar commentId={comment.id} reactions={comment.reactions} />
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setReplying((v) => !v)}>
              <MessageSquare className="size-3.5 me-1" /> Reply
            </Button>
            {isMe && !editing && (
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setEditing(true)}>
                <Pencil className="size-3.5" />
              </Button>
            )}
            {(isMe || isAdmin) && (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {replying && (
          <div className="mt-2">
            <CommentComposer
              entityType={entityType}
              entityId={entityId}
              parentId={comment.id}
              autoFocus
              placeholder="Write a reply…"
              onPosted={() => setReplying(false)}
              onCancel={() => setReplying(false)}
            />
          </div>
        )}

        {comment.children.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                entityType={entityType}
                entityId={entityId}
                depth={depth + 1}
                highlighted={highlighted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AttachmentChip({ path, name }: { path: string; name: string }) {
  const open = async () => {
    const { data, error } = await supabase.storage.from("record-attachments").createSignedUrl(path, 3600);
    if (error) return toast.error(error.message);
    window.open(data.signedUrl, "_blank");
  };
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/30 px-2 py-1 text-xs hover:bg-muted/60"
    >
      <Paperclip className="size-3" />
      <span className="truncate max-w-[200px]">{name}</span>
    </button>
  );
}

function prettyRole(r: string) {
  return r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
