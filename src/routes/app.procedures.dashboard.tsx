import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck, FlaskConical,
  Clock, FileWarning, Activity, GitCompare, Layers, Download,
} from "lucide-react";
import { scoreProcedureHeader, distribution, bulkExportProceduresCsv, bulkExportProceduresXlsx } from "@/lib/wps-export";
import { toast } from "sonner";

export const Route = createFileRoute("/app/procedures/dashboard")({
  component: WpsDashboard,
});

function WpsDashboard() {
  const procs = useCompanyRows<any>("procedures", { order: { column: "updated_at", ascending: false } });
  const welds = useCompanyRows<any>("welds");
  const ncrs = useCompanyRows<any>("ncrs");
  const quals = useCompanyRows<any>("qualifications");
  const nav = useNavigate();

  const rows = procs.data ?? [];
  const weldRows = welds.data ?? [];
  const ncrRows = ncrs.data ?? [];
  const qualRows = quals.data ?? [];

  // Usage maps
  const procWeldCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of weldRows) if (w.procedure_id) m.set(w.procedure_id, (m.get(w.procedure_id) ?? 0) + 1);
    return m;
  }, [weldRows]);

  const procNcrCount = useMemo(() => {
    const m = new Map<string, number>();
    // NCRs reference welds; map weld→procedure
    const weldProc = new Map<string, string>();
    for (const w of weldRows) if (w.procedure_id) weldProc.set(w.id, w.procedure_id);
    for (const n of ncrRows) {
      if (n.status === "Closed") continue;
      const pid = n.weld_id ? weldProc.get(n.weld_id) : null;
      if (pid) m.set(pid, (m.get(pid) ?? 0) + 1);
    }
    return m;
  }, [ncrRows, weldRows]);

  // KPIs
  const kpis = useMemo(() => {
    const by = (s: string) => rows.filter((r) => r.status === s).length;
    const ready = rows.filter((r) => scoreProcedureHeader(r).bucket === "Ready").length;
    const highRisk = rows.filter((r) => {
      const b = scoreProcedureHeader(r).bucket;
      return b === "High Risk" || b === "Critical";
    }).length;
    const inProduction = rows.filter((r) => procWeldCount.has(r.id)).length;
    const ncrImpacted = rows.filter((r) => procNcrCount.has(r.id)).length;
    return {
      total: rows.length,
      draft: by("Draft"),
      review: by("In Review") + by("Pending Review"),
      approved: by("Approved"),
      released: by("Released"),
      rejected: by("Rejected"),
      ready,
      highRisk,
      inProduction,
      ncrImpacted,
    };
  }, [rows, procWeldCount, procNcrCount]);

  // Bottlenecks: stuck in review > 7d
  const bottlenecks = useMemo(() => {
    const now = Date.now();
    return rows
      .filter((r) => ["In Review", "Pending Review", "Draft"].includes(r.status))
      .map((r) => {
        const ageDays = Math.floor((now - new Date(r.submitted_for_review_at ?? r.updated_at).getTime()) / 86400000);
        const readiness = scoreProcedureHeader(r);
        return { ...r, ageDays, readiness };
      })
      .filter((r) => r.ageDays >= 3)
      .sort((a, b) => b.ageDays - a.ageDays)
      .slice(0, 10);
  }, [rows]);

  // Readiness ranking — bottom 10
  const ranking = useMemo(() => {
    return rows
      .map((r) => ({ ...r, readiness: scoreProcedureHeader(r), welds: procWeldCount.get(r.id) ?? 0, ncrs: procNcrCount.get(r.id) ?? 0 }))
      .sort((a, b) => a.readiness.score - b.readiness.score)
      .slice(0, 10);
  }, [rows, procWeldCount, procNcrCount]);

  // Distributions
  const processDist = distribution(rows, "process");
  const standardDist = distribution(rows, "standard");
  const positionDist = distribution(rows, "position_qualified");
  const pwhtDist = distribution(rows.map((r) => ({ pwht: r.pwht ? "Required" : "None" })), "pwht");
  const revisionDist = distribution(rows, "revision");
  const pipeDist = distribution(rows, "pipe_or_plate");

  // Drift candidates: heuristic based on missing PQR or out-of-window heat input
  const driftCandidates = useMemo(() => {
    return rows
      .map((r) => {
        const issues: string[] = [];
        if (!r.pqr_no) issues.push("No PQR linkage");
        if (r.voltage_min != null && r.voltage_max != null && r.voltage_min > r.voltage_max) issues.push("Voltage min > max");
        if (r.current_min != null && r.current_max != null && r.current_min > r.current_max) issues.push("Current min > max");
        if (r.heat_input_min != null && r.heat_input_max != null && r.heat_input_min > r.heat_input_max) issues.push("Heat input window inverted");
        if (r.preheat_min_c != null && r.interpass_max_c != null && Number(r.preheat_min_c) > Number(r.interpass_max_c))
          issues.push("Preheat > Interpass max");
        const welds = procWeldCount.get(r.id) ?? 0;
        return { ...r, issues, welds };
      })
      .filter((r) => r.issues.length > 0)
      .sort((a, b) => b.welds - a.welds || b.issues.length - a.issues.length)
      .slice(0, 8);
  }, [rows, procWeldCount]);

  // Most-used procedures
  const mostUsed = useMemo(() => {
    return rows
      .map((r) => ({ ...r, welds: procWeldCount.get(r.id) ?? 0, ncrs: procNcrCount.get(r.id) ?? 0 }))
      .filter((r) => r.welds > 0)
      .sort((a, b) => b.welds - a.welds)
      .slice(0, 6);
  }, [rows, procWeldCount, procNcrCount]);

  const loading = procs.isLoading || welds.isLoading;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/app/procedures" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="size-3" /> Procedures
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">WPS Operational Dashboard</h1>
          <p className="text-sm text-muted-foreground">Engineering readiness, workflow bottlenecks, and cross-module intelligence for welding procedures.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { bulkExportProceduresCsv(rows, "wps-all"); toast.success("CSV exported"); }}>
            <Download className="size-4 me-1.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await bulkExportProceduresXlsx(rows, "wps-all"); toast.success("XLSX exported"); }}>
            <Download className="size-4 me-1.5" /> Excel
          </Button>
          <Button size="sm" onClick={() => nav({ to: "/app/procedures" })}>Open WPS list</Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Kpi label="Total WPS" value={kpis.total} tone="info" />
        <Kpi label="Draft" value={kpis.draft} tone="muted" linkTo="/app/procedures" />
        <Kpi label="In review" value={kpis.review} tone="warning" linkTo="/app/procedures" />
        <Kpi label="Approved" value={kpis.approved} tone="ok" />
        <Kpi label="Released" value={kpis.released} tone="ok" />
        <Kpi label="Rejected" value={kpis.rejected} tone="danger" />
        <Kpi label="Production-ready" value={kpis.ready} tone="ok" icon={<ShieldCheck className="size-3.5" />} />
        <Kpi label="High risk" value={kpis.highRisk} tone="danger" icon={<AlertTriangle className="size-3.5" />} />
        <Kpi label="Used in production" value={kpis.inProduction} tone="info" icon={<Activity className="size-3.5" />} />
        <Kpi label="NCR impacted" value={kpis.ncrImpacted} tone="danger" icon={<FileWarning className="size-3.5" />} />
        <Kpi label="Welds tracked" value={weldRows.length} tone="muted" />
        <Kpi label="Qualified welders" value={qualRows.filter((q: any) => q.status === "Active").length} tone="muted" />
      </div>

      {/* Bottlenecks + Drift */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Clock className="size-4 text-warning" /> Workflow Bottlenecks</CardTitle>
            <p className="text-xs text-muted-foreground">Procedures awaiting action 3+ days. Aging ranked first.</p>
          </CardHeader>
          <CardContent>
            {bottlenecks.length === 0 ? (
              <Empty>No procedures stuck in review.</Empty>
            ) : (
              <ul className="space-y-1.5">
                {bottlenecks.map((b: any) => (
                  <li key={b.id}>
                    <Link to="/app/procedures/$procedureId" params={{ procedureId: b.id }}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40 transition">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{b.code} <span className="text-muted-foreground text-xs">· {b.process}</span></div>
                        <div className="text-xs text-muted-foreground">{b.status} · {b.readiness.reasons[0] ?? "No major findings"}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={b.ageDays >= 14 ? "destructive" : b.ageDays >= 7 ? "default" : "secondary"}>
                          {b.ageDays}d
                        </Badge>
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><GitCompare className="size-4 text-destructive" /> Parameter Drift Center</CardTitle>
            <p className="text-xs text-muted-foreground">Procedures with inverted windows, missing PQRs or thermal inconsistencies.</p>
          </CardHeader>
          <CardContent>
            {driftCandidates.length === 0 ? (
              <Empty>No drift candidates detected.</Empty>
            ) : (
              <ul className="space-y-1.5">
                {driftCandidates.map((d: any) => (
                  <li key={d.id}>
                    <Link to="/app/procedures/$procedureId" params={{ procedureId: d.id }}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40 transition">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{d.code}</div>
                        <div className="text-xs text-muted-foreground truncate">{d.issues.join(" · ")}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {d.welds > 0 && <Badge variant="destructive">{d.welds} welds</Badge>}
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Readiness ranking + Most used */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="size-4 text-info" /> Lowest-Readiness Procedures</CardTitle>
            <p className="text-xs text-muted-foreground">Engineering attention needed first.</p>
          </CardHeader>
          <CardContent>
            {ranking.length === 0 ? <Empty>No procedures yet.</Empty> : (
              <ul className="space-y-2">
                {ranking.map((r: any) => (
                  <li key={r.id}>
                    <Link to="/app/procedures/$procedureId" params={{ procedureId: r.id }}
                      className="block rounded-md px-2 py-1.5 hover:bg-muted/40 transition">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="text-sm font-medium truncate">{r.code} <span className="text-xs text-muted-foreground">· {r.process}</span></div>
                        <Badge variant={r.readiness.bucket === "Critical" ? "destructive" : r.readiness.bucket === "High Risk" ? "destructive" : r.readiness.bucket === "Attention" ? "default" : "secondary"}>
                          {r.readiness.bucket} · {r.readiness.score}
                        </Badge>
                      </div>
                      <Progress value={r.readiness.score} className="h-1.5" />
                      <div className="text-[11px] text-muted-foreground mt-1 truncate">
                        {r.readiness.reasons.slice(0, 2).join(" · ") || "All checks passing"}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Activity className="size-4 text-success" /> Most-Used in Production</CardTitle>
            <p className="text-xs text-muted-foreground">Procedures driving the highest weld volume.</p>
          </CardHeader>
          <CardContent>
            {mostUsed.length === 0 ? <Empty>No production welds linked yet.</Empty> : (
              <ul className="space-y-1.5">
                {mostUsed.map((m: any) => (
                  <li key={m.id}>
                    <Link to="/app/procedures/$procedureId" params={{ procedureId: m.id }}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40 transition">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{m.code}</div>
                        <div className="text-xs text-muted-foreground">{m.process} · {m.standard}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary">{m.welds} welds</Badge>
                        {m.ncrs > 0 && <Badge variant="destructive">{m.ncrs} NCR</Badge>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Engineering distributions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Layers className="size-4" /> Engineering Compliance Analytics</CardTitle>
          <p className="text-xs text-muted-foreground">Distribution of qualified procedures across engineering dimensions.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <DistChart title="Welding processes" data={processDist} />
            <DistChart title="Code / Standard" data={standardDist} />
            <DistChart title="Position qualified" data={positionDist} />
            <DistChart title="PWHT usage" data={pwhtDist} />
            <DistChart title="Revisions" data={revisionDist} />
            <DistChart title="Pipe vs Plate" data={pipeDist} />
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center text-xs text-muted-foreground py-4 flex items-center justify-center gap-2">
          <FlaskConical className="size-3.5 animate-pulse" /> Loading engineering data…
        </div>
      )}
    </div>
  );
}

function Kpi({
  label, value, tone, icon, linkTo,
}: {
  label: string; value: number; tone: "ok" | "info" | "warning" | "danger" | "muted";
  icon?: React.ReactNode; linkTo?: string;
}) {
  const cls = {
    ok: "border-success/30 bg-success/5",
    info: "border-info/30 bg-info/5",
    warning: "border-warning/40 bg-warning/5",
    danger: "border-destructive/40 bg-destructive/5",
    muted: "border-border bg-background",
  }[tone];
  const inner = (
    <div className={`rounded-xl border ${cls} p-3 h-full transition hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-semibold mt-1.5 leading-none tabular-nums">{value}</div>
    </div>
  );
  return linkTo ? <Link to={linkTo as any}>{inner}</Link> : inner;
}

function DistChart({ title, data }: { title: string; data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const top = data.slice(0, 6);
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground mb-2">{title}</div>
      {top.length === 0 ? (
        <div className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded">No data</div>
      ) : (
        <ul className="space-y-1.5">
          {top.map((d) => (
            <li key={d.label} className="flex items-center gap-2">
              <div className="w-20 shrink-0 text-xs truncate" title={d.label}>{d.label}</div>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary/60" style={{ width: `${(d.count / max) * 100}%` }} />
              </div>
              <div className="w-8 text-end text-xs tabular-nums text-muted-foreground">{d.count}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-muted-foreground py-6 text-center">{children}</div>;
}
