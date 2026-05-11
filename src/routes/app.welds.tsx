import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { recentWelds } from "@/lib/sample-data";

export const Route = createFileRoute("/app/welds")({
  component: () => (
    <ModulePage
      title="Weld Log & Traceability"
      subtitle="Every weld traced to welder, WPS, material heat number, drawing and inspection result."
      primaryAction="Log Weld"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">Weld No.</th>
              <th className="text-start font-medium px-5 py-2.5">Project</th>
              <th className="text-start font-medium px-5 py-2.5">Welder</th>
              <th className="text-start font-medium px-5 py-2.5">WPS</th>
              <th className="text-start font-medium px-5 py-2.5">Heat Input</th>
              <th className="text-start font-medium px-5 py-2.5">Date</th>
              <th className="text-start font-medium px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentWelds.map((w) => (
              <tr key={w.weldNo} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{w.weldNo}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.project}</td>
                <td className="px-5 py-3">{w.welder}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.wps}</td>
                <td className="px-5 py-3">{w.heatInput}</td>
                <td className="px-5 py-3 text-muted-foreground">{w.date}</td>
                <td className="px-5 py-3"><StatusBadge status={w.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  ),
});
