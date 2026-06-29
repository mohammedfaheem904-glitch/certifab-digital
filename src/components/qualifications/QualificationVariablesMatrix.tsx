import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { VARIABLE_DERIVERS } from "@/lib/qualification-intelligence";

const CODE_REFS = ["QW-402", "QW-403", "QW-404", "QW-405", "QW-408", "QW-409", "QW-410", "ISO 9606"];

const PRESETS: Array<{ key: string; label: string; ref: string }> = [
  { key: "p_no", label: "P-Number (Base)", ref: "QW-423.1" },
  { key: "f_no", label: "F-Number (Filler)", ref: "QW-433" },
  { key: "thickness", label: "Coupon Thickness", ref: "QW-452.1(b)" },
  { key: "diameter", label: "Pipe Diameter", ref: "QW-403.16" },
  { key: "position", label: "Position", ref: "QW-461.9" },
  { key: "progression", label: "Progression", ref: "QW-405.3" },
  { key: "backing", label: "Backing", ref: "QW-402.4" },
  { key: "current", label: "Current / Polarity", ref: "QW-409.4" },
  { key: "inert_gas_backing", label: "Inert Gas Backing", ref: "QW-408.5" },
  { key: "aws_spec", label: "AWS Specification", ref: "QW-404.4" },
  { key: "insert_ring", label: "Consumable Insert", ref: "QW-402.10" },
  { key: "weld_deposit", label: "T Weld Deposit Thickness", ref: "QW-452.1(b)" },
  { key: "test_specimen", label: "Test Specimen", ref: "QW-452" },
  { key: "sfa", label: "SFA Classification", ref: "QW-404.4" },
  { key: "filler_metal", label: "Filler Metal Form", ref: "QW-404.23" },
  { key: "transfer_mode", label: "Transfer Mode (GMAW)", ref: "QW-409.2" },
  { key: "joint_type", label: "Joint Type", ref: "QW-402.1" },
];

