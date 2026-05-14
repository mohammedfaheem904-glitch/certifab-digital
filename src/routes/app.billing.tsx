import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/PlanBadge";
import { UsageMeter } from "@/components/UsageMeter";
import { usePlan } from "@/lib/use-plan";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  PLANS,
  PLAN_ORDER,
  FEATURE_LABEL,
  type FeatureKey,
  type PlanId,
} from "@/lib/plans";
import { Check, X, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});

const FEATURE_KEYS: FeatureKey[] = [
  "qr_verification",
  "advanced_reports",
  "audit_export",
  "pdf_branding",
  "calibration_tracking",
  "team_management",
  "priority_support",
  "api_access",
];

function BillingPage() {
  const { plan } = usePlan();
  const { roles, profile } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const qc = useQueryClient();
  const [busy, setBusy] = useState<PlanId | null>(null);

  const switchPlan = async (target: PlanId) => {
    if (!isAdmin || !profile?.company_id) return;
    setBusy(target);
    const { error } = await supabase
      .from("companies")
      .update({ plan: target })
      .eq("id", profile.company_id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Switched to ${PLANS[target].name} plan.`);
    qc.invalidateQueries({ queryKey: ["plan-usage"] });
  };

  return (
    <ModulePage
      title="Billing & Plan"
      subtitle="Workspace subscription, usage limits and feature access."
    >
      <div className="p-5 space-y-6">
        {/* Current plan summary */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-wrap items-start gap-4">
          <div className="size-10 rounded-lg bg-primary/15 grid place-items-center text-primary">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Current plan</h2>
              <PlanBadge plan={plan} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{plan.tagline}</p>
          </div>
          <div className="text-end">
            <div className="text-2xl font-semibold tracking-tight">
              {plan.priceMonthly === null
                ? "Custom"
                : plan.priceMonthly === 0
                  ? "Free"
                  : `$${plan.priceMonthly}`}
              {plan.priceMonthly && plan.priceMonthly > 0 && (
                <span className="text-xs text-muted-foreground font-normal">/mo</span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Stripe billing — coming soon
            </p>
          </div>
        </div>

        {/* Usage */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Workspace usage</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <UsageMeter quota="users" />
            <UsageMeter quota="projects" />
            <UsageMeter quota="welds" />
            <UsageMeter quota="procedures" />
            <UsageMeter quota="storage_mb" />
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {PLAN_ORDER.map((id) => {
            const p = PLANS[id];
            const current = p.id === plan.id;
            return (
              <div
                key={id}
                className={cn(
                  "rounded-xl border p-5 flex flex-col",
                  current
                    ? "border-primary/40 bg-primary/5"
                    : p.highlight
                      ? "border-primary/30"
                      : "border-border bg-card",
                )}
              >
                <div className="flex items-center justify-between">
                  <PlanBadge plan={p} />
                  {p.highlight && !current && (
                    <span className="text-[10px] uppercase tracking-wide text-primary">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">
                  {p.priceMonthly === null
                    ? "Custom"
                    : p.priceMonthly === 0
                      ? "Free"
                      : `$${p.priceMonthly}`}
                  {p.priceMonthly && p.priceMonthly > 0 && (
                    <span className="text-sm text-muted-foreground font-normal">/mo</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
                <ul className="mt-4 space-y-1.5 text-sm flex-1">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <Check className="size-4 mt-0.5 text-primary shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {current ? (
                    <Button variant="outline" disabled className="w-full">
                      Current plan
                    </Button>
                  ) : isAdmin ? (
                    <Button
                      className="w-full"
                      onClick={() => switchPlan(id)}
                      disabled={busy !== null}
                    >
                      {busy === id ? "Switching…" : (
                        <>
                          <ArrowUpRight className="size-3.5 me-1" />
                          Switch to {p.name}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Contact admin
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Feature comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr>
                  <th className="text-start font-medium px-5 py-2.5">Feature</th>
                  {PLAN_ORDER.map((id) => (
                    <th key={id} className="text-center font-medium px-5 py-2.5">
                      {PLANS[id].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_KEYS.map((f) => (
                  <tr key={f} className="border-t border-border/60">
                    <td className="px-5 py-2.5">{FEATURE_LABEL[f]}</td>
                    {PLAN_ORDER.map((id) => (
                      <td key={id} className="px-5 py-2.5 text-center">
                        {PLANS[id].features[f] ? (
                          <Check className="size-4 text-success inline" />
                        ) : (
                          <X className="size-4 text-muted-foreground/50 inline" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!isAdmin && (
          <p className="text-xs text-muted-foreground">
            Only super admins can change the workspace plan.
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          Note: pricing is illustrative. Stripe billing will be wired up in the next
          release — switching plans currently updates the workspace tier instantly so you
          can validate access controls.
        </p>
      </div>
    </ModulePage>
  );
}
