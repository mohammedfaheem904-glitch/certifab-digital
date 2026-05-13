import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { IdleTimeoutGuard } from "@/components/IdleTimeoutGuard";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  component: AppGate,
});

function AppGate() {
  const { loading, session } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;
  return (
    <>
      <AppLayout />
      <IdleTimeoutGuard />
    </>
  );
}
