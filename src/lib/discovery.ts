// Discovery layer: feature manifest + localStorage-backed dismissal state.
// Drives the command palette, "What's new" sheet, NEW pills, and spotlight tips.

export type Feature = {
  id: string;
  title: string;
  blurb: string;
  to: string;
  /** Sidebar/page key that should show a NEW pill until the feature is seen. */
  surface: "dashboard" | "procedures" | "qualifications" | "welds" | "ncrs";
  /** ISO date used for "What's new" sorting. */
  addedAt: string;
  /** Keywords for the command palette. */
  keywords?: string[];
};

/** The single source of truth for newly-shipped features. Add new entries on top. */
export const FEATURES: Feature[] = [
  {
    id: "wps-variables-matrix",
    title: "WPS Variables Matrix",
    blurb:
      "Edit Essential / Non-Essential / Supplementary variables. Seed ASME IX QW-402…QW-410 defaults in one click.",
    to: "/app/procedures",
    surface: "procedures",
    addedAt: "2026-05-22",
    keywords: ["asme", "qw-402", "essential", "variables", "matrix"],
  },
  {
    id: "wps-guidance-strip",
    title: "WPS Operational Guidance",
    blurb:
      "Verdict banner, production usage card, parameter drift detection and compatible WPQ suggestions on every procedure.",
    to: "/app/procedures",
    surface: "procedures",
    addedAt: "2026-05-22",
    keywords: ["drift", "heat input", "guidance", "recommendations"],
  },
  {
    id: "wpq-guidance-strip",
    title: "Qualification Operational Impact",
    blurb:
      "Readiness score, expiry risk, replacement-welder suggestions and code-referenced explainability for every WPQ.",
    to: "/app/qualifications",
    surface: "qualifications",
    addedAt: "2026-05-22",
    keywords: ["readiness", "continuity", "expiry", "welder"],
  },
  {
    id: "weld-guidance-strip",
    title: "Weld Release Readiness",
    blurb:
      "Operational banner + one-click remediation dialogs above every weld. Tells you exactly what blocks release.",
    to: "/app/welds",
    surface: "welds",
    addedAt: "2026-05-22",
    keywords: ["release", "ncr", "block", "remediation"],
  },
  {
    id: "dashboard-operational",
    title: "Operational Dashboard",
    blurb:
      "Cross-module alert strip, workflow bottlenecks and live activity feed on the main dashboard.",
    to: "/app",
    surface: "dashboard",
    addedAt: "2026-05-22",
    keywords: ["alerts", "bottlenecks", "activity"],
  },
];

const KEY_SEEN = "cf:seen-features:v1";
const KEY_TIP = "cf:dismissed-tips:v1";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}
function writeSet(key: string, s: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(Array.from(s)));
}

export function getSeenFeatures(): Set<string> { return readSet(KEY_SEEN); }
export function markFeatureSeen(id: string) {
  const s = readSet(KEY_SEEN); s.add(id); writeSet(KEY_SEEN, s);
  window.dispatchEvent(new Event("cf:discovery-changed"));
}
export function markAllFeaturesSeen() {
  writeSet(KEY_SEEN, new Set(FEATURES.map((f) => f.id)));
  window.dispatchEvent(new Event("cf:discovery-changed"));
}
export function resetSeenFeatures() {
  writeSet(KEY_SEEN, new Set());
  window.dispatchEvent(new Event("cf:discovery-changed"));
}

export function isTipDismissed(id: string): boolean { return readSet(KEY_TIP).has(id); }
export function dismissTip(id: string) {
  const s = readSet(KEY_TIP); s.add(id); writeSet(KEY_TIP, s);
  window.dispatchEvent(new Event("cf:discovery-changed"));
}

export function unseenCount(): number {
  const seen = getSeenFeatures();
  return FEATURES.filter((f) => !seen.has(f.id)).length;
}
export function surfaceHasUnseen(surface: Feature["surface"]): boolean {
  const seen = getSeenFeatures();
  return FEATURES.some((f) => f.surface === surface && !seen.has(f.id));
}
