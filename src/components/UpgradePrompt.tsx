import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Lock, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { usePlan } from "@/lib/use-plan";
import { PlanBadge } from "./PlanBadge";

/** Slim banner — drop at the top of a page when the workspace is approaching a limit. */
export function UpgradeBanner({
  title,
  message,
  className,
}: {
  title?: string;
  message: string;
  className?: string;
}) {
  const { plan } = usePlan();
  if (plan.id === "enterprise") return null;
  return (
    <div
      className={cn(
        "rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-wrap items-start gap-3",
        className,
      )}
    >
      <div className="size-9 rounded-lg bg-primary/15 grid place-items-center text-primary shrink-0">
        <Sparkles className="size-4" />
      </div>
      <div className="flex-1 min-w-[200px]">
        <div className="text-sm font-medium">{title ?? "Time to upgrade"}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{message}</div>
      </div>
      <UpgradeButton size="sm" />
    </div>
  );
}

/** A "locked" wrapper — renders children normally if the gate passes,
 *  or a paywall card if it doesn't. Used for whole sections. */
export function Gated({
  allowed,
  reason,
  title = "Premium feature",
  children,
}: {
  allowed: boolean;
  reason: string;
  title?: string;
  children: ReactNode;
}) {
  if (allowed) return <>{children}</>;
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <div className="size-10 rounded-full bg-muted grid place-items-center mx-auto mb-3">
        <Lock className="size-4 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium">{title}</div>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{reason}</p>
      <UpgradeButton size="sm" className="mt-4" />
    </div>
  );
}

/** Button that opens the comparison dialog. */
export function UpgradeButton({
  size = "sm",
  className,
  children,
}: {
  size?: "sm" | "default";
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size={size} onClick={() => setOpen(true)} className={className}>
        {children ?? (
          <>
            <ArrowUpRight className="size-3.5 me-1" /> Upgrade plan
          </>
        )}
      </Button>
      <UpgradeDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

export function UpgradeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { plan } = usePlan();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Upgrade your workspace
            <PlanBadge plan={plan} size="xs" />
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-3 py-2">
          {PLAN_ORDER.map((id) => {
            const p = PLANS[id];
            const current = p.id === plan.id;
            return (
              <div
                key={id}
                className={cn(
                  "rounded-xl border p-4 flex flex-col",
                  current
                    ? "border-primary/40 bg-primary/5"
                    : p.highlight
                      ? "border-primary/30"
                      : "border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  <PlanBadge plan={p} />
                  {current && (
                    <span className="text-[10px] text-muted-foreground">Current</span>
                  )}
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">
                  {p.priceMonthly === null
                    ? "Custom"
                    : p.priceMonthly === 0
                      ? "Free"
                      : `$${p.priceMonthly}`}
                  {p.priceMonthly && p.priceMonthly > 0 && (
                    <span className="text-xs text-muted-foreground font-normal">/mo</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.tagline}</p>
                <ul className="mt-3 space-y-1.5 text-xs flex-1">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <Check className="size-3.5 mt-0.5 text-primary shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <DialogFooter className="flex-wrap gap-2">
          <p className="text-[11px] text-muted-foreground flex-1 min-w-[200px]">
            Billing isn't connected yet — talk to your account owner to change plans, or open
            workspace settings to adjust manually.
          </p>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <Link to="/app/billing" onClick={() => onOpenChange(false)}>
              Manage billing
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
