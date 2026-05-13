import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const ROLES: AppRole[] = ["super_admin","qa_qc_manager","welding_engineer","inspector","welder","client_viewer"];
const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super Admin",
  qa_qc_manager: "QA/QC Manager",
  welding_engineer: "Welding Engineer",
  inspector: "Inspector",
  welder: "Welder",
  client_viewer: "Client Viewer",
};
const ROLE_SCOPE: Record<AppRole, string> = {
  super_admin: "Full workspace control, billing, roles & integrations.",
  qa_qc_manager: "Approves WPS, signs off inspections, manages NCRs.",
  welding_engineer: "Authors WPS/PQR, manages welding parameters.",
  inspector: "Logs inspections, raises NCRs, monitors weld quality.",
  welder: "Views assigned welds, scans WPS via QR.",
  client_viewer: "Read-only access to project KPIs & reports.",
};

export const Route = createFileRoute("/app/team")({
  component: TeamPage,
});

type Member = { id: string; display_name: string | null; job_title: string | null; roles: AppRole[]; email: string | null };

function TeamPage() {
  const { profile, roles } = useAuth();
  const qc = useQueryClient();
  const isAdmin = roles.includes("super_admin");

  const { data, isLoading } = useQuery<Member[]>({
    queryKey: ["team", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, job_title")
        .eq("company_id", profile!.company_id as string);
      const ids = (profs ?? []).map((p) => p.id);
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const grouped: Record<string, AppRole[]> = {};
      (roleRows ?? []).forEach((r: any) => {
        grouped[r.user_id] = [...(grouped[r.user_id] ?? []), r.role];
      });
      return (profs ?? []).map((p) => ({
        id: p.id,
        display_name: p.display_name,
        job_title: p.job_title,
        roles: grouped[p.id] ?? [],
        email: null,
      }));
    },
  });

  const updateRole = async (userId: string, role: AppRole, hasIt: boolean) => {
    if (!isAdmin || !profile?.company_id) return toast.error("Only super admins can change roles.");
    if (hasIt) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role, company_id: profile.company_id });
    }
    qc.invalidateQueries({ queryKey: ["team", profile.company_id] });
    toast.success("Role updated.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team & Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage workspace members and their access levels.</p>
        </div>
        {isAdmin && <InviteDialog />}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">Member</th>
              <th className="text-start font-medium px-5 py-2.5">Job title</th>
              <th className="text-start font-medium px-5 py-2.5">Roles</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={3} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {data?.map((m) => (
              <tr key={m.id} className="border-t border-border/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8"><AvatarFallback className="text-xs">{(m.display_name ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{m.display_name ?? "(unnamed)"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{m.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{m.job_title ?? "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.map((r) => {
                      const has = m.roles.includes(r);
                      return (
                        <button
                          key={r}
                          disabled={!isAdmin}
                          onClick={() => updateRole(m.id, r, has)}
                          className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${has ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"} ${!isAdmin ? "cursor-not-allowed opacity-70" : ""}`}
                        >
                          {ROLE_LABEL[r]}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Role permissions</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES.map((r) => (
            <div key={r} className="rounded-lg border border-border p-3">
              <Badge className="mb-2">{ROLE_LABEL[r]}</Badge>
              <p className="text-xs text-muted-foreground">{ROLE_SCOPE[r]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InviteDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("inspector");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Magic-link self-signup style invite. Real provisioning would use service role; this surfaces an actionable signup link.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    if (error) return toast.error(error.message);
    toast.success(`Invitation email sent to ${email}. Assign their role here once they sign in.`);
    setOpen(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite member</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader><DialogTitle>Invite member</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div><Label className="text-xs">Email</Label><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" /></div>
            <div><Label className="text-xs">Initial role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              We'll email a magic-link sign-in. After they accept, assign roles from the table.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Send invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
