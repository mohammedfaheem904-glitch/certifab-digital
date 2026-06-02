// Centralized subscription plan definitions.
// Single source of truth for limits, features, and pricing copy.
// Stripe-ready: each plan has a `priceId` slot for future billing wiring.

export type PlanId = "free" | "professional" | "enterprise";

export type FeatureKey =
  | "qr_verification"
  | "advanced_reports"
  | "audit_export"
  | "pdf_branding"
  | "calibration_tracking"
  | "team_management"
  | "priority_support"
  | "api_access";

export type QuotaKey =
  | "users"
  | "projects"
  | "welds"
  | "procedures"
  | "storage_mb";

export type PlanDefinition = {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number | null; // null = custom / contact
  priceId: string | null; // future Stripe price id
  badgeTone: "muted" | "primary" | "gold";
  highlight?: boolean;
  limits: Record<QuotaKey, number>; // Infinity = unlimited
  features: Record<FeatureKey, boolean>;
  perks: string[];
};

const UNLIMITED = Number.POSITIVE_INFINITY;

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Try the platform with a small team.",
    priceMonthly: 0,
    priceId: null,
    badgeTone: "muted",
    limits: {
      users: 3,
      projects: 5,
      welds: 25,
      procedures: 2,
      storage_mb: 100,
    },
    features: {
      qr_verification: false,
      advanced_reports: false,
      audit_export: false,
      pdf_branding: false,
      calibration_tracking: false,
      team_management: false,
      priority_support: false,
      api_access: false,
    },
    perks: [
      "3 team members",
      "5 projects, 25 welds",
      "2 WPS procedures",
      "Core inspections & NCRs",
    ],
  },
  professional: {
    id: "professional",
    name: "Professional",
    tagline: "Production-ready QA/QC for growing teams.",
    priceMonthly: 199,
    priceId: null,
    badgeTone: "primary",
    highlight: true,
    limits: {
      users: 25,
      projects: 100,
      welds: 10_000,
      procedures: 200,
      storage_mb: 10_240,
    },
    features: {
      qr_verification: true,
      advanced_reports: true,
      audit_export: true,
      pdf_branding: true,
      calibration_tracking: true,
      team_management: true,
      priority_support: false,
      api_access: false,
    },
    perks: [
      "Up to 25 users",
      "QR weld & instrument verification",
      "Calibration tracking",
      "Full reports & PDF branding",
      "Audit log export",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Unlimited scale, advanced governance, API access.",
    priceMonthly: null,
    priceId: null,
    badgeTone: "gold",
    limits: {
      users: UNLIMITED,
      projects: UNLIMITED,
      welds: UNLIMITED,
      procedures: UNLIMITED,
      storage_mb: UNLIMITED,
    },
    features: {
      qr_verification: true,
      advanced_reports: true,
      audit_export: true,
      pdf_branding: true,
      calibration_tracking: true,
      team_management: true,
      priority_support: true,
      api_access: true,
    },
    perks: [
      "Unlimited users, projects & welds",
      "Priority support & SLA",
      "Advanced audit visibility",
      "API access (coming soon)",
      "SAML / SSO (on request)",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "professional", "enterprise"];

const ALIAS: Record<string, PlanId> = {
  trial: "free",
  starter: "free",
  pro: "professional",
  business: "professional",
  team: "professional",
  ent: "enterprise",
};

/** Normalize whatever string sits in `companies.plan` into a known PlanId. */
export function resolvePlan(raw: string | null | undefined): PlanDefinition {
  const k = (raw ?? "free").toLowerCase().trim();
  const id = (PLANS as any)[k] ? (k as PlanId) : ALIAS[k] ?? "free";
  return PLANS[id];
}

export const FEATURE_LABEL: Record<FeatureKey, string> = {
  qr_verification: "QR verification",
  advanced_reports: "Advanced reports",
  audit_export: "Audit log export",
  pdf_branding: "PDF branding",
  calibration_tracking: "Calibration tracking",
  team_management: "Team management",
  priority_support: "Priority support",
  api_access: "API access",
};

export const QUOTA_LABEL: Record<QuotaKey, string> = {
  users: "Team members",
  projects: "Projects",
  welds: "Welds",
  procedures: "WPS procedures",
  storage_mb: "Storage",
};

export function formatLimit(q: QuotaKey, n: number): string {
  if (!isFinite(n)) return "Unlimited";
  if (q === "storage_mb") return n >= 1024 ? `${(n / 1024).toFixed(0)} GB` : `${n} MB`;
  return n.toLocaleString();
}

export function isUnlimited(n: number) {
  return !isFinite(n);
}
