import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  BadgeCheck,
  Flame,
  Search,
  Settings,
  Wrench,
  ClipboardCheck,
  Languages,
  FolderKanban,
  BarChart3,
  LogOut,
  Sparkles,
  Gauge,
  ScrollText,
  Users,
  Menu,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { PlanBadge } from "@/components/PlanBadge";
import { usePlan } from "@/lib/use-plan";
import { NotificationsBell } from "@/components/NotificationsBell";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { seedDemoData } from "@/lib/seed";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CommandPalette, useCommandPalette } from "@/components/discovery/CommandPalette";
import { WhatsNewSheet } from "@/components/discovery/WhatsNewSheet";
import { NewPill } from "@/components/discovery/NewPill";
import { unseenCount } from "@/lib/discovery";
import type { Feature } from "@/lib/discovery";

export function AppLayout() {
  const { t, lang, toggle } = useI18n();
  const loc = useLocation();
  const nav = useNavigate();
  const { profile, user, companyName, roles, signOut } = useAuth();
  const qc = useQueryClient();
  const [seeding, setSeeding] = useState(false);

  const initials = (profile?.display_name || user?.email || "U")
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const handleSeed = async () => {
    if (!profile?.company_id) return;
    setSeeding(true);
    const r = await seedDemoData(profile.company_id);
    setSeeding(false);
    if (r.skipped) toast.info("Workspace already has data.");
    else {
      toast.success("Demo data loaded.");
      qc.invalidateQueries();
    }
  };

  const isSuperAdmin = roles.includes("super_admin");
  const nav_items = [
    { to: "/app", label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { to: "/app/procedures", label: t("procedures"), icon: FileText },
    { to: "/app/qualifications", label: t("qualifications"), icon: BadgeCheck },
    { to: "/app/welds", label: t("welds"), icon: Flame },
    { to: "/app/inspections", label: t("inspections"), icon: ClipboardCheck },
    { to: "/app/ncrs", label: "NCRs", icon: ScrollText },
    { to: "/app/equipment", label: t("equipment"), icon: Wrench },
    { to: "/app/instruments", label: "QA/QC Instruments", icon: Gauge },
    { to: "/app/projects", label: t("projects"), icon: FolderKanban },
    { to: "/app/reports", label: t("reports"), icon: BarChart3 },
    { to: "/app/team", label: "Team & Roles", icon: Users },
    { to: "/app/audit", label: "Audit Log", icon: ScrollText },
    { to: "/app/billing", label: "Billing & Plan", icon: Sparkles },
    ...(isSuperAdmin
      ? [
          { to: "/app/admin", label: "Admin Console", icon: ShieldCheck },
          { to: "/app/admin/companies", label: "Companies", icon: Building2 },
        ]
      : []),
  ];

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {nav_items.map((item) => {
        const active = item.exact
          ? loc.pathname === item.to
          : loc.pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground border-s-2 border-primary"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">{t("appName")}</div>
            <div className="text-[11px] text-muted-foreground">{t("tagline")}</div>
          </div>
        </div>
        <NavList />
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/app/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
          >
            <Settings className="size-4" />
            {t("settings")}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center gap-2 md:gap-3 px-3 md:px-6 sticky top-0 z-10">
          {/* Mobile drawer trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
                <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]">
                  <Flame className="size-5 text-primary-foreground" />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold tracking-tight">{t("appName")}</div>
                  <div className="text-[11px] text-muted-foreground">{companyName ?? t("tagline")}</div>
                </div>
              </div>
              <NavList />
              <div className="p-3 border-t border-sidebar-border">
                <Link to="/app/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60">
                  <Settings className="size-4" />
                  {t("settings")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 max-w-xl relative">
            <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              className="ps-9 bg-background/60 border-border h-9"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={toggle} className="gap-2">
            <Languages className="size-4" />
            {lang === "en" ? "العربية" : "English"}
          </Button>
          <NotificationsBell />
          <PlanPill />
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="hidden md:inline-flex">
            <Sparkles className="size-4 me-1" /> {seeding ? "Seeding…" : "Seed demo data"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 ps-2 border-s border-border outline-none">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-xs leading-tight text-start">
                  <div className="font-medium">{profile?.display_name || user?.email}</div>
                  <div className="text-muted-foreground truncate max-w-[140px]">
                    {companyName ?? "—"}
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-xs text-muted-foreground">Signed in as</div>
                <div className="truncate">{user?.email}</div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {roles.join(", ") || "no role"}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => nav({ to: "/app/settings" })}>
                <Settings className="size-4 me-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  nav({ to: "/login" });
                }}
              >
                <LogOut className="size-4 me-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PlanPill() {
  const { plan, isInternal } = usePlan();
  return (
    <Link
      to="/app/billing"
      className="hidden sm:inline-flex items-center gap-1.5"
      title={isInternal ? "Internal owner workspace" : "Manage plan"}
    >
      <PlanBadge plan={plan} />
      {isInternal && <PlanBadge plan={plan} internal size="xs" />}
    </Link>
  );
}
