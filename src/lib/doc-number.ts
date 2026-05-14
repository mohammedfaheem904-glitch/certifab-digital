// Deterministic, traceable engineering document numbers.
// Stable form (preferred): WY-{TYPE}-{YYYY}-{SHORTHASH}  → same record always produces same number.
// Fallback (no entityId): WY-{TYPE}-{YYYYMMDD}-{HHMM}.

export function shortHash(s: string, len = 6) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).toUpperCase().padStart(len, "0").slice(0, len);
}

export function docNumber(type: string, entityId?: string, year: number = new Date().getFullYear()) {
  const T = type.toUpperCase();
  if (entityId) return `WY-${T}-${year}-${shortHash(entityId, 6)}`;
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `WY-${T}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

/** Format an ISO date for engineering documents (DD-MMM-YYYY, locale-independent). */
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
export function fmtEngDate(input?: string | Date | null) {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}
