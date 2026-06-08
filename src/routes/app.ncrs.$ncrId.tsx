import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { NcrReportDocument } from "@/components/reports/NcrReportDocument";
import { daysUntil } from "@/lib/format";
import { toast } from "sonner";

const FLOW = ["Open", "Root Cause", "CA Pending", "In Review", "Closed"] as const;

export const Route = createFileRoute("/app/ncrs/$ncrId")({
  component: NcrDetail,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

function NcrDetail() {
  const { ncrId } = Route.useParams();
  const nav = useNavigate();
  const { profile, user } = useAuth();
  const qc = useQueryClient();

  const ncr = useQuery({
    queryKey: ["ncr", ncrId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await (supabase.from("ncrs" as any) as any).select("*").eq("id", ncrId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const events = useQuery<any[]>({
    queryKey: ["ncr_events", ncrId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("ncr_events" as any) as any)
        .select("*").eq("ncr_id", ncrId).order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const [drafts, setDrafts] = useState<any>({});
  const [busy, setBusy] = useState(false);

  if (ncr.isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-32 w-full" /></div>;
  if (!ncr.data) return (
    <div className="text-center py-20"><div className="text-lg font-semibold">NCR not found</div>
      <Button variant="link" onClick={() => nav({ to: "/app/ncrs" })}>Back</Button></div>
  );
  const n: any = ncr.data;
  const d = n.due_date ? daysUntil(n.due_date) : null;
  const overdue = d != null && d < 0 && !["Closed", "Rejected"].includes(n.status);

  const update = async (patch: any, eventKind?: string, comment?: string) => {
    setBusy(true);
    const { error } = await (supabase.from("ncrs" as any) as any).update(patch).eq("id", ncrId);
    if (error) { toast.error(error.message); setBusy(false); return; }
    if (eventKind && profile?.company_id) {
      await (supabase.from("ncr_events" as any) as any).insert({
        company_id: profile.company_id, ncr_id: ncrId, kind: eventKind,
        actor_id: user?.id ?? null, comment, payload: patch,
      });
    }
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["ncr", ncrId] });
    qc.invalidateQueries({ queryKey: ["ncr_events", ncrId] });
    toast.success("Updated.");
  };

  const advance = async () => {
    const idx = FLOW.indexOf(n.status as any);
    const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : "Closed";
    const patch: any = { status: next };
    if (next === "Closed") {
      patch.closed_at = new Date().toISOString();
      patch.closed_by = user?.id ?? null;
    }
    await update(patch, "status_advance");
  };
  const reject = () => update({ status: "Rejected" }, "rejected");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/ncrs" className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="size-3.5" /> NCRs</Link>
        <span>/</span><span className="text-foreground">{n.ncr_no}</span>
      </div>

      <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">{n.ncr_no}</h1>
              <StatusBadge status={n.severity ?? "—"} />
              <Badge variant="outline">{n.status}</Badge>
              {overdue && <Badge className="bg-destructive/10 text-destructive border-destructive/30" variant="outline">Overdue {Math.abs(d!)}d</Badge>}
            </div>
            <div className="text-sm mt-1">{n.title}</div>
            <div className="text-xs text-muted-foreground mt-1">Raised {new Date(n.created_at).toLocaleString()} · Due {n.due_date ?? "—"}</div>
          </div>
          <div className="flex gap-2">
            {!["Closed", "Rejected"].includes(n.status) && (
              <>
                <Button variant="outline" size="sm" onClick={reject} disabled={busy}>Reject</Button>
                <Button size="sm" onClick={advance} disabled={busy} className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : `Advance → ${FLOW[Math.min(FLOW.indexOf(n.status as any) + 1, FLOW.length - 1)] ?? "Closed"}`}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-1 text-xs">
          {FLOW.map((s, i) => {
            const idx = FLOW.indexOf(n.status as any);
            const reached = i <= idx;
            return (
              <div key={s} className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded ${reached ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground"}`}>{s}</span>
                {i < FLOW.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="workflow">
        <TabsList className="print:hidden">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="audit">Audit trail ({events.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="report"><FileText className="size-4 me-1.5" />NCR Report</TabsTrigger>
        </TabsList>
        <TabsContent value="workflow" className="space-y-4">
          <Section title="Description" value={n.description} field="description" drafts={drafts} setDrafts={setDrafts} onSave={(v) => update({ description: v }, "description_updated")} />
          <Section title="Root cause" value={n.root_cause} field="root_cause" drafts={drafts} setDrafts={setDrafts} onSave={(v) => update({ root_cause: v }, "root_cause_updated")} />
          <Section title="Corrective action" value={n.corrective_action} field="corrective_action" drafts={drafts} setDrafts={setDrafts} onSave={(v) => update({ corrective_action: v }, "ca_updated")} />
          <Section title="Preventive action" value={n.preventive_action} field="preventive_action" drafts={drafts} setDrafts={setDrafts} onSave={(v) => update({ preventive_action: v }, "pa_updated")} />

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-medium">Workflow controls</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Severity</Label>
                <Select value={n.severity ?? "Medium"} onValueChange={(v) => update({ severity: v }, "severity_changed")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Low", "Medium", "High", "Critical"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Due date</Label>
                <input type="date" defaultValue={n.due_date ?? ""}
                  onBlur={(e) => e.target.value !== (n.due_date ?? "") && update({ due_date: e.target.value || null }, "due_changed")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="rounded-xl border border-border bg-card p-5">
            <ol className="relative border-s border-border ms-2 space-y-4">
              {(events.data ?? []).map((e: any) => (
                <li key={e.id} className="ms-4">
                  <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" />
                  <div className="text-sm font-medium">{e.kind.replace(/_/g, " ")}</div>
                  <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                  {e.comment && <div className="text-xs mt-1">{e.comment}</div>}
                </li>
              ))}
              {(events.data?.length ?? 0) === 0 && <div className="text-sm text-muted-foreground">No events yet.</div>}
            </ol>
          </div>
        </TabsContent>
        <TabsContent value="report" className="mt-4">
          <NcrReportDocument ncr={n} events={events.data ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, value, field, drafts, setDrafts, onSave }: { title: string; value: string | null; field: string; drafts: any; setDrafts: any; onSave: (v: string) => void }) {
  const v = drafts[field] ?? value ?? "";
  const dirty = drafts[field] !== undefined && drafts[field] !== (value ?? "");
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {dirty && <Button size="sm" onClick={() => { onSave(v); setDrafts((s: any) => { const n = { ...s }; delete n[field]; return n; }); }}>Save</Button>}
      </div>
      <Textarea rows={3} value={v} onChange={(e) => setDrafts((s: any) => ({ ...s, [field]: e.target.value }))} placeholder={`Enter ${title.toLowerCase()}…`} />
    </div>
  );
}
