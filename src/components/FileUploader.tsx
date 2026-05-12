import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function FileUploader({
  procedureId,
  onUploaded,
}: {
  procedureId: string;
  onUploaded?: () => void;
}) {
  const { profile, user } = useAuth();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length || !profile?.company_id) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      const path = `${profile.company_id}/${procedureId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("procedure-files").upload(path, file, { upsert: false });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
      const { error: dbErr } = await supabase.from("procedure_attachments").insert({
        procedure_id: procedureId,
        company_id: profile.company_id,
        filename: file.name,
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id ?? null,
      });
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
      <Button variant="link" size="sm" disabled={busy} onClick={() => ref.current?.click()} className="px-1">
        {busy ? <Loader2 className="size-4 animate-spin" /> : "browse"}
      </Button>
      <input ref={ref} type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      <div className="text-[11px] mt-1">PDF, drawings, certificates — up to 50 MB each.</div>
    </div>
  );
}
