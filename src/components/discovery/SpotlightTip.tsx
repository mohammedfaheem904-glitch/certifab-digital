import { useEffect, useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isTipDismissed, dismissTip } from "@/lib/discovery";

/**
 * Inline, dismissible contextual hint. Use sparingly to surface a newly
 * shipped capability on the page where it lives.
 */
export function SpotlightTip({
  id,
  title,
  body,
  action,
}: {
  id: string;
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(isTipDismissed(id));
    const onChange = () => setHidden(isTipDismissed(id));
    window.addEventListener("cf:discovery-changed", onChange);
    return () => window.removeEventListener("cf:discovery-changed", onChange);
  }, [id]);

  if (hidden) return null;
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-start gap-3">
      <div className="shrink-0 rounded-full bg-primary/15 p-2">
        <Lightbulb className="size-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            New here
          </span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{body}</p>
        {action && (
          <Button size="sm" variant="outline" className="mt-2" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
      <button
        className="text-muted-foreground hover:text-foreground"
        onClick={() => dismissTip(id)}
        aria-label="Dismiss tip"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
