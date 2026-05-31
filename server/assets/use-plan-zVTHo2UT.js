import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, j as cn, b as useAuth, s as supabase } from "./router-DGN8uIPq.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      key: "nnexq3"
    }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" }]
];
const Leaf = createLucideIcon("leaf", __iconNode);
const TONE = {
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/15 text-primary border-primary/30",
  gold: "bg-warning/15 text-warning border-warning/30"
};
const ICON = {
  free: Leaf,
  professional: Sparkles,
  enterprise: Crown
};
function PlanBadge({
  plan,
  className,
  size = "sm",
  internal = false
}) {
  if (internal) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: cn(
          "inline-flex items-center gap-1.5 rounded-full border font-medium border-warning/40 bg-warning/15 text-warning",
          size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
          className
        ),
        title: "Internal owner workspace — plan limits bypassed",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: size === "xs" ? "size-2.5" : "size-3" }),
          "Internal · Owner"
        ]
      }
    );
  }
  const Icon = ICON[plan.id] ?? Sparkles;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        TONE[plan.badgeTone],
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className
      ),
      title: `${plan.name} plan`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: size === "xs" ? "size-2.5" : "size-3" }),
        plan.name
      ]
    }
  );
}
const UNLIMITED = Number.POSITIVE_INFINITY;
const PLANS = {
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
      storage_mb: 100
    },
    features: {
      qr_verification: false,
      advanced_reports: false,
      audit_export: false,
      pdf_branding: false,
      calibration_tracking: false,
      team_management: false,
      priority_support: false,
      api_access: false
    },
    perks: [
      "3 team members",
      "5 projects, 25 welds",
      "2 WPS procedures",
      "Core inspections & NCRs"
    ]
  },
  professional: {
    id: "professional",
    name: "Professional",
    tagline: "Production-ready QA/QC for growing teams.",
    priceMonthly: 49,
    priceId: null,
    badgeTone: "primary",
    highlight: true,
    limits: {
      users: 25,
      projects: 100,
      welds: 1e4,
      procedures: 200,
      storage_mb: 10240
    },
    features: {
      qr_verification: true,
      advanced_reports: true,
      audit_export: true,
      pdf_branding: true,
      calibration_tracking: true,
      team_management: true,
      priority_support: false,
      api_access: false
    },
    perks: [
      "Up to 25 users",
      "QR weld & instrument verification",
      "Calibration tracking",
      "Full reports & PDF branding",
      "Audit log export"
    ]
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
      storage_mb: UNLIMITED
    },
    features: {
      qr_verification: true,
      advanced_reports: true,
      audit_export: true,
      pdf_branding: true,
      calibration_tracking: true,
      team_management: true,
      priority_support: true,
      api_access: true
    },
    perks: [
      "Unlimited users, projects & welds",
      "Priority support & SLA",
      "Advanced audit visibility",
      "API access (coming soon)",
      "SAML / SSO (on request)"
    ]
  }
};
const PLAN_ORDER = ["free", "professional", "enterprise"];
const ALIAS = {
  trial: "free",
  starter: "free",
  pro: "professional",
  business: "professional",
  team: "professional",
  ent: "enterprise"
};
function resolvePlan(raw) {
  const k = (raw ?? "free").toLowerCase().trim();
  const id = PLANS[k] ? k : ALIAS[k] ?? "free";
  return PLANS[id];
}
const FEATURE_LABEL = {
  qr_verification: "QR verification",
  advanced_reports: "Advanced reports",
  audit_export: "Audit log export",
  pdf_branding: "PDF branding",
  calibration_tracking: "Calibration tracking",
  team_management: "Team management",
  priority_support: "Priority support",
  api_access: "API access"
};
const QUOTA_LABEL = {
  users: "Team members",
  projects: "Projects",
  welds: "Welds",
  procedures: "WPS procedures",
  storage_mb: "Storage"
};
function formatLimit(q, n) {
  if (!isFinite(n)) return "Unlimited";
  if (q === "storage_mb") return n >= 1024 ? `${(n / 1024).toFixed(0)} GB` : `${n} MB`;
  return n.toLocaleString();
}
function isUnlimited(n) {
  return !isFinite(n);
}
const Ctx = reactExports.createContext(null);
const ZERO_USAGE = {
  users: 0,
  projects: 0,
  welds: 0,
  procedures: 0,
  storage_mb: 0
};
function PlanProvider({ children }) {
  const { profile } = useAuth();
  const cid = profile?.company_id ?? null;
  const { data, isLoading } = useQuery({
    queryKey: ["plan-usage", cid],
    enabled: !!cid,
    staleTime: 3e4,
    queryFn: async () => {
      const [{ data: company }, ...counts] = await Promise.all([
        supabase.from("companies").select("plan, is_internal").eq("id", cid).maybeSingle(),
        countRows("profiles", cid),
        countRows("projects", cid),
        countRows("welds", cid),
        countRows("procedures", cid),
        sumStorageMb(cid)
      ]);
      const [users, projects, welds, procedures, storage_mb] = counts;
      const isInternal = !!company?.is_internal;
      const plan = isInternal ? PLANS.enterprise : resolvePlan(company?.plan);
      return {
        plan,
        isInternal,
        usage: { users, projects, welds, procedures, storage_mb }
      };
    }
  });
  const value = reactExports.useMemo(() => {
    const plan = data?.plan ?? PLANS.free;
    const usage = data?.usage ?? ZERO_USAGE;
    const isInternal = !!data?.isInternal;
    const hasFeature = (f) => isInternal || !!plan.features[f];
    const remaining = (q) => isInternal ? Number.POSITIVE_INFINITY : Math.max(0, plan.limits[q] - usage[q]);
    const percentUsed = (q) => {
      if (isInternal) return 0;
      const lim = plan.limits[q];
      if (!isFinite(lim)) return 0;
      return Math.min(100, Math.round((usage[q] ?? 0) / lim * 100));
    };
    const isOverQuota = (q) => !isInternal && isFinite(plan.limits[q]) && (usage[q] ?? 0) >= plan.limits[q];
    const reasonForFeature = (_f) => `Your ${plan.name} plan doesn't include this feature. Upgrade to unlock it.`;
    const reasonForQuota = (q) => `You've reached the ${plan.name} plan limit for ${q.replace("_", " ")}. Upgrade for higher capacity.`;
    return {
      plan,
      usage,
      loading: isLoading,
      isInternal,
      hasFeature,
      remaining,
      percentUsed,
      isOverQuota,
      reasonForFeature,
      reasonForQuota
    };
  }, [data, isLoading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function usePlan() {
  const v = reactExports.useContext(Ctx);
  if (!v) {
    return {
      plan: PLANS.free,
      usage: ZERO_USAGE,
      loading: true,
      isInternal: false,
      hasFeature: () => false,
      remaining: () => 0,
      percentUsed: () => 0,
      isOverQuota: () => false,
      reasonForFeature: () => "Upgrade to unlock this feature.",
      reasonForQuota: () => "Upgrade for higher capacity."
    };
  }
  return v;
}
async function countRows(table, cid) {
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true }).eq("company_id", cid);
  return count ?? 0;
}
async function sumStorageMb(cid) {
  const tables = ["procedure_attachments", "weld_attachments", "ncr_attachments"];
  let bytes = 0;
  for (const t of tables) {
    const { data } = await supabase.from(t).select("size_bytes").eq("company_id", cid);
    bytes += (data ?? []).reduce((a, r) => a + (r.size_bytes ?? 0), 0);
  }
  return Math.round(bytes / (1024 * 1024));
}
export {
  FEATURE_LABEL as F,
  PlanBadge as P,
  QUOTA_LABEL as Q,
  PlanProvider as a,
  PLAN_ORDER as b,
  PLANS as c,
  formatLimit as f,
  isUnlimited as i,
  usePlan as u
};
