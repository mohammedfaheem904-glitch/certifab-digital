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
import { fmtEngDate } from "@/lib/doc-number";

export const Route = createFileRoute("/app/qualifications/trash")({
  component: TrashPage,
});

type Row = {
  id: string;
  wpq_number: string | null;
  welder_name: string;
  employee_id: string;
  process: string;
  code_family: string | null;
  standard: string;
  deleted_at: string;
  deleted_by: string | null;
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
    const { data, error } = await supabase
      .from("qualifications")
      .select("id, wpq_number, welder_name, employee_id, process, code_family, standard, deleted_at, deleted_by")
      .eq("company_id", profile.company_id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as Row[]);
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, profile?.company_id]);

  if (!isAdmin) {
    return (
      <ModulePage title="Trash" subtitle="Restricted to super admins.">
        <div className="text-center py-20 text-muted-foreground">
          You don't have permission to view the WPQ trash.
        </div>
      </ModulePage>
    );
  }

  const restore = async (id: string) => {
    setBusy(id);
    const { error } = await (supabase.rpc as any)("restore_qualification", { _id: id });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Restored.");
    qc.invalidateQueries({ queryKey: ["qualifications"] });
    load();
  };

  const hardDelete = async (id: string) => {
    if (!(await confirmDialog("Permanently delete? This cannot be undone."))) return;
    setBusy(id);
    const { error } = await supabase.from("qualifications").delete().eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Permanently deleted.");
    load();
  };

  return (
    <ModulePage
      title="WPQ Trash"
      subtitle="Soft-deleted Welder Qualifications. Restore to bring them back into active records."
      action={
        <Link to="/app/qualifications">
          <Button size="sm" variant="outline"><ArrowLeft className="size-4 me-1" /> Back to WPQ</Button>
        </Link>
      }
    >
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>WPQ No.</Th>
              <Th>Welder</Th>
              <Th>Employee</Th>
              <Th>Process</Th>
              <Th>Code</Th>
              <Th>Deleted</Th>
              <Th className="text-end pe-5">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows === null && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>
            )}
            {rows && rows.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Trash is empty.</td></tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-mono text-xs">
                  <button onClick={() => nav({ to: "/app/qualifications/$qualId", params: { qualId: r.id } })} className="hover:text-primary">
                    {r.wpq_number ?? r.id.slice(0, 8)}
                  </button>
                </td>
                <td className="px-5 py-3 font-medium">{r.welder_name}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.employee_id}</td>
                <td className="px-5 py-3">{r.process}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.code_family ?? r.standard}</td>
                <td className="px-5 py-3 text-xs">{fmtEngDate(r.deleted_at)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2 pe-1">
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => restore(r.id)}>
                      <Undo2 className="size-3.5 me-1" /> Restore
                    </Button>
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => hardDelete(r.id)} className="text-destructive">
                      <Trash2 className="size-3.5 me-1" /> Delete
                    </Button>
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-start font-medium px-5 py-2.5 ${className}`}>{children}</th>;
}
