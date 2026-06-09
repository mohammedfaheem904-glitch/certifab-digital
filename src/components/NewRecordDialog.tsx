import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePlan } from "@/lib/use-plan";
import { UpgradeButton } from "@/components/UpgradePrompt";
import type { QuotaKey } from "@/lib/plans";

export function NewRecordDialog({
  table,
  title,
  trigger,
  defaults = {},
  quota,
  children,
}: {
  table: string;
  title: string;
  trigger?: string;
  defaults?: Record<string, any>;
  /** When set, the trigger is disabled when this quota is exceeded. */
  quota?: QuotaKey;
  children: (opts: {
    values: Record<string, any>;
    set: (k: string, v: any) => void;
  }) => ReactNode;
}) {
  const { profile } = useAuth();
  const { isOverQuota, reasonForQuota } = usePlan();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(defaults);
  const [busy, setBusy] = useState(false);
  const blocked = quota ? isOverQuota(quota) : false;

  const set = (k: string, v: any) => setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.company_id) {
      toast.error("No workspace.");
      return;
    }
    setBusy(true);
    const payload = Object.fromEntries(
      Object.entries(values).filter(([k]) => !k.startsWith("_"))
    );
    const { error } = await (supabase.from(table as any) as any).insert({ ...payload, company_id: profile.company_id });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Created.");
    qc.invalidateQueries({ queryKey: [table] });
    setOpen(false);
    setValues(defaults);
  };

  if (blocked) {
    return (
      <Button
        size="sm"
        variant="outline"
        title={quota ? reasonForQuota(quota) : undefined}
        onClick={() =>
          toast.message("Plan limit reached", {
            description: quota ? reasonForQuota(quota) : "Upgrade to add more.",
          })
        }
      >
        <Lock className="size-4 me-1" /> {trigger ?? "New"}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
          <Plus className="size-4 me-1" /> {trigger ?? "New"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">{children({ values, set })}</div>
          <DialogFooter className="flex-wrap gap-2">
            {quota && (
              <span className="text-[11px] text-muted-foreground me-auto">
                <UpgradeHint quota={quota} />
              </span>
            )}
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UpgradeHint({ quota }: { quota: QuotaKey }) {
  const { plan, usage, percentUsed } = usePlan();
  if (!isFinite(plan.limits[quota])) return null;
  const pct = percentUsed(quota);
  if (pct < 70) return null;
  return (
    <span className="inline-flex items-center gap-2">
      <span>
        {usage[quota]} / {plan.limits[quota]} on the {plan.name} plan
      </span>
      <UpgradeButton size="sm">Upgrade</UpgradeButton>
    </span>
  );
}
