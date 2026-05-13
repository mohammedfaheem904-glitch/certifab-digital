import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { error: Error | null };

/**
 * Top-level error boundary for the whole app. Catches render-time
 * errors that escape route-level boundaries and logs them to the
 * console (and any global logger hooked into window.onerror).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Hook for future logging infrastructure (Sentry, Logtail, etc.)
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground break-words">
            {this.state.error.message ||
              "An unexpected error occurred. Try refreshing the page."}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" onClick={this.reset}>
              <RotateCcw className="size-4 me-2" /> Try again
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              Go home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
