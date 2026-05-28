import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModulePage } from "@/components/ModulePage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Undo2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { fmtEngDate } from "@/lib/doc-number";

export const Route = createFileRoute("/app/pqrs/trash")({
  component: TrashPage,
});

type Row = {
  id: string;
  pqr_no: string;
  status: string;
  code_family: string;
  standard: string | null;
  overall_result: string;
  deleted_at: string;
};

function TrashPage() {
  const { roles, profile } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const nav = useNavigate();
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    if (!profile?.company_id) return;
    setRows(null);
    const { data, error } = await (supabase.from("pqrs" as any) as any)
      .select("id, pqr_no, status, code_family, standard, overall_result, deleted_at")
      .eq("company_id", profile.company_id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    if (error) { toast.error(error.message); setRows([]); return; }
    setRows((data ?? []) as Row[]);
  };

  useEffect(() => { if (isAdmin) load(); /* eslint-disable-next-line */ }, [isAdmin, profile?.company_id]);

  if (!isAdmin) {
    return (
      <ModulePage title="PQR Trash" subtitle="Restricted to super admins.">
        <div className="text-center py-20 text-muted-foreground">You don't have permission to view the PQR trash.</div>
      </ModulePage>
    );
  }

  const restore = async (id: string) => {
    setBusy(id);
    const { error } = await (supabase.rpc as any)("restore_pqr", { _id: id });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Restored.");
    qc.invalidateQueries({ queryKey: ["pqrs"] });
    load();
  };

  const hardDelete = async (id: string) => {
    if (!confirm("Permanently delete? This cannot be undone.")) return;
    setBusy(id);
    const { error } = await (supabase.from("pqrs" as any) as any).delete().eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Permanently deleted.");
    load();
  };

  return (
    <ModulePage
      title="PQR Trash"
      subtitle="Soft-deleted Procedure Qualification Records. Restore to bring them back into active records."
      action={
        <Link to="/app/pqrs">
          <Button size="sm" variant="outline"><ArrowLeft className="size-4 me-1" /> Back to PQRs</Button>
        </Link>
      }
    >
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>PQR No.</Th><Th>Code</Th><Th>Standard</Th><Th>Status</Th><Th>Result</Th><Th>Deleted</Th>
              <Th className="text-end pe-5">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {rows && rows.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Trash is empty.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 font-mono text-xs">
                  <button onClick={() => nav({ to: "/app/pqrs/$pqrId", params: { pqrId: r.id } })} className="hover:text-primary">{r.pqr_no}</button>
                </td>
                <td className="px-5 py-3">{r.code_family}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.standard ?? "—"}</td>
                <td className="px-5 py-3">{r.status}</td>
                <td className="px-5 py-3">{r.overall_result}</td>
                <td className="px-5 py-3 text-xs">{fmtEngDate(r.deleted_at)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2 pe-1">
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-start font-medium px-5 py-2.5 ${className}`}>{children}</th>;
}
