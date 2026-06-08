import { useRouter, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export function RouteErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  if (typeof console !== "undefined") console.error("[route]", error);
  return (
    <div className="grid place-items-center min-h-[60vh] px-4">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto size-12 rounded-full bg-destructive/10 grid place-items-center">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">This page couldn't load</h2>
        <p className="text-sm text-muted-foreground break-words">
          {error?.message ?? "An unexpected error occurred."}
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button
            variant="default"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app">
              <ArrowLeft className="size-4 me-1" /> Back to dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RouteNotFoundFallback() {
  return (
    <div className="grid place-items-center min-h-[60vh] px-4">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-semibold">Not found</h2>
        <p className="text-sm text-muted-foreground">
          The record you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button variant="outline" asChild>
          <Link to="/app">
            <ArrowLeft className="size-4 me-1" /> Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
