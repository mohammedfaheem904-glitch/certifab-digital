import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Download, Eye, Trash2, Trash, BarChart3, Briefcase, CheckCircle2, Pause, Activity,
} from "lucide-react";
import { exportExcel } from "@/lib/export";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STATUSES = ["Planning", "Active", "On Hold", "Completed", "Cancelled"];

type Row = {
  id: string;
  code: string;
  name: string;
  client: string | null;
  location: string | null;
  status: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export const Route = createFileRoute("/app/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data, isLoading } = useCompanyRows<Row>("projects", { order: { column: "created_at" } });
  const qc = useQueryClient();
  const nav = useNavigate();
  const [search, setSearch] = useState("");
  const [client, setClient] = useState("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  const clients = useMemo(
    () => Array.from(new Set((data ?? []).map((r) => r.client).filter(Boolean))) as string[],
    [data],
  );
  const locations = useMemo(
    () => Array.from(new Set((data ?? []).map((r) => r.location).filter(Boolean))) as string[],
    [data],
  );

  const rows = useMemo(() => (data ?? []).filter((r) => {
    if (client !== "all" && (r.client ?? "") !== client) return false;
    if (location !== "all" && (r.location ?? "") !== location) return false;
    if (status !== "all" && r.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${r.code} ${r.name} ${r.client ?? ""} ${r.location ?? ""} ${r.description ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [data, client, location, status, search]);

  const total = rows.length;
  const active = rows.filter((r) => r.status === "Active").length;
  const onHold = rows.filter((r) => r.status === "On Hold").length;
  const completed = rows.filter((r) => r.status === "Completed").length;

  const allFilteredSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () => {
    if (allFilteredSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const exportRows = (list: Row[]) => {
    if (list.length === 0) return toast.message("Nothing to export.");
    exportExcel("projects", "Projects", list.map((r) => ({
      Code: r.code, Name: r.name, Client: r.client ?? "", Location: r.location ?? "",
      Status: r.status, "Start date": r.start_date ?? "", "End date": r.end_date ?? "",
      Description: r.description ?? "", Created: r.created_at,
    })));
    toast.success(`Exported ${list.length} project(s).`);
  };

  const moveToTrash = async (ids: string[]) => {
    if (!confirm(`Move ${ids.length} project(s) to trash?`)) return;
    setBusy("bulk");
    let ok = 0, fail = 0;
    for (const id of ids) {
      const { error } = await (supabase.rpc as any)("soft_delete_project", { _id: id });
      if (error) fail++; else ok++;
    }
    setBusy(null);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["projects"] });
    if (fail) toast.error(`${fail} failed, ${ok} moved to trash.`);
    else toast.success(`${ok} moved to trash.`);
  };

  return (
    <ModulePage
      title="Projects"
      subtitle="Master data for every fabrication and field-welding project."
      action={
        <div className="flex items-center gap-2">
          <Link to="/app/projects/dashboard">
            <Button variant="outline" size="sm"><BarChart3 className="size-4 me-1" /> Dashboard</Button>
          </Link>
          <Link to="/app/projects/trash">
            <Button variant="outline" size="sm"><Trash className="size-4 me-1" /> Trash</Button>
          </Link>
          <NewRecordDialog table="projects" title="New project" trigger="New Project" quota="projects" defaults={{ status: "Active" }}>
            {({ values, set }) => (
              <>
                <F label="Code"><Input required value={values.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="PRJ-001" /></F>
                <F label="Name"><Input required value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} /></F>
                <F label="Client"><Input value={values.client ?? ""} onChange={(e) => set("client", e.target.value)} /></F>
                <F label="Location"><Input value={values.location ?? ""} onChange={(e) => set("location", e.target.value)} /></F>
                <F label="Description"><Textarea rows={3} value={values.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Scope, deliverables, notes…" /></F>
              </>
            )}
          </NewRecordDialog>
        </div>
      }
    >
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-border">
        <Stat icon={Briefcase} label="Total" value={total} tone="info" />
        <Stat icon={Activity} label="Active" value={active} tone="success" />
        <Stat icon={Pause} label="On Hold" value={onHold} tone="warning" />
        <Stat icon={CheckCircle2} label="Completed" value={completed} tone="success" />
      </div>

      <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Search code, name, client, location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs h-9"
        />
        <Select value={client} onValueChange={setClient}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {clients.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        {(client !== "all" || location !== "all" || status !== "all" || search) && (
          <Button variant="ghost" size="sm" onClick={() => { setClient("all"); setLocation("all"); setStatus("all"); setSearch(""); }}>
            Reset
          </Button>
        )}
        <div className="ms-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => exportRows(rows)} disabled={rows.length === 0}>
            <Download className="size-4 me-1" /> Export ({rows.length})
          </Button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2 text-sm">
          <span>{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => exportRows(rows.filter((r) => selected.has(r.id)))}>
            <Download className="size-4 me-1" /> Export selected
          </Button>
          <Button size="sm" variant="outline" className="text-destructive" disabled={busy === "bulk"} onClick={() => moveToTrash(Array.from(selected))}>
            <Trash2 className="size-4 me-1" /> Move to trash
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="w-10 ps-5 py-2.5"><Checkbox checked={allFilteredSelected} onCheckedChange={toggleAll} /></th>
              <Th>Code</Th><Th>Name</Th><Th>Client</Th><Th>Location</Th><Th>Description</Th><Th>Status</Th>
              <th className="text-end font-medium pe-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No projects match.</td></tr>}
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="ps-5 py-3"><Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleOne(p.id)} /></td>
                <td className="px-5 py-3 font-medium">
                  <Link to="/app/projects/$projectId" params={{ projectId: p.id }} className="hover:text-primary">{p.code}</Link>
                </td>
                <td className="px-5 py-3">{p.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.client ?? "—"}</td>
                <td className="px-5 py-3">{p.location ?? "—"}</td>
                <td className="px-5 py-3 text-muted-foreground max-w-[320px] truncate" title={p.description ?? ""}>{p.description}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                <td className="pe-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" title="View details" onClick={() => nav({ to: "/app/projects/$projectId", params: { projectId: p.id } })}>
                      <Eye className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Move to trash" className="text-destructive hover:text-destructive" disabled={busy === p.id} onClick={() => moveToTrash([p.id])}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "success" | "warning" | "destructive" | "info" }) {
  const tones: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    info: "text-info",
  };
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
      <Icon className={`size-5 ${tones[tone]}`} />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
