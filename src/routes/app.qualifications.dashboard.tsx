import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Clock, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { useCompanyRows } from "@/lib/use-company-rows";
import { deriveQualStatus, continuityBroken } from "@/lib/qualification-status";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/app/qualifications/dashboard")({
  component: WpqDashboard,
});

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function WpqDashboard() {
  const { data } = useCompanyRows<any>("qualifications", { order: { column: "expiry_date", ascending: true } });
  const rows = data ?? [];

  const enriched = useMemo(
    () => rows.map((r) => ({
      ...r,
      derived: deriveQualStatus(r),
      continuity_broken: continuityBroken(r.last_continuity_date),
    })),
    [rows],
  );

  const total = enriched.length;
  const active = enriched.filter((r) => r.derived === "Active").length;
  const expiring = enriched.filter((r) => r.derived === "Expiring Soon").length;
  const expired = enriched.filter((r) => r.derived === "Expired").length;
  const broken = enriched.filter((r) => r.continuity_broken).length;
  const compliance = total ? Math.round((active / total) * 100) : 0;

  const processData = useMemo(() => {
    const m = new Map<string, number>();
    enriched.forEach((r) => m.set(r.process || "Unknown", (m.get(r.process || "Unknown") ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [enriched]);

  const statusData = [
    { name: "Active", value: active },
    { name: "Expiring", value: expiring },
    { name: "Expired", value: expired },
  ].filter((x) => x.value > 0);

  // Expiry trend — next 12 months
  const expiryTrend = useMemo(() => {
    const buckets: { label: string; count: number; key: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.push({ key, label: d.toLocaleString("en", { month: "short" }), count: 0 });
    }
    enriched.forEach((r) => {
      if (!r.expiry_date) return;
      const d = new Date(r.expiry_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b) => b.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [enriched]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/qualifications" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Qualifications
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">WPQ Dashboard</h1>
          <p className="text-sm text-muted-foreground">Compliance KPIs, expiry trends, and process distribution.</p>
        </div>
        <Link to="/app/qualifications/new"><Button>New WPQ</Button></Link>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi icon={<Users className="size-4" />} label="Total" value={total} />
        <Kpi icon={<ShieldCheck className="size-4 text-emerald-500" />} label="Active" value={active} />
        <Kpi icon={<Clock className="size-4 text-amber-500" />} label="Expiring" value={expiring} />
        <Kpi icon={<AlertTriangle className="size-4 text-destructive" />} label="Expired" value={expired} />
        <Kpi icon={<AlertTriangle className="size-4 text-destructive" />} label="Continuity" value={broken} />
        <Kpi icon={<TrendingUp className="size-4 text-primary" />} label="Compliance" value={`${compliance}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Process distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={processData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {processData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Status overview</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Expiry trend (next 12 months)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={expiryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Expiring soon</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start font-medium px-4 py-2">WPQ</th>
                <th className="text-start font-medium px-4 py-2">Welder</th>
                <th className="text-start font-medium px-4 py-2">Process</th>
                <th className="text-start font-medium px-4 py-2">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {enriched.filter((r) => r.derived === "Expiring Soon" || r.derived === "Expired")
                .slice(0, 10).map((r) => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="px-4 py-2 font-mono text-xs">
                    <Link to="/app/qualifications/$qualId" params={{ qualId: r.id }} className="hover:text-primary">
                      {r.wpq_number ?? r.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-medium">{r.welder_name}</td>
                  <td className="px-4 py-2">{r.process}</td>
                  <td className="px-4 py-2">{r.expiry_date}</td>
                </tr>
              ))}
              {expiring + expired === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">All qualifications healthy.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </Card>
  );
}
