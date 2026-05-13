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
  /** Override default 25 MB per-file cap. */
  maxSizeMb?: number;
};

const DEFAULT_MAX_MB = 25;

// MIME allow-list — engineering documents, drawings, certificates, photos.
const ALLOWED_MIME = new Set<string>([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/dxf",
  "image/vnd.dxf",
  "application/octet-stream", // fallback for DXF/DWG; size-validated
]);

const FORBIDDEN_EXT = /\.(exe|bat|cmd|sh|js|mjs|ts|com|msi|dll|scr|jar|ps1|vbs|html?)$/i;

function sanitizeName(name: string) {
  return name
    .replace(/[\\/]/g, "_")
    .replace(/[^\w.\-() ]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 180);
}

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
  maxSizeMb = DEFAULT_MAX_MB,
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
  const maxBytes = maxSizeMb * 1024 * 1024;

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length || !profile?.company_id || !id) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      if (file.size > maxBytes) {
        toast.error(`${file.name}: exceeds ${maxSizeMb} MB limit.`);
        continue;
      }
      if (FORBIDDEN_EXT.test(file.name)) {
        toast.error(`${file.name}: file type not permitted.`);
        continue;
      }
      if (file.type && !ALLOWED_MIME.has(file.type)) {
        toast.error(`${file.name}: ${file.type || "unknown type"} not permitted.`);
        continue;
      }
      const safeName = sanitizeName(file.name);
      const path = `${profile.company_id}/${sub}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (upErr) {
        toast.error(`${file.name}: ${upErr.message}`);
        continue;
      }
      const row: Record<string, any> = {
        company_id: profile.company_id,
        filename: safeName,
        storage_path: path,
        mime_type: file.type || null,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null,
      };
      row[idCol] = id;
      const { error: dbErr } = await (supabase.from(table as any) as any).insert(row);
      if (dbErr) {
        // Attempt to roll back the orphaned file so we don't leak storage.
        await supabase.storage.from(bucket).remove([path]).catch(() => {});
        toast.error(dbErr.message);
        continue;
      }
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
