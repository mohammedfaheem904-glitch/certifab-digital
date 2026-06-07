import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Activity, Pause, CheckCircle2, XCircle, Users } from "lucide-react";
import { useCompanyRows } from "@/lib/use-company-rows";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/app/projects/dashboard")({
  component: ProjectsDashboard,
});

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#64748b"];

type Row = {
  id: string;
  code: string;
  name: string;
  client: string | null;
  status: string;
  created_at: string;
};

function ProjectsDashboard() {
  const { data } = useCompanyRows<Row>("projects", { order: { column: "created_at", ascending: false } });
  const rows = data ?? [];

  const total = rows.length;
  const active = rows.filter((r) => r.status === "Active").length;
  const onHold = rows.filter((r) => r.status === "On Hold").length;
  const completed = rows.filter((r) => r.status === "Completed").length;
  const cancelled = rows.filter((r) => r.status === "Cancelled").length;
  const distinctClients = new Set(rows.map((r) => r.client).filter(Boolean)).size;

  const statusData = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.status, (m.get(r.status) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const clientData = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const k = r.client || "Unspecified";
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ name, value }));
  }, [rows]);

  const trend = useMemo(() => {
    const buckets: { label: string; count: number; key: string }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.push({ key, label: d.toLocaleString("en", { month: "short" }), count: 0 });
    }
    rows.forEach((r) => {
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b) => b.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [rows]);

  const recent = rows.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/projects" className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="size-3.5" /> Projects</Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Projects Dashboard</h1>
          <p className="text-sm text-muted-foreground">Portfolio KPIs, status mix, and recent activity.</p>
        </div>
        <Link to="/app/projects"><Button>Go to list</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi icon={<Briefcase className="size-4" />} label="Total" value={total} />
        <Kpi icon={<Activity className="size-4 text-emerald-500" />} label="Active" value={active} />
        <Kpi icon={<Pause className="size-4 text-amber-500" />} label="On Hold" value={onHold} />
        <Kpi icon={<CheckCircle2 className="size-4 text-emerald-500" />} label="Completed" value={completed} />
        <Kpi icon={<XCircle className="size-4 text-destructive" />} label="Cancelled" value={cancelled} />
        <Kpi icon={<Users className="size-4 text-primary" />} label="Clients" value={distinctClients} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Status distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Top clients</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={clientData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                  {clientData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Created (last 12 months)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={trend}>
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
        <h3 className="text-sm font-semibold mb-3">Recently created</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start font-medium px-4 py-2">Code</th>
                <th className="text-start font-medium px-4 py-2">Name</th>
                <th className="text-start font-medium px-4 py-2">Client</th>
                <th className="text-start font-medium px-4 py-2">Status</th>
                <th className="text-start font-medium px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="px-4 py-2 font-mono text-xs"><Link to="/app/projects/$projectId" params={{ projectId: r.id }} className="hover:text-primary">{r.code}</Link></td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.client ?? "—"}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">No projects yet.</td></tr>}
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
