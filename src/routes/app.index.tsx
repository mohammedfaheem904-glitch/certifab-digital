import { createFileRoute, Link } from "@tanstack/react-router";
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
  ScrollText,
  Gauge,
  ShieldCheck,
  Activity,
  FolderKanban,
  XCircle,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { OperationalAlertStrip } from "@/components/dashboard/OperationalAlertStrip";
import { WorkflowBottlenecks } from "@/components/dashboard/WorkflowBottlenecks";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { SpotlightTip } from "@/components/discovery/SpotlightTip";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

type Weld = { id: string; status: string; weld_date: string; welder_name: string | null; weld_no: string; project_id: string | null; inspection_status: string | null };
type Insp = { id: string; inspection_type: string; status: string; severity: string | null; inspected_at: string };
type Ncr = { id: string; status: string; severity: string | null; ncr_no: string; title: string; due_date: string | null; created_at: string };
type Qual = { id: string; welder_name: string; expiry_date: string; status: string; process: string };
type Inst = { id: string; name: string; calibration_due: string | null; status: string; asset_id: string };
type Project = { id: string; code: string; name: string; status: string };

function Dashboard() {
  const { t } = useI18n();
  const welds = useCompanyRows<Weld>("welds", { realtime: true });
  const insps = useCompanyRows<Insp>("inspections", { realtime: true });
  const ncrs = useCompanyRows<Ncr>("ncrs", { realtime: true });
  const quals = useCompanyRows<Qual>("qualifications", { realtime: true });
  const insts = useCompanyRows<Inst>("instruments", { realtime: true });
  const projects = useCompanyRows<Project>("projects");

  const loading = welds.isLoading || insps.isLoading || quals.isLoading || ncrs.isLoading;

  const stats = useMemo(() => {
    const w = welds.data ?? [];
    const total = w.length;
    const accepted = w.filter((x) => x.status === "Accepted").length;
    const rejected = w.filter((x) => x.status === "Rejected").length;
    const repair = w.filter((x) => x.status === "Repair").length;
    const pending = w.filter((x) => x.status === "Pending").length;
    const acceptance = total ? (accepted / total) * 100 : 0;
    const repairRate = total ? ((repair + rejected) / total) * 100 : 0;
    const today = new Date();
    const in30 = new Date(today.getTime() + 30 * 86400000);
    const expiringQuals = (quals.data ?? []).filter((q) => {
      const d = new Date(q.expiry_date);
      return d <= in30;
    }).length;
    const expiredQuals = (quals.data ?? []).filter((q) => new Date(q.expiry_date) < today).length;
    const calDue = (insts.data ?? []).filter((i) => i.calibration_due && new Date(i.calibration_due) <= in30).length;
    const openNcrs = (ncrs.data ?? []).filter((n) => n.status !== "Closed").length;
    const criticalNcrs = (ncrs.data ?? []).filter((n) => n.severity === "Critical" && n.status !== "Closed").length;
    const activeWelders = new Set(w.map((x) => x.welder_name).filter(Boolean)).size;
    const compliance = Math.round(
      Math.max(0, 100 - repairRate * 0.6 - expiringQuals * 1.5 - calDue * 1.2 - criticalNcrs * 4),
    );
    return {
      total, accepted, rejected, repair, pending, acceptance, repairRate,
      expiringQuals, expiredQuals, calDue, openNcrs, criticalNcrs, activeWelders, compliance,
    };
  }, [welds.data, quals.data, insts.data, ncrs.data]);

  const weldTrend = useMemo(() => {
    const days: Record<string, { day: string; welds: number; rejected: number }> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      const key = d.toISOString().slice(5, 10);
      days[key] = { day: key, welds: 0, rejected: 0 };
    }
    (welds.data ?? []).forEach((w) => {
      const key = w.weld_date?.slice(5, 10);
      if (days[key]) {
        days[key].welds += 1;
        if (w.status === "Rejected" || w.status === "Repair") days[key].rejected += 1;
      }
    });
    return Object.values(days);
  }, [welds.data]);

  const ndtBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    (insps.data ?? []).forEach((i) => {
      counts[i.inspection_type] = (counts[i.inspection_type] ?? 0) + 1;
    });
    const palette = ["oklch(0.68 0.16 60)", "oklch(0.7 0.16 155)", "oklch(0.7 0.13 240)", "oklch(0.78 0.16 80)", "oklch(0.62 0.22 25)"];
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }));
  }, [insps.data]);

  const welderPerf = useMemo(() => {
    const map = new Map<string, { name: string; accepted: number; repair: number; rejected: number }>();
    (welds.data ?? []).forEach((w) => {
      const name = w.welder_name ?? "Unassigned";
      const r = map.get(name) ?? { name, accepted: 0, repair: 0, rejected: 0 };
      if (w.status === "Accepted") r.accepted += 1;
      else if (w.status === "Repair") r.repair += 1;
      else if (w.status === "Rejected") r.rejected += 1;
      map.set(name, r);
    });
    return Array.from(map.values())
      .sort((a, b) => b.accepted + b.repair + b.rejected - (a.accepted + a.repair + a.rejected))
      .slice(0, 6);
  }, [welds.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            Live · synced just now
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("overview")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time QA/QC posture across all active projects.</p>
        </div>
        <ComplianceRing score={stats.compliance} />
      </div>

      {/* Contextual onboarding hint — dismissible */}
      <SpotlightTip
        id="dashboard-operational-v1"
        title="Operational alerts now live"
        body="The strip below surfaces overdue NCRs, expiring qualifications, calibration due dates and blocked welds across every project. Click any chip to jump to the source record. Press ⌘K to open the new command palette anywhere."
      />

      {/* Operational alerts — actionable, deep-linked to filtered lists */}
      <OperationalAlertStrip />

      {/* KPI grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Flame} label="Total welds" value={stats.total.toLocaleString()} delta={`${stats.pending} pending`} tone="primary" loading={loading} />
        <Kpi icon={CheckCircle2} label="Acceptance" value={`${stats.acceptance.toFixed(1)}%`} delta={`${stats.accepted} accepted`} tone="success" loading={loading} />
        <Kpi icon={XCircle} label="Repair / Reject rate" value={`${stats.repairRate.toFixed(1)}%`} delta={`${stats.repair + stats.rejected} items`} tone="warning" loading={loading} />
        <Kpi icon={Users} label="Active welders" value={String(stats.activeWelders)} delta={`${(quals.data ?? []).length} qualified`} tone="info" loading={loading} />
        <Kpi icon={ScrollText} label="Open NCRs" value={String(stats.openNcrs)} delta={`${stats.criticalNcrs} critical`} tone={stats.criticalNcrs ? "danger" : "warning"} loading={loading} link="/app/ncrs" />
        <Kpi icon={AlertTriangle} label="Quals expiring 30d" value={String(stats.expiringQuals)} delta={`${stats.expiredQuals} expired`} tone="warning" loading={loading} link="/app/qualifications" />
        <Kpi icon={Gauge} label="Calibration due 30d" value={String(stats.calDue)} delta={`${(insts.data ?? []).length} instruments`} tone="info" loading={loading} link="/app/instruments" />
        <Kpi icon={FolderKanban} label="Active projects" value={String((projects.data ?? []).filter((p) => p.status === "Active").length)} delta={`${(projects.data ?? []).length} total`} tone="primary" loading={loading} link="/app/projects" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" title="Weld activity — last 14 days" right={<Legend />}>
          {loading ? <Skeleton className="h-72 w-full" /> : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weldTrend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.68 0.16 60)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.68 0.16 60)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.32 0.02 252)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="welds" stroke="oklch(0.68 0.16 60)" strokeWidth={2} fill="url(#g1)" />
                  <Area type="monotone" dataKey="rejected" stroke="oklch(0.62 0.22 25)" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="NDT inspection mix">
          {loading || ndtBreakdown.length === 0 ? (
            <EmptyChart label="No inspections yet" />
          ) : (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ndtBreakdown} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2} stroke="none">
                      {ndtBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                {ndtBreakdown.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ms-auto font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Lists */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" title="Recent welds" right={<Link to="/app/welds" className="text-xs text-primary hover:underline">View all</Link>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr>
                  <th className="text-start font-medium px-5 py-2.5">Weld No.</th>
                  <th className="text-start font-medium px-5 py-2.5">Welder</th>
                  <th className="text-start font-medium px-5 py-2.5">Date</th>
                  <th className="text-start font-medium px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {(welds.data ?? []).slice(0, 6).map((w) => (
                  <tr key={w.id} className="border-t border-border/60 hover:bg-muted/20">
                    <td className="px-5 py-3 font-medium">
                      <Link to="/app/welds/$weldId" params={{ weldId: w.id }} className="hover:text-primary">{w.weld_no}</Link>
                    </td>
                    <td className="px-5 py-3">{w.welder_name ?? "—"}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{w.weld_date}</td>
                    <td className="px-5 py-3"><StatusBadge status={w.status} /></td>
                  </tr>
                ))}
                {(welds.data?.length ?? 0) === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground text-sm">No welds yet — load demo data from the header.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Qualification alerts" right={<span className="text-xs text-warning">{stats.expiringQuals + stats.expiredQuals}</span>}>
            <ul className="space-y-3">
              {(quals.data ?? [])
                .filter((q) => new Date(q.expiry_date) <= new Date(Date.now() + 60 * 86400000))
                .slice(0, 4)
                .map((q) => (
                  <li key={q.id} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-muted grid place-items-center text-xs font-medium">
                      {q.welder_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{q.welder_name}</div>
                      <div className="text-xs text-muted-foreground">{q.process} · exp {q.expiry_date}</div>
                    </div>
                    <StatusBadge status={q.status} />
                  </li>
                ))}
              {stats.expiringQuals + stats.expiredQuals === 0 && <Empty label="All certifications current" />}
            </ul>
          </Card>

          <Card title="Open NCRs" right={<Link to="/app/ncrs" className="text-xs text-primary hover:underline">View</Link>}>
            <ul className="space-y-3">
              {(ncrs.data ?? []).filter((n) => n.status !== "Closed").slice(0, 4).map((n) => (
                <li key={n.id} className="flex items-start gap-3">
                  <div className={`mt-1 size-2 rounded-full ${n.severity === "Critical" ? "bg-destructive" : "bg-warning"}`} />
                  <div className="flex-1 min-w-0">
                    <Link to="/app/ncrs/$ncrId" params={{ ncrId: n.id }} className="text-sm hover:text-primary truncate block">{n.title}</Link>
                    <div className="text-xs text-muted-foreground">{n.ncr_no} · {n.due_date ? `due ${n.due_date}` : "no due date"}</div>
                  </div>
                  <StatusBadge status={n.severity ?? n.status} />
                </li>
              ))}
              {stats.openNcrs === 0 && <Empty label="No open NCRs" />}
            </ul>
          </Card>

          <Card title="Calibration due" right={<Link to="/app/instruments" className="text-xs text-primary hover:underline">View</Link>}>
            <ul className="space-y-3">
              {(insts.data ?? [])
                .filter((i) => i.calibration_due && new Date(i.calibration_due) <= new Date(Date.now() + 60 * 86400000))
                .slice(0, 4)
                .map((i) => (
                  <li key={i.id} className="flex items-center gap-3">
                    <Wrench className="size-4 text-warning" />
                    <div className="flex-1 min-w-0">
                      <Link to="/app/instruments/$instrumentId" params={{ instrumentId: i.id }} className="text-sm hover:text-primary truncate block">{i.name}</Link>
                      <div className="text-xs text-muted-foreground">{i.asset_id} · due {i.calibration_due}</div>
                    </div>
                  </li>
                ))}
              {stats.calDue === 0 && <Empty label="All instruments in tolerance" />}
            </ul>
          </Card>
        </div>
      </div>

      {/* Welder performance */}
      <Card title="Welder performance — top 6">
        {loading || welderPerf.length === 0 ? (
          <EmptyChart label="No welds yet" />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={welderPerf}>
                <CartesianGrid stroke="oklch(0.32 0.02 252)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="accepted" stackId="a" fill="oklch(0.7 0.16 155)" />
                <Bar dataKey="repair" stackId="a" fill="oklch(0.78 0.16 80)" />
                <Bar dataKey="rejected" stackId="a" fill="oklch(0.62 0.22 25)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Workflow bottlenecks + cross-entity activity feed */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" title="Workflow bottlenecks" right={<Link to="/app/welds" className="text-xs text-primary hover:underline">All welds</Link>}>
          <WorkflowBottlenecks />
        </Card>
        <Card title="Recent activity" right={<Link to="/app/audit" className="text-xs text-primary hover:underline">Full audit log</Link>}>
          <RecentActivityFeed limit={12} />
        </Card>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "oklch(0.22 0.022 252)",
  border: "1px solid oklch(0.32 0.02 252)",
  borderRadius: 8,
  fontSize: 12,
};

function Kpi({
  icon: Icon, label, value, delta, tone = "primary", loading, link,
}: {
  icon: typeof Flame; label: string; value: string; delta: string;
  tone?: "primary" | "success" | "info" | "warning" | "danger";
  loading?: boolean; link?: string;
}) {
  const toneClass = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10",
  }[tone];
  const inner = (
    <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-5 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] transition-all">
      <div className="flex items-center justify-between">
        <div className={`size-10 rounded-lg grid place-items-center ${toneClass}`}>
          <Icon className="size-5" />
        </div>
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
          <ArrowUpRight className="size-3" />{delta}
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-4 h-7 w-20" />
      ) : (
        <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      )}
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}

function Card({ title, right, children, className = "" }: { title: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Legend() {
  return (
    <div className="text-xs text-muted-foreground flex gap-3">
      <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Welds</span>
      <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" />Rejected/Repair</span>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="text-xs text-muted-foreground py-6 text-center inline-flex items-center justify-center w-full gap-2">
      <ShieldCheck className="size-4 text-success" /> {label}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-56 grid place-items-center text-xs text-muted-foreground">
      <div className="text-center">
        <Activity className="size-6 mx-auto mb-2 opacity-50" />
        {label}
      </div>
    </div>
  );
}

function ComplianceRing({ score }: { score: number }) {
  const c = 2 * Math.PI * 28;
  const offset = c - (score / 100) * c;
  const tone = score >= 90 ? "oklch(0.7 0.16 155)" : score >= 70 ? "oklch(0.78 0.16 80)" : "oklch(0.62 0.22 25)";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="oklch(0.32 0.02 252)" strokeWidth="6" />
        <circle cx="32" cy="32" r="28" fill="none" stroke={tone} strokeWidth="6" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">QA/QC compliance</div>
        <div className="text-xl font-semibold tabular-nums">{score}<span className="text-sm text-muted-foreground"> / 100</span></div>
      </div>
    </div>
  );
}
