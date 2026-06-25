import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/UserAvatar";
import { invalidateAvatarCache, resizeImageToSquareJpeg } from "@/lib/avatar";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB before resize

export function ProfilePictureUploader() {
  const { user, profile, refresh } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (!user) return;
    if (!ALLOWED.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image is too large. Maximum 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const blob = await resizeImageToSquareJpeg(file, 512, 0.85);
      const path = `${user.id}/avatar-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false, cacheControl: "3600" });
      if (upErr) throw upErr;

      const oldPath = profile?.avatar_url && !/^https?:\/\//i.test(profile.avatar_url) ? profile.avatar_url : null;

      const { error: dbErr } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
      if (dbErr) {
        await supabase.storage.from("avatars").remove([path]).catch(() => {});
        throw dbErr;
      }

      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]).catch(() => {});
        invalidateAvatarCache(oldPath);
      }
      await refresh();
      toast.success("Profile picture updated.");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!user || !profile?.avatar_url) return;
    setBusy(true);
    try {
      const path = profile.avatar_url;
      if (!/^https?:\/\//i.test(path)) {
        await supabase.storage.from("avatars").remove([path]).catch(() => {});
        invalidateAvatarCache(path);
      }
      const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
      if (error) throw error;
      await refresh();
      toast.success("Profile picture removed.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not remove picture.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <UserAvatar
        src={profile?.avatar_url}
        name={profile?.display_name}
        email={user?.email}
        className="size-20 text-lg"
        fallbackClassName="text-base"
      />
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="size-4 me-1 animate-spin" /> : <Upload className="size-4 me-1" />}
            {profile?.avatar_url ? "Change photo" : "Upload photo"}
          </Button>
          {profile?.avatar_url && (
            <Button type="button" size="sm" variant="outline" onClick={handleRemove} disabled={busy}>
              <Trash2 className="size-4 me-1" /> Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WEBP. Square crop, auto-resized to 512&times;512.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
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
