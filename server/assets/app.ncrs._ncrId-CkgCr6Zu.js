import { U as jsxRuntimeExports, r as reactExports } from "./server-BEiNT1sm.js";
import { a3 as Route, a as useNavigate, b as useAuth, g as useQueryClient, B as Button, L as Link, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BSpN8byK.js";
import { S as Skeleton } from "./skeleton-DxehOMK1.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { L as Label } from "./label-DgglCfez.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { S as StatusBadge } from "./StatusBadge-Dmv7vWBA.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { R as ReportShell, S as SectionTitle, K as KvTable } from "./ReportShell-DFFKdsOP.js";
import { f as fmtEngDate } from "./doc-number-DocNUsKJ.js";
import { d as daysUntil } from "./format-gAjFLL1B.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-DH7MMPOO.js";
import "./index-Df5iUNGq.js";
import "./index-BuCuGgC7.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
import "./check-DS8b9zeL.js";
import "./file-spreadsheet-CPXneq8K.js";
import "./shield-check-BhHQurBT.js";
function NcrReportDocument({ ncr, events = [] }) {
  const approvals = events.map((e) => ({
    action: e.kind?.replace(/_/g, " ") ?? "event",
    actor_name: e.actor_name ?? null,
    actor_role: null,
    signed_at: e.created_at,
    comment: e.comment ?? null
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ReportShell,
    {
      title: "Non-Conformance Report",
      subtitle: ncr.title,
      docType: "NCR",
      entityId: ncr.id,
      revision: "Rev 0",
      status: ncr.status,
      classification: "Quality Record · Controlled",
      meta: [
        { label: "NCR No.", value: ncr.ncr_no },
        { label: "Severity", value: ncr.severity ?? "—" },
        { label: "Raised on", value: fmtEngDate(ncr.created_at) },
        { label: "Due date", value: fmtEngDate(ncr.due_date) }
      ],
      approvalHistory: approvals,
      signatories: [
        { role: "Raised by", name: ncr.raised_by_name, date: ncr.created_at },
        { role: "QA/QC Manager" },
        { role: "Closed by", name: ncr.closed_by, date: ncr.closed_at }
      ],
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 1, title: "Identification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KvTable, { rows: [
          ["NCR Number", ncr.ncr_no],
          ["Title", ncr.title],
          ["Severity", ncr.severity ?? "—"],
          ["Status", ncr.status],
          ["Raised by", ncr.raised_by_name ?? "—"],
          ["Assigned to", ncr.assigned_to_name ?? "—"]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 2, title: "Description of Non-Conformance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]", children: ncr.description ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 3, title: "Root Cause Analysis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]", children: ncr.root_cause ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 4, title: "Corrective Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]", children: ncr.corrective_action ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 5, title: "Preventive Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10pt] whitespace-pre-wrap border border-foreground/30 p-3 min-h-[60pt]", children: ncr.preventive_action ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { index: 6, title: "Closure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KvTable, { rows: [
          ["Closed on", fmtEngDate(ncr.closed_at)],
          ["Closed by", ncr.closed_by ?? "—"],
          ["Verification of effectiveness", ncr.status === "Closed" ? "Verified" : "Pending"]
        ] })
      ]
    }
  );
}
const FLOW = ["Open", "Root Cause", "CA Pending", "In Review", "Closed"];
function NcrDetail() {
  const {
    ncrId
  } = Route.useParams();
  const nav = useNavigate();
  const {
    profile,
    user
  } = useAuth();
  const qc = useQueryClient();
  const ncr = useQuery({
    queryKey: ["ncr", ncrId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("ncrs").select("*").eq("id", ncrId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const events = useQuery({
    queryKey: ["ncr_events", ncrId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("ncr_events").select("*").eq("ncr_id", ncrId).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const [drafts, setDrafts] = reactExports.useState({});
  const [busy, setBusy] = reactExports.useState(false);
  if (ncr.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" })
  ] });
  if (!ncr.data) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "NCR not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", onClick: () => nav({
      to: "/app/ncrs"
    }), children: "Back" })
  ] });
  const n = ncr.data;
  const d = n.due_date ? daysUntil(n.due_date) : null;
  const overdue = d != null && d < 0 && !["Closed", "Rejected"].includes(n.status);
  const update = async (patch, eventKind, comment) => {
    setBusy(true);
    const {
      error
    } = await supabase.from("ncrs").update(patch).eq("id", ncrId);
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    if (eventKind && profile?.company_id) {
      await supabase.from("ncr_events").insert({
        company_id: profile.company_id,
        ncr_id: ncrId,
        kind: eventKind,
        actor_id: user?.id ?? null,
        comment,
        payload: patch
      });
    }
    setBusy(false);
    qc.invalidateQueries({
      queryKey: ["ncr", ncrId]
    });
    qc.invalidateQueries({
      queryKey: ["ncr_events", ncrId]
    });
    toast.success("Updated.");
  };
  const advance = async () => {
    const idx = FLOW.indexOf(n.status);
    const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : "Closed";
    const patch = {
      status: next
    };
    if (next === "Closed") {
      patch.closed_at = (/* @__PURE__ */ new Date()).toISOString();
      patch.closed_by = user?.id ?? null;
    }
    await update(patch, "status_advance");
  };
  const reject = () => update({
    status: "Rejected"
  }, "rejected");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/ncrs", className: "hover:text-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
        " NCRs"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: n.ncr_no })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: n.ncr_no }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: n.severity ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: n.status }),
            overdue && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-destructive/10 text-destructive border-destructive/30", variant: "outline", children: [
              "Overdue ",
              Math.abs(d),
              "d"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1", children: n.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
            "Raised ",
            new Date(n.created_at).toLocaleString(),
            " · Due ",
            n.due_date ?? "—"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: !["Closed", "Rejected"].includes(n.status) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: reject, disabled: busy, children: "Reject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: advance, disabled: busy, className: "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : `Advance → ${FLOW[Math.min(FLOW.indexOf(n.status) + 1, FLOW.length - 1)] ?? "Closed"}` })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center gap-1 text-xs", children: FLOW.map((s, i) => {
        const idx = FLOW.indexOf(n.status);
        const reached = i <= idx;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded ${reached ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground"}`, children: s }),
          i < FLOW.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" })
        ] }, s);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "workflow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "print:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "workflow", children: "Workflow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "audit", children: [
          "Audit trail (",
          events.data?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "report", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 me-1.5" }),
          "NCR Report"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "workflow", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Description", value: n.description, field: "description", drafts, setDrafts, onSave: (v) => update({
          description: v
        }, "description_updated") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Root cause", value: n.root_cause, field: "root_cause", drafts, setDrafts, onSave: (v) => update({
          root_cause: v
        }, "root_cause_updated") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Corrective action", value: n.corrective_action, field: "corrective_action", drafts, setDrafts, onSave: (v) => update({
          corrective_action: v
        }, "ca_updated") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Preventive action", value: n.preventive_action, field: "preventive_action", drafts, setDrafts, onSave: (v) => update({
          preventive_action: v
        }, "pa_updated") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: "Workflow controls" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Severity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: n.severity ?? "Medium", onValueChange: (v) => update({
                severity: v
              }, "severity_changed"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Low", "Medium", "High", "Critical"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Due date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", defaultValue: n.due_date ?? "", onBlur: (e) => e.target.value !== (n.due_date ?? "") && update({
                due_date: e.target.value || null
              }, "due_changed"), className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "audit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "relative border-s border-border ms-2 space-y-4", children: [
        (events.data ?? []).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ms-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: e.kind.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(e.created_at).toLocaleString() }),
          e.comment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-1", children: e.comment })
        ] }, e.id)),
        (events.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No events yet." })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "report", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NcrReportDocument, { ncr: n, events: events.data ?? [] }) })
    ] })
  ] });
}
function Section({
  title,
  value,
  field,
  drafts,
  setDrafts,
  onSave
}) {
  const v = drafts[field] ?? value ?? "";
  const dirty = drafts[field] !== void 0 && drafts[field] !== (value ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", children: title }),
      dirty && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => {
        onSave(v);
        setDrafts((s) => {
          const n = {
            ...s
          };
          delete n[field];
          return n;
        });
      }, children: "Save" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: v, onChange: (e) => setDrafts((s) => ({
      ...s,
      [field]: e.target.value
    })), placeholder: `Enter ${title.toLowerCase()}…` })
  ] });
}
export {
  NcrDetail as component
};
