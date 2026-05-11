import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { qualifications } from "@/lib/sample-data";

export const Route = createFileRoute("/app/qualifications")({
  component: () => (
    <ModulePage
      title="Personnel Qualifications"
      subtitle="Welders, operators, inspectors and QA/QC engineers — with expiry tracking and QR verification."
      primaryAction="Add Personnel"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">Name</th>
              <th className="text-start font-medium px-5 py-2.5">Employee ID</th>
              <th className="text-start font-medium px-5 py-2.5">Process</th>
              <th className="text-start font-medium px-5 py-2.5">Standard</th>
              <th className="text-start font-medium px-5 py-2.5">Expiry</th>
              <th className="text-start font-medium px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {qualifications.map((q) => (
              <tr key={q.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium flex items-center gap-3">
                  <span className="size-7 rounded-full bg-muted grid place-items-center text-[11px]">
                    {q.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                  </span>
                  {q.name}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{q.id}</td>
                <td className="px-5 py-3">{q.process}</td>
                <td className="px-5 py-3 text-muted-foreground">{q.standard}</td>
                <td className="px-5 py-3">{q.expiry}</td>
                <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  ),
});
