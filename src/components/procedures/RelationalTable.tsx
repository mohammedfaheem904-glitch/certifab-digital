import { ReactNode, useState } from "react";
import { useConfirm } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2, Plus, Trash2, ChevronsUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

export type ComboOption = {
  value: string;
  label: string;
  description?: string;
  keywords?: string;
};

export type ColumnDef = {
  key: string;
  label: string;
  type?: "text" | "number";
  width?: string;
  placeholder?: string;
  kind?: "input" | "combobox" | "select";
  options?: ComboOption[] | ((row: any) => ComboOption[]);
  selectOptions?: string[];
  onOptionSelected?: (option: ComboOption, row: any) => Record<string, any>;
  /** Optional per-row warning text (e.g. invalid combination). */
  validate?: (row: any) => string | null;
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

  const updatePatch = async (id: string, patch: Record<string, any>) => {
    setSaving(id);
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(patch)) clean[k] = v === "" ? null : v;
    const { error } = await (supabase.from(table) as any).update(clean).eq("id", id);
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
                    {c.kind === "combobox" ? (
                      <ComboboxCell
                        column={c}
                        row={row}
                        disabled={!canEdit}
                        onCommit={(value) => {
                          if (String(value ?? "") !== String(row[c.key] ?? "")) {
                            updateField(row.id, c.key, value);
                          }
                        }}
                        onSelectOption={(opt) => {
                          const extra = c.onOptionSelected?.(opt, row) ?? {};
                          const patch = { [c.key]: opt.value, ...extra };
                          updatePatch(row.id, patch);
                        }}
                      />
                    ) : c.kind === "select" ? (
                      <select
                        defaultValue={row[c.key] ?? ""}
                        disabled={!canEdit}
                        className="h-8 w-full min-w-[180px] rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onChange={(e) => {
                          const v = e.target.value;
                          if (String(v ?? "") !== String(row[c.key] ?? "")) updateField(row.id, c.key, v);
                        }}
                      >
                        <option value="">{c.placeholder ?? "— Select —"}</option>
                        {(c.selectOptions ?? []).map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
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
                    )}

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

function ComboboxCell({
  column, row, disabled, onCommit, onSelectOption,
}: {
  column: ColumnDef;
  row: any;
  disabled: boolean;
  onCommit: (value: string) => void;
  onSelectOption: (opt: ComboOption) => void;
}) {
  const current = String(row[column.key] ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = column.options ?? [];
  const trimmed = query.trim();
  const hasExact = trimmed
    ? options.some((o) => o.value.toLowerCase() === trimmed.toLowerCase())
    : true;

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setQuery(""); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex h-8 w-full min-w-[180px] items-center justify-between rounded-md border border-input bg-background px-2 text-sm text-start hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className={current ? "" : "text-muted-foreground"}>
            {current || column.placeholder || "Select…"}
          </span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground ms-2 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[380px]" align="start">
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput
            placeholder="Search or type a custom material…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            {trimmed && !hasExact && (
              <CommandGroup heading="Custom">
                <CommandItem
                  value={`__custom__ ${trimmed}`}
                  onSelect={() => {
                    onCommit(trimmed);
                    setOpen(false);
                  }}
                >
                  Use "<span className="font-medium ms-1">{trimmed}</span>"
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup heading="Standard materials">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value + (opt.keywords ?? "")}
                  value={`${opt.value} ${opt.label} ${opt.description ?? ""} ${opt.keywords ?? ""}`}
                  onSelect={() => {
                    onSelectOption(opt);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{opt.label}</span>
                    {opt.description && (
                      <span className="text-xs text-muted-foreground">{opt.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
