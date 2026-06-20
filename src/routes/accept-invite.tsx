import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Wordmark } from "@/components/Wordmark";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Loader2, Flame, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const search = z.object({ token: z.string().min(8).max(128).optional() });

export const Route = createFileRoute("/accept-invite")({
  validateSearch: (s) => search.parse(s),
  component: AcceptInvite,
});

type Invite = {
  company_id: string;
  company_name: string;
  email: string;
  role: string;
  expires_at: string;
  accepted_at: string | null;
  invited_by_name: string | null;
};

function AcceptInvite() {
  const { token } = Route.useSearch();
  const { session, loading, refresh } = useAuth();
  const nav = useNavigate();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing invitation token.");
      setChecking(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("get_invitation", { _token: token });
      const row = (data as Invite[] | null)?.[0] ?? null;
      if (error || !row) {
        setError("This invitation link is invalid.");
      } else if (row.accepted_at) {
        setError("This invitation has already been used.");
      } else if (new Date(row.expires_at) < new Date()) {
        setError("This invitation has expired. Ask your admin to send a new one.");
      } else {
        setInvite(row);
      }
      setChecking(false);
    })();
  }, [token]);

  const accept = async () => {
    if (!token) return;
    setAccepting(true);
    const { error } = await supabase.rpc("accept_invitation", { _token: token });
    setAccepting(false);
    if (error) return toast.error(error.message);
    toast.success(`Joined ${invite?.company_name}`);
    await refresh();
    nav({ to: "/app" });
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[image:var(--gradient-surface)]">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <BrandLogo className="size-9" />
          <div className="font-semibold"><Wordmark /></div>
        </Link>

        {checking || loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="size-4 animate-spin" /> Verifying invitation…
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h1 className="text-lg font-semibold">Invitation unavailable</h1>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to sign in</Link>
            </Button>
          </div>
        ) : invite ? (
          <div className="space-y-5">
            <div>
              <CheckCircle2 className="size-6 text-primary mb-2" />
              <h1 className="text-xl font-semibold tracking-tight">
                Join {invite.company_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {invite.invited_by_name ? `${invite.invited_by_name} invited` : "You were invited"}{" "}
                <span className="font-mono text-foreground">{invite.email}</span> as{" "}
                <span className="text-foreground">{invite.role.replace(/_/g, " ")}</span>.
              </p>
            </div>

            {session ? (
              <>
                {session.user.email?.toLowerCase() !== invite.email.toLowerCase() && (
                  <div className="text-xs rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-400">
                    You're signed in as <b>{session.user.email}</b>. Accepting will move this account into{" "}
                    <b>{invite.company_name}</b>.
                  </div>
                )}
                <Button
                  className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground"
                  onClick={accept}
                  disabled={accepting}
                >
                  {accepting ? <Loader2 className="size-4 animate-spin" /> : `Join ${invite.company_name}`}
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <Link to="/signup" search={{ invite: token!, email: invite.email } as any}>
                    Create account & join
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" search={{ next: `/accept-invite?token=${token}` } as any}>
                    I already have an account
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
