import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link, B as Button, T as TriangleAlert } from "./router-DGN8uIPq.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { L as Layers } from "./layers-ndoH4caN.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { C as CircleX } from "./circle-x-CEG87Cnk.js";
import { R as ResponsiveContainer, P as PieChart, p as Pie, q as Cell, T as Tooltip, s as Legend, B as BarChart, o as CartesianGrid, X as XAxis, Y as YAxis, r as Bar } from "./PieChart-AboGOAhm.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./useQuery-tHuwiQPC.js";
import "./index-DybbMtR3.js";
const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#64748b", "#ec4899", "#14b8a6"];
function WeldsDashboard() {
  const {
    data
  } = useCompanyRows("welds", {
    order: {
      column: "weld_date"
    }
  });
  const procs = useCompanyRows("procedures");
  const rows = data ?? [];
  const total = rows.length;
  const approved = rows.filter((r) => ["Approved", "Released"].includes(r.workflow_status ?? "")).length;
  const awaiting = rows.filter((r) => r.workflow_status === "Awaiting Inspection").length;
  const ncrOpen = rows.filter((r) => r.workflow_status === "NCR Open").length;
  const rejected = rows.filter((r) => r.workflow_status === "Rejected").length;
  const accepted = rows.filter((r) => r.status === "Accepted").length;
  const workflowData = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      const k = r.workflow_status ?? "Draft";
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [rows]);
  const resultData = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(r.status, (m.get(r.status) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [rows]);
  const trend = reactExports.useMemo(() => {
    const buckets = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.push({
        key,
        label: d.toLocaleString("en", {
          month: "short"
        }),
        count: 0
      });
    }
    rows.forEach((r) => {
      const d = new Date(r.weld_date ?? r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b2) => b2.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [rows]);
  const topWelders = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      if (!r.welder_name) return;
      m.set(r.welder_name, (m.get(r.welder_name) ?? 0) + 1);
    });
    return Array.from(m.entries()).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [rows]);
  const topWps = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      if (!r.procedure_id) return;
      m.set(r.procedure_id, (m.get(r.procedure_id) ?? 0) + 1);
    });
    return Array.from(m.entries()).map(([id, count]) => ({
      name: procs.data?.find((p) => p.id === id)?.code ?? id.slice(0, 6),
      count
    })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [rows, procs.data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/welds", className: "hover:text-foreground inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
          " Weld Log"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight mt-1", children: "Welds Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Pipeline KPIs, workflow distribution, top welders & WPS." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/welds", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Go to log" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4" }), label: "Total welds", value: total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-amber-500" }), label: "Awaiting inspection", value: awaiting }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-destructive" }), label: "NCR open", value: ncrOpen }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-emerald-500" }), label: "Approved/Released", value: approved }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-emerald-500" }), label: "Accepted result", value: accepted }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive" }), label: "Rejected", value: rejected })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Workflow distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: workflowData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, label: true, children: workflowData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Result distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: resultData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, label: true, children: resultData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Welds logged (last 12 months)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: trend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", stroke: "hsl(var(--muted-foreground))", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "hsl(var(--muted-foreground))", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "hsl(var(--primary))", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Top welders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: topWelders, layout: "vertical", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", stroke: "hsl(var(--muted-foreground))", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "name", stroke: "hsl(var(--muted-foreground))", fontSize: 12, width: 110 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "#10b981", radius: [0, 4, 4, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Top WPS by usage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: topWps, layout: "vertical", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", stroke: "hsl(var(--muted-foreground))", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "name", stroke: "hsl(var(--muted-foreground))", fontSize: 12, width: 110 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "#8b5cf6", radius: [0, 4, 4, 0] })
        ] }) }) })
      ] })
    ] })
  ] });
}
function Kpi({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1", children: value })
  ] });
}
export {
  WeldsDashboard as component
};
