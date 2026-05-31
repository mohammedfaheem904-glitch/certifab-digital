const FEATURES = [
  {
    id: "wps-variables-matrix",
    title: "WPS Variables Matrix",
    blurb: "Edit Essential / Non-Essential / Supplementary variables. Seed ASME IX QW-402…QW-410 defaults in one click.",
    to: "/app/procedures",
    surface: "procedures",
    addedAt: "2026-05-22",
    keywords: ["asme", "qw-402", "essential", "variables", "matrix"]
  },
  {
    id: "wps-guidance-strip",
    title: "WPS Operational Guidance",
    blurb: "Verdict banner, production usage card, parameter drift detection and compatible WPQ suggestions on every procedure.",
    to: "/app/procedures",
    surface: "procedures",
    addedAt: "2026-05-22",
    keywords: ["drift", "heat input", "guidance", "recommendations"]
  },
  {
    id: "wpq-guidance-strip",
    title: "Qualification Operational Impact",
    blurb: "Readiness score, expiry risk, replacement-welder suggestions and code-referenced explainability for every WPQ.",
    to: "/app/qualifications",
    surface: "qualifications",
    addedAt: "2026-05-22",
    keywords: ["readiness", "continuity", "expiry", "welder"]
  },
  {
    id: "weld-guidance-strip",
    title: "Weld Release Readiness",
    blurb: "Operational banner + one-click remediation dialogs above every weld. Tells you exactly what blocks release.",
    to: "/app/welds",
    surface: "welds",
    addedAt: "2026-05-22",
    keywords: ["release", "ncr", "block", "remediation"]
  },
  {
    id: "dashboard-operational",
    title: "Operational Dashboard",
    blurb: "Cross-module alert strip, workflow bottlenecks and live activity feed on the main dashboard.",
    to: "/app",
    surface: "dashboard",
    addedAt: "2026-05-22",
    keywords: ["alerts", "bottlenecks", "activity"]
  }
];
const KEY_SEEN = "cf:seen-features:v1";
const KEY_TIP = "cf:dismissed-tips:v1";
function readSet(key) {
  if (typeof window === "undefined") return /* @__PURE__ */ new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? "[]"));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function writeSet(key, s) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(Array.from(s)));
}
function getSeenFeatures() {
  return readSet(KEY_SEEN);
}
function markFeatureSeen(id) {
  const s = readSet(KEY_SEEN);
  s.add(id);
  writeSet(KEY_SEEN, s);
  window.dispatchEvent(new Event("cf:discovery-changed"));
}
function markAllFeaturesSeen() {
  writeSet(KEY_SEEN, new Set(FEATURES.map((f) => f.id)));
  window.dispatchEvent(new Event("cf:discovery-changed"));
}
function isTipDismissed(id) {
  return readSet(KEY_TIP).has(id);
}
function dismissTip(id) {
  const s = readSet(KEY_TIP);
  s.add(id);
  writeSet(KEY_TIP, s);
  window.dispatchEvent(new Event("cf:discovery-changed"));
}
function unseenCount() {
  const seen = getSeenFeatures();
  return FEATURES.filter((f) => !seen.has(f.id)).length;
}
function surfaceHasUnseen(surface) {
  const seen = getSeenFeatures();
  return FEATURES.some((f) => f.surface === surface && !seen.has(f.id));
}
export {
  FEATURES as F,
  markAllFeaturesSeen as a,
  dismissTip as d,
  getSeenFeatures as g,
  isTipDismissed as i,
  markFeatureSeen as m,
  surfaceHasUnseen as s,
  unseenCount as u
};
