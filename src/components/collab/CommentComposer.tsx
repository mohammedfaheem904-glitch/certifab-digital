import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { postComment } from "@/lib/collab/use-comments";
import { useCompanyUsers } from "@/lib/collab/use-mention-suggestions";
import { parseMentions } from "@/lib/collab/mentions";
import { ROLE_GROUPS, type CollabEntityType } from "@/lib/collab/types";
import { toast } from "sonner";

type Props = {
  entityType: CollabEntityType;
  entityId: string;
  parentId?: string | null;
  category?: string | null;
  placeholder?: string;
  autoFocus?: boolean;
  onPosted?: () => void;
  onCancel?: () => void;
};

type PendingAttachment = {
  id: string;
  path: string;
  name: string;
  mime: string | null;
  size: number;
};

export function CommentComposer(props: Props) {
  const { profile } = useAuth();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionAnchor, setMentionAnchor] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: users } = useCompanyUsers();

  useEffect(() => { if (props.autoFocus) ref.current?.focus(); }, [props.autoFocus]);

  const handleChange = (val: string) => {
    setBody(val);
    const pos = ref.current?.selectionStart ?? val.length;
    // Find @ token under cursor
    const upTo = val.slice(0, pos);
    const match = upTo.match(/@([\w\-]*)$/);
    if (match) {
      setMentionAnchor(pos - match[0].length);
      setMentionQuery(match[1].toLowerCase());
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (kind: "user" | "role", id: string, label: string) => {
    const before = body.slice(0, mentionAnchor);
    const after = body.slice(ref.current?.selectionStart ?? body.length);
    const token = `@[${label}](${kind}:${id}) `;
    const next = before + token + after;
    setBody(next);
    setMentionQuery(null);
    requestAnimationFrame(() => {
      ref.current?.focus();
      const p = before.length + token.length;
      ref.current?.setSelectionRange(p, p);
    });
  };

  const onPickFiles = async (files: FileList | null) => {
    if (!files || !files.length || !profile?.company_id) return;
    setBusy(true);
    try {
      const next: PendingAttachment[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 25 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 25 MB`);
          continue;
        }
        const id = crypto.randomUUID();
        const path = `${profile.company_id}/${props.entityType}/${props.entityId}/${id}-${sanitize(file.name)}`;
        const { error } = await supabase.storage
          .from("record-attachments")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`${file.name}: ${error.message}`);
          continue;
        }
        next.push({ id, path, name: file.name, mime: file.type || null, size: file.size });
      }
      setAttachments((a) => [...a, ...next]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAttachment = async (a: PendingAttachment) => {
    await supabase.storage.from("record-attachments").remove([a.path]);
    setAttachments((list) => list.filter((x) => x.id !== a.id));
  };

  const submit = async () => {
    if (!body.trim()) return;
    setBusy(true);
    try {
      const { userIds, roles, plain } = parseMentions(body);
      await postComment({
        entityType: props.entityType,
        entityId: props.entityId,
        parentId: props.parentId ?? null,
        bodyMd: body,
        bodyPlain: plain,
        category: props.category ?? null,
        mentionUserIds: userIds,
        mentionRoles: roles,
        attachments: attachments.map((a) => ({ path: a.path, name: a.name, mime: a.mime, size: a.size })),
      });
      setBody("");
      setAttachments([]);
      props.onPosted?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to post");
    } finally {
      setBusy(false);
    }
  };

  const filteredUsers = (users ?? []).filter((u) =>
    mentionQuery === null || (u.display_name ?? "").toLowerCase().includes(mentionQuery),
  ).slice(0, 6);
  const filteredRoles = ROLE_GROUPS.filter((g) =>
    mentionQuery === null || g.token.slice(1).toLowerCase().includes(mentionQuery) || g.label.toLowerCase().includes(mentionQuery),
  );

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="relative">
        <Textarea
          ref={ref}
          rows={props.parentId ? 2 : 3}
          value={body}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={props.placeholder ?? "Write a comment… use @ to mention people or teams"}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); submit(); }
            if (e.key === "Escape" && mentionQuery !== null) setMentionQuery(null);
          }}
        />
        {mentionQuery !== null && (filteredUsers.length + filteredRoles.length > 0) && (
          <div className="absolute z-20 left-2 bottom-full mb-1 w-72 rounded-md border border-border bg-popover shadow-md p-1 max-h-72 overflow-y-auto">
            {filteredRoles.length > 0 && (
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">Teams</div>
            )}
            {filteredRoles.map((g) => (
              <button
                key={g.role}
                type="button"
                onClick={() => insertMention("role", g.role, g.token.slice(1))}
                className="w-full text-start px-2 py-1.5 rounded hover:bg-accent text-sm flex items-center justify-between"
              >
                <span className="font-medium">{g.token}</span>
                <span className="text-xs text-muted-foreground">{g.label}</span>
              </button>
            ))}
            {filteredUsers.length > 0 && (
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">People</div>
            )}
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => insertMention("user", u.id, u.display_name ?? "User")}
                className="w-full text-start px-2 py-1.5 rounded hover:bg-accent text-sm"
              >
                @{u.display_name ?? "User"}
              </button>
            ))}
          </div>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attachments.map((a) => (
            <div key={a.id} className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/30 px-2 py-1 text-xs">
              <Paperclip className="size-3" />
              <span className="truncate max-w-[180px]">{a.name}</span>
              <button onClick={() => removeAttachment(a)} className="text-muted-foreground hover:text-destructive">
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onPickFiles(e.target.files)}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={busy}>
          <Paperclip className="size-4 me-1" /> Attach
        </Button>
        <div className="flex items-center gap-2">
          {props.onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={props.onCancel}>Cancel</Button>
          )}
          <Button type="button" size="sm" onClick={submit} disabled={busy || !body.trim()}>
            {busy ? <Loader2 className="size-4 me-1 animate-spin" /> : <Send className="size-4 me-1" />}
            {props.parentId ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80);
}
