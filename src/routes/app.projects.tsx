import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type Row = { id: string; code: string; name: string; client: string | null; location: string | null; status: string; description: string | null };

export const Route = createFileRoute("/app/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data, isLoading } = useCompanyRows<Row>("projects", { order: { column: "created_at" } });
  return (
    <ModulePage
      title="Projects"
      subtitle="Master data for every fabrication and field-welding project."
      action={
        <NewRecordDialog table="projects" title="New project" trigger="New Project" quota="projects" defaults={{ status: "Active" }}>
          {({ values, set }) => (
            <>
              <F label="Code"><Input required value={values.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="PRJ-001" /></F>
              <F label="Name"><Input required value={values.name ?? ""} onChange={(e) => set("name", e.target.value)} /></F>
              <F label="Client"><Input value={values.client ?? ""} onChange={(e) => set("client", e.target.value)} /></F>
              <F label="Location"><Input value={values.location ?? ""} onChange={(e) => set("location", e.target.value)} /></F>
            </>
          )}
        </NewRecordDialog>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr><Th>Code</Th><Th>Name</Th><Th>Client</Th><Th>Location</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={5}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && (data?.length ?? 0) === 0 && <Empty colSpan={5}>No projects yet.</Empty>}
            {data?.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-medium">{p.code}</td>
                <td className="px-5 py-3">{p.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.client}</td>
                <td className="px-5 py-3">{p.location}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
