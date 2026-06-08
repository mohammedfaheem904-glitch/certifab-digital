import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useConfirm } from "@/components/ConfirmDialog";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Undo2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/inspections/trash")({
  component: TrashPage,
});

type Row = {
  id: string;
  inspection_no: string | null;
  inspection_type: string;
  discipline: string | null;
  line_no: string | null;
  joint_no: string | null;
  workflow_status: string | null;
  deleted_at: string;
};

function TrashPage() {
  const confirmDialog = useConfirm();
  const { roles, profile } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const nav = useNavigate();
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    if (!profile?.company_id) return;
    setRows(null);
    const { data, error } = await (supabase.from("inspections" as any) as any)
      .select("id, inspection_no, inspection_type, discipline, line_no, joint_no, workflow_status, deleted_at")
      .eq("company_id", profile.company_id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    if (error) { toast.error(error.message); setRows([]); return; }
    setRows((data ?? []) as Row[]);
  };

  useEffect(() => { if (isAdmin) load(); /* eslint-disable-next-line */ }, [isAdmin, profile?.company_id]);

  if (!isAdmin) {
    return (
      <ModulePage title="Inspections Trash" subtitle="Restricted to super admins.">
        <div className="text-center py-20 text-muted-foreground">You don't have permission to view the inspections trash.</div>
      </ModulePage>
    );
  }

  const restore = async (id: string) => {
    setBusy(id);
    const { error } = await (supabase.rpc as any)("restore_inspection", { _id: id });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Restored.");
    qc.invalidateQueries({ queryKey: ["inspections"] });
    load();
  };

  const hardDelete = async (id: string) => {
    if (!(await confirmDialog("Permanently delete this inspection? This cannot be undone."))) return;
    setBusy(id);
    const { error } = await (supabase.from("inspections" as any) as any).delete().eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Permanently deleted.");
    load();
  };

  return (
    <ModulePage
      title="Inspections Trash"
      subtitle="Soft-deleted inspections. Restore to bring them back into active records."
      action={
        <Link to="/app/inspections">
          <Button size="sm" variant="outline"><ArrowLeft className="size-4 me-1" /> Back to Inspections</Button>
        </Link>
      }
    >
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>Inspection</Th><Th>Type</Th><Th>Discipline</Th><Th>Line / Joint</Th><Th>Status</Th><Th>Deleted</Th>
              <th className="text-end font-medium pe-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Trash is empty.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-mono text-xs">
                  <button onClick={() => nav({ to: "/app/inspections/$inspectionId", params: { inspectionId: r.id } })} className="hover:text-primary">{r.inspection_no ?? r.id.slice(0, 8)}</button>
                </td>
                <td className="px-5 py-3">{r.inspection_type}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.discipline ?? "—"}</td>
                <td className="px-5 py-3 text-xs">{r.line_no ?? "—"}{r.joint_no ? ` · ${r.joint_no}` : ""}</td>
                <td className="px-5 py-3 text-xs">{r.workflow_status ?? "—"}</td>
                <td className="px-5 py-3 text-xs">{new Date(r.deleted_at).toLocaleString()}</td>
                <td className="pe-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => restore(r.id)}><Undo2 className="size-3.5 me-1" /> Restore</Button>
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => hardDelete(r.id)} className="text-destructive"><Trash2 className="size-3.5 me-1" /> Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
