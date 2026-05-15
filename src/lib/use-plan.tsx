import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  PLANS,
  resolvePlan,
  type FeatureKey,
  type PlanDefinition,
  type QuotaKey,
} from "@/lib/plans";

type Usage = Record<QuotaKey, number>;

type PlanState = {
  plan: PlanDefinition;
  usage: Usage;
  loading: boolean;
  /** True if the company plan unlocks this feature. */
  hasFeature: (f: FeatureKey) => boolean;
  /** Returns remaining capacity for a quota. Infinity = unlimited. */
  remaining: (q: QuotaKey) => number;
  /** Percent used (0-100, capped). */
  percentUsed: (q: QuotaKey) => number;
  /** True when the next item of that type would exceed the plan limit. */
  isOverQuota: (q: QuotaKey) => boolean;
  /** Build a friendly reason string for paywalled UI. */
  reasonForFeature: (f: FeatureKey) => string;
  reasonForQuota: (q: QuotaKey) => string;
};

const Ctx = createContext<PlanState | null>(null);

const ZERO_USAGE: Usage = {
  users: 0,
  projects: 0,
  welds: 0,
  procedures: 0,
  storage_mb: 0,
};

export function PlanProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const cid = profile?.company_id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["plan-usage", cid],
    enabled: !!cid,
    staleTime: 30_000,
    queryFn: async () => {
      const [{ data: company }, ...counts] = await Promise.all([
        supabase
          .from("companies")
          .select("plan, is_internal")
          .eq("id", cid!)
          .maybeSingle(),
        countRows("profiles", cid!),
        countRows("projects", cid!),
        countRows("welds", cid!),
        countRows("procedures", cid!),
        sumStorageMb(cid!),
      ]);
      const [users, projects, welds, procedures, storage_mb] = counts as number[];
      // Internal/owner workspaces always get full Enterprise access with no limits.
      const isInternal = !!(company as any)?.is_internal;
      const plan = isInternal ? PLANS.enterprise : resolvePlan(company?.plan);
      return {
        plan,
        isInternal,
        usage: { users, projects, welds, procedures, storage_mb } as Usage,
      };
    },
  });

  const value = useMemo<PlanState>(() => {
    const plan = data?.plan ?? PLANS.free;
    const usage = data?.usage ?? ZERO_USAGE;
    const hasFeature = (f: FeatureKey) => !!plan.features[f];
    const remaining = (q: QuotaKey) => Math.max(0, plan.limits[q] - usage[q]);
    const percentUsed = (q: QuotaKey) => {
      const lim = plan.limits[q];
      if (!isFinite(lim)) return 0;
      return Math.min(100, Math.round(((usage[q] ?? 0) / lim) * 100));
    };
    const isOverQuota = (q: QuotaKey) =>
      isFinite(plan.limits[q]) && (usage[q] ?? 0) >= plan.limits[q];
    const reasonForFeature = (f: FeatureKey) =>
      `Your ${plan.name} plan doesn't include this feature. Upgrade to unlock it.`;
    const reasonForQuota = (q: QuotaKey) =>
      `You've reached the ${plan.name} plan limit for ${q.replace("_", " ")}. Upgrade for higher capacity.`;
    return {
      plan,
      usage,
      loading: isLoading,
      hasFeature,
      remaining,
      percentUsed,
      isOverQuota,
      reasonForFeature,
      reasonForQuota,
    };
  }, [data, isLoading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlan(): PlanState {
  const v = useContext(Ctx);
  if (!v) {
    // Safe fallback — treat as free until provider mounts.
    return {
      plan: PLANS.free,
      usage: ZERO_USAGE,
      loading: true,
      hasFeature: () => false,
      remaining: () => 0,
      percentUsed: () => 0,
      isOverQuota: () => false,
      reasonForFeature: () => "Upgrade to unlock this feature.",
      reasonForQuota: () => "Upgrade for higher capacity.",
    };
  }
  return v;
}

async function countRows(
  table: "profiles" | "projects" | "welds" | "procedures",
  cid: string,
): Promise<number> {
  const { count } = await supabase
    .from(table as any)
    .select("id", { count: "exact", head: true })
    .eq("company_id", cid);
  return count ?? 0;
}

async function sumStorageMb(cid: string): Promise<number> {
  const tables = ["procedure_attachments", "weld_attachments", "ncr_attachments"] as const;
  let bytes = 0;
  for (const t of tables) {
    const { data } = await supabase
      .from(t as any)
      .select("size_bytes")
      .eq("company_id", cid);
    bytes += (data ?? []).reduce((a: number, r: any) => a + (r.size_bytes ?? 0), 0);
  }
  return Math.round(bytes / (1024 * 1024));
}
