import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Loader2, Trash2, MapPin, User, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/projects/$projectId")({
  component: ProjectDetailsPage,
});

type Project = {
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
  updated_at: string;
};

type Counts = { welds: number; inspections: number; ncrs: number; instruments: number };

function ProjectDetailsPage() {
  const { projectId } = Route.useParams();
  const { profile } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [counts, setCounts] = useState<Counts>({ welds: 0, inspections: 0, ncrs: 0, instruments: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile?.company_id) return;
    let cancel = false;
    (async () => {
      const { data, error } = await (supabase.from("projects" as any) as any)
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (cancel) return;
      if (error) { toast.error(error.message); setProject(null); return; }
      setProject((data ?? null) as Project | null);

      const [w, i, n, ins] = await Promise.all([
        (supabase.from("welds" as any) as any).select("id", { count: "exact", head: true }).eq("project_id", projectId),
        (supabase.from("inspections" as any) as any).select("id", { count: "exact", head: true }).eq("project_id", projectId),
        (supabase.from("ncrs" as any) as any).select("id", { count: "exact", head: true }).eq("project_id", projectId),
        (supabase.from("instruments" as any) as any).select("id", { count: "exact", head: true }).eq("assigned_project_id", projectId),
      ]);
      if (cancel) return;
      setCounts({
        welds: w.count ?? 0,
        inspections: i.count ?? 0,
        ncrs: n.count ?? 0,
        instruments: ins.count ?? 0,
      });
    })();
    return () => { cancel = true; };
  }, [projectId, profile?.company_id]);

  const moveToTrash = async () => {
    if (!confirm("Move this project to trash?")) return;
    setBusy(true);
    const { error } = await (supabase.rpc as any)("soft_delete_project", { _id: projectId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Moved to trash.");
    qc.invalidateQueries({ queryKey: ["projects"] });
    nav({ to: "/app/projects" });
  };

  if (project === undefined) {
    return (
      <ModulePage title="Project" subtitle="Loading…">
        <div className="py-16 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" /> Loading…</div>
      </ModulePage>
    );
  }
  if (project === null) {
    return (
      <ModulePage title="Project not found" subtitle="">
        <div className="py-16 text-center text-muted-foreground">This project does not exist or has been removed.</div>
      </ModulePage>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/projects" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Projects
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1 flex items-center gap-3">
            <span className="font-mono text-base text-muted-foreground">{project.code}</span>
            {project.name}
            <StatusBadge status={project.status} />
          </h1>
        </div>
        <Button variant="outline" className="text-destructive" onClick={moveToTrash} disabled={busy}>
          <Trash2 className="size-4 me-1" /> Move to trash
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold">Overview</h3>
          <Info icon={<User className="size-4" />} label="Client" value={project.client ?? "—"} />
          <Info icon={<MapPin className="size-4" />} label="Location" value={project.location ?? "—"} />
          <Info icon={<Calendar className="size-4" />} label="Start date" value={project.start_date ?? "—"} />
          <Info icon={<Calendar className="size-4" />} label="End date" value={project.end_date ?? "—"} />
          <Info icon={<Calendar className="size-4" />} label="Created" value={new Date(project.created_at).toLocaleString()} />
          <Info icon={<Calendar className="size-4" />} label="Updated" value={new Date(project.updated_at).toLocaleString()} />
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
          <CountBox label="Welds" value={counts.welds} />
          <CountBox label="Inspections" value={counts.inspections} />
          <CountBox label="NCRs" value={counts.ncrs} />
          <CountBox label="Instruments assigned" value={counts.instruments} />
        </div>
      </Card>
    </div>
  );
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
