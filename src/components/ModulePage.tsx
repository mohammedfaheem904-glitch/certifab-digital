import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, Plus, Search } from "lucide-react";

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
          <Button variant="outline" size="sm">
            <Download className="size-4 me-1" /> Export
          </Button>
          {action ?? (primaryAction && (
            <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
              <Plus className="size-4 me-1" /> {primaryAction}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-60 relative">
            <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="ps-9 bg-background/60 h-9" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="size-4 me-1" /> Filters
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