export function QualificationVariablesMatrix({
  qualificationId,
  rows,
  onChange,
  readOnly = false,
}: {
  qualificationId: string;
  rows: any[];
  onChange: () => void;
  readOnly?: boolean;
}) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  const update = async (id: string, patch: Record<string, any>) => {
    const { error } = await (supabase.from("qualification_variables" as any) as any)
      .update(patch)
      .eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };

  const remove = async (id: string) => {
    const { error } = await (supabase.from("qualification_variables" as any) as any)
      .delete()
      .eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };

  const addRow = async (preset?: typeof PRESETS[number]) => {
    if (!profile?.company_id) return;
    setBusy(true);
    const { error } = await (supabase.from("qualification_variables" as any) as any).insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      variable_key: preset?.key ?? `var_${Date.now()}`,
      variable_label: preset?.label ?? "New variable",
      code_reference: preset?.ref ?? "QW-402",
      sort_order: rows.length,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      onChange();
      qc.invalidateQueries({ queryKey: ["qualification_variables", qualificationId] });
    }
  };

  const seedDefaults = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    const payload = PRESETS.map((p, i) => ({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      variable_key: p.key,
      variable_label: p.label,
      code_reference: p.ref,
      sort_order: i,
    }));
    const { error } = await (supabase.from("qualification_variables" as any) as any).insert(payload);
    setBusy(false);
    if (error) toast.error(error.message);
    else onChange();
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>Variable</Th>
              <Th>Code Ref</Th>
              <Th>Qualified With</Th>
              <Th>Qualified For (Range) — auto</Th>
              {!readOnly && <Th className="w-10"> </Th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No variables yet.
                  {!readOnly && (
                    <Button size="sm" variant="link" onClick={seedDefaults} disabled={busy}>
                      Insert ASME IX defaults
                    </Button>
                  )}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <VariableRow
                key={r.id}
                row={r}
                readOnly={readOnly}
                onUpdate={(patch) => update(r.id, patch)}
                onRemove={() => remove(r.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => addRow()} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Add row
          </Button>
          {PRESETS.map((p) => (
            <Button key={p.key} size="sm" variant="ghost" onClick={() => addRow(p)} disabled={busy}>
              + {p.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariableRow({
  row,
  readOnly,
  onUpdate,
  onRemove,
}: {
  row: any;
  readOnly: boolean;
  onUpdate: (patch: Record<string, any>) => void;
  onRemove: () => void;
}) {
  const deriver = VARIABLE_DERIVERS[row.variable_key as string];
  const [localWith, setLocalWith] = useState<string>(row.qualified_with ?? "");
  const [withBacking, setWithBacking] = useState<boolean>(!!row.with_backing);

  const derivation = useMemo(() => {
    if (!deriver) return null;
    return deriver.derive(localWith, { withBacking });
  }, [deriver, localWith, withBacking]);

  const computedQualifiedFor = derivation?.qualifiedFor ?? "";
  const effectiveCodeRef = derivation?.codeRef ?? row.code_reference;

  const commit = (nextWith: string, nextWithBacking = withBacking) => {
    const patch: Record<string, any> = { qualified_with: nextWith };
    if (deriver) {
      const d = deriver.derive(nextWith, { withBacking: nextWithBacking });
      patch.qualified_for = d.qualifiedFor;
      if (d.codeRef && d.codeRef !== row.code_reference) {
        patch.code_reference = d.codeRef;
      }
    }
    onUpdate(patch);
  };

  return (
    <tr className="border-t border-border/60 align-top">
      <td className="px-3 py-2">
        <Input
          defaultValue={row.variable_label}
          disabled={readOnly}
          onBlur={(e) =>
            e.target.value !== row.variable_label && onUpdate({ variable_label: e.target.value })
          }
          className="h-8 text-sm"
        />
      </td>
      <td className="px-3 py-2">
        <select
          disabled={readOnly}
          value={effectiveCodeRef ?? "QW-402"}
          onChange={(e) => onUpdate({ code_reference: e.target.value })}
          className="h-8 rounded-md border bg-transparent px-2 text-xs"
        >
          {[...new Set([...CODE_REFS, effectiveCodeRef].filter(Boolean))].map((c) => (
            <option key={c as string}>{c as string}</option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        {deriver ? (
          <div className="space-y-1">
            {deriver.kind === "select" ? (
              <select
                disabled={readOnly}
                value={localWith}
                onChange={(e) => {
                  setLocalWith(e.target.value);
                  commit(e.target.value);
                }}
                className="h-8 w-full rounded-md border bg-transparent px-2 text-sm"
              >
                <option value="">— Select —</option>
                {deriver.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type={deriver.kind === "number" ? "number" : "text"}
                inputMode={deriver.kind === "number" ? "decimal" : undefined}
                placeholder={deriver.placeholder}
                value={localWith}
                disabled={readOnly}
                onChange={(e) => setLocalWith(e.target.value)}
                onBlur={(e) => e.target.value !== (row.qualified_with ?? "") && commit(e.target.value)}
                className="h-8 text-sm"
              />
            )}
            {(row.variable_key === "thickness" || row.variable_key === "weld_deposit") && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={withBacking}
                  disabled={readOnly}
                  onCheckedChange={(c) => {
                    const next = !!c;
                    setWithBacking(next);
                    commit(localWith, next);
                  }}
                />
                Tested with backing
              </label>
            )}
          </div>
        ) : (
          <Input
            defaultValue={row.qualified_with ?? ""}
            disabled={readOnly}
            onBlur={(e) =>
              e.target.value !== (row.qualified_with ?? "") &&
              onUpdate({ qualified_with: e.target.value })
            }
            className="h-8 text-sm"
          />
        )}
      </td>
      <td className="px-3 py-2">
        {deriver ? (
          <div className="space-y-1">
            <div className="min-h-8 rounded-md border border-dashed border-border bg-muted/30 px-2 py-1.5 text-sm">
              {computedQualifiedFor || (
                <span className="text-muted-foreground italic">
                  Enter a value to auto-calculate…
                </span>
              )}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Ref: {effectiveCodeRef}
            </div>
            {derivation?.warning && (
              <div className="flex items-start gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-3 mt-0.5 shrink-0" />
                <span>{derivation.warning}</span>
              </div>
            )}
          </div>
        ) : (
          <Input
            defaultValue={row.qualified_for ?? ""}
            disabled={readOnly}
            onBlur={(e) =>
              e.target.value !== (row.qualified_for ?? "") &&
              onUpdate({ qualified_for: e.target.value })
            }
            className="h-8 text-sm"
          />
        )}
      </td>
      {!readOnly && (
        <td className="px-2 py-2">
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="size-4 text-muted-foreground" />
          </Button>
        </td>
      )}
    </tr>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-start font-medium px-3 py-2 ${className}`}>{children}</th>;
}
