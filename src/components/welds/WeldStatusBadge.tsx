import { cn } from "@/lib/utils";
import { STATUS_TONE, type WeldWorkflowStatus } from "@/lib/weld-workflow";
import {
  CircleDashed, Hourglass, Search, AlertOctagon,
  CheckCircle2, ShieldCheck, PackageCheck, XCircle, ShieldAlert,
} from "lucide-react";

const ICON: Record<WeldWorkflowStatus, React.ComponentType<{ className?: string }>> = {
  Draft: CircleDashed,
  "Pending Validation": Hourglass,
  "Awaiting Inspection": Search,
  "NCR Open": AlertOctagon,
  "Ready for Release": ShieldCheck,
  Approved: CheckCircle2,
  Released: PackageCheck,
  Rejected: XCircle,
  Blocked: ShieldAlert,
};

export function WeldStatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: WeldWorkflowStatus | string;
  size?: "sm" | "md";
  className?: string;
}) {
  const s = (status as WeldWorkflowStatus) in STATUS_TONE
    ? (status as WeldWorkflowStatus)
    : "Draft";
  const Icon = ICON[s];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        STATUS_TONE[s],
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} />
      {status}
    </span>
  );
}
