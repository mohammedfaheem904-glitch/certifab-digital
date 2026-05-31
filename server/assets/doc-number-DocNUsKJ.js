function shortHash(s, len = 6) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return Math.abs(h).toString(36).toUpperCase().padStart(len, "0").slice(0, len);
}
function docNumber(type, entityId, year = (/* @__PURE__ */ new Date()).getFullYear()) {
  const T = type.toUpperCase();
  if (entityId) return `WY-${T}-${year}-${shortHash(entityId, 6)}`;
  const d = /* @__PURE__ */ new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `WY-${T}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function fmtEngDate(input) {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
}
export {
  docNumber as d,
  fmtEngDate as f,
  shortHash as s
};
