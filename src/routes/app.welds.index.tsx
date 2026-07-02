import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useConfirm } from "@/components/ConfirmDialog";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WeldStatusBadge } from "@/components/welds/WeldStatusBadge";
import {
  Eye, ExternalLink, Trash2, LayoutDashboard, Download, X, Loader2, ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { exportCsv, exportExcel } from "@/lib/export";

type Row = {
  id: string;
  weld_no: string;
  welder_name: string | null;
  heat_input: string | null;
  status: string;
  workflow_status: string | null;
  weld_date: string;
  joint_no: string | null;
  spool_no: string | null;
  drawing_ref: string | null;
  line_no: string | null;
  base_material: string | null;
  filler_metal: string | null;
  aws_classification: string | null;
  joint_type: string | null;
  inspection_status: string | null;
  project_id: string | null;
  procedure_id: string | null;
};

type Project = { id: string; code: string; name: string };
type Procedure = {
  id: string;
  code: string;
  base_material?: string | null;
  filler_material?: string | null;
  heat_input_min?: number | null;
  heat_input_max?: number | null;
};
type FillerMetal = { procedure_id: string; aws_classification: string | null };
type Qualification = { id: string; welder_name: string | null };

const WORKFLOW_STATUSES = [
  "Draft", "Pending Validation", "Awaiting Inspection",
  "NCR Open", "Ready for Release", "Approved", "Released",
  "Rejected", "Blocked",
];

export const Route = createFileRoute("/app/welds/")({
  validateSearch: (s: Record<string, unknown>) => ({
    workflow: typeof s.workflow === "string" ? s.workflow : undefined,
  }),
  component: WeldsPage,
});

function WeldsPage() {
  const confirmDialog = useConfirm();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { roles, profile } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const { workflow } = Route.useSearch();
  const { data, isLoading } = useCompanyRows<Row>("welds", {
    order: { column: "weld_date" },
    realtime: true,
  });
  const projects = useCompanyRows<Project>("projects");
  const procs = useCompanyRows<Procedure>("procedures");
  const fillerMetals = useCompanyRows<FillerMetal>("wps_filler_metals", {
    select: "procedure_id, aws_classification",
    order: { column: "sort_order", ascending: true },
  });
  const qualifications = useCompanyRows<Qualification>("qualifications");

  const [statusFilter, setStatusFilter] = useState<string>(workflow ?? "all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [wpsFilter, setWpsFilter] = useState<string>("all");
  const [welderFilter, setWelderFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (workflow && workflow !== statusFilter) setStatusFilter(workflow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  const projectName = (id: string | null) =>
    projects.data?.find((p) => p.id === id)?.code ?? "—";
  const procCode = (id: string | null) =>
    procs.data?.find((p) => p.id === id)?.code ?? "—";

  const welders = useMemo(() => {
    const fromQuals = (qualifications.data ?? []).map((q) => q.welder_name).filter(Boolean) as string[];
    const fromWelds = (data ?? []).map((w) => w.welder_name).filter(Boolean) as string[];
    return Array.from(new Set([...fromQuals, ...fromWelds])).sort();
  }, [qualifications.data, data]);

  const results = useMemo(
    () => Array.from(new Set((data ?? []).map((r) => r.status).filter(Boolean))).sort(),
    [data],
  );

  const filtered = (data ?? []).filter(
    (r) =>
      (statusFilter === "all" || (r.workflow_status ?? "Draft") === statusFilter) &&
      (projectFilter === "all" || r.project_id === projectFilter) &&
      (wpsFilter === "all" || r.procedure_id === wpsFilter) &&
      (welderFilter === "all" || r.welder_name === welderFilter) &&
      (resultFilter === "all" || r.status === resultFilter),
  );

  const hasFilters =
    statusFilter !== "all" || projectFilter !== "all" || wpsFilter !== "all" ||
    welderFilter !== "all" || resultFilter !== "all";
  const clearFilters = () => {
    setStatusFilter("all"); setProjectFilter("all"); setWpsFilter("all");
    setWelderFilter("all"); setResultFilter("all");
  };

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((r) => r.id)) : new Set());
  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
  };

  const exportRows = (rows: Row[]) => rows.map((r) => ({
    "Weld No": r.weld_no,
    Project: projectName(r.project_id),
    WPS: procCode(r.procedure_id),
    Welder: r.welder_name ?? "",
    Date: r.weld_date,
    "Joint No": r.joint_no ?? "",
    "Spool No": r.spool_no ?? "",
    "Line No": r.line_no ?? "",
    "Drawing Ref": r.drawing_ref ?? "",
    "Joint Type": r.joint_type ?? "",
    "Base Material": r.base_material ?? "",
    "Filler Metal": r.filler_metal ?? "",
    "Heat Input": r.heat_input ?? "",
    Workflow: r.workflow_status ?? "Draft",
    Result: r.status,
    "Inspection Status": r.inspection_status ?? "",
  }));

  const toExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;

  const moveToTrash = async (ids: string[]) => {
    if (!(await confirmDialog(`Move ${ids.length} weld${ids.length > 1 ? "s" : ""} to trash?`))) return;
    setBusy(true);
    const results = await Promise.all(
      ids.map((id) => (supabase.rpc as any)("soft_delete_weld", { _id: id })),
    );
    setBusy(false);
    const errs = results.filter((r: any) => r.error);
    if (errs.length) toast.error(`Failed for ${errs.length}: ${errs[0].error.message}`);
    else toast.success(`Moved ${ids.length} to trash.`);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["welds", profile?.company_id] });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <ModulePage
        title="Weld Traceability Log"
        subtitle="Every weld linked to its WPS, welder, project, joint and inspection result."
        action={
          <div className="flex items-center gap-2">
            <Link to="/app/welds/dashboard">
              <Button variant="outline" size="sm"><LayoutDashboard className="size-4 me-1" /> Dashboard</Button>
            </Link>
            {isAdmin && (
              <Link to="/app/welds/trash">
                <Button variant="outline" size="sm"><Trash2 className="size-4 me-1" /> Trash</Button>
              </Link>
            )}
            <NewRecordDialog
              quota="welds"
              table="welds"
              title="Log a weld"
              trigger="Log Weld"
              defaults={{ status: "Pending", weld_date: new Date().toISOString().slice(0, 10) }}
            >
              {({ values, set }) => (
                <div className="grid grid-cols-2 gap-3">
                  <F label="Weld No.*">
                    <Input required value={values.weld_no ?? ""} onChange={(e) => set("weld_no", e.target.value)} placeholder="WL-2410-0500" />
                  </F>
                  <F label="Date">
                    <Input type="date" value={values.weld_date ?? ""} onChange={(e) => set("weld_date", e.target.value)} />
                  </F>
                  <F label="Project">
                    <Select value={values.project_id ?? ""} onValueChange={(v) => set("project_id", v)}>
                      <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                      <SelectContent>
                        {projects.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </F>
                  <F label="WPS">
                    <Select value={values.procedure_id ?? ""} onValueChange={(v) => {
                      set("procedure_id", v);
                      const p = procs.data?.find((x) => x.id === v);
                      if (p) {
                        if (p.base_material) set("base_material", p.base_material);
                        if (p.filler_material) set("filler_metal", p.filler_material);
                        const hiMin = p.heat_input_min;
                        const hiMax = p.heat_input_max;
                        if (hiMin != null && hiMax != null) set("heat_input", `${hiMin}–${hiMax} kJ/mm`);
                        else if (hiMin != null) set("heat_input", `${hiMin} kJ/mm`);
                        else if (hiMax != null) set("heat_input", `${hiMax} kJ/mm`);
                        const fm = fillerMetals.data?.find((x) => x.procedure_id === v);
                        set("aws_classification", fm?.aws_classification ?? p.filler_material ?? "");
                      } else {
                        set("aws_classification", "");
                      }
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select WPS" /></SelectTrigger>
                      <SelectContent>
                        {procs.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.code}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </F>

                  <F label="Welder">
                    <Select
                      value={values.welder_name && values.welder_name !== "__other__" ? values.welder_name : (values._welder_mode === "other" ? "__other__" : "")}
                      onValueChange={(v) => {
                        if (v === "__other__") { set("_welder_mode", "other"); set("welder_name", ""); }
                        else { set("_welder_mode", "list"); set("welder_name", v); }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select welder" /></SelectTrigger>
                      <SelectContent>
                        {welders.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                        <SelectItem value="__other__">— Other (type name) —</SelectItem>
                      </SelectContent>
                    </Select>
                    {values._welder_mode === "other" && (
                      <Input
                        className="mt-1.5"
                        value={values.welder_name ?? ""}
                        onChange={(e) => set("welder_name", e.target.value)}
                        placeholder="Welder name"
                      />
                    )}
                  </F>
                  <F label="Drawing ref">
                    <Input value={values.drawing_ref ?? ""} onChange={(e) => set("drawing_ref", e.target.value)} placeholder="DWG-PIP-001" />
                  </F>
                  <F label="Line no.">
                    <Input value={values.line_no ?? ""} onChange={(e) => set("line_no", e.target.value)} placeholder="L-101-A1" />
                  </F>
                  <F label="Spool no.">
                    <Input value={values.spool_no ?? ""} onChange={(e) => set("spool_no", e.target.value)} placeholder="SP-014" />
                  </F>
                  <F label="Joint no.">
                    <Input value={values.joint_no ?? ""} onChange={(e) => set("joint_no", e.target.value)} placeholder="J-08" />
                  </F>
                  <F label="Joint type">
                    <Select value={values.joint_type ?? ""} onValueChange={(v) => set("joint_type", v)}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {["Butt", "Fillet", "Socket", "Branch", "Lap"].map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </F>
                  <F label="Base material">
                    <Input value={values.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} placeholder="ASTM A106 Gr B" />
                  </F>
                  <F label="AWS Classification">
                    <Input
                      value={values.aws_classification ?? ""}
                      onChange={(e) => set("aws_classification", e.target.value)}
                      placeholder="ER70S-6 / E7018"
                      disabled={!!values.aws_classification}
                      readOnly={!!values.aws_classification}
                    />
                  </F>
                  <F label="Filler metal">
                    <Input value={values.filler_metal ?? ""} onChange={(e) => set("filler_metal", e.target.value)} placeholder="ER70S-6 / E7018" />
                  </F>
                  <F label="Heat input">
                    <Input value={values.heat_input ?? ""} onChange={(e) => set("heat_input", e.target.value)} placeholder="1.42 kJ/mm" />
                  </F>
                </div>
              )}
            </NewRecordDialog>
          </div>
        }
      >
        <div className="p-3 border-b border-border space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Sel value={statusFilter} onChange={setStatusFilter} placeholder="All workflow" width="w-[170px]"
              options={[{ value: "all", label: "All workflow" }, ...WORKFLOW_STATUSES.map((s) => ({ value: s, label: s }))]} />
            <Sel value={projectFilter} onChange={setProjectFilter} placeholder="All projects" width="w-[150px]"
              options={[{ value: "all", label: "All projects" }, ...(projects.data ?? []).map((p) => ({ value: p.id, label: p.code }))]} />
            <Sel value={wpsFilter} onChange={setWpsFilter} placeholder="All WPS" width="w-[150px]"
              options={[{ value: "all", label: "All WPS" }, ...(procs.data ?? []).map((p) => ({ value: p.id, label: p.code }))]} />
            <Sel value={welderFilter} onChange={setWelderFilter} placeholder="All welders" width="w-[170px]"
              options={[{ value: "all", label: "All welders" }, ...welders.map((w) => ({ value: w, label: w }))]} />
            <Sel value={resultFilter} onChange={setResultFilter} placeholder="All results" width="w-[140px]"
              options={[{ value: "all", label: "All results" }, ...results.map((r) => ({ value: r, label: r }))]} />
            {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="size-3.5 me-1" /> Clear</Button>}
            <div className="ms-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Showing {filtered.length} of {data?.length ?? 0}</span>
              <Button size="sm" variant="outline"
                onClick={() => exportCsv(`welds-${selected.size > 0 ? "selected" : "filtered"}`, exportRows(toExport))}
                disabled={toExport.length === 0}>
                <Download className="size-3.5 me-1" /> CSV
              </Button>
              <Button size="sm" variant="outline"
                onClick={() => exportExcel(`welds-${selected.size > 0 ? "selected" : "filtered"}`, "Welds", exportRows(toExport))}
                disabled={toExport.length === 0}>
                <Download className="size-3.5 me-1" /> XLSX
              </Button>
            </div>
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 rounded-md bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs">
              <span className="font-medium">{selected.size} selected</span>
              <div className="ms-auto flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={busy}
                  onClick={() => moveToTrash(Array.from(selected))}
                  className="text-destructive">
                  <Trash2 className="size-3.5 me-1" /> Move to trash
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <th className="px-3 py-2.5 w-8">
                  <Checkbox checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id))}
                    onCheckedChange={(c) => toggleAll(!!c)} />
                </th>
                <Th>Weld No.</Th>
                <Th>Project</Th>
                <Th>WPS</Th>
                <Th>Joint / Spool</Th>
                <Th>Welder</Th>
                <Th>Date</Th>
                <Th>Workflow</Th>
                <Th>Result</Th>
                <th className="text-end font-medium px-5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={10} className="px-5 py-10 text-center text-muted-foreground">
                  <Loader2 className="size-4 animate-spin inline" /> Loading…
                </td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={10} className="px-5 py-10 text-center text-muted-foreground">
                  No welds match your filters.
                </td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.has(r.id)} onCheckedChange={(c) => toggleOne(r.id, !!c)} />
                  </td>
                  <td className="px-5 py-3 font-medium text-primary cursor-pointer"
                    onClick={() => nav({ to: "/app/welds/$weldId", params: { weldId: r.id } })}>
                    {r.weld_no}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{projectName(r.project_id)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{procCode(r.procedure_id)}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {r.joint_no ?? "—"} / {r.spool_no ?? "—"}
                  </td>
                  <td className="px-5 py-3">{r.welder_name ?? "—"}</td>
                  <td className="px-5 py-3 text-xs">{r.weld_date}</td>
                  <td className="px-5 py-3"><WeldStatusBadge status={r.workflow_status ?? "Draft"} /></td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8"
                            aria-label="View weld details"
                            onClick={(e) => { e.stopPropagation(); nav({ to: "/app/welds/$weldId", params: { weldId: r.id } }); }}>
                            <Eye className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View weld details</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8"
                            aria-label="Open weld"
                            onClick={(e) => { e.stopPropagation(); nav({ to: "/app/welds/$weldId", params: { weldId: r.id } }); }}>
                            <ExternalLink className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open weld</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                            disabled={busy}
                            aria-label="Move to trash"
                            onClick={(e) => { e.stopPropagation(); moveToTrash([r.id]); }}>
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to trash</TooltipContent>
                      </Tooltip>
                      <ChevronRight className="size-4 ms-1 text-muted-foreground" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModulePage>
    </TooltipProvider>
  );
}

function Sel({
  value, onChange, placeholder, options, width = "w-[150px]",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  width?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-9 ${width}`}><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
