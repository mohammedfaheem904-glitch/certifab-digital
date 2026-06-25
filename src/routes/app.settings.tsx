import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ModulePage } from "@/components/ModulePage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Bell, ShieldCheck, ScrollText, Sparkles, Lock, Sun, Moon, Monitor, UserCircle2 } from "lucide-react";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { usePlan } from "@/lib/use-plan";
import { UsageMeter } from "@/components/UsageMeter";
import { UpgradeBanner, UpgradeButton } from "@/components/UpgradePrompt";
import { PlanBadge } from "@/components/PlanBadge";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, companyName, refresh, roles } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const [name, setName] = useState(companyName ?? "");
  const [logo, setLogo] = useState("");
  const [footer, setFooter] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile?.company_id) return;
    supabase.from("companies").select("name, logo_url, report_footer").eq("id", profile.company_id).maybeSingle()
      .then(({ data }) => {
        if (data) { setName(data.name); setLogo(data.logo_url ?? ""); setFooter(data.report_footer ?? ""); }
      });
  }, [profile?.company_id]);

  const save = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const { error } = await supabase.from("companies").update({ name, logo_url: logo, report_footer: footer }).eq("id", profile.company_id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Workspace updated.");
    refresh();
  };

  const { plan, hasFeature, percentUsed, isInternal } = usePlan();
  const brandingLocked = !hasFeature("pdf_branding");
  const nearCap = ["users", "projects", "welds", "procedures"].some(
    (q) => percentUsed(q as any) >= 80,
  );

  return (
    <ModulePage title="Settings" subtitle="Workspace, branding, members and access control.">
      {nearCap && (
        <div className="p-5 pb-0">
          <UpgradeBanner
            title="You're approaching a plan limit"
            message={`Your workspace is on the ${plan.name} plan. Upgrade to keep adding records without interruption.`}
          />
        </div>
      )}

      <div className="p-5 grid lg:grid-cols-3 gap-3">
        <Tile to="/app/team" icon={Users} title="Team & Roles" desc="Invite members, assign roles." />
        <Tile to="/app/audit" icon={ScrollText} title="Audit Log" desc="Tamper-evident change history." />
        <Tile to="/app/billing" icon={Sparkles} title="Billing & Plan" desc="Subscription, usage and feature access." />
      </div>

      <div className="p-5 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Workspace usage</h3>
            <PlanBadge plan={plan} />
            {isInternal && <PlanBadge plan={plan} internal size="xs" />}
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/billing">View plan details →</Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
          <UsageMeter quota="users" />
          <UsageMeter quota="projects" />
          <UsageMeter quota="welds" />
          <UsageMeter quota="procedures" />
          <UsageMeter quota="storage_mb" />
        </div>
      </div>

      <div className="p-5 border-t border-border space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Workspace branding</h3>
          {brandingLocked && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground ms-1">
              <Lock className="size-3" /> Professional plan
            </span>
          )}
        </div>
        <F label="Company name"><Input value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} /></F>
        <F label="Logo URL"><Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://…" disabled={!isAdmin || brandingLocked} /></F>
        <F label="Report footer"><Input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Confidential — © 2026" disabled={!isAdmin || brandingLocked} /></F>
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
            {brandingLocked && <UpgradeButton size="sm">Unlock branding</UpgradeButton>}
          </div>
        )}
        {!isAdmin && <p className="text-xs text-muted-foreground">Only super admins can edit workspace branding.</p>}
      </div>

      <ThemeSection />
    </ModulePage>
  );
}

function ThemeSection() {
  const { preference, resolved, setPreference } = useTheme();
  const options: { value: ThemePreference; label: string; desc: string; Icon: typeof Sun }[] = [
    { value: "light", label: "Light", desc: "Bright background, dark text.", Icon: Sun },
    { value: "dark", label: "Dark", desc: "Low-glare dark interface.", Icon: Moon },
    { value: "system", label: "Auto", desc: "Follow your device's theme.", Icon: Monitor },
  ];
  return (
    <div className="p-5 border-t border-border max-w-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Sun className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Appearance</h3>
        <span className="text-[11px] text-muted-foreground ms-1">
          Currently showing {resolved === "light" ? "Light" : "Dark"}
          {preference === "system" ? " (Auto)" : ""}
        </span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {options.map(({ value, label, desc, Icon }) => {
          const active = preference === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setPreference(value);
                toast.success(`Theme set to ${label}.`);
              }}
              className={`text-left rounded-lg border p-3 transition-colors ${
                active
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border hover:bg-muted/30"
              }`}
              aria-pressed={active}
            >
              <Icon className="size-5 text-primary mb-2" />
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Your preference is saved to your account and restored automatically when you sign in.
      </p>
    </div>
  );
}

function Tile({ to, icon: Icon, title, desc, disabled }: any) {
  const Body = (
    <div className={`rounded-lg border border-border p-4 hover:bg-muted/20 transition-colors ${disabled ? "opacity-60" : ""}`}>
      <Icon className="size-5 text-primary mb-2" />
      <div className="font-medium">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
  );
  return disabled ? Body : <Link to={to}>{Body}</Link>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
