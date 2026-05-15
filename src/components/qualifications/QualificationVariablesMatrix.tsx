import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const CODE_REFS = ["QW-402", "QW-403", "QW-404", "QW-405", "QW-408", "QW-409", "QW-410", "ISO 9606"];

const PRESETS: Array<{ key: string; label: string; ref: string }> = [
  { key: "p_no", label: "P-Number (Base)", ref: "QW-403" },
  { key: "f_no", label: "F-Number (Filler)", ref: "QW-404" },
  { key: "thickness", label: "Coupon Thickness", ref: "QW-403" },
  { key: "diameter", label: "Pipe Diameter", ref: "QW-403" },
  { key: "position", label: "Position", ref: "QW-405" },
  { key: "progression", label: "Progression", ref: "QW-405" },
  { key: "backing", label: "Backing", ref: "QW-402" },
  { key: "current", label: "Current / Polarity", ref: "QW-409" },
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
              <Th>Qualified For (Range)</Th>
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
              <tr key={r.id} className="border-t border-border/60">
                <td className="px-3 py-2">
                  <Input
                    defaultValue={r.variable_label}
                    disabled={readOnly}
                    onBlur={(e) =>
                      e.target.value !== r.variable_label && update(r.id, { variable_label: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    disabled={readOnly}
                    defaultValue={r.code_reference ?? "QW-402"}
                    onChange={(e) => update(r.id, { code_reference: e.target.value })}
                    className="h-8 rounded-md border bg-transparent px-2 text-xs"
                  >
                    {CODE_REFS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <Input
                    defaultValue={r.qualified_with ?? ""}
                    disabled={readOnly}
                    onBlur={(e) =>
                      e.target.value !== (r.qualified_with ?? "") &&
                      update(r.id, { qualified_with: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    defaultValue={r.qualified_for ?? ""}
                    disabled={readOnly}
                    onBlur={(e) =>
                      e.target.value !== (r.qualified_for ?? "") &&
                      update(r.id, { qualified_for: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </td>
                {!readOnly && (
                  <td className="px-2 py-2">
                    <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </td>
                )}
              </tr>
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-start font-medium px-3 py-2 ${className}`}>{children}</th>;
}
