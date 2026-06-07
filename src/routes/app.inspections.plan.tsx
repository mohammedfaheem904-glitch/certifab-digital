import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, ListChecks, ArrowLeft, Wand2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const INSPECTION_TYPES = ["VT","Dimensional","Fit-Up","Welding Surveillance","Final","RT","UT","PT","MT","PMI","Hardness","Hydrotest Witness"];
const DISCIPLINES = ["Welding","Piping","Structural","Mechanical","Electrical","Civil"];
const PRIORITIES = ["Low","Normal","High","Critical"];

export const Route = createFileRoute("/app/inspections/plan")({
  component: PlansPage,
});

function PlansPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const plans = useQuery<any[]>({
    queryKey: ["inspection_plans", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("inspection_plans" as any) as any)
        .select("*").eq("company_id", profile!.company_id).order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const selected = (plans.data ?? []).find((p) => p.id === selectedId) ?? (plans.data ?? [])[0];

  return (
    <ModulePage
      title="Inspection Planning"
      subtitle="Plan inspections in advance, assign them in bulk and turn them into actual inspections on-the-fly."
      action={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/app/inspections"><ArrowLeft className="size-4 me-1" /> Inspections</Link>
          </Button>
          <NewPlanDialog onDone={() => qc.invalidateQueries({ queryKey: ["inspection_plans"] })} />
        </div>
      }
    >
      <div className="grid md:grid-cols-[300px_1fr]">
        <div className="border-e border-border max-h-[70vh] overflow-y-auto">
          {plans.isLoading && <div className="p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</div>}
          {!plans.isLoading && (plans.data?.length ?? 0) === 0 && <div className="p-6 text-sm text-muted-foreground">No plans yet.</div>}
          {(plans.data ?? []).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-start p-4 border-b border-border/60 hover:bg-muted/30 ${selected?.id === p.id ? "bg-muted/40" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1 flex gap-2 flex-wrap">
                {p.default_inspection_type && <span>{p.default_inspection_type}</span>}
                {p.priority && <span>· {p.priority}</span>}
                {p.due_date && <span>· due {p.due_date}</span>}
              </div>
            </button>
          ))}
        </div>
        <div className="p-4">
          {selected ? (
            <PlanDetail plan={selected} refresh={() => qc.invalidateQueries({ queryKey: ["inspection_plan_items", selected.id] })} />
          ) : (
            <div className="text-sm text-muted-foreground text-center py-12">Pick a plan to view items.</div>
          )}
        </div>
      </div>
    </ModulePage>
  );
}

function PlanDetail({ plan, refresh }: { plan: any; refresh: () => void }) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const items = useQuery<any[]>({
    queryKey: ["inspection_plan_items", plan.id],
    queryFn: async () => {
      const { data } = await (supabase.from("inspection_plan_items" as any) as any)
        .select("*").eq("plan_id", plan.id).order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const generated = (items.data ?? []).filter((i) => i.status === "Generated").length;
  const progress = items.data?.length ? Math.round((generated / items.data.length) * 100) : 0;

  const generateAll = async () => {
    if (!profile?.company_id) return;
    const pending = (items.data ?? []).filter((i) => i.status === "Planned");
    if (!pending.length) { toast.info("No planned items left."); return; }
    for (const it of pending) {
      const { data: ins } = await (supabase.from("inspections" as any) as any).insert({
        company_id: profile.company_id,
        inspection_type: it.inspection_type,
        discipline: plan.discipline,
        line_no: it.line_no,
        spool_no: it.spool_no,
        joint_no: it.joint_no,
        welder_name: it.welder_name,
        priority: it.priority,
        scheduled_for: it.planned_date,
        due_date: plan.due_date,
        plan_item_id: it.id,
        weld_id: it.weld_id,
        assigned_to_name: plan.assigned_to_name,
        workflow_status: "Requested",
        status: "Open",
      }).select("id").maybeSingle();
      if (ins?.id) {
        await (supabase.from("inspection_plan_items" as any) as any).update({
          status: "Generated", generated_inspection_id: ins.id,
        }).eq("id", it.id);
        await (supabase.from("inspection_events" as any) as any).insert({
          company_id: profile.company_id, inspection_id: ins.id, kind: "requested",
          comment: `Generated from plan ${plan.name}`,
        });
      }
    }
    toast.success(`Generated ${pending.length} inspection${pending.length > 1 ? "s" : ""}.`);
    qc.invalidateQueries({ queryKey: ["inspections"] });
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{plan.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {plan.discipline ?? "—"} · {plan.area ?? "—"} · priority {plan.priority}
              {plan.due_date && <> · due {plan.due_date}</>}
            </div>
            {plan.description && <div className="text-sm mt-2">{plan.description}</div>}
          </div>
          <Button size="sm" onClick={generateAll} className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Wand2 className="size-4 me-1" /> Generate inspections
          </Button>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
            <span>{generated}/{items.data?.length ?? 0} generated</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <AddItemRow plan={plan} onDone={refresh} />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>Type</Th><Th>Line / Joint</Th><Th>Welder</Th><Th>Priority</Th><Th>Planned</Th><Th>Status</Th><Th>Inspection</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.isLoading && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /></td></tr>}
            {!items.isLoading && (items.data?.length ?? 0) === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No items yet — add one above.</td></tr>}
            {(items.data ?? []).map((it) => (
              <tr key={it.id} className="border-t border-border/60">
                <td className="px-4 py-2.5">{it.inspection_type}</td>
                <td className="px-4 py-2.5 text-xs">{it.line_no ?? "—"}{it.joint_no ? ` · ${it.joint_no}` : ""}</td>
                <td className="px-4 py-2.5 text-xs">{it.welder_name ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs">{it.priority}</td>
                <td className="px-4 py-2.5 text-xs">{it.planned_date ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs"><Badge variant="outline" className="text-[10px]">{it.status}</Badge></td>
                <td className="px-4 py-2.5 text-xs">
                  {it.generated_inspection_id && (
                    <Link to="/app/inspections/$inspectionId" params={{ inspectionId: it.generated_inspection_id }} className="text-primary hover:underline">View</Link>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {it.status === "Planned" && (
                    <Button variant="ghost" size="icon" onClick={async () => {
                      await (supabase.from("inspection_plan_items" as any) as any).delete().eq("id", it.id);
                      refresh();
                    }}>
                      <Trash2 className="size-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddItemRow({ plan, onDone }: { plan: any; onDone: () => void }) {
  const { profile } = useAuth();
  const [v, setV] = useState<any>({
    inspection_type: plan.default_inspection_type ?? "VT",
    priority: plan.priority ?? "Normal",
    line_no: plan.line_no ?? "",
    spool_no: plan.spool_no ?? "",
  });
  const set = (k: string, val: any) => setV((s: any) => ({ ...s, [k]: val }));

  const add = async () => {
    if (!profile?.company_id) return;
    const { error } = await (supabase.from("inspection_plan_items" as any) as any).insert({
      ...v, company_id: profile.company_id, plan_id: plan.id,
    });
    if (error) return toast.error(error.message);
    setV({ inspection_type: v.inspection_type, priority: v.priority, line_no: v.line_no, spool_no: v.spool_no });
    onDone();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3 grid grid-cols-2 md:grid-cols-7 gap-2 items-end">
      <div className="space-y-1">
        <Label className="text-[10px]">Type</Label>
        <Select value={v.inspection_type} onValueChange={(x) => set("inspection_type", x)}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{INSPECTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1"><Label className="text-[10px]">Line no</Label><Input className="h-8" value={v.line_no ?? ""} onChange={(e) => set("line_no", e.target.value)} /></div>
      <div className="space-y-1"><Label className="text-[10px]">Spool</Label><Input className="h-8" value={v.spool_no ?? ""} onChange={(e) => set("spool_no", e.target.value)} /></div>
      <div className="space-y-1"><Label className="text-[10px]">Joint</Label><Input className="h-8" value={v.joint_no ?? ""} onChange={(e) => set("joint_no", e.target.value)} /></div>
      <div className="space-y-1"><Label className="text-[10px]">Welder</Label><Input className="h-8" value={v.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} /></div>
      <div className="space-y-1">
        <Label className="text-[10px]">Priority</Label>
        <Select value={v.priority} onValueChange={(x) => set("priority", x)}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Button size="sm" onClick={add}><Plus className="size-4 me-1" /> Add item</Button>
    </div>
  );
}

function NewPlanDialog({ onDone }: { onDone: () => void }) {
  const { profile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<any>({ priority: "Normal", default_inspection_type: "VT", discipline: "Welding", status: "Active", recurrence: "none" });
  const set = (k: string, val: any) => setV((s: any) => ({ ...s, [k]: val }));

  const submit = async () => {
    if (!profile?.company_id || !v.name) { toast.error("Plan name required."); return; }
    setBusy(true);
    const { error } = await (supabase.from("inspection_plans" as any) as any).insert({
      ...v, company_id: profile.company_id, created_by: user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setOpen(false);
    setV({ priority: "Normal", default_inspection_type: "VT", discipline: "Welding", status: "Active", recurrence: "none" });
    toast.success("Plan created.");
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <ListChecks className="size-4 me-1" /> New plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>New inspection plan</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <F label="Plan name"><Input value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Unit-200 RT Coverage" /></F>
          <F label="Plan code"><Input value={v.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="PLN-RT-200" /></F>
          <F label="Discipline">
            <Select value={v.discipline} onValueChange={(x) => set("discipline", x)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DISCIPLINES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Default type">
            <Select value={v.default_inspection_type} onValueChange={(x) => set("default_inspection_type", x)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{INSPECTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Priority">
            <Select value={v.priority} onValueChange={(x) => set("priority", x)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Recurrence">
            <Select value={v.recurrence} onValueChange={(x) => set("recurrence", x)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </F>
          <F label="Area"><Input value={v.area ?? ""} onChange={(e) => set("area", e.target.value)} /></F>
          <F label="Unit"><Input value={v.unit ?? ""} onChange={(e) => set("unit", e.target.value)} /></F>
          <F label="Line scope"><Input value={v.line_no ?? ""} onChange={(e) => set("line_no", e.target.value)} placeholder="3-P-1001" /></F>
          <F label="Spool scope"><Input value={v.spool_no ?? ""} onChange={(e) => set("spool_no", e.target.value)} /></F>
          <F label="Planned start"><Input type="date" value={v.planned_date ?? ""} onChange={(e) => set("planned_date", e.target.value)} /></F>
          <F label="Due date"><Input type="date" value={v.due_date ?? ""} onChange={(e) => set("due_date", e.target.value)} /></F>
          <F label="Assignee name"><Input value={v.assigned_to_name ?? ""} onChange={(e) => set("assigned_to_name", e.target.value)} /></F>
          <div className="col-span-2"><F label="Description"><Textarea rows={2} value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} /></F></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Create plan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-4 py-2">{children}</th>; }
