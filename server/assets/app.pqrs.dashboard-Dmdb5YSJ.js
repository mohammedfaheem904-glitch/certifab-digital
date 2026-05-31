import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, L as Link, B as Button, T as TriangleAlert } from "./router-DGN8uIPq.js";
import { C as Card } from "./card-QRh3nxuz.js";
import { u as useCompanyRows } from "./use-company-rows-C8B2FfJG.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { C as CircleX } from "./circle-x-CEG87Cnk.js";
import { T as TrendingUp } from "./trending-up-BULMghd6.js";
import { R as ResponsiveContainer, P as PieChart, p as Pie, q as Cell, T as Tooltip, s as Legend, B as BarChart, o as CartesianGrid, X as XAxis, Y as YAxis, r as Bar } from "./PieChart-AboGOAhm.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./useQuery-tHuwiQPC.js";
import "./index-DybbMtR3.js";
const __iconNode = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "m9 15 2 2 4-4", key: "1grp1n" }]
];
const FileCheck = createLucideIcon("file-check", __iconNode);
const COLORS = ["hsl(var(--primary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#64748b"];
function PqrDashboard() {
  const {
    data
  } = useCompanyRows("pqrs", {
    order: {
      column: "created_at",
      ascending: false
    }
  });
  const rows = (data ?? []).filter((r) => !r.deleted_at);
  const total = rows.length;
  const pending = rows.filter((r) => r.overall_result === "Pending").length;
  const passed = rows.filter((r) => r.overall_result === "Passed").length;
  const failed = rows.filter((r) => r.overall_result === "Failed").length;
  const inconclusive = rows.filter((r) => r.overall_result === "Inconclusive").length;
  const withWps = rows.filter((r) => !!r.resulting_wps_id).length;
  const resultData = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(r.overall_result, (m.get(r.overall_result) ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({
      name,
      value
    }));
  }, [rows]);
  const codeData = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    rows.forEach((r) => m.set(r.code_family || "Unknown", (m.get(r.code_family || "Unknown") ?? 0) + 1));
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
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const b = buckets.find((b2) => b2.key === key);
      if (b) b.count += 1;
    });
    return buckets;
  }, [rows]);
  const attention = rows.filter((r) => r.overall_result === "Pending" || r.overall_result === "Inconclusive").slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/pqrs", className: "hover:text-foreground inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
          " PQRs"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight mt-1", children: "PQR Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Qualification outcomes, pipeline KPIs, and recent activity." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pqrs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Go to list" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { className: "size-4" }), label: "Total", value: total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-amber-500" }), label: "Pending", value: pending }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-emerald-500" }), label: "Passed", value: passed }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive" }), label: "Failed", value: failed }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-warning" }), label: "Inconclusive", value: inconclusive }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-primary" }), label: "Resulting WPS", value: withWps })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Overall result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: resultData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, label: true, children: resultData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Code family" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: codeData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, label: true, children: codeData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Created (last 12 months)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: trend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", stroke: "hsl(var(--muted-foreground))", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "hsl(var(--muted-foreground))", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "count", fill: "hsl(var(--primary))", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Needs attention" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-muted-foreground bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "PQR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-start font-medium px-4 py-2", children: "Result" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          attention.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/pqrs/$pqrId", params: {
              pqrId: r.id
            }, className: "hover:text-primary", children: r.pqr_no }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.code_family }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.overall_result })
          ] }, r.id)),
          attention.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-sm text-muted-foreground", children: "All PQRs decided." }) })
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
  PqrDashboard as component
};
