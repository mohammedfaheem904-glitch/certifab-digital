import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";

const projects = [
  { name: "Aramco GOSP-7", client: "Saudi Aramco", welds: 1842, progress: 72, lead: "M. Al-Harbi" },
  { name: "ADNOC Pipeline 22B", client: "ADNOC", welds: 1204, progress: 58, lead: "R. Kumar" },
  { name: "Sabic Refinery Expansion", client: "SABIC", welds: 980, progress: 41, lead: "J. Silva" },
  { name: "Qatar LNG-T4", client: "QatarEnergy", welds: 801, progress: 33, lead: "A. Ibrahim" },
];

export const Route = createFileRoute("/app/projects")({
  component: () => (
    <ModulePage
      title="Projects"
      subtitle="Multi-project, multi-company oversight with real-time KPIs."
      primaryAction="New Project"
    >
      <div className="grid md:grid-cols-2 p-4 gap-4">
        {projects.map((p) => (
          <div key={p.name} className="rounded-lg border border-border bg-[image:var(--gradient-surface)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.client} · Lead {p.lead}</div>
              </div>
              <div className="text-end">
                <div className="text-lg font-semibold">{p.welds.toLocaleString()}</div>
                <div className="text-[11px] text-muted-foreground">welds</div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{p.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[image:var(--gradient-primary)]"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModulePage>
  ),
});
