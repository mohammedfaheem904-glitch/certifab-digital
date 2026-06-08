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
import { ArrowLeft, FileText } from "lucide-react";
import { NcrReportDocument } from "@/components/reports/NcrReportDocument";
import { daysUntil } from "@/lib/format";
import { toast } from "sonner";
import { NcrTransitionBar, RcaPanel, ReworkPanel } from "@/components/ncr/NcrGovernancePanels";
import { NcrWorkflowStepper } from "@/components/ncr/NcrWorkflowStepper";
import { NcrActionBar } from "@/components/ncr/NcrActionBar";
import { GovernanceBanner } from "@/components/ncr/GovernanceBanner";
import { CapaBoard } from "@/components/ncr/CapaBoard";
import { ReInspectionPanel } from "@/components/ncr/ReInspectionPanel";
import { NcrAuditTimeline } from "@/components/ncr/NcrAuditTimeline";

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

  const capas = useQuery<any[]>({
    queryKey: ["capa", ncrId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("capa_actions" as any) as any)
        .select("*").eq("ncr_id", ncrId).order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const rework = useQuery<any[]>({
    queryKey: ["rework", ncrId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("rework_jobs" as any) as any)
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

  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["ncr", ncrId] });
    qc.invalidateQueries({ queryKey: ["ncr_events", ncrId] });
    qc.invalidateQueries({ queryKey: ["capa", ncrId] });
    qc.invalidateQueries({ queryKey: ["rework", ncrId] });
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/ncrs" className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="size-3.5" /> NCRs</Link>
        <span>/</span><span className="text-foreground">{n.ncr_no}</span>
      </div>

      <GovernanceBanner ncr={n} capas={capas.data ?? []} rework={rework.data ?? []} />

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
        </div>
      </div>

      <NcrWorkflowStepper ncr={n} events={events.data ?? []} />

      <Tabs defaultValue="workflow">
        <TabsList className="print:hidden">
          <TabsTrigger value="workflow">Details</TabsTrigger>
          <TabsTrigger value="governance">Transition</TabsTrigger>
          <TabsTrigger value="rca">Root Cause</TabsTrigger>
          <TabsTrigger value="capa">CAPA</TabsTrigger>
          <TabsTrigger value="rework">Rework</TabsTrigger>
          <TabsTrigger value="reinspect">Re-Inspection</TabsTrigger>
          <TabsTrigger value="audit">Audit timeline ({events.data?.length ?? 0})</TabsTrigger>
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
                <Select value={n.severity ?? "Medium"} onValueChange={(v) => update({ severity: v }, "severity_changed")} disabled={busy}>
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

        <TabsContent value="governance">
          <NcrTransitionBar ncr={n} onChanged={refreshAll} />
        </TabsContent>
        <TabsContent value="rca">
          <RcaPanel ncrId={ncrId} companyId={profile?.company_id ?? null} onChanged={() => qc.invalidateQueries({ queryKey: ["ncr_events", ncrId] })} />
        </TabsContent>
        <TabsContent value="capa">
          <CapaBoard ncrId={ncrId} companyId={profile?.company_id ?? null} capas={capas.data ?? []} />
        </TabsContent>
        <TabsContent value="rework">
          <ReworkPanel ncr={n} onChanged={refreshAll} />
        </TabsContent>
        <TabsContent value="reinspect">
          <ReInspectionPanel ncr={n} events={events.data ?? []} onChanged={refreshAll} />
        </TabsContent>
        <TabsContent value="audit">
          <div className="rounded-xl border border-border bg-card p-5">
            <NcrAuditTimeline events={events.data ?? []} />
          </div>
        </TabsContent>
        <TabsContent value="report" className="mt-4">
          <NcrReportDocument ncr={n} events={events.data ?? []} />
        </TabsContent>
      </Tabs>

      <NcrActionBar ncr={n} onChanged={refreshAll} />
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
