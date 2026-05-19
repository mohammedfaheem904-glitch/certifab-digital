import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Activity, FileEdit, Plus, Trash2, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditRow {
  id: string;
  created_at: string;
  table_name: string;
  record_id: string | null;
  action: string;
  actor_id: string | null;
}

/**
 * Cross-entity activity feed — pulls the most recent audit_logs rows for the
 * tenant so users see real-time engineering activity directly on the dashboard,
 * not only on /app/audit.
 */
export function RecentActivityFeed({ limit = 12 }: { limit?: number }) {
  const { profile } = useAuth();
  const cid = profile?.company_id;
  const q = useQuery<AuditRow[]>({
    queryKey: ["dashboard-audit", cid, limit],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, created_at, table_name, record_id, action, actor_id")
        .eq("company_id", cid!)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
  });

  if (q.isLoading) return <Skeleton className="h-72 w-full" />;
  const rows = q.data ?? [];
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No activity yet. As welds, NCRs and qualifications change, you'll see them here.
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {rows.map((r) => <Row key={r.id} r={r} />)}
    </ul>
  );
}

function Row({ r }: { r: AuditRow }) {
  const Icon =
    r.action === "INSERT" ? Plus :
    r.action === "UPDATE" ? FileEdit :
    r.action === "DELETE" ? Trash2 :
    r.action.includes("soft") ? Trash2 :
    r.action.includes("restore") ? ArrowRightLeft :
    Activity;
  const verb =
    r.action === "INSERT" ? "created" :
    r.action === "UPDATE" ? "updated" :
    r.action === "DELETE" ? "deleted" :
    r.action.replace(/_/g, " ");
  const target = humanizeTable(r.table_name);
  const link = recordLink(r.table_name, r.record_id);
  const time = relTime(r.created_at);

  const content = (
    <div className="flex items-start gap-3 rounded-md px-2 py-1.5 hover:bg-muted/40">
      <div className="mt-0.5 size-7 rounded-md grid place-items-center bg-muted">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm">
          <span className="font-medium capitalize">{verb}</span>{" "}
          <span className="text-muted-foreground">{target}</span>
        </div>
        <div className="text-[11px] text-muted-foreground">{time}</div>
      </div>
    </div>
  );
  return <li>{link ? <Link to={link.to} params={link.params as any}>{content}</Link> : content}</li>;
}

function humanizeTable(t: string): string {
  const map: Record<string, string> = {
    welds: "weld",
    ncrs: "NCR",
    qualifications: "qualification",
    procedures: "WPS / procedure",
    inspections: "inspection",
    instruments: "instrument",
    projects: "project",
    procedure_revisions: "procedure revision",
    procedure_approvals: "procedure approval",
    qualification_signatures: "qualification signature",
  };
  return map[t] ?? t.replace(/_/g, " ");
}

function recordLink(table: string, id: string | null): { to: string; params: Record<string, string> } | null {
  if (!id) return null;
  switch (table) {
    case "welds": return { to: "/app/welds/$weldId", params: { weldId: id } };
    case "ncrs": return { to: "/app/ncrs/$ncrId", params: { ncrId: id } };
    case "qualifications": return { to: "/app/qualifications/$qualId", params: { qualId: id } };
    case "procedures": return { to: "/app/procedures/$procedureId", params: { procedureId: id } };
    case "instruments": return { to: "/app/instruments/$instrumentId", params: { instrumentId: id } };
    default: return null;
  }
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
