import { Link } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, ClipboardCheck, ScrollText, Gauge, CalendarClock } from "lucide-react";
import { useCompanyRows } from "@/lib/use-company-rows";

/**
 * Operational Alert Strip — surfaces the platform's most actionable signals
 * (blocked welds, awaiting-inspection backlog, pending engineering approval,
 * open NCRs, expiring qualifications, calibration due) as deep-linked cards.
 *
 * All counts are computed client-side from already-loaded tenant rows. Each
 * card navigates to the relevant module, pre-filtered when supported.
 */
export function OperationalAlertStrip() {
  const welds = useCompanyRows<{ id: string; workflow_status: string | null }>("welds");
  const ncrs = useCompanyRows<{ id: string; status: string; severity: string | null }>("ncrs");
  const quals = useCompanyRows<{ id: string; expiry_date: string; status: string }>("qualifications");
  const insts = useCompanyRows<{ id: string; calibration_due: string | null }>("instruments");

  const today = new Date();
  const in30 = new Date(today.getTime() + 30 * 86400000);

  const blocked = (welds.data ?? []).filter((w) =>
    ["Blocked", "Rejected", "NCR Open"].includes(w.workflow_status ?? ""),
  ).length;
  const awaitingInsp = (welds.data ?? []).filter((w) => w.workflow_status === "Awaiting Inspection").length;
  const pendingApproval = (welds.data ?? []).filter((w) => w.workflow_status === "Ready for Release").length;
  const openNcrs = (ncrs.data ?? []).filter((n) => n.status !== "Closed").length;
  const criticalNcrs = (ncrs.data ?? []).filter((n) => n.status !== "Closed" && n.severity === "Critical").length;
  const expiringQuals = (quals.data ?? []).filter((q) => {
    const d = new Date(q.expiry_date); return d <= in30;
  }).length;
  const calDue = (insts.data ?? []).filter(
    (i) => i.calibration_due && new Date(i.calibration_due) <= in30,
  ).length;

  const items = [
    {
      key: "blocked",
      label: "Blocked / rejected welds",
      value: blocked,
      hint: blocked ? "Engineering attention required" : "All welds progressing",
      Icon: ShieldAlert,
      tone: blocked ? "danger" : "ok",
      to: "/app/welds",
      search: { workflow: "Blocked" } as const,
    },
    {
      key: "awaiting",
      label: "Awaiting inspection",
      value: awaitingInsp,
      hint: awaitingInsp ? "Schedule NDT to keep flow" : "Inspection backlog clear",
      Icon: ClipboardCheck,
      tone: awaitingInsp > 5 ? "warning" : awaitingInsp ? "info" : "ok",
      to: "/app/welds",
      search: { workflow: "Awaiting Inspection" } as const,
    },
    {
      key: "approval",
      label: "Pending approval",
      value: pendingApproval,
      hint: pendingApproval ? "Welds ready — needs engineering sign-off" : "No approval queue",
      Icon: AlertTriangle,
      tone: pendingApproval ? "warning" : "ok",
      to: "/app/welds",
      search: { workflow: "Ready for Release" } as const,
    },
    {
      key: "ncrs",
      label: "Open NCRs",
      value: openNcrs,
      hint: criticalNcrs ? `${criticalNcrs} critical` : openNcrs ? "Resolve to release" : "No NCRs open",
      Icon: ScrollText,
      tone: criticalNcrs ? "danger" : openNcrs ? "warning" : "ok",
      to: "/app/ncrs",
    },
    {
      key: "quals",
      label: "Qualifications expiring 30d",
      value: expiringQuals,
      hint: expiringQuals ? "Schedule renewals" : "All qualifications current",
      Icon: CalendarClock,
      tone: expiringQuals ? "warning" : "ok",
      to: "/app/qualifications",
    },
    {
      key: "cal",
      label: "Calibration due 30d",
      value: calDue,
      hint: calDue ? "Recalibrate to keep measurements admissible" : "All instruments in tolerance",
      Icon: Gauge,
      tone: calDue ? "warning" : "ok",
      to: "/app/instruments",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map(({ key, ...rest }) => <Card key={key} {...rest} />)}
    </div>
  );
}

function Card({
  Icon, label, value, hint, tone, to, search,
}: {
  Icon: typeof AlertTriangle; label: string; value: number; hint: string;
  tone: "ok" | "info" | "warning" | "danger";
  to: string; search?: Record<string, string>;
}) {
  const palette = {
    ok: "border-success/30 bg-success/5 text-success",
    info: "border-info/30 bg-info/5 text-info",
    warning: "border-warning/40 bg-warning/5 text-warning",
    danger: "border-destructive/40 bg-destructive/5 text-destructive",
  }[tone];
  const inner = (
    <div className={`rounded-xl border ${palette} p-3 h-full transition-all hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="size-3.5 opacity-80" />
      </div>
      <div className="text-2xl font-semibold mt-1.5 leading-none">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1.5 leading-tight">{hint}</div>
    </div>
  );
  return (
    <Link to={to} search={search as any}>
      {inner}
    </Link>
  );
}
