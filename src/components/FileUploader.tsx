import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type Props = {
  onUploaded?: () => void;
  /** Legacy: procedure attachments. */
  procedureId?: string;
  /** Generic mode: bucket + folder under {company_id}/{folder}/ + table to record metadata. */
  bucket?: string;
  folder?: string;
  table?: string;
  recordIdColumn?: string;
  recordId?: string;
  accept?: string;
  hint?: string;
};

export function FileUploader({
  procedureId,
  onUploaded,
  bucket: bucketProp,
  folder,
  table: tableProp,
  recordIdColumn,
  recordId,
  accept,
  hint,
}: Props) {
  const { profile, user } = useAuth();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  // Resolve mode (legacy vs generic)
  const bucket = bucketProp ?? "procedure-files";
  const table = tableProp ?? "procedure_attachments";
  const idCol = recordIdColumn ?? "procedure_id";
  const id = recordId ?? procedureId;
  const sub = folder ?? id ?? "misc";

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length || !profile?.company_id || !id) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      const path = `${profile.company_id}/${sub}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
      const row: Record<string, any> = {
        company_id: profile.company_id,
        filename: file.name,
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null,
      };
      row[idCol] = id;
      const { error: dbErr } = await (supabase.from(table as any) as any).insert(row);
      if (dbErr) { toast.error(dbErr.message); continue; }
    }
    setBusy(false);
    if (ref.current) ref.current.value = "";
    onUploaded?.();
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
      className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground bg-muted/20 hover:bg-muted/30 transition"
    >
      <Upload className="size-5 mx-auto mb-2 text-muted-foreground" />
      Drag & drop files here, or
      <Button type="button" variant="link" size="sm" disabled={busy} onClick={() => ref.current?.click()} className="px-1">
        {busy ? <Loader2 className="size-4 animate-spin" /> : "browse"}
      </Button>
      <input ref={ref} type="file" multiple accept={accept} className="hidden" onChange={(e) => onFiles(e.target.files)} />
      <div className="text-[11px] mt-1">{hint ?? "PDF, drawings, certificates — up to 50 MB each."}</div>
    </div>
  );
}
