import { supabase } from "@/integrations/supabase/client";

// Stored in profiles.avatar_url. Two formats supported:
//   - storage path under the `avatars` bucket (preferred): "{user_id}/avatar-...jpg"
//   - absolute http(s) URL (legacy / external)
const SIGN_TTL = 60 * 60 * 24; // 24h
const cache = new Map<string, { url: string; exp: number }>();

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

export async function resolveAvatarUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (isHttpUrl(value)) return value;
  const now = Date.now();
  const hit = cache.get(value);
  if (hit && hit.exp > now + 60_000) return hit.url;
  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(value, SIGN_TTL);
  if (error || !data?.signedUrl) return null;
  cache.set(value, { url: data.signedUrl, exp: now + SIGN_TTL * 1000 });
  return data.signedUrl;
}

export function invalidateAvatarCache(value?: string | null) {
  if (value) cache.delete(value);
  else cache.clear();
}

// Resize & re-encode to a square JPEG, max edge `size`. Returns a Blob.
export async function resizeImageToSquareJpeg(file: File, size = 512, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const min = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - min) / 2;
  const sy = (bitmap.height - min) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, min, min, 0, 0, size, size);
  bitmap.close?.();
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/jpeg", quality),
  );
}
