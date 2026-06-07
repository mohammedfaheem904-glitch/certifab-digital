import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, ClipboardCheck, Clock, ShieldAlert, CheckCircle2, Download } from "lucide-react";
import { INSPECTION_WORKFLOW_STAGES, inspectionStatusTone } from "@/lib/inspection-workflow";
import { exportExcel } from "@/lib/export";
import { toast } from "sonner";

const INSPECTION_TYPES = ["VT","Dimensional","Fit-Up","Welding Surveillance","Final","RT","UT","PT","MT","PMI","Hardness","Hydrotest Witness"];
const DISCIPLINES = ["Welding","Piping","Structural","Mechanical","Electrical","Civil"];
const ALL_STATUSES = [...INSPECTION_WORKFLOW_STAGES, "Rejected", "NCR Raised", "Re-Inspection Required"] as const;

export const Route = createFileRoute("/app/inspections")({
  component: InspectionsPage,
});

function InspectionsPage() {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["inspections", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await (supabase.from("inspections" as any) as any)
        .select("*").eq("company_id", profile!.company_id).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const rows = (data ?? []).filter((r: any) => {
    if (statusFilter !== "all" && r.workflow_status !== statusFilter) return false;
    if (typeFilter !== "all" && r.inspection_type !== typeFilter) return false;
    if (search) {
      const hay = `${r.inspection_no ?? ""} ${r.ncr_code ?? ""} ${r.inspection_type ?? ""} ${r.line_no ?? ""} ${r.joint_no ?? ""} ${r.welder_name ?? ""}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const counts = {
    open: rows.filter((r: any) => !["Closed","Rejected"].includes(r.workflow_status)).length,
    pending: rows.filter((r: any) => r.workflow_status === "Pending Review").length,
    ncr: rows.filter((r: any) => r.workflow_status === "NCR Raised").length,
    accepted: rows.filter((r: any) => r.workflow_status === "Accepted").length,
  };

  return (
    <ModulePage
      title="Inspections & NCR Workflow"
      subtitle="Plan, execute, accept or reject inspections — and govern the corrective-action lifecycle from request to closure."
      action={<NewInspectionDialog onDone={() => qc.invalidateQueries({ queryKey: ["inspections"] })} />}
    >
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border">
        <Stat icon={ClipboardCheck} label="Open" value={counts.open} tone="info" />
        <Stat icon={Clock} label="Pending review" value={counts.pending} tone="warning" />
        <Stat icon={ShieldAlert} label="NCR raised" value={counts.ncr} tone="destructive" />
        <Stat icon={CheckCircle2} label="Accepted" value={counts.accepted} tone="success" />
      </div>

      <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center">
        <Input placeholder="Search inspection no, line, joint, welder…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm h-9" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {INSPECTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ms-auto">
          <Button variant="outline" size="sm" onClick={() => exportExcel("inspections", "Inspections", rows.map((r: any) => ({
            "Inspection No": r.inspection_no, Type: r.inspection_type, Status: r.workflow_status, Discipline: r.discipline,
            Line: r.line_no, Joint: r.joint_no, Welder: r.welder_name, Assignee: r.assigned_to_name,
            Scheduled: r.scheduled_for, Created: r.created_at,
          })))}><Download className="size-4 me-1" /> Export</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40 sticky top-0">
            <tr><Th>Inspection</Th><Th>Type</Th><Th>Discipline</Th><Th>Line / Joint</Th><Th>Welder</Th><Th>Assignee</Th><Th>Status</Th><Th>Scheduled</Th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /></td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No inspections.</td></tr>}
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">
                  <Link to="/app/inspections/$inspectionId" params={{ inspectionId: r.id }} className="hover:text-primary">
                    {r.inspection_no ?? r.id.slice(0, 8)}
                  </Link>
                  {r.ncr_code && <div className="text-[10px] text-muted-foreground mt-0.5">NCR {r.ncr_code}</div>}
                </td>
                <td className="px-5 py-3">{r.inspection_type}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.discipline ?? "—"}</td>
                <td className="px-5 py-3 text-xs">{r.line_no ?? "—"}{r.joint_no ? ` · ${r.joint_no}` : ""}</td>
                <td className="px-5 py-3 text-xs">{r.welder_name ?? "—"}</td>
                <td className="px-5 py-3 text-xs">{r.assigned_to_name ?? "—"}</td>
                <td className="px-5 py-3"><WorkflowChip status={r.workflow_status} /></td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{r.scheduled_for ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function WorkflowChip({ status }: { status: string }) {
  const tone = inspectionStatusTone(status);
  const cls = {
    success: "bg-success/15 text-success border-success/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    info: "bg-info/15 text-info border-info/30",
    muted: "bg-muted text-muted-foreground border-border",
  }[tone];
  return <Badge variant="outline" className={`text-[11px] ${cls}`}>{status}</Badge>;
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "success" | "warning" | "destructive" | "info" }) {
  const cls = { success: "text-success bg-success/10", warning: "text-warning bg-warning/10", destructive: "text-destructive bg-destructive/10", info: "text-info bg-info/10" }[tone];
  return (
    <div className="rounded-lg border border-border p-3 flex items-center gap-3">
      <div className={`size-9 rounded-md grid place-items-center ${cls}`}><Icon className="size-4" /></div>
      <div>
        <div className="text-xl font-semibold leading-tight">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }

function NewInspectionDialog({ onDone }: { onDone: () => void }) {
  const { profile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<any>({ inspection_type: "VT", discipline: "Welding", workflow_status: "Requested" });
  const set = (k: string, val: any) => setV((s: any) => ({ ...s, [k]: val }));

  const submit = async () => {
    if (!profile?.company_id || !v.inspection_type) { toast.error("Inspection type required."); return; }
    setBusy(true);
    const payload = {
      ...v,
      company_id: profile.company_id,
      requested_by: user?.id ?? null,
      requested_at: new Date().toISOString(),
      status: "Open",
    };
    const { data, error } = await (supabase.from("inspections" as any) as any).insert(payload).select("id").maybeSingle();
    if (!error && data?.id) {
      await (supabase.from("inspection_events" as any) as any).insert({
        company_id: profile.company_id, inspection_id: data.id, kind: "requested",
        actor_id: user?.id ?? null, actor_name: profile?.display_name ?? null,
      });
    }
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Inspection requested.");
    setOpen(false);
    setV({ inspection_type: "VT", discipline: "Welding", workflow_status: "Requested" });
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Plus className="size-4 me-1" /> Request Inspection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Request new inspection</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <F label="Inspection no"><Input value={v.inspection_no ?? ""} onChange={(e) => set("inspection_no", e.target.value)} placeholder="INS-0001" /></F>
          <F label="Type">
            <Select value={v.inspection_type} onValueChange={(x) => set("inspection_type", x)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{INSPECTION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Discipline">
            <Select value={v.discipline} onValueChange={(x) => set("discipline", x)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DISCIPLINES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Scheduled for"><Input type="date" value={v.scheduled_for ?? ""} onChange={(e) => set("scheduled_for", e.target.value)} /></F>
          <F label="Area"><Input value={v.area ?? ""} onChange={(e) => set("area", e.target.value)} placeholder="Unit 200 / Skid A" /></F>
          <F label="Line no"><Input value={v.line_no ?? ""} onChange={(e) => set("line_no", e.target.value)} placeholder="3-P-1001" /></F>
          <F label="Spool no"><Input value={v.spool_no ?? ""} onChange={(e) => set("spool_no", e.target.value)} /></F>
          <F label="Joint no"><Input value={v.joint_no ?? ""} onChange={(e) => set("joint_no", e.target.value)} /></F>
          <F label="Welder name"><Input value={v.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} /></F>
          <F label="Assignee name"><Input value={v.assigned_to_name ?? ""} onChange={(e) => set("assigned_to_name", e.target.value)} placeholder="Inspector to assign" /></F>
          <div className="col-span-2"><F label="Client requirement reference"><Input value={v.client_requirement_ref ?? ""} onChange={(e) => set("client_requirement_ref", e.target.value)} placeholder="ITP-Rev2 §4.3" /></F></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Request"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
