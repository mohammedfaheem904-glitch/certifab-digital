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
import { lovable } from "@/integrations/lovable";
import { Wordmark } from "@/components/Wordmark";
import { BrandLogo } from "@/components/BrandLogo";

import { useTenantBranding } from "@/lib/tenant-branding";
import { toast } from "sonner";

const search = z.object({ next: z.string().max(256).optional() });

export const Route = createFileRoute("/login")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — Weld Yard" },
      { name: "description", content: "Access your Weld Yard industrial workspace." },
    ],
  }),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { next } = Route.useSearch();
  const dest = next && next.startsWith("/") ? next : "/app";
  const { session, loading } = useAuth();
  const { branding } = useTenantBranding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) window.location.assign(dest);
  }, [loading, session, dest]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    window.location.assign(dest);
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + dest,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    window.location.assign(dest);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-[image:var(--gradient-surface)] border-e border-border relative overflow-hidden">
        <div className="absolute -top-32 -end-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -start-32 size-96 rounded-full bg-accent/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          {branding?.logo_url ? (
            <img src={branding.logo_url} alt={branding.name} className="size-9 rounded-md object-cover bg-card border border-border" />
          ) : (
            <BrandLogo className="size-9" />
          )}
          <div>
            <div className="font-semibold tracking-tight">{branding?.name ?? <Wordmark>{t("appName")}</Wordmark>}</div>
            <div className="text-[11px] text-muted-foreground">{branding ? "Welding QA/QC workspace" : t("tagline")}</div>
          </div>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight max-w-md">
            {branding ? `Sign in to ${branding.name}.` : "One control room for every welder, weld and project."}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md">
            {branding ? "Your team's secure welding management portal." : "Trusted by EPC contractors, fabrication workshops and oil & gas operators."}
          </p>
        </div>
        <div className="text-xs text-muted-foreground relative">
          ISO 9001 · ASME IX · EN ISO 3834
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={handleEmail} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("signIn")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("loginSubtitle")}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={busy}
          >
            <svg className="size-4 me-2" viewBox="0 0 24 24" aria-hidden>
              <path fill="#EA4335" d="M12 11v3.2h5.4c-.2 1.4-1.6 4-5.4 4-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.7 14.6 3 12 3 6.9 3 3 6.9 3 12s3.9 9 9 9c5.2 0 8.7-3.7 8.7-8.8 0-.6-.1-1-.1-1.2H12z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <>{t("signIn")} <ArrowRight className="size-4 ms-1" /></>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            New to <Wordmark />?{" "}
            <Link to="/signup" className="text-primary hover:underline">Create a workspace</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
