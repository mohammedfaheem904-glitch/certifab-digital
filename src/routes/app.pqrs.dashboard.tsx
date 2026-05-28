import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck, Clock, CheckCircle2, XCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { useCompanyRows } from "@/lib/use-company-rows";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/app/pqrs/dashboard")({
  component: PqrDashboard,
});

const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#64748b"];

function PqrDashboard() {
  const { data } = useCompanyRows<any>("pqrs" as any, { order: { column: "created_at", ascending: false } });
  const rows = (data ?? []).filter((r: any) => !r.deleted_at);

  const total = rows.length;
  const pending = rows.filter((r) => r.overall_result === "Pending").length;
  const passed = rows.filter((r) => r.overall_result === "Passed").length;
  const failed = rows.filter((r) => r.overall_result === "Failed").length;
  const inconclusive = rows.filter((r) => r.overall_result === "Inconclusive").length;
  const withWps = rows.filter((r) => !!r.resulting_wps_id).length;

  const resultData = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.overall_result, (m.get(r.overall_result) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const codeData = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.code_family || "Unknown", (m.get(r.code_family || "Unknown") ?? 0) + 1));
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
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b) => b.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [rows]);

  const attention = rows.filter((r) => r.overall_result === "Pending" || r.overall_result === "Inconclusive").slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/pqrs" className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="size-3.5" /> PQRs</Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">PQR Dashboard</h1>
          <p className="text-sm text-muted-foreground">Qualification outcomes, pipeline KPIs, and recent activity.</p>
        </div>
        <Link to="/app/pqrs"><Button>Go to list</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Kpi icon={<FileCheck className="size-4" />} label="Total" value={total} />
        <Kpi icon={<Clock className="size-4 text-amber-500" />} label="Pending" value={pending} />
        <Kpi icon={<CheckCircle2 className="size-4 text-emerald-500" />} label="Passed" value={passed} />
        <Kpi icon={<XCircle className="size-4 text-destructive" />} label="Failed" value={failed} />
        <Kpi icon={<AlertTriangle className="size-4 text-warning" />} label="Inconclusive" value={inconclusive} />
        <Kpi icon={<TrendingUp className="size-4 text-primary" />} label="Resulting WPS" value={withWps} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Overall result</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={resultData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {resultData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Code family</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={codeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                  {codeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
        <h3 className="text-sm font-semibold mb-3">Needs attention</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr><th className="text-start font-medium px-4 py-2">PQR</th><th className="text-start font-medium px-4 py-2">Code</th><th className="text-start font-medium px-4 py-2">Status</th><th className="text-start font-medium px-4 py-2">Result</th></tr>
            </thead>
            <tbody>
              {attention.map((r) => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="px-4 py-2 font-mono text-xs"><Link to="/app/pqrs/$pqrId" params={{ pqrId: r.id }} className="hover:text-primary">{r.pqr_no}</Link></td>
                  <td className="px-4 py-2">{r.code_family}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2">{r.overall_result}</td>
                </tr>
              ))}
              {attention.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">All PQRs decided.</td></tr>}
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
