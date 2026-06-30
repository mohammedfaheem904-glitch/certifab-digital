import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  WELDER_PHOTO_ACCEPT,
  WELDER_PHOTO_MAX_BYTES,
  deleteWelderPhoto,
  invalidateWelderPhotoCache,
  resolveWelderPhotoUrl,
  uploadWelderPhoto,
} from "@/lib/welder-photo";

type Props = {
  qualId: string;
  companyId: string | null | undefined;
  value: string | null | undefined;
  welderName?: string | null;
  onChange: () => void; // parent should refetch
};

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function WelderPhotoUploader({ qualId, companyId, value, welderName, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!value) {
      setPreview(null);
      return;
    }
    resolveWelderPhotoUrl(value).then((u) => {
      if (!cancelled) setPreview(u);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  const handleFile = async (file: File) => {
    if (!companyId) {
      toast.error("Missing company context — cannot upload.");
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > WELDER_PHOTO_MAX_BYTES) {
      toast.error("Image is too large. Maximum 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const path = await uploadWelderPhoto(file, companyId, qualId);
      const oldPath = value && !/^https?:\/\//i.test(value) ? value : null;
      const { error } = await (supabase.from("qualifications") as any)
        .update({ welder_photo_url: path })
        .eq("id", qualId);
      if (error) {
        await deleteWelderPhoto(path);
        throw error;
      }
      if (oldPath) await deleteWelderPhoto(oldPath);
      invalidateWelderPhotoCache(path);
      onChange();
      toast.success("Welder photo updated.");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    setBusy(true);
    try {
      await deleteWelderPhoto(value);
      const { error } = await (supabase.from("qualifications") as any)
        .update({ welder_photo_url: null })
        .eq("id", qualId);
      if (error) throw error;
      onChange();
      toast.success("Welder photo removed.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not remove photo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="w-28 h-36 rounded border border-border/60 overflow-hidden bg-muted/40 grid place-items-center">
        {preview ? (
          <img src={preview} alt={welderName || "Welder photo"} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-[11px] text-muted-foreground px-2 flex flex-col items-center gap-1">
            <ImageIcon className="size-5 opacity-60" />
            Welder Photo
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Welder Photo</div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="size-4 me-1 animate-spin" /> : <Upload className="size-4 me-1" />}
            {value ? "Replace photo" : "Upload photo"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="outline" onClick={handleRemove} disabled={busy}>
              <Trash2 className="size-4 me-1" /> Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, or WEBP. Max 8 MB. Appears on the WPQ certificate.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={WELDER_PHOTO_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}
