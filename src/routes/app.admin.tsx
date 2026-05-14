import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ShieldAlert, Database, Users, Bell, FileWarning, HardDrive, Activity, Mail, Globe } from "lucide-react";
import { formatDistanceToNow } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin")({
  component: AdminConsole,
});

function AdminConsole() {
  const { profile, roles } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const tables = [
        "welds", "procedures", "qualifications", "inspections",
        "ncrs", "instruments", "projects", "profiles",
      ] as const;
      const counts: Record<string, number> = {};
      await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase
            .from(t as any)
            .select("id", { count: "exact", head: true });
          counts[t] = count ?? 0;
        }),
      );

      // Storage usage estimate from attachment metadata (RLS-scoped).
      const sumSize = async (t: string) => {
        const { data } = await supabase.from(t as any).select("size_bytes");
        return (data ?? []).reduce(
          (a: number, r: any) => a + (r.size_bytes ?? 0),
          0,
        );
      };
      const [a, b, c] = await Promise.all([
        sumSize("procedure_attachments"),
        sumSize("weld_attachments"),
        sumSize("ncr_attachments"),
      ]);
      const storageBytes = a + b + c;

      const { data: pendingInv } = await supabase
        .from("invitations")
        .select("id", { count: "exact" })
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString());

      const { data: openNcrs } = await supabase
        .from("ncrs")
        .select("id")
        .eq("status", "Open");

      const { data: expiringQuals } = await supabase
        .from("qualifications")
        .select("id, welder_name, expiry_date")
        .lte(
          "expiry_date",
          new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 10),
        )
        .order("expiry_date", { ascending: true })
        .limit(10);

      const { data: recentAudit } = await supabase
        .from("audit_logs")
        .select("id, table_name, action, actor_id, created_at")
        .order("created_at", { ascending: false })
        .limit(15);

      return {
        counts,
        storageBytes,
        pendingInvites: pendingInv?.length ?? 0,
        openNcrs: openNcrs?.length ?? 0,
        expiringQuals: expiringQuals ?? [],
        recentAudit: recentAudit ?? [],
      };
    },
  });

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <ShieldAlert className="size-8 mx-auto text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold">Restricted area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The Admin Console is available to workspace owners only.
        </p>
      </div>
    );
  }

  const fmtBytes = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
    return `${(b / 1024 ** 3).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Console</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Workspace health, storage, recent activity, and operational signals.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KPI icon={Database} label="Welds" value={stats?.counts.welds} loading={isLoading} />
        <KPI icon={Database} label="Procedures" value={stats?.counts.procedures} loading={isLoading} />
        <KPI icon={Users} label="Members" value={stats?.counts.profiles} loading={isLoading} />
        <KPI icon={Mail} label="Pending invites" value={stats?.pendingInvites} loading={isLoading} accent={(stats?.pendingInvites ?? 0) > 0 ? "info" : undefined} />
        <KPI icon={FileWarning} label="Open NCRs" value={stats?.openNcrs} loading={isLoading} accent={(stats?.openNcrs ?? 0) > 0 ? "warn" : undefined} />
        <KPI icon={Bell} label="Inspections" value={stats?.counts.inspections} loading={isLoading} />
        <KPI icon={Database} label="Instruments" value={stats?.counts.instruments} loading={isLoading} />
        <KPI icon={HardDrive} label="Storage used" value={stats ? fmtBytes(stats.storageBytes) : "—"} loading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity className="size-4 text-muted-foreground" />
              Recent activity
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/audit">Open audit log</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border max-h-[360px] overflow-y-auto">
            {(stats?.recentAudit ?? []).map((r: any) => (
              <li key={r.id} className="px-5 py-2.5 flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.table_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.action} · {r.actor_id?.slice(0, 8) ?? "system"}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap ms-3">
                  {formatDistanceToNow(r.created_at)}
                </div>
              </li>
            ))}
            {!isLoading && (stats?.recentAudit?.length ?? 0) === 0 && (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">No recent activity.</li>
            )}
          </ul>
        </div>

        {/* Expiring qualifications */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileWarning className="size-4 text-warning" />
              Welder qualifications expiring (30 days)
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/qualifications">Manage</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border max-h-[360px] overflow-y-auto">
            {(stats?.expiringQuals ?? []).map((q: any) => (
              <li key={q.id} className="px-5 py-2.5 flex items-center justify-between text-sm">
                <span className="font-medium">{q.welder_name}</span>
                <span className="text-xs text-muted-foreground">{q.expiry_date}</span>
              </li>
            ))}
            {!isLoading && (stats?.expiringQuals?.length ?? 0) === 0 && (
              <li className="px-5 py-8 text-center text-sm text-muted-foreground">All qualifications are current.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function KPI({
  icon: Icon, label, value, loading, accent,
}: {
  icon: any;
  label: string;
  value: number | string | undefined;
  loading?: boolean;
  accent?: "info" | "warn";
}) {
  const tone =
    accent === "warn" ? "text-warning" : accent === "info" ? "text-info" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${tone}`}>
        {loading ? <span className="inline-block h-6 w-12 rounded bg-muted/60 animate-pulse" /> : (value ?? "—")}
      </div>
    </div>
  );
}
