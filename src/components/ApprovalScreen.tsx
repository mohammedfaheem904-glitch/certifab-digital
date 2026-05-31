import { Flame, Clock, XCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function PendingApprovalScreen() {
  const { signOut, user } = useAuth();
  return (
    <Shell icon={<Clock className="size-6 text-primary" />} title="Awaiting administrator approval">
      <p className="text-sm text-muted-foreground">
        Your account <span className="font-medium text-foreground">{user?.email}</span> has been created and
        is awaiting approval by a workspace administrator. You'll be notified once you're approved.
      </p>
      <Button variant="outline" className="w-full" onClick={() => signOut()}>
        <LogOut className="size-4 me-2" /> Sign out
      </Button>
    </Shell>
  );
}

export function RejectedScreen() {
  const { signOut, profile } = useAuth();
  return (
    <Shell icon={<XCircle className="size-6 text-destructive" />} title="Account request not approved">
      <p className="text-sm text-muted-foreground">
        Your account request was reviewed and not approved by a workspace administrator.
      </p>
      {profile?.rejection_reason && (
        <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
          <div className="text-xs font-medium text-muted-foreground mb-1">Reason</div>
          {profile.rejection_reason}
        </div>
      )}
      <Button variant="outline" className="w-full" onClick={() => signOut()}>
        <LogOut className="size-4 me-2" /> Sign out
      </Button>
    </Shell>
  );
}

function Shell({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[image:var(--gradient-surface)]">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)] space-y-5">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div className="font-semibold tracking-tight">Weld Yard</div>
        </div>
        <div className="flex items-start gap-3">
          {icon}
          <h1 className="text-lg font-semibold tracking-tight pt-0.5">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
