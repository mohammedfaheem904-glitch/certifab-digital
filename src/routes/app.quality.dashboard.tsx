import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ModulePage } from "@/components/ModulePage";
import { ShieldAlert, Clock, AlertTriangle, Wrench, Eye, CheckCheck, ArrowRight } from "lucide-react";
import { RouteErrorFallback } from "@/components/RouteErrorFallback";

export const Route = createFileRoute("/app/quality/dashboard")({
  component: QualityDashboard,
  errorComponent: RouteErrorFallback,
});

function QualityDashboard() {
  const { profile } = useAuth();

  const { data } = useQuery({
    queryKey: ["quality_kpis", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const [ncrs, capas, rework] = await Promise.all([
        (supabase.from("ncrs" as any) as any).select("id,status,due_date").eq("company_id", profile!.company_id).is("deleted_at", null),
        (supabase.from("capa_actions" as any) as any).select("id,status,target_date").eq("company_id", profile!.company_id),
        (supabase.from("rework_jobs" as any) as any).select("id,status,reinspection_id").eq("company_id", profile!.company_id),
      ]);
      return { ncrs: ncrs.data ?? [], capas: capas.data ?? [], rework: rework.data ?? [] };
    },
  });

  const ncrs = data?.ncrs ?? [];
  const capas = data?.capas ?? [];
  const rework = data?.rework ?? [];
  const now = Date.now();
  const isOpen = (s: string) => !["Closed", "Rejected", "Accepted As-Is"].includes(s);

  const openNcrs = ncrs.filter((n: any) => isOpen(n.status)).length;
  const awaitingApproval = ncrs.filter((n: any) => n.status === "Awaiting Approval" || n.status === "In Review").length;
  const reInspectPending = ncrs.filter((n: any) => n.status === "Re-Inspection Required").length;
  const capasDue = capas.filter((c: any) => c.target_date && ["Proposed", "Approved", "In Progress"].includes(c.status)).length;
  const capasOverdue = capas.filter((c: any) => c.target_date && ["Proposed", "Approved", "In Progress"].includes(c.status) && new Date(c.target_date).getTime() < now).length;
  const reworkJobs = rework.filter((r: any) => r.status !== "Cancelled" && r.status !== "Re-Inspected").length;

  const cards = [
    { label: "Open NCRs", value: openNcrs, icon: ShieldAlert, tone: "warning", to: "/app/ncrs", linkLabel: "View NCRs" },
    { label: "NCRs Awaiting Approval", value: awaitingApproval, icon: Eye, tone: "info", to: "/app/ncrs", linkLabel: "Review" },
    { label: "Re-Inspections Pending", value: reInspectPending, icon: Wrench, tone: "warning", to: "/app/ncrs", linkLabel: "View" },
    { label: "CAPAs Due", value: capasDue, icon: Clock, tone: "info", to: "/app/ncrs", linkLabel: "View" },
    { label: "CAPAs Overdue", value: capasOverdue, icon: AlertTriangle, tone: "destructive", to: "/app/ncrs", linkLabel: "View" },
    { label: "Rework Jobs", value: reworkJobs, icon: CheckCheck, tone: "info", to: "/app/ncrs", linkLabel: "View" },
  ] as const;

  return (
    <ModulePage title="Quality Dashboard" subtitle="Operational KPIs for NCRs, CAPAs, rework and re-inspection.">
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const tone = { warning: "text-warning bg-warning/10", destructive: "text-destructive bg-destructive/10", info: "text-primary bg-primary/10" }[c.tone];
          return (
            <Link key={c.label} to={c.to} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] transition-all group">
              <div className="flex items-start justify-between">
                <div className={`size-10 rounded-lg grid place-items-center ${tone}`}><Icon className="size-5" /></div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-3 text-3xl font-semibold">{c.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{c.label}</div>
              <div className="text-xs text-primary mt-2">{c.linkLabel} →</div>
            </Link>
          );
        })}
      </div>
    </ModulePage>
  );
}
