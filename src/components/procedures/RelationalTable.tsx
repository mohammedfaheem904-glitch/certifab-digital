import { ReactNode, useState } from "react";
import { useConfirm } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

export type ColumnDef = {
  key: string;
  label: string;
  type?: "text" | "number";
  width?: string;
  placeholder?: string;
};

type Props = {
  title: string;
  description?: string;
  table:
    | "wps_base_metals"
    | "wps_filler_metals"
    | "wps_electrical_characteristics"
    | "wps_joint_configurations"
    | "wps_positions"
    | "wps_preheat_entries"
    | "wps_techniques"
    | "wps_shielding_gases"
    | "wps_pwht"
    | "wps_notes";
  procedureId: string;
  columns: ColumnDef[];
  emptyMessage?: string;
  canEdit: boolean;
  extraRowDefaults?: Record<string, any>;
  renderExtra?: (row: any, refresh: () => void) => ReactNode;
};

export function RelationalTable({
  title, description, table, procedureId, columns, emptyMessage, canEdit, extraRowDefaults, renderExtra,
}: Props) {
  const confirmDialog = useConfirm();
  const qc = useQueryClient();
  const { profile } = useAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const queryKey = [table, procedureId] as const;

  const q = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await (supabase.from(table) as any)
        .select("*")
        .eq("procedure_id", procedureId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey });

  const addRow = async () => {
    if (!profile?.company_id) return;
    setAdding(true);
    const row: Record<string, any> = {
      company_id: profile.company_id,
      procedure_id: procedureId,
      sort_order: (q.data?.length ?? 0),
      ...(extraRowDefaults ?? {}),
    };
    const { error } = await (supabase.from(table) as any).insert(row);
    setAdding(false);
    if (error) return toast.error(error.message);
    refresh();
  };

  const updateField = async (id: string, key: string, value: any) => {
    setSaving(id + key);
    const patch: Record<string, any> = { [key]: value === "" ? null : value };
    const { error } = await (supabase.from(table) as any).update(patch).eq("id", id);
    setSaving(null);
    if (error) return toast.error(error.message);
    refresh();
  };

  const removeRow = async (id: string) => {
    if (!(await confirmDialog("Delete this row?"))) return;
    const { error } = await (supabase.from(table) as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{title}</div>
          {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
        </div>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={addRow} disabled={adding}>
            {adding ? <Loader2 className="size-4 animate-spin me-1" /> : <Plus className="size-4 me-1" />}
            Add row
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-start font-medium px-3 py-2 whitespace-nowrap" style={c.width ? { width: c.width } : undefined}>
                  {c.label}
                </th>
              ))}
              {canEdit && <th className="px-3 py-2 w-10" />}
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr><td colSpan={columns.length + 1} className="px-5 py-6 text-center text-muted-foreground">
                <Loader2 className="size-4 animate-spin inline me-2" /> Loading…
              </td></tr>
            )}
            {!q.isLoading && (q.data ?? []).length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-muted-foreground">
                {emptyMessage ?? "No rows yet."}
              </td></tr>
            )}
            {(q.data ?? []).map((row: any) => (
              <tr key={row.id} className="border-t border-border/60 align-top">
                {columns.map((c) => (
                  <td key={c.key} className="px-2 py-1.5">
                    <Input
                      defaultValue={row[c.key] ?? ""}
                      placeholder={c.placeholder}
                      type={c.type === "number" ? "number" : "text"}
                      disabled={!canEdit}
                      className="h-8 text-sm"
                      onBlur={(e) => {
                        const v = c.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value;
                        if (String(v ?? "") !== String(row[c.key] ?? "")) updateField(row.id, c.key, v);
                      }}
                    />
                  </td>
                ))}
                {canEdit && (
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1">
                      {renderExtra?.(row, refresh)}
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeRow(row.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {saving && <div className="px-5 py-2 text-xs text-muted-foreground border-t border-border">Saving…</div>}
    </div>
  );
}
