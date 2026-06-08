import { AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "destructive" | "warning" | "success" | "info";

const TONE_CLS: Record<Tone, string> = {
  destructive: "bg-destructive/10 border-destructive/30 text-destructive",
  warning: "bg-warning/10 border-warning/30 text-warning",
  success: "bg-success/10 border-success/30 text-success",
  info: "bg-primary/10 border-primary/30 text-primary",
};

export function GovernanceBanner({
  ncr,
  capas = [],
  rework = [],
}: {
  ncr: any;
  capas?: any[];
  rework?: any[];
}) {
  const now = new Date();
  const overdueCapas = capas.filter(
    (c) => c.target_date && c.status !== "Completed" && c.status !== "Verified" && c.status !== "Cancelled" && new Date(c.target_date) < now,
  );
  const activeRework = rework.filter((r) => r.status !== "Cancelled" && r.status !== "Re-Inspected");
  const readyForClosure = ncr.status === "Repaired" || ncr.status === "Re-Inspection Required";
  const terminal = ["Closed", "Rejected", "Accepted As-Is"].includes(ncr.status);

  const banners: { tone: Tone; icon: any; text: string }[] = [];

  if (!terminal && !["Closed"].includes(ncr.status)) {
    banners.push({
      tone: "destructive",
      icon: AlertTriangle,
      text: `Open NCR ${ncr.ncr_no} — blocking release until closed.`,
    });
  }
  if (overdueCapas.length > 0) {
    banners.push({
      tone: "warning",
      icon: Clock,
      text: `${overdueCapas.length} CAPA action${overdueCapas.length === 1 ? "" : "s"} overdue.`,
    });
  }
  if (ncr.status === "Re-Inspection Required") {
    banners.push({ tone: "warning", icon: Wrench, text: "Re-inspection required before closure." });
  }
  if (readyForClosure) {
    banners.push({ tone: "success", icon: CheckCircle2, text: "NCR ready for closure review." });
  }
  if (activeRework.some((r) => r.status === "Completed" && !r.reinspection_id)) {
    banners.push({ tone: "info", icon: Wrench, text: "Rework complete — ready for re-inspection." });
  }
  if (terminal) {
    banners.push({ tone: "success", icon: CheckCircle2, text: `NCR ${ncr.status.toLowerCase()}.` });
  }

  if (banners.length === 0) return null;

  return (
    <div className="space-y-2">
      {banners.map((b, i) => {
        const Icon = b.icon;
        return (
          <div key={i} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", TONE_CLS[b.tone])}>
            <Icon className="size-4 flex-shrink-0" />
            <span>{b.text}</span>
          </div>
        );
      })}
    </div>
  );
}
