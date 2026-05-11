import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { equipment } from "@/lib/sample-data";

export const Route = createFileRoute("/app/equipment")({
  component: () => (
    <ModulePage
      title="Fleet & Equipment"
      subtitle="Welding machines, calibration schedules and maintenance status across the yard."
      primaryAction="Register Machine"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">Asset ID</th>
              <th className="text-start font-medium px-5 py-2.5">Model</th>
              <th className="text-start font-medium px-5 py-2.5">Calibration Due</th>
              <th className="text-start font-medium px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((e) => (
              <tr key={e.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{e.id}</td>
                <td className="px-5 py-3">{e.model}</td>
                <td className="px-5 py-3 text-muted-foreground">{e.calibration}</td>
                <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  ),
});
