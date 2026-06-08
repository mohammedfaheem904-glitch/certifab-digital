import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { InspectionWorkflowStepper } from "@/components/inspections/InspectionWorkflowStepper";
import { InspectionActionBar } from "@/components/inspections/InspectionActionBar";
import { InspectionTimeline } from "@/components/inspections/InspectionTimeline";
import { DynamicInspectionForm } from "@/components/inspections/DynamicInspectionForm";
import { ReadinessGauge } from "@/components/inspections/ReadinessGauge";
import { DefectsPanel } from "@/components/defects/DefectsPanel";
import { scoreInspection } from "@/lib/inspection-readiness";
import { inspectionStatusTone, type InspectionWorkflowStatus } from "@/lib/inspection-workflow";
import { toast } from "sonner";

export const Route = createFileRoute("/app/inspections/$inspectionId")({
  component: InspectionDetail,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

function InspectionDetail() {
  const { inspectionId } = Route.useParams();
  const nav = useNavigate();
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const insp = useQuery({
    queryKey: ["inspection", inspectionId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await (supabase.from("inspections" as any) as any).select("*").eq("id", inspectionId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const events = useQuery<any[]>({
    queryKey: ["inspection_events", inspectionId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("inspection_events" as any) as any)
        .select("*").eq("inspection_id", inspectionId).order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const checklist = useQuery<any[]>({
    queryKey: ["inspection_checklist", inspectionId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("inspection_checklist_items" as any) as any)
        .select("*").eq("inspection_id", inspectionId).order("sort_order", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  if (insp.isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-32 w-full" /></div>;
  if (!insp.data) {
    return (
      <div className="text-center py-20">
        <div className="text-lg font-semibold">Inspection not found</div>
        <Button variant="link" onClick={() => nav({ to: "/app/inspections" })}>Back</Button>
      </div>
    );
  }
  const i: any = insp.data;

  const logEvent = async (kind: string, comment?: string, payload?: any) => {
    if (!profile?.company_id) return;
    await (supabase.from("inspection_events" as any) as any).insert({
      company_id: profile.company_id, inspection_id: inspectionId, kind,
      actor_id: user?.id ?? null, actor_name: profile?.display_name ?? null,
      comment: comment ?? null, payload: payload ?? null,
    });
  };

  const update = async (patch: any, kind?: string, comment?: string) => {
    setBusy(true);
    const { error } = await (supabase.from("inspections" as any) as any).update(patch).eq("id", inspectionId);
    if (error) { toast.error(error.message); setBusy(false); return; }
    if (kind) await logEvent(kind, comment, patch);
    setBusy(false);
    qc.invalidateQueries({ queryKey: ["inspection", inspectionId] });
    qc.invalidateQueries({ queryKey: ["inspection_events", inspectionId] });
    qc.invalidateQueries({ queryKey: ["inspections"] });
    toast.success("Updated.");
  };

  const transition = async (next: InspectionWorkflowStatus, comment?: string) => {
    const now = new Date().toISOString();
    const patch: any = { workflow_status: next };
    if (next === "Assigned") patch.assigned_at = now;
    if (next === "In Progress") patch.started_at = now;
    if (next === "Pending Review") patch.completed_at = now;
    if (next === "Accepted" || next === "Rejected") {
      patch.reviewed_at = now;
      patch.reviewed_by = user?.id ?? null;
      patch.status = next === "Accepted" ? "Accepted" : "Rejected";
    }
    if (next === "Closed") {
      patch.closed_at = now;
      patch.closed_by = user?.id ?? null;
    }
    await update(patch, `transition_${next.replace(/\s+/g, "_").toLowerCase()}`, comment);
  };

  const tone = inspectionStatusTone(i.workflow_status);
  const toneCls = {
    success: "bg-success/15 text-success border-success/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    info: "bg-info/15 text-info border-info/30",
    muted: "bg-muted text-muted-foreground border-border",
  }[tone];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/inspections" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Inspections
        </Link>
        <span>/</span>
        <span className="text-foreground">{i.inspection_no ?? i.id.slice(0, 8)}</span>
      </div>

      <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">{i.inspection_no ?? "Inspection"}</h1>
              <Badge variant="outline">{i.inspection_type}</Badge>
              {i.discipline && <Badge variant="outline" className="text-muted-foreground">{i.discipline}</Badge>}
              <Badge variant="outline" className={toneCls}>{i.workflow_status}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {i.line_no && <>Line {i.line_no} · </>}
              {i.joint_no && <>Joint {i.joint_no} · </>}
              {i.welder_name && <>Welder {i.welder_name} · </>}
              Requested {new Date(i.requested_at ?? i.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <InspectionActionBar status={i.workflow_status} busy={busy} onTransition={transition} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        <InspectionWorkflowStepper status={i.workflow_status} />
        <ReadinessGauge result={scoreInspection({
          checklistItems: checklist.data ?? [],
          workflowStatus: i.workflow_status,
          hasFindings: !!i.defect_type,
        })} />
      </div>

      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Inspection form</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="checklist">Custom items ({(checklist.data ?? []).filter((x: any) => !x.template_field_id).length})</TabsTrigger>
          <TabsTrigger value="findings">Defects</TabsTrigger>
          <TabsTrigger value="audit">Audit trail ({events.data?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          {profile?.company_id && (
            <DynamicInspectionForm
              companyId={profile.company_id}
              inspectionId={inspectionId}
              inspectionType={i.inspection_type}
              currentTemplateId={i.template_id ?? null}
              items={(checklist.data ?? []).filter((x: any) => x.template_field_id)}
              refresh={() => qc.invalidateQueries({ queryKey: ["inspection_checklist", inspectionId] })}
            />
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailField label="Type" value={i.inspection_type} onSave={(v) => update({ inspection_type: v }, "type_changed")} options={["VT","Dimensional","Fit-Up","Welding Surveillance","Final","RT","UT","PT","MT","PMI","Hardness","Hydrotest Witness"]} />
            <DetailField label="Discipline" value={i.discipline ?? ""} onSave={(v) => update({ discipline: v }, "discipline_changed")} options={["Welding","Piping","Structural","Mechanical","Electrical","Civil"]} />
            <DetailField label="Priority" value={i.priority ?? "Normal"} onSave={(v) => update({ priority: v })} options={["Low","Normal","High","Critical"]} />
            <DetailField label="Area" value={i.area ?? ""} onSave={(v) => update({ area: v || null })} />
            <DetailField label="Line No" value={i.line_no ?? ""} onSave={(v) => update({ line_no: v || null })} />
            <DetailField label="Spool No" value={i.spool_no ?? ""} onSave={(v) => update({ spool_no: v || null })} />
            <DetailField label="Joint No" value={i.joint_no ?? ""} onSave={(v) => update({ joint_no: v || null })} />
            <DetailField label="Welder" value={i.welder_name ?? ""} onSave={(v) => update({ welder_name: v || null })} />
            <DetailField label="Assignee" value={i.assigned_to_name ?? ""} onSave={(v) => update({ assigned_to_name: v || null }, "assignee_changed")} />
            <DetailField label="Scheduled for" type="date" value={i.scheduled_for ?? ""} onSave={(v) => update({ scheduled_for: v || null })} />
            <DetailField label="Due date" type="date" value={i.due_date ?? ""} onSave={(v) => update({ due_date: v || null })} />
            <DetailField label="Client requirement" value={i.client_requirement_ref ?? ""} onSave={(v) => update({ client_requirement_ref: v || null })} />
            <DetailField label="Inspector name" value={i.inspector_name ?? ""} onSave={(v) => update({ inspector_name: v || null })} />
            <DetailField label="NCR code" value={i.ncr_code ?? ""} onSave={(v) => update({ ncr_code: v || null })} />
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <ChecklistTab inspectionId={inspectionId} companyId={profile?.company_id ?? null} items={(checklist.data ?? []).filter((x: any) => !x.template_field_id)} refresh={() => qc.invalidateQueries({ queryKey: ["inspection_checklist", inspectionId] })} />
        </TabsContent>

        <TabsContent value="findings">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-medium">Findings</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailField label="Defect type" value={i.defect_type ?? ""} onSave={(v) => update({ defect_type: v || null }, "defect_logged")} />
              <DetailField label="Severity" value={i.severity ?? ""} onSave={(v) => update({ severity: v || null })} options={["Low","Medium","High","Critical"]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Defect description</Label>
              <Textarea rows={3} defaultValue={i.notes ?? ""} onBlur={(e) => e.target.value !== (i.notes ?? "") && update({ notes: e.target.value || null })} />
            </div>
            <div className="text-xs text-muted-foreground">Phase 3 will add the full defect catalog with severity and code references.</div>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="rounded-xl border border-border bg-card p-5">
            <InspectionTimeline events={events.data ?? []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DetailField({ label, value, onSave, options, type = "text" }: { label: string; value: string; onSave: (v: string) => void; options?: string[]; type?: string }) {
  if (options) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs">{label}</Label>
        <Select value={value || undefined} onValueChange={(v) => onSave(v)}>
          <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
          <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} defaultValue={value} onBlur={(e) => e.target.value !== value && onSave(e.target.value)} />
    </div>
  );
}

function ChecklistTab({ inspectionId, companyId, items, refresh }: { inspectionId: string; companyId: string | null; items: any[]; refresh: () => void }) {
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState("pass_fail");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!label.trim() || !companyId) return;
    setBusy(true);
    const { error } = await (supabase.from("inspection_checklist_items" as any) as any).insert({
      company_id: companyId, inspection_id: inspectionId,
      label: label.trim(), field_type: fieldType, sort_order: items.length,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setLabel("");
    refresh();
  };

  const setResult = async (id: string, patch: any) => {
    const { error } = await (supabase.from("inspection_checklist_items" as any) as any).update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await (supabase.from("inspection_checklist_items" as any) as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <Label className="text-xs">New checklist item</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Verify weld profile against acceptance criteria" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Type</Label>
          <Select value={fieldType} onValueChange={setFieldType}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pass_fail">Pass / Fail</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={add} disabled={busy || !label.trim()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="size-4 me-1" /> Add</>}
        </Button>
      </div>

      {items.length === 0 && <div className="text-sm text-muted-foreground">No checklist items yet.</div>}

      <ul className="divide-y divide-border/60">
        {items.map((it) => (
          <li key={it.id} className="py-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium">{it.label}</div>
              <div className="text-[11px] text-muted-foreground">{it.field_type}</div>
            </div>
            {it.field_type === "pass_fail" && (
              <Select value={it.result ?? undefined} onValueChange={(v) => setResult(it.id, { result: v })}>
                <SelectTrigger className="w-32 h-8"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            )}
            {it.field_type === "text" && (
              <Input className="w-48 h-8" defaultValue={it.value_text ?? ""} onBlur={(e) => e.target.value !== (it.value_text ?? "") && setResult(it.id, { value_text: e.target.value || null })} />
            )}
            {it.field_type === "number" && (
              <Input type="number" className="w-32 h-8" defaultValue={it.value_number ?? ""} onBlur={(e) => setResult(it.id, { value_number: e.target.value === "" ? null : Number(e.target.value) })} />
            )}
            {it.field_type === "checkbox" && (
              <input type="checkbox" className="size-4" defaultChecked={!!it.value_bool} onChange={(e) => setResult(it.id, { value_bool: e.target.checked })} />
            )}
            <Button variant="ghost" size="icon" onClick={() => remove(it.id)}>
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
