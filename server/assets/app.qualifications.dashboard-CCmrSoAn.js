import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link, B as Button, T as TriangleAlert } from "./router-DGN8uIPq.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { c as continuityBroken, d as deriveQualStatus } from "./qualification-status-CLO5y49_.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { T as TrendingUp } from "./trending-up-BULMghd6.js";
import { R as ResponsiveContainer, P as PieChart, p as Pie, q as Cell, T as Tooltip, s as Legend, B as BarChart, o as CartesianGrid, X as XAxis, Y as YAxis, r as Bar } from "./PieChart-AboGOAhm.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./useQuery-tHuwiQPC.js";
import "./format-gAjFLL1B.js";
import "./index-DybbMtR3.js";
const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
function WpqDashboard() {
  const {
    data
  } = useCompanyRows("qualifications", {
    order: {
      column: "expiry_date",
      ascending: true
    }
  });
  const rows = data ?? [];
  const enriched = reactExports.useMemo(() => rows.map((r) => ({
    ...r,
    derived: deriveQualStatus(r),
    continuity_broken: continuityBroken(r.last_continuity_date)
  })), [rows]);
  const total = enriched.length;
  const active = enriched.filter((r) => r.derived === "Active").length;
  const expiring = enriched.filter((r) => r.derived === "Expiring Soon").length;
  const expired = enriched.filter((r) => r.derived === "Expired").length;
  const broken = enriched.filter((r) => r.continuity_broken).length;
  const compliance = total ? Math.round(active / total * 100) : 0;
  const processData = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    enriched.forEach((r) => m.set(r.process || "Unknown", (m.get(r.process || "Unknown") ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [enriched]);
  const statusData = [{
    name: "Active",
    value: active
  }, {
    name: "Expiring",
    value: expiring
  }, {
    name: "Expired",
    value: expired
  }].filter((x) => x.value > 0);
  const expiryTrend = reactExports.useMemo(() => {
    const buckets = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      buckets.push({
        key,
        label: d.toLocaleString("en", {
          month: "short"
        }),
        count: 0
      });
    }
    enriched.forEach((r) => {
      if (!r.expiry_date) return;
      const d = new Date(r.expiry_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b2) => b2.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [enriched]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/qualifications", className: "hover:text-foreground inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
          " Qualifications"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight mt-1", children: "WPQ Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Compliance KPIs, expiry trends, and process distribution." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "New WPQ" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }), label: "Total", value: total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-emerald-500" }), label: "Active", value: active }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-amber-500" }), label: "Expiring", value: expiring }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-destructive" }), label: "Expired", value: expired }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-destructive" }), label: "Continuity", value: broken }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-primary" }), label: "Compliance", value: `${compliance}%` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Process distribution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: processData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, label: true, children: processData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Status overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: statusData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, label: true, children: statusData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Expiry trend (next 12 months)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: expiryTrend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", stroke: "hsl(var(--muted-foreground))", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "hsl(var(--muted-foreground))", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "hsl(var(--primary))", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Expiring soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "WPQ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "Welder" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "Process" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "Expiry" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          enriched.filter((r) => r.derived === "Expiring Soon" || r.derived === "Expired").slice(0, 10).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/qualifications/$qualId", params: {
              qualId: r.id
            }, className: "hover:text-primary", children: r.wpq_number ?? r.id.slice(0, 8) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-medium", children: r.welder_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.process }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.expiry_date })
          ] }, r.id)),
          expiring + expired === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-sm text-muted-foreground", children: "All qualifications healthy." }) })
        ] })
      ] }) })
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
  WpqDashboard as component
};
