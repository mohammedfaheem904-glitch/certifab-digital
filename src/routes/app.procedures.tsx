import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { procedures } from "@/lib/sample-data";

export const Route = createFileRoute("/app/procedures")({
  component: () => (
    <ModulePage
      title="Welding Procedures (WPS / pWPS / PQR)"
      subtitle="Create, revise and approve welding procedure specifications across ASME, EN ISO, AWS, AS/NZS and JIS."
      primaryAction="New WPS"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">ID</th>
              <th className="text-start font-medium px-5 py-2.5">Standard</th>
              <th className="text-start font-medium px-5 py-2.5">Process</th>
              <th className="text-start font-medium px-5 py-2.5">Thickness</th>
              <th className="text-start font-medium px-5 py-2.5">Revision</th>
              <th className="text-start font-medium px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {procedures.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{p.id}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.standard}</td>
                <td className="px-5 py-3">{p.process}</td>
                <td className="px-5 py-3">{p.thickness}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.rev}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  ),
});
