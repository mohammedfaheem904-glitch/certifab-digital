import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useConfirm } from "@/components/ConfirmDialog";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Trash2, MapPin, User, Calendar, FileText, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { ProjectWorkflowStepper } from "@/components/projects/ProjectWorkflowStepper";
import { ProjectActionBar } from "@/components/projects/ProjectActionBar";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import type { ProjectWorkflowStatus } from "@/lib/project-workflow";
import { CollaborationTab } from "@/components/collab/CollaborationTab";

export const Route = createFileRoute("/app/projects/$projectId")({
  component: ProjectDetailsPage,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

type Project = {
  id: string;
  code: string;
  name: string;
  client: string | null;
  location: string | null;
  status: string;
  workflow_status: ProjectWorkflowStatus;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  started_at: string | null;
  held_at: string | null;
  closed_at: string | null;
  hold_reason: string | null;
  rejection_reason: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
};

type Counts = { welds: number; inspections: number; ncrs: number; instruments: number };

function ProjectDetailsPage() {
  const confirmDialog = useConfirm();
  const { projectId } = Route.useParams();
  const { profile } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const { data: project, isLoading } = useQuery<Project | null>({
    queryKey: ["project", projectId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await (supabase.from("projects" as any) as any)
        .select("*").eq("id", projectId).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Project | null;
    },
  });

  const { data: counts } = useQuery<Counts>({
    queryKey: ["project_counts", projectId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const [w, i, n, ins] = await Promise.all([
        (supabase.from("welds" as any) as any).select("id", { count: "exact", head: true }).eq("project_id", projectId),
        (supabase.from("inspections" as any) as any).select("id", { count: "exact", head: true }).eq("project_id", projectId),
        (supabase.from("ncrs" as any) as any).select("id", { count: "exact", head: true }).eq("project_id", projectId),
        (supabase.from("instruments" as any) as any).select("id", { count: "exact", head: true }).eq("assigned_project_id", projectId),
      ]);
      return { welds: w.count ?? 0, inspections: i.count ?? 0, ncrs: n.count ?? 0, instruments: ins.count ?? 0 };
    },
  });

  const moveToTrash = async () => {
    if (!(await confirmDialog("Move this project to trash?"))) return;
    setBusy(true);
    const { error } = await (supabase.rpc as any)("soft_delete_project", { _id: projectId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Moved to trash.");
    qc.invalidateQueries({ queryKey: ["projects"] });
    nav({ to: "/app/projects" });
  };

  if (isLoading || project === undefined) {
    return (
      <ModulePage title="Project" subtitle="Loading…">
        <div className="py-16 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" /> Loading…</div>
      </ModulePage>
    );
  }
  if (!project) {
    return (
      <ModulePage title="Project not found" subtitle="">
        <div className="py-16 text-center text-muted-foreground">This project does not exist or has been removed.</div>
      </ModulePage>
    );
  }

  const reasonNote =
    project.workflow_status === "On Hold" ? project.hold_reason :
    project.workflow_status === "Rejected" ? project.rejection_reason :
    project.workflow_status === "Cancelled" ? project.cancellation_reason :
    null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/projects" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Projects
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1 flex items-center gap-3 flex-wrap">
            <span className="font-mono text-base text-muted-foreground">{project.code}</span>
            {project.name}
          </h1>
        </div>
        <Button variant="outline" className="text-destructive" onClick={moveToTrash} disabled={busy}>
          <Trash2 className="size-4 me-1" /> Move to trash
        </Button>
      </div>

      <ProjectWorkflowStepper status={project.workflow_status} />

      <ProjectActionBar
        projectId={project.id}
        projectCode={project.code}
        status={project.workflow_status}
      />

      {reasonNote && (
        <Card className="p-3 border-warning/40 bg-warning/5 text-sm">
          <span className="font-semibold">Reason:</span> {reasonNote}
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold">Overview</h3>
          <Info icon={<User className="size-4" />} label="Client" value={project.client ?? "—"} />
          <Info icon={<MapPin className="size-4" />} label="Location" value={project.location ?? "—"} />
          <Info icon={<Calendar className="size-4" />} label="Start date" value={project.start_date ?? "—"} />
          <Info icon={<Calendar className="size-4" />} label="End date" value={project.end_date ?? "—"} />
          <Info icon={<Calendar className="size-4" />} label="Submitted" value={fmt(project.submitted_at)} />
          <Info icon={<Calendar className="size-4" />} label="Approved" value={fmt(project.approved_at)} />
          <Info icon={<Calendar className="size-4" />} label="Started" value={fmt(project.started_at)} />
          <Info icon={<Calendar className="size-4" />} label="Closed" value={fmt(project.closed_at)} />
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="size-4" /> Description</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap min-h-[100px]">
            {project.description || "No description provided."}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Related records</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <CountBox label="Welds" value={counts?.welds ?? 0} />
          <CountBox label="Inspections" value={counts?.inspections ?? 0} />
          <CountBox label="NCRs" value={counts?.ncrs ?? 0} />
          <CountBox label="Instruments assigned" value={counts?.instruments ?? 0} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><History className="size-4" /> Workflow timeline</h3>
        <ProjectTimeline projectId={project.id} />
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Collaboration</h3>
        <CollaborationTab entityType="project" entityId={project.id} />
      </Card>
    </div>
  );
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleString() : "—";
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground w-28">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CountBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
