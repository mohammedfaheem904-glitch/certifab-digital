import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Layers, Clock, CheckCircle2, XCircle, AlertTriangle, ShieldCheck,
} from "lucide-react";
import { useCompanyRows } from "@/lib/use-company-rows";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/app/welds/dashboard")({
  component: WeldsDashboard,
});

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#64748b", "#ec4899", "#14b8a6"];

type Row = {
  id: string;
  weld_no: string;
  welder_name: string | null;
  status: string;
  workflow_status: string | null;
  weld_date: string;
  created_at: string;
  procedure_id: string | null;
};

type Procedure = { id: string; code: string };

function WeldsDashboard() {
  const { data } = useCompanyRows<Row>("welds", { order: { column: "weld_date" } });
  const procs = useCompanyRows<Procedure>("procedures");
  const rows = data ?? [];

  const total = rows.length;
  const approved = rows.filter((r) => ["Approved", "Released"].includes(r.workflow_status ?? "")).length;
  const awaiting = rows.filter((r) => r.workflow_status === "Awaiting Inspection").length;
  const ncrOpen = rows.filter((r) => r.workflow_status === "NCR Open").length;
  const rejected = rows.filter((r) => r.workflow_status === "Rejected").length;
  const accepted = rows.filter((r) => r.status === "Accepted").length;

  const workflowData = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const k = r.workflow_status ?? "Draft";
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const resultData = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.status, (m.get(r.status) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
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
      const d = new Date(r.weld_date ?? r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b) => b.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [rows]);

  const topWelders = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      if (!r.welder_name) return;
      m.set(r.welder_name, (m.get(r.welder_name) ?? 0) + 1);
    });
    return Array.from(m.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [rows]);

  const topWps = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      if (!r.procedure_id) return;
      m.set(r.procedure_id, (m.get(r.procedure_id) ?? 0) + 1);
    });
    return Array.from(m.entries())
      .map(([id, count]) => ({
        name: procs.data?.find((p) => p.id === id)?.code ?? id.slice(0, 6),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [rows, procs.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/welds" search={{ workflow: undefined }} className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Weld Log
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">Welds Dashboard</h1>
          <p className="text-sm text-muted-foreground">Pipeline KPIs, workflow distribution, top welders & WPS.</p>
        </div>
        <Link to="/app/welds" search={{ workflow: undefined }}><Button>Go to log</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi icon={<Layers className="size-4" />} label="Total welds" value={total} />
        <Kpi icon={<Clock className="size-4 text-amber-500" />} label="Awaiting inspection" value={awaiting} />
        <Kpi icon={<AlertTriangle className="size-4 text-destructive" />} label="NCR open" value={ncrOpen} />
        <Kpi icon={<ShieldCheck className="size-4 text-emerald-500" />} label="Approved/Released" value={approved} />
        <Kpi icon={<CheckCircle2 className="size-4 text-emerald-500" />} label="Accepted result" value={accepted} />
        <Kpi icon={<XCircle className="size-4 text-destructive" />} label="Rejected" value={rejected} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Workflow distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={workflowData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {workflowData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Result distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={resultData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                  {resultData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-3">Welds logged (last 12 months)</h3>
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

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Top welders</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topWelders} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Top WPS by usage</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topWps} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
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
