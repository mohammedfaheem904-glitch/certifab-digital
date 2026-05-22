import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FEATURES,
  getSeenFeatures,
  markAllFeaturesSeen,
  markFeatureSeen,
} from "@/lib/discovery";

export function WhatsNewSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const nav = useNavigate();
  const seen = getSeenFeatures();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            What's new
          </SheetTitle>
          <SheetDescription>
            Recently shipped operational features across the platform.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-3">
          {FEATURES.map((f) => {
            const isSeen = seen.has(f.id);
            return (
              <div
                key={f.id}
                className={`rounded-lg border p-3 ${isSeen ? "border-border bg-card" : "border-primary/30 bg-primary/5"}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{f.title}</span>
                      {!isSeen && (
                        <span className="text-[10px] font-semibold uppercase rounded px-1.5 py-0.5 bg-primary text-primary-foreground">
                          New
                        </span>
                      )}
                      {isSeen && <Check className="size-3.5 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{f.blurb}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    variant={isSeen ? "outline" : "default"}
                    onClick={() => {
                      markFeatureSeen(f.id);
                      onOpenChange(false);
                      nav({ to: f.to });
                    }}
                  >
                    Open
                    <ArrowRight className="size-3.5 ms-1.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <SheetFooter>
          <Button variant="ghost" size="sm" onClick={() => markAllFeaturesSeen()}>
            Mark all as seen
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
