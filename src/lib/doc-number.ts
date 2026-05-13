// Generate a deterministic, traceable document number for engineering reports.
// Format: WY-{TYPE}-{YYYYMMDD}-{HHMM}
export function docNumber(type: string, d: Date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const hm = `${pad(d.getHours())}${pad(d.getMinutes())}`;
  return `WY-${type.toUpperCase()}-${ymd}-${hm}`;
}

export function shortHash(s: string, len = 6) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).toUpperCase().padStart(len, "0").slice(0, len);
}
