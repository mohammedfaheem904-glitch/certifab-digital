import { supabase } from "@/integrations/supabase/client";

const BUCKET = "welder-photos";
const SIGN_TTL = 60 * 60 * 24; // 24h
const cache = new Map<string, { url: string; exp: number }>();

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

export async function resolveWelderPhotoUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (isHttpUrl(value)) return value;
  const now = Date.now();
  const hit = cache.get(value);
  if (hit && hit.exp > now + 60_000) return hit.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(value, SIGN_TTL);
  if (error || !data?.signedUrl) return null;
  cache.set(value, { url: data.signedUrl, exp: now + SIGN_TTL * 1000 });
  return data.signedUrl;
}

export function invalidateWelderPhotoCache(value?: string | null) {
  if (value) cache.delete(value);
  else cache.clear();
}

export async function uploadWelderPhoto(
  file: File,
  companyId: string,
  qualId: string,
): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${companyId}/${qualId}/photo-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
    cacheControl: "3600",
  });
  if (error) throw error;
  return path;
}

export async function deleteWelderPhoto(path: string | null | undefined) {
  if (!path || isHttpUrl(path)) return;
  await supabase.storage.from(BUCKET).remove([path]).catch(() => {});
  invalidateWelderPhotoCache(path);
}

export const WELDER_PHOTO_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
export const WELDER_PHOTO_MAX_BYTES = 8 * 1024 * 1024;
