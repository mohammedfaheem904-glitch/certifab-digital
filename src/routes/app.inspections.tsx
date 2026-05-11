import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { ncrs } from "@/lib/sample-data";

export const Route = createFileRoute("/app/inspections")({
  component: () => (
    <ModulePage
      title="Inspections & Non-Conformances"
      subtitle="VT · PT · MT · RT · UT — with defect tracking, repair workflow and acceptance reports."
      primaryAction="New Inspection"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">NCR ID</th>
              <th className="text-start font-medium px-5 py-2.5">Weld</th>
              <th className="text-start font-medium px-5 py-2.5">Defect</th>
              <th className="text-start font-medium px-5 py-2.5">Project</th>
              <th className="text-start font-medium px-5 py-2.5">Severity</th>
            </tr>
          </thead>
          <tbody>
            {ncrs.map((n) => (
              <tr key={n.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{n.id}</td>
                <td className="px-5 py-3 text-muted-foreground">{n.weld}</td>
                <td className="px-5 py-3">{n.type}</td>
                <td className="px-5 py-3 text-muted-foreground">{n.project}</td>
                <td className="px-5 py-3"><StatusBadge status={n.severity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  ),
});
