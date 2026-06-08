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
import { StatusBadge } from "@/components/StatusBadge";
import { AlertTriangle, Clock, Loader2, Plus, ShieldAlert, Eye, Trash2 } from "lucide-react";
import { daysUntil } from "@/lib/format";
import { exportExcel } from "@/lib/export";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { useIsEditor } from "@/lib/use-role";

export const Route = createFileRoute("/app/ncrs/")({
  component: NcrsPage,
});

function NcrsPage() {
  const { profile, roles } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const isEditor = useIsEditor();
  const confirmDialog = useConfirm();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["ncrs", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await (supabase.from("ncrs" as any) as any)
        .select("*").eq("company_id", profile!.company_id).is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const moveToTrash = async (id: string, label: string) => {
    if (!(await confirmDialog(`Move ${label} to trash?`))) return;
    setBusyId(id);
    const { error } = await (supabase.rpc as any)("soft_delete_ncr", { _id: id });
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Moved to trash.");
    qc.invalidateQueries({ queryKey: ["ncrs"] });
  };

  const rows = (data ?? []).filter((r: any) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !`${r.ncr_no} ${r.title}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const open = rows.filter((r: any) => !["Closed", "Rejected"].includes(r.status)).length;
  const overdue = rows.filter((r: any) => r.due_date && (daysUntil(r.due_date) ?? 999) < 0 && !["Closed", "Rejected"].includes(r.status)).length;
  const critical = rows.filter((r: any) => r.severity === "Critical" && !["Closed", "Rejected"].includes(r.status)).length;

  return (
    <ModulePage
      title="Non-Conformance Reports"
      subtitle="Raise, investigate, and close NCRs with full root-cause and corrective-action workflow."
      action={
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/app/ncrs/trash">
              <Button variant="outline" size="sm"><Trash2 className="size-4 me-1" /> Trash</Button>
            </Link>
          )}
          <NewNcrDialog onDone={() => qc.invalidateQueries({ queryKey: ["ncrs"] })} />
        </div>
      }
    >
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border">
        <Stat icon={ShieldAlert} label="Open" value={open} tone="warning" />
        <Stat icon={Clock} label="Overdue" value={overdue} tone="destructive" />
        <Stat icon={AlertTriangle} label="Critical" value={critical} tone="destructive" />
        <Stat icon={ShieldAlert} label="Total" value={rows.length} tone="info" />
      </div>

      <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center">
        <Input placeholder="Search NCR number or title…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm h-9" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["all", "Open", "Root Cause", "CA Pending", "In Review", "Closed", "Rejected"].map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ms-auto">
          <Button variant="outline" size="sm" onClick={() => exportExcel("ncrs", "NCRs", rows.map((r: any) => ({
            NCR: r.ncr_no, Title: r.title, Severity: r.severity, Status: r.status, "Due date": r.due_date, "Raised": r.created_at,
          })))}><Download className="size-4 me-1" /> Export</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40 sticky top-0">
            <tr><Th>NCR</Th><Th>Title</Th><Th>Severity</Th><Th>Status</Th><Th>Due</Th><Th>Raised</Th><th className="text-end font-medium px-5 py-2.5">Actions</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /></td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No NCRs.</td></tr>}
            {rows.map((r: any) => {
              const d = r.due_date ? daysUntil(r.due_date) : null;
              return (
                <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                  <td className="px-5 py-3 font-medium">
                    <Link to="/app/ncrs/$ncrId" params={{ ncrId: r.id }} className="hover:text-primary">{r.ncr_no}</Link>
                  </td>
                  <td className="px-5 py-3">{r.title}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.severity ?? "—"} /></td>
                  <td className="px-5 py-3 text-xs">{r.status}</td>
                  <td className="px-5 py-3 text-xs">
                    {r.due_date ?? "—"}
                    {d != null && d < 0 && !["Closed", "Rejected"].includes(r.status) &&
                      <span className="ms-2 text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">Overdue {Math.abs(d)}d</span>}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild size="icon" variant="ghost" className="h-8 w-8" aria-label="Open NCR details">
                        <Link to="/app/ncrs/$ncrId" params={{ ncrId: r.id }}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      {isEditor && (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={busyId === r.id} onClick={() => moveToTrash(r.id, r.ncr_no)} aria-label="Move to trash">
                          {busyId === r.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
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

function NewNcrDialog({ onDone }: { onDone: () => void }) {
  const { profile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<any>({ severity: "Medium", status: "Open" });
  const set = (k: string, val: any) => setV((s: any) => ({ ...s, [k]: val }));

  const submit = async () => {
    if (!profile?.company_id || !v.title || !v.ncr_no) { toast.error("NCR number and title required."); return; }
    setBusy(true);
    const { error } = await (supabase.from("ncrs" as any) as any).insert({
      ...v,
      company_id: profile.company_id,
      raised_by: user?.id ?? null,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("NCR raised.");
    setOpen(false);
    setV({ severity: "Medium", status: "Open" });
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Plus className="size-4 me-1" /> Raise NCR
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Raise Non-Conformance Report</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <F label="NCR number"><Input value={v.ncr_no ?? ""} onChange={(e) => set("ncr_no", e.target.value)} placeholder="NCR-0231" /></F>
          <F label="Title"><Input value={v.title ?? ""} onChange={(e) => set("title", e.target.value)} /></F>
          <F label="Description"><Textarea rows={3} value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Severity">
              <Select value={v.severity} onValueChange={(x) => set("severity", x)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Low", "Medium", "High", "Critical"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Due date"><Input type="date" value={v.due_date ?? ""} onChange={(e) => set("due_date", e.target.value)} /></F>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Raise"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
