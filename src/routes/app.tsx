import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { IdleTimeoutGuard } from "@/components/IdleTimeoutGuard";
import { PendingApprovalScreen, RejectedScreen } from "@/components/ApprovalScreen";
import { useAuth } from "@/lib/auth";
import { PlanProvider } from "@/lib/use-plan";

export const Route = createFileRoute("/app")({
  component: AppGate,
});

function AppGate() {
  const { loading, session, profile } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;
  if (profile?.approval_status === "pending") return <PendingApprovalScreen />;
  if (profile?.approval_status === "rejected") return <RejectedScreen />;
  return (
    <PlanProvider>
      <AppLayout />
      <IdleTimeoutGuard />
    </PlanProvider>
  );
}

