import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ModulePage } from "@/components/ModulePage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Bell, ShieldCheck, ScrollText } from "lucide-react";

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

  return (
    <ModulePage title="Settings" subtitle="Workspace, branding, members and access control.">
      <div className="p-5 grid lg:grid-cols-3 gap-3">
        <Tile to="/app/team" icon={Users} title="Team & Roles" desc="Invite members, assign roles." />
        <Tile to="/app/audit" icon={ScrollText} title="Audit Log" desc="Tamper-evident change history." />
        <Tile to="/app/settings" icon={Bell} title="Notifications" desc="Reminders & alerts settings." disabled />
      </div>

      <div className="p-5 border-t border-border space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 mb-2"><ShieldCheck className="size-4 text-primary" /><h3 className="text-sm font-semibold">Workspace branding</h3></div>
        <F label="Company name"><Input value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} /></F>
        <F label="Logo URL"><Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://…" disabled={!isAdmin} /></F>
        <F label="Report footer"><Input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Confidential — © 2026" disabled={!isAdmin} /></F>
        {isAdmin && <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>}
        {!isAdmin && <p className="text-xs text-muted-foreground">Only super admins can edit workspace branding.</p>}
      </div>
    </ModulePage>
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
