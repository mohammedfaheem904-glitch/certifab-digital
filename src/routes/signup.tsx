import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flame, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const search = z.object({
  invite: z.string().min(8).max(128).optional(),
  email: z.string().email().max(254).optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Create workspace — Weld Yard" },
      { name: "description", content: "Spin up a new Weld Yard workspace for your fabrication or EPC team." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { invite, email: invitedEmail } = Route.useSearch();
  const isInvite = !!invite;
  const { session, loading } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(invitedEmail ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) nav({ to: "/app" });
  }, [loading, session, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: {
          display_name: displayName,
          ...(isInvite ? { invitation_token: invite } : { company_name: companyName }),
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(isInvite ? "Account created. Check your inbox to confirm." : "Workspace created. Check your inbox to confirm.");
    nav({ to: "/login" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-[image:var(--gradient-surface)] border-e border-border relative overflow-hidden">
        <div className="absolute -top-32 -end-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">{t("appName")}</div>
            <div className="text-[11px] text-muted-foreground">{t("tagline")}</div>
          </div>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight max-w-md">
            {isInvite ? "You've been invited to a Weld Yard workspace." : "Spin up a workspace for your fabrication yard."}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md">
            {isInvite ? "Create your account to join the team." : "Multi-tenant by default — your data stays isolated to your company."}
          </p>
        </div>
        <div className="text-xs text-muted-foreground relative">14-day trial · no credit card</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isInvite ? "Create your account" : "Create your workspace"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isInvite ? "You'll join your inviter's workspace automatically." : "You'll be the workspace owner."}
            </p>
          </div>
          {!isInvite && (
            <div className="space-y-2">
              <Label>Company name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Welding LLC" required />
            </div>
          )}
          <div className="space-y-2">
            <Label>Your name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Doe" required />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required readOnly={!!invitedEmail} />
          </div>
          <div className="space-y-2">
            <Label>{t("password")}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <>{isInvite ? "Create account" : "Create workspace"} <ArrowRight className="size-4 ms-1" /></>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" search={invite ? ({ next: `/accept-invite?token=${invite}` } as any) : undefined} className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
