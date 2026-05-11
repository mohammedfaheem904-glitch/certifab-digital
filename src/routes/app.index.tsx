import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Flame,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Download,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  inspectionBreakdown,
  kpis,
  ncrs,
  qualifications,
  recentWelds,
  weldActivity,
} from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
  tone = "primary",
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  delta: string;
  tone?: "primary" | "success" | "info" | "warning";
}) {
  const toneClass = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
    warning: "text-warning bg-warning/10",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-5">
      <div className="flex items-center justify-between">
        <div className={`size-10 rounded-lg grid place-items-center ${toneClass}`}>
          <Icon className="size-5" />
        </div>
        <span className="text-xs text-success inline-flex items-center gap-1">
          <ArrowUpRight className="size-3" />
          {delta}
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Dashboard() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">{t("welcome")}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("overview")}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4 me-1" />
            {t("export")}
          </Button>
          <Button
            size="sm"
            className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]"
          >
            <Plus className="size-4 me-1" />
            {t("addWeld")}
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Flame} label={t("totalWelds")} value={kpis.totalWelds.toLocaleString()} delta="+8.2%" tone="primary" />
        <Kpi icon={CheckCircle2} label={t("acceptanceRate")} value={`${kpis.acceptanceRate}%`} delta="+0.6%" tone="success" />
        <Kpi icon={Users} label={t("activeWelders")} value={String(kpis.activeWelders)} delta="+4" tone="info" />
        <Kpi icon={AlertTriangle} label={t("expiringCerts")} value={String(kpis.expiringCerts)} delta="30d" tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">{t("weldActivity")}</h3>
            <div className="text-xs text-muted-foreground flex gap-3">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Welds</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" />Rejected</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weldActivity}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.16 60)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.68 0.16 60)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.32 0.02 252)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.022 252)",
                    border: "1px solid oklch(0.32 0.02 252)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="welds" stroke="oklch(0.68 0.16 60)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="rejected" stroke="oklch(0.62 0.22 25)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium mb-4">{t("inspectionResults")}</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inspectionBreakdown}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {inspectionBreakdown.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.022 252)",
                    border: "1px solid oklch(0.32 0.02 252)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {inspectionBreakdown.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ms-auto font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-medium">Recent Welds</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr>
                  <th className="text-start font-medium px-5 py-2.5">{t("weldNo")}</th>
                  <th className="text-start font-medium px-5 py-2.5">{t("project")}</th>
                  <th className="text-start font-medium px-5 py-2.5">{t("welder")}</th>
                  <th className="text-start font-medium px-5 py-2.5">{t("wps")}</th>
                  <th className="text-start font-medium px-5 py-2.5">{t("heatInput")}</th>
                  <th className="text-start font-medium px-5 py-2.5">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {recentWelds.map((w) => (
                  <tr key={w.weldNo} className="border-t border-border/60 hover:bg-muted/20">
                    <td className="px-5 py-3 font-medium">{w.weldNo}</td>
                    <td className="px-5 py-3 text-muted-foreground">{w.project}</td>
                    <td className="px-5 py-3">{w.welder}</td>
                    <td className="px-5 py-3 text-muted-foreground">{w.wps}</td>
                    <td className="px-5 py-3">{w.heatInput}</td>
                    <td className="px-5 py-3"><StatusBadge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{t("qualificationAlerts")}</h3>
              <span className="text-xs text-warning">{qualifications.filter(q => q.status !== "Active").length} alerts</span>
            </div>
            <ul className="space-y-3">
              {qualifications.filter(q => q.status !== "Active").map((q) => (
                <li key={q.id} className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted grid place-items-center text-xs font-medium">
                    {q.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{q.name}</div>
                    <div className="text-xs text-muted-foreground">{q.process} · exp {q.expiry}</div>
                  </div>
                  <StatusBadge status={q.status} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium mb-3">{t("recentNCRs")}</h3>
            <ul className="space-y-3">
              {ncrs.slice(0, 4).map((n) => (
                <li key={n.id} className="flex items-start gap-3">
                  <div className="mt-1 size-2 rounded-full bg-destructive" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{n.type}</div>
                    <div className="text-xs text-muted-foreground">{n.id} · {n.weld} · {n.project}</div>
                  </div>
                  <StatusBadge status={n.severity} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium mb-4">Welder Performance — last 30 days</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: "M. Al-Harbi", accepted: 142, repair: 4, rejected: 1 },
              { name: "R. Kumar", accepted: 128, repair: 6, rejected: 2 },
              { name: "J. Silva", accepted: 110, repair: 9, rejected: 5 },
              { name: "K. Nguyen", accepted: 134, repair: 3, rejected: 1 },
              { name: "A. Ibrahim", accepted: 121, repair: 5, rejected: 2 },
              { name: "P. Costa", accepted: 117, repair: 7, rejected: 3 },
            ]}>
              <CartesianGrid stroke="oklch(0.32 0.02 252)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.22 0.022 252)",
                  border: "1px solid oklch(0.32 0.02 252)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="accepted" stackId="a" fill="oklch(0.7 0.16 155)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="repair" stackId="a" fill="oklch(0.78 0.16 80)" />
              <Bar dataKey="rejected" stackId="a" fill="oklch(0.62 0.22 25)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
