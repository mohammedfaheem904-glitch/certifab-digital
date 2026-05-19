import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WeldStatusBadge } from "@/components/welds/WeldStatusBadge";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

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
  joint_type: string | null;
  inspection_status: string | null;
  project_id: string | null;
  procedure_id: string | null;
};


type Project = { id: string; code: string; name: string };
type Procedure = { id: string; code: string };

export const Route = createFileRoute("/app/welds")({
  component: WeldsPage,
});

function WeldsPage() {
  const nav = useNavigate();
  const { data, isLoading } = useCompanyRows<Row>("welds", {
    order: { column: "weld_date" },
    realtime: true,
  });
  const projects = useCompanyRows<Project>("projects");
  const procs = useCompanyRows<Procedure>("procedures");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const projectName = (id: string | null) =>
    projects.data?.find((p) => p.id === id)?.code ?? "—";

  const filtered = (data ?? []).filter(
    (r) =>
      (statusFilter === "all" || (r.workflow_status ?? "Draft") === statusFilter) &&
      (projectFilter === "all" || r.project_id === projectFilter),
  );

  return (
    <ModulePage
      title="Weld Traceability Log"
      subtitle="Every weld linked to its WPS, welder, project, joint and inspection result."
      action={
        <NewRecordDialog quota="welds"
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
                <Select value={values.procedure_id ?? ""} onValueChange={(v) => set("procedure_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Select WPS" /></SelectTrigger>
                  <SelectContent>
                    {procs.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.code}</SelectItem>)}
                  </SelectContent>
                </Select>
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
              <F label="Welder">
                <Input value={values.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} />
              </F>
              <F label="Base material">
                <Input value={values.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} placeholder="ASTM A106 Gr B" />
              </F>
              <F label="Heat number">
                <Input value={values.heat_number ?? ""} onChange={(e) => set("heat_number", e.target.value)} placeholder="H-23901" />
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
      }
    >
      <DataTable<Row>
        rows={filtered}
        loading={isLoading}
        onRowClick={(r) => nav({ to: "/app/welds/$weldId", params: { weldId: r.id } })}
        searchPlaceholder="Search weld no, joint, line, spool, welder…"
        empty="No welds match your filters."
        filters={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All workflow stages</SelectItem>
                {[
                  "Draft", "Pending Validation", "Awaiting Inspection",
                  "NCR Open", "Ready for Release", "Approved", "Released",
                  "Rejected", "Blocked",
                ].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-9 w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {projects.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.code}</SelectItem>)}
              </SelectContent>
            </Select>
          </>
        }
        columns={[
          {
            key: "weld_no",
            header: "Weld No.",
            searchable: (r) => `${r.weld_no} ${r.joint_no ?? ""} ${r.line_no ?? ""} ${r.spool_no ?? ""} ${r.welder_name ?? ""}`,
            cell: (r) => <span className="font-medium text-primary">{r.weld_no}</span>,
          },
          { key: "project", header: "Project", cell: (r) => <span className="text-muted-foreground">{projectName(r.project_id)}</span> },
          { key: "joint", header: "Joint / Spool", cell: (r) => <span className="text-xs text-muted-foreground">{r.joint_no ?? "—"} / {r.spool_no ?? "—"}</span> },
          { key: "welder", header: "Welder", cell: (r) => r.welder_name ?? "—" },
          { key: "date", header: "Date", cell: (r) => <span className="text-xs">{r.weld_date}</span> },
          { key: "workflow", header: "Workflow", cell: (r) => <WeldStatusBadge status={r.workflow_status ?? "Draft"} /> },
          { key: "status", header: "Result", cell: (r) => <StatusBadge status={r.status} /> },
          {
            key: "actions",
            header: "",
            cell: (r) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Open weld"
                    onClick={(e) => {
                      e.stopPropagation();
                      nav({ to: "/app/welds/$weldId", params: { weldId: r.id } });
                    }}
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open weld</TooltipContent>
              </Tooltip>
            ),
          },
        ]}
      />
    </ModulePage>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
