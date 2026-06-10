import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { IdleTimeoutGuard } from "@/components/IdleTimeoutGuard";
import { PendingApprovalScreen, RejectedScreen } from "@/components/ApprovalScreen";
import { useAuth } from "@/lib/auth";
import { PlanProvider } from "@/lib/use-plan";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  component: AppGate,
});

function getLoginRedirectTarget() {
  if (typeof window === "undefined") return "/app";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function AppBootRecovery({ message }: { message: string }) {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Workspace is temporarily unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground break-words">
            The app recovered from a startup issue instead of failing the whole preview. Reload to retry the protected workspace.
          </p>
        </div>
        <p className="text-xs text-muted-foreground break-words">{message}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>Go to login</Button>
        </div>
      </div>
    </div>
  );
}

function AppGate() {
  const { loading, session, profile, bootstrapError } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }
  if (!session && bootstrapError) return <AppBootRecovery message={bootstrapError} />;
  if (!session) return <Navigate to="/login" search={{ next: getLoginRedirectTarget() } as any} />;
  if (profile?.approval_status === "pending") return <PendingApprovalScreen />;
  if (profile?.approval_status === "rejected") return <RejectedScreen />;
  return (
    <PlanProvider>
      <AppLayout />
      <IdleTimeoutGuard />
    </PlanProvider>
  );
}
