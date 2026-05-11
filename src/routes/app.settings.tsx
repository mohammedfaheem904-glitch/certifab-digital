import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";

const roles = [
  { role: "Super Admin", users: 2, scope: "Full access across all companies" },
  { role: "QA/QC Manager", users: 5, scope: "Approve WPS, manage NCRs, sign-off inspections" },
  { role: "Welding Engineer", users: 8, scope: "Author WPS/PQR, validate parameters" },
  { role: "Inspector", users: 14, scope: "Log inspections, raise NCRs" },
  { role: "Welder", users: 142, scope: "View assigned welds, scan QR for WPS" },
  { role: "Client Viewer", users: 6, scope: "Read-only access to project KPIs" },
];

export const Route = createFileRoute("/app/settings")({
  component: () => (
    <ModulePage title="Settings — Roles & Access">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">Role</th>
              <th className="text-start font-medium px-5 py-2.5">Users</th>
              <th className="text-start font-medium px-5 py-2.5">Scope</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.role} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{r.role}</td>
                <td className="px-5 py-3">{r.users}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  ),
});
