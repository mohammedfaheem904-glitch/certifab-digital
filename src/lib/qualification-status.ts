import { daysUntil } from "@/lib/format";

export type QualStatus = "Active" | "Expiring Soon" | "Expired" | "Suspended";

export function deriveQualStatus(row: {
  status?: string | null;
  expiry_date?: string | null;
  last_continuity_date?: string | null;
}): QualStatus {
  if (row.status === "Suspended") return "Suspended";
  const d = daysUntil(row.expiry_date ?? null);
  if (d == null) return (row.status as QualStatus) ?? "Active";
  if (d < 0) return "Expired";
  if (d <= 30) return "Expiring Soon";
  return "Active";
}

/** ASME IX continuity: max 6-month gap between welding activity. */
export function continuityBroken(lastActivity: string | null | undefined): boolean {
  if (!lastActivity) return false;
  const days = (Date.now() - new Date(lastActivity).getTime()) / 86_400_000;
  return days > 183;
}

export function continuityWarning(lastActivity: string | null | undefined): boolean {
  if (!lastActivity) return false;
  const days = (Date.now() - new Date(lastActivity).getTime()) / 86_400_000;
  return days > 150 && days <= 183;
}
