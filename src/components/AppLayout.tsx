import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  BadgeCheck,
  Flame,
  Search,
  Settings,
  Wrench,
  ClipboardCheck,
  Bell,
  Languages,
  FolderKanban,
  BarChart3,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { t, lang, toggle } = useI18n();
  const loc = useLocation();

  const nav = [
    { to: "/app", label: t("dashboard"), icon: LayoutDashboard, exact: true },
    { to: "/app/procedures", label: t("procedures"), icon: FileText },
    { to: "/app/qualifications", label: t("qualifications"), icon: BadgeCheck },
    { to: "/app/welds", label: t("welds"), icon: Flame },
    { to: "/app/inspections", label: t("inspections"), icon: ClipboardCheck },
    { to: "/app/equipment", label: t("equipment"), icon: Wrench },
    { to: "/app/projects", label: t("projects"), icon: FolderKanban },
    { to: "/app/reports", label: t("reports"), icon: BarChart3 },
  ];

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
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = item.exact
              ? loc.pathname === item.to
              : loc.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
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
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center gap-3 px-4 md:px-6 sticky top-0 z-10">
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            <span className="absolute top-1.5 end-1.5 size-2 rounded-full bg-primary" />
          </Button>
          <div className="flex items-center gap-2 ps-2 border-s border-border">
            <Avatar className="size-8">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                QC
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-xs leading-tight">
              <div className="font-medium">QA/QC Manager</div>
              <div className="text-muted-foreground">Aramco GOSP-7</div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
