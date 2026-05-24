import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ModulePage({
  title,
  subtitle,
  primaryAction,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Backwards-compat: simple label-only button. */
  primaryAction?: string;
  /** Custom right-side action (e.g. NewRecordDialog). Overrides primaryAction. */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          {action ?? (primaryAction && (
            <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
              <Plus className="size-4 me-1" /> {primaryAction}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}
