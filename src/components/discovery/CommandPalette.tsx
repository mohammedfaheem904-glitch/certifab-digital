import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FileText,
  BadgeCheck,
  Flame,
  ClipboardCheck,
  ScrollText,
  Wrench,
  Gauge,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { FEATURES, markFeatureSeen } from "@/lib/discovery";

const ROUTES = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/procedures", label: "Procedures ( PWPS - PQR - WPS )", icon: FileText },
  { to: "/app/qualifications", label: "Welder Qualifications (WPQ)", icon: BadgeCheck },
  { to: "/app/welds", label: "Welds", icon: Flame },
  { to: "/app/inspections", label: "Inspections", icon: ClipboardCheck },
  { to: "/app/ncrs", label: "NCRs", icon: ScrollText },
  { to: "/app/equipment", label: "Equipment", icon: Wrench },
  { to: "/app/instruments", label: "QA/QC Instruments", icon: Gauge },
  { to: "/app/projects", label: "Projects", icon: FolderKanban },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
  { to: "/app/team", label: "Team & Roles", icon: Users },
  { to: "/app/audit", label: "Audit Log", icon: ScrollText },
  { to: "/app/billing", label: "Billing & Plan", icon: Sparkles },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/admin", label: "Admin Console", icon: ShieldCheck },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const nav = useNavigate();
  const go = (to: string, featureId?: string) => {
    onOpenChange(false);
    if (featureId) markFeatureSeen(featureId);
    nav({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search routes, features, actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Jump to">
          {ROUTES.map((r) => (
            <CommandItem key={r.to} value={`${r.label} ${r.to}`} onSelect={() => go(r.to)}>
              <r.icon className="size-4 me-2" />
              {r.label}
              <span className="ms-auto text-[10px] text-muted-foreground">{r.to}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="New features">
          {FEATURES.map((f) => (
            <CommandItem
              key={f.id}
              value={`${f.title} ${f.blurb} ${(f.keywords ?? []).join(" ")}`}
              onSelect={() => go(f.to, f.id)}
            >
              <Sparkles className="size-4 me-2 text-primary" />
              <div className="flex-1 min-w-0">
                <div className="text-sm">{f.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{f.blurb}</div>
              </div>
              <span className="ms-2 text-[10px] font-semibold uppercase text-primary">New</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Hook that exposes ⌘K / Ctrl+K toggling state for the palette. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
