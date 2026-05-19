import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Building2, Globe, Mail, FolderKanban, Save, Loader2 } from "lucide-react";
import { ModulePage } from "@/components/ModulePage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin/companies")({
  component: CompaniesAdmin,
});

type Company = {
  id: string;
  name: string;
  dedicated_domain: string | null;
  allowed_email_domains: string[] | null;
  logo_url: string | null;
  report_footer: string | null;
  email_from_name: string | null;
  country: string | null;
  industry: string | null;
  plan: string;
  created_at: string;
};

function CompaniesAdmin() {
  const { profile, roles, refresh } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const cid = profile?.company_id ?? null;
  const qc = useQueryClient();

  const { data: company, isLoading } = useQuery<Company | null>({
    queryKey: ["admin-company", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, dedicated_domain, allowed_email_domains, logo_url, report_footer, email_from_name, country, industry, plan, created_at")
        .eq("id", cid!)
        .maybeSingle();
      if (error) throw error;
      return (data as Company) ?? null;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["admin-company-projects", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, code, name, status, description, created_at")
        .eq("company_id", cid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [form, setForm] = useState<Partial<Company>>({});
  const [allowedRaw, setAllowedRaw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!company) return;
    setForm({
      name: company.name,
      dedicated_domain: company.dedicated_domain,
      logo_url: company.logo_url,
      report_footer: company.report_footer,
      email_from_name: company.email_from_name,
      country: company.country,
      industry: company.industry,
    });
    setAllowedRaw((company.allowed_email_domains ?? []).join(", "));
  }, [company]);

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <ShieldAlert className="size-8 mx-auto text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold">Restricted area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The Companies admin is available to super-admins only.
        </p>
      </div>
    );
  }

  const set = <K extends keyof Company>(k: K, v: Company[K] | null) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (!cid) return;
    setBusy(true);
    const allowed = allowedRaw
      .split(/[\s,;]+/)
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    const { error } = await (supabase.from("companies") as any)
      .update({
        name: form.name?.trim() || null,
        dedicated_domain: form.dedicated_domain?.trim().toLowerCase() || null,
        allowed_email_domains: allowed,
        logo_url: form.logo_url || null,
        report_footer: form.report_footer || null,
        email_from_name: form.email_from_name || null,
        country: form.country || null,
        industry: form.industry || null,
      })
      .eq("id", cid);
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "That dedicated domain is already claimed." : error.message);
      return;
    }
    toast.success("Company profile updated.");
    qc.invalidateQueries({ queryKey: ["admin-company", cid] });
    refresh();
  };

  return (
    <ModulePage
      title="Companies"
      subtitle="Manage your workspace company profile, domains, and project portfolio."
    >
      <div className="p-5 space-y-6">
        {isLoading && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Loading company…
          </div>
        )}

        {company && (
          <>
            {/* Header */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="size-14 rounded-md object-cover border border-border bg-background" />
              ) : (
                <div className="size-14 rounded-md grid place-items-center bg-muted">
                  <Building2 className="size-6 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold tracking-tight truncate">{company.name}</h2>
                  <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded bg-muted text-muted-foreground">{company.plan}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {company.dedicated_domain ?? "No dedicated domain"} · Created {new Date(company.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Profile editor */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2 text-sm font-medium">
                <Building2 className="size-4 text-primary" /> Company profile
              </div>
              <div className="p-5 grid md:grid-cols-2 gap-4">
                <F label="Company name">
                  <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
                </F>
                <F label="Industry">
                  <Input value={form.industry ?? ""} onChange={(e) => set("industry", e.target.value)} placeholder="Oil & Gas, EPC, Fabrication…" />
                </F>
                <F label="Country">
                  <Input value={form.country ?? ""} onChange={(e) => set("country", e.target.value)} placeholder="UAE" />
                </F>
                <F label="Logo URL">
                  <Input value={form.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://…" />
                </F>
                <F label="Report footer">
                  <Input value={form.report_footer ?? ""} onChange={(e) => set("report_footer", e.target.value)} placeholder="Confidential — © 2026" />
                </F>
                <F label="Email from name">
                  <Input value={form.email_from_name ?? ""} onChange={(e) => set("email_from_name", e.target.value)} placeholder="Weld Yard System" />
                </F>
              </div>
            </div>

            {/* Domain controls */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2 text-sm font-medium">
                <Globe className="size-4 text-primary" /> Domain & email whitelisting
              </div>
              <div className="p-5 grid md:grid-cols-2 gap-4">
                <F label="Dedicated domain">
                  <Input
                    value={form.dedicated_domain ?? ""}
                    onChange={(e) => set("dedicated_domain", e.target.value)}
                    placeholder="dwm.weldyard.com"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    When users open this host, branding loads and signups land here.
                  </p>
                </F>
                <F label="Allowed email domains">
                  <Textarea
                    rows={2}
                    value={allowedRaw}
                    onChange={(e) => setAllowedRaw(e.target.value)}
                    placeholder="weldyard.com, contractors.weldyard.com"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Mail className="size-3" /> Comma-separated. Matching signups auto-join as client viewers.
                  </p>
                </F>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button onClick={save} disabled={busy}>
                {busy ? <Loader2 className="size-4 me-1 animate-spin" /> : <Save className="size-4 me-1" />}
                Save changes
              </Button>
            </div>

            {/* Projects under company */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FolderKanban className="size-4 text-primary" /> Projects ({projects?.length ?? 0})
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/app/projects">Manage projects →</Link>
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground bg-muted/40">
                    <tr>
                      <Th>Code</Th><Th>Name</Th><Th>Description</Th><Th>Status</Th><Th>Created</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {(projects?.length ?? 0) === 0 && (
                      <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No projects yet.</td></tr>
                    )}
                    {projects?.map((p: any) => (
                      <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                        <td className="px-5 py-3 font-medium">{p.code}</td>
                        <td className="px-5 py-3">{p.name}</td>
                        <td className="px-5 py-3 text-muted-foreground max-w-[360px] truncate" title={p.description ?? ""}>{p.description ?? "—"}</td>
                        <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-5 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ModulePage>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
