import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, a as useNavigate, L as Link, B as Button, t as toast, T as TriangleAlert } from "./router-DGN8uIPq.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-QRh3nxuz.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { P as Progress } from "./progress-DVwsDxkn.js";
import { s as scoreProcedureHeader, d as distribution, b as bulkExportProceduresCsv, a as bulkExportProceduresXlsx } from "./wps-export-Cgb3CbaI.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { D as Download } from "./download-BKvKMLMR.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { A as Activity } from "./activity-D9iRMj5N.js";
import { F as FileExclamationPoint } from "./file-exclamation-point-D_pdeduv.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { G as GitCompare } from "./git-compare-lZGv20XO.js";
import { L as Layers } from "./layers-ndoH4caN.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./useQuery-tHuwiQPC.js";
import "./export-BKxIOV_6.js";
import "crypto";
import "fs";
import "stream";
import "events";
import "buffer";
import "util";
import "string_decoder";
import "path";
import "constants";
import "assert";
import "zlib";
import "os";
const __iconNode = [
  [
    "path",
    {
      d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
      key: "18mbvz"
    }
  ],
  ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }]
];
const FlaskConical = createLucideIcon("flask-conical", __iconNode);
function WpsDashboard() {
  const procs = useCompanyRows("procedures", {
    order: {
      column: "updated_at",
      ascending: false
    }
  });
  const welds = useCompanyRows("welds");
  const ncrs = useCompanyRows("ncrs");
  const quals = useCompanyRows("qualifications");
  const nav = useNavigate();
  const rows = procs.data ?? [];
  const weldRows = welds.data ?? [];
  const ncrRows = ncrs.data ?? [];
  const qualRows = quals.data ?? [];
  const procWeldCount = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const w of weldRows) if (w.procedure_id) m.set(w.procedure_id, (m.get(w.procedure_id) ?? 0) + 1);
    return m;
  }, [weldRows]);
  const procNcrCount = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    const weldProc = /* @__PURE__ */ new Map();
    for (const w of weldRows) if (w.procedure_id) weldProc.set(w.id, w.procedure_id);
    for (const n of ncrRows) {
      if (n.status === "Closed") continue;
      const pid = n.weld_id ? weldProc.get(n.weld_id) : null;
      if (pid) m.set(pid, (m.get(pid) ?? 0) + 1);
    }
    return m;
  }, [ncrRows, weldRows]);
  const kpis = reactExports.useMemo(() => {
    const by = (s) => rows.filter((r) => r.status === s).length;
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
      ncrImpacted
    };
  }, [rows, procWeldCount, procNcrCount]);
  const bottlenecks = reactExports.useMemo(() => {
    const now = Date.now();
    return rows.filter((r) => ["In Review", "Pending Review", "Draft"].includes(r.status)).map((r) => {
      const ageDays = Math.floor((now - new Date(r.submitted_for_review_at ?? r.updated_at).getTime()) / 864e5);
      const readiness = scoreProcedureHeader(r);
      return {
        ...r,
        ageDays,
        readiness
      };
    }).filter((r) => r.ageDays >= 3).sort((a, b) => b.ageDays - a.ageDays).slice(0, 10);
  }, [rows]);
  const ranking = reactExports.useMemo(() => {
    return rows.map((r) => ({
      ...r,
      readiness: scoreProcedureHeader(r),
      welds: procWeldCount.get(r.id) ?? 0,
      ncrs: procNcrCount.get(r.id) ?? 0
    })).sort((a, b) => a.readiness.score - b.readiness.score).slice(0, 10);
  }, [rows, procWeldCount, procNcrCount]);
  const processDist = distribution(rows, "process");
  const standardDist = distribution(rows, "standard");
  const positionDist = distribution(rows, "position_qualified");
  const pwhtDist = distribution(rows.map((r) => ({
    pwht: r.pwht ? "Required" : "None"
  })), "pwht");
  const revisionDist = distribution(rows, "revision");
  const pipeDist = distribution(rows, "pipe_or_plate");
  const driftCandidates = reactExports.useMemo(() => {
    return rows.map((r) => {
      const issues = [];
      if (!r.pqr_no) issues.push("No PQR linkage");
      if (r.voltage_min != null && r.voltage_max != null && r.voltage_min > r.voltage_max) issues.push("Voltage min > max");
      if (r.current_min != null && r.current_max != null && r.current_min > r.current_max) issues.push("Current min > max");
      if (r.heat_input_min != null && r.heat_input_max != null && r.heat_input_min > r.heat_input_max) issues.push("Heat input window inverted");
      if (r.preheat_min_c != null && r.interpass_max_c != null && Number(r.preheat_min_c) > Number(r.interpass_max_c)) issues.push("Preheat > Interpass max");
      const welds2 = procWeldCount.get(r.id) ?? 0;
      return {
        ...r,
        issues,
        welds: welds2
      };
    }).filter((r) => r.issues.length > 0).sort((a, b) => b.welds - a.welds || b.issues.length - a.issues.length).slice(0, 8);
  }, [rows, procWeldCount]);
  const mostUsed = reactExports.useMemo(() => {
    return rows.map((r) => ({
      ...r,
      welds: procWeldCount.get(r.id) ?? 0,
      ncrs: procNcrCount.get(r.id) ?? 0
    })).filter((r) => r.welds > 0).sort((a, b) => b.welds - a.welds).slice(0, 6);
  }, [rows, procWeldCount, procNcrCount]);
  const loading = procs.isLoading || welds.isLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/procedures", className: "hover:text-foreground inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3" }),
          " Procedures"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight mt-1", children: "WPS Operational Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Engineering readiness, workflow bottlenecks, and cross-module intelligence for welding procedures." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
          bulkExportProceduresCsv(rows, "wps-all");
          toast.success("CSV exported");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 me-1.5" }),
          " CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: async () => {
          await bulkExportProceduresXlsx(rows, "wps-all");
          toast.success("XLSX exported");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 me-1.5" }),
          " Excel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => nav({
          to: "/app/procedures"
        }), children: "Open WPS list" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Total WPS", value: kpis.total, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Draft", value: kpis.draft, tone: "muted", linkTo: "/app/procedures" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "In review", value: kpis.review, tone: "warning", linkTo: "/app/procedures" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Approved", value: kpis.approved, tone: "ok" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Released", value: kpis.released, tone: "ok" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Rejected", value: kpis.rejected, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Production-ready", value: kpis.ready, tone: "ok", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "High risk", value: kpis.highRisk, tone: "danger", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Used in production", value: kpis.inProduction, tone: "info", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "NCR impacted", value: kpis.ncrImpacted, tone: "danger", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileExclamationPoint, { className: "size-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Welds tracked", value: weldRows.length, tone: "muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { label: "Qualified welders", value: qualRows.filter((q) => q.status === "Active").length, tone: "muted" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-warning" }),
            " Workflow Bottlenecks"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Procedures awaiting action 3+ days. Aging ranked first." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: bottlenecks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No procedures stuck in review." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: bottlenecks.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/procedures/$procedureId", params: {
          procedureId: b.id
        }, className: "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium truncate", children: [
              b.code,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                "· ",
                b.process
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              b.status,
              " · ",
              b.readiness.reasons[0] ?? "No major findings"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: b.ageDays >= 14 ? "destructive" : b.ageDays >= 7 ? "default" : "secondary", children: [
              b.ageDays,
              "d"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 text-muted-foreground" })
          ] })
        ] }) }, b.id)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GitCompare, { className: "size-4 text-destructive" }),
            " Parameter Drift Center"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Procedures with inverted windows, missing PQRs or thermal inconsistencies." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: driftCandidates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No drift candidates detected." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: driftCandidates.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/procedures/$procedureId", params: {
          procedureId: d.id
        }, className: "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: d.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: d.issues.join(" · ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            d.welds > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
              d.welds,
              " welds"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 text-muted-foreground" })
          ] })
        ] }) }, d.id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-info" }),
            " Lowest-Readiness Procedures"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Engineering attention needed first." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: ranking.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No procedures yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: ranking.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/procedures/$procedureId", params: {
          procedureId: r.id
        }, className: "block rounded-md px-2 py-1.5 hover:bg-muted/40 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium truncate", children: [
              r.code,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "· ",
                r.process
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: r.readiness.bucket === "Critical" ? "destructive" : r.readiness.bucket === "High Risk" ? "destructive" : r.readiness.bucket === "Attention" ? "default" : "secondary", children: [
              r.readiness.bucket,
              " · ",
              r.readiness.score
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: r.readiness.score, className: "h-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1 truncate", children: r.readiness.reasons.slice(0, 2).join(" · ") || "All checks passing" })
        ] }) }, r.id)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-success" }),
            " Most-Used in Production"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Procedures driving the highest weld volume." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: mostUsed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { children: "No production welds linked yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: mostUsed.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/procedures/$procedureId", params: {
          procedureId: m.id
        }, className: "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: m.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              m.process,
              " · ",
              m.standard
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
              m.welds,
              " welds"
            ] }),
            m.ncrs > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
              m.ncrs,
              " NCR"
            ] })
          ] })
        ] }) }, m.id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4" }),
          " Engineering Compliance Analytics"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Distribution of qualified procedures across engineering dimensions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistChart, { title: "Welding processes", data: processDist }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistChart, { title: "Code / Standard", data: standardDist }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistChart, { title: "Position qualified", data: positionDist }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistChart, { title: "PWHT usage", data: pwhtDist }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistChart, { title: "Revisions", data: revisionDist }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DistChart, { title: "Pipe vs Plate", data: pipeDist })
      ] }) })
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-muted-foreground py-4 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "size-3.5 animate-pulse" }),
      " Loading engineering data…"
    ] })
  ] });
}
function Kpi({
  label,
  value,
  tone,
  icon,
  linkTo
}) {
  const cls = {
    ok: "border-success/30 bg-success/5",
    info: "border-info/30 bg-info/5",
    warning: "border-warning/40 bg-warning/5",
    danger: "border-destructive/40 bg-destructive/5",
    muted: "border-border bg-background"
  }[tone];
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border ${cls} p-3 h-full transition hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      icon
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1.5 leading-none tabular-nums", children: value })
  ] });
  return linkTo ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: linkTo, children: inner }) : inner;
}
function DistChart({
  title,
  data
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const top = data.slice(0, 6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground mb-2", children: title }),
    top.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded", children: "No data" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: top.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 shrink-0 text-xs truncate", title: d.label, children: d.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary/60", style: {
        width: `${d.count / max * 100}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 text-end text-xs tabular-nums text-muted-foreground", children: d.count })
    ] }, d.label)) })
  ] });
}
function Empty({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground py-6 text-center", children });
}
export {
  WpsDashboard as component
};
