import { d as daysUntil } from "./format-gAjFLL1B.js";
function deriveQualStatus(row) {
  if (row.status === "Suspended") return "Suspended";
  const d = daysUntil(row.expiry_date ?? null);
  if (d == null) return row.status ?? "Active";
  if (d < 0) return "Expired";
  if (d <= 30) return "Expiring Soon";
  return "Active";
}
function continuityBroken(lastActivity) {
  if (!lastActivity) return false;
  const days = (Date.now() - new Date(lastActivity).getTime()) / 864e5;
  return days > 183;
}
function continuityWarning(lastActivity) {
  if (!lastActivity) return false;
  const days = (Date.now() - new Date(lastActivity).getTime()) / 864e5;
  return days > 150 && days <= 183;
}
export {
  continuityWarning as a,
  continuityBroken as c,
  deriveQualStatus as d
};
