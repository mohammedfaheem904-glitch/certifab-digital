import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Engineering taxonomy — Essential / Non-Essential / Supplementary Essential
// ---------------------------------------------------------------------------
type Cat = "essential" | "non_essential" | "supplementary_essential";

export const WPS_GROUPS = [
  "Welding Process",
  "Joint Design",
  "Base Metal",
  "Filler Metal",
  "Electrical",
  "Position",
  "Preheat / Interpass",
  "PWHT",
  "Shielding Gas",
  "Backing",
  "Technique",
  "Material Compatibility",
] as const;

type GroupName = (typeof WPS_GROUPS)[number];

type Preset = {
  key: string;
  label: string;
  ref: string;
  cat: Cat;
  group: GroupName;
};

// ASME IX (QW) presets — covers the standard essential / non-essential /
// supplementary essential variables for arc welding processes.
const PRESETS: Preset[] = [
  // ----- Welding Process
  { key: "process", label: "Process (SMAW/GTAW/...)", ref: "QW-401.1", cat: "essential", group: "Welding Process" },
  { key: "process_type", label: "Process Type (manual/semi-auto)", ref: "QW-410", cat: "non_essential", group: "Welding Process" },

  // ----- Joint Design
  { key: "joint_groove", label: "Groove Type", ref: "QW-402.1", cat: "non_essential", group: "Joint Design" },
  { key: "joint_backing", label: "Backing (with/without)", ref: "QW-402.4", cat: "essential", group: "Joint Design" },
  { key: "joint_root_spacing", label: "Root Spacing", ref: "QW-402.10", cat: "non_essential", group: "Joint Design" },

  // ----- Base Metal
  { key: "bm_pno", label: "P-Number", ref: "QW-403.11", cat: "essential", group: "Base Metal" },
  { key: "bm_group", label: "Group Number", ref: "QW-403.16", cat: "supplementary_essential", group: "Base Metal" },
  { key: "bm_thickness", label: "Thickness Range", ref: "QW-403.6", cat: "essential", group: "Base Metal" },
  { key: "bm_diameter", label: "Pipe Diameter Range", ref: "QW-403.13", cat: "essential", group: "Base Metal" },
  { key: "bm_pwht_cond", label: "Base Metal PWHT Condition", ref: "QW-403.8", cat: "essential", group: "Base Metal" },

  // ----- Filler Metal
  { key: "fm_fno", label: "F-Number", ref: "QW-404.4", cat: "essential", group: "Filler Metal" },
  { key: "fm_ano", label: "A-Number", ref: "QW-404.5", cat: "essential", group: "Filler Metal" },
  { key: "fm_sfa", label: "SFA / AWS Class", ref: "QW-404.4", cat: "non_essential", group: "Filler Metal" },
  { key: "fm_diameter", label: "Electrode Diameter", ref: "QW-404.6", cat: "non_essential", group: "Filler Metal" },
  { key: "fm_deposit_thk", label: "Max Deposit Thickness", ref: "QW-404.32", cat: "essential", group: "Filler Metal" },
  { key: "fm_supplemental", label: "Supplemental Filler", ref: "QW-404.23", cat: "non_essential", group: "Filler Metal" },

  // ----- Electrical
  { key: "el_current", label: "Current / Polarity", ref: "QW-409.4", cat: "non_essential", group: "Electrical" },
  { key: "el_amperage", label: "Amperage Range", ref: "QW-409.8", cat: "non_essential", group: "Electrical" },
  { key: "el_voltage", label: "Voltage Range", ref: "QW-409.8", cat: "non_essential", group: "Electrical" },
  { key: "el_heat_input", label: "Heat Input (max kJ/mm)", ref: "QW-409.1", cat: "supplementary_essential", group: "Electrical" },
  { key: "el_travel_speed", label: "Travel Speed", ref: "QW-410.5", cat: "non_essential", group: "Electrical" },

  // ----- Position
  { key: "pos_qualified", label: "Position Qualified", ref: "QW-405.1", cat: "non_essential", group: "Position" },
  { key: "pos_progression", label: "Progression (up/down)", ref: "QW-405.3", cat: "essential", group: "Position" },

  // ----- Preheat / Interpass
  { key: "pre_min_temp", label: "Min Preheat Temperature", ref: "QW-406.1", cat: "essential", group: "Preheat / Interpass" },
  { key: "pre_interpass", label: "Max Interpass Temperature", ref: "QW-406.2", cat: "supplementary_essential", group: "Preheat / Interpass" },
  { key: "pre_maintenance", label: "Preheat Maintenance", ref: "QW-406.3", cat: "non_essential", group: "Preheat / Interpass" },

  // ----- PWHT
  { key: "pwht_type", label: "PWHT Type", ref: "QW-407.1", cat: "essential", group: "PWHT" },
  { key: "pwht_temp_time", label: "Temp / Time Range", ref: "QW-407.2", cat: "essential", group: "PWHT" },
  { key: "pwht_thickness", label: "PWHT Thickness Range", ref: "QW-407.4", cat: "supplementary_essential", group: "PWHT" },

  // ----- Shielding Gas
  { key: "gas_type", label: "Gas Type / Mixture", ref: "QW-408.2", cat: "non_essential", group: "Shielding Gas" },
  { key: "gas_flow", label: "Flow Rate", ref: "QW-408.3", cat: "non_essential", group: "Shielding Gas" },
  { key: "gas_backing", label: "Backing Gas", ref: "QW-408.5", cat: "essential", group: "Shielding Gas" },

  // ----- Backing
  { key: "back_type", label: "Backing Type / Material", ref: "QW-402.4", cat: "essential", group: "Backing" },

  // ----- Technique
  { key: "tech_string_weave", label: "String / Weave", ref: "QW-410.1", cat: "non_essential", group: "Technique" },
  { key: "tech_cleaning", label: "Cleaning Method", ref: "QW-410.5", cat: "non_essential", group: "Technique" },
  { key: "tech_oscillation", label: "Oscillation", ref: "QW-410.7", cat: "non_essential", group: "Technique" },
  { key: "tech_peening", label: "Peening", ref: "QW-410.9", cat: "non_essential", group: "Technique" },
  { key: "tech_back_gouge", label: "Back Gouging", ref: "QW-410.6", cat: "non_essential", group: "Technique" },

  // ----- Material Compatibility
  { key: "mat_dissimilar", label: "Dissimilar Joint Allowance", ref: "QW-403.20", cat: "essential", group: "Material Compatibility" },
];

const CAT_META: Record<Cat, { label: string; tone: string; short: string }> = {
  essential: { label: "Essential", tone: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30", short: "E" },
  supplementary_essential: { label: "Supplementary Essential", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30", short: "SE" },
  non_essential: { label: "Non-Essential", tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30", short: "NE" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function WpsVariablesMatrix({
  procedureId,
  canEdit,
  process,
}: {
  procedureId: string;
  canEdit: boolean;
  process?: string | null;
}) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [filterCat, setFilterCat] = useState<"all" | Cat>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const q = useQuery({
    queryKey: ["wps_variables", procedureId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("wps_variables" as any) as any)
        .select("*")
        .eq("procedure_id", procedureId)
        .order("group_name", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const rows = q.data ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const g of WPS_GROUPS) map.set(g, []);
    for (const r of rows) {
      if (filterCat !== "all" && r.category !== filterCat) continue;
      const arr = map.get(r.group_name) ?? [];
      arr.push(r);
      map.set(r.group_name, arr);
    }
    return map;
  }, [rows, filterCat]);

  const refresh = () => qc.invalidateQueries({ queryKey: ["wps_variables", procedureId] });

  const update = async (id: string, patch: Record<string, any>) => {
    const { error } = await (supabase.from("wps_variables" as any) as any).update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this variable?")) return;
    const { error } = await (supabase.from("wps_variables" as any) as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const addRow = async (group: GroupName, preset?: Preset) => {
    if (!profile?.company_id) return;
    setBusy(true);
    const { error } = await (supabase.from("wps_variables" as any) as any).insert({
      company_id: profile.company_id,
      procedure_id: procedureId,
      category: preset?.cat ?? "essential",
      group_name: preset?.group ?? group,
      process_ref: process ?? null,
      variable_key: preset?.key ?? `var_${Date.now()}`,
      variable_label: preset?.label ?? "New variable",
      code_reference: preset?.ref ?? "QW-402",
      sort_order: rows.length,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    refresh();
  };

  const seedAll = async () => {
    if (!profile?.company_id) return;
    if (rows.length > 0 && !confirm("Seed default ASME IX variables in addition to existing rows?")) return;
    setBusy(true);
    const payload = PRESETS.map((p, i) => ({
      company_id: profile.company_id,
      procedure_id: procedureId,
      category: p.cat,
      group_name: p.group,
      process_ref: process ?? null,
      variable_key: p.key,
      variable_label: p.label,
      code_reference: p.ref,
      sort_order: i,
    }));
    const { error } = await (supabase.from("wps_variables" as any) as any).insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Seeded ${PRESETS.length} ASME IX variables`);
    refresh();
  };

  if (q.isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="size-4 animate-spin me-2" /> Loading variables…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filter:</span>
          {(["all", "essential", "supplementary_essential", "non_essential"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                filterCat === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
              }`}
            >
              {c === "all" ? "All" : CAT_META[c].label}
            </button>
          ))}
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            {rows.length === 0 && (
              <Button size="sm" onClick={seedAll} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin me-1.5" /> : <Sparkles className="size-4 me-1.5" />}
                Seed ASME IX defaults
              </Button>
            )}
          </div>
        )}
      </div>

      {rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <Sparkles className="size-6 mx-auto mb-2 text-muted-foreground" />
          <div className="font-medium text-sm">No engineering variables yet</div>
          <div className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Capture Essential, Non-Essential, and Supplementary Essential variables for this WPS.
            Start with the standard ASME IX (QW) preset and edit from there.
          </div>
        </div>
      )}

      {/* Grouped tables */}
      {WPS_GROUPS.map((g) => {
        const items = grouped.get(g) ?? [];
        if (items.length === 0 && !canEdit) return null;
        const isCollapsed = collapsed[g];
        return (
          <div key={g} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              type="button"
              onClick={() => setCollapsed((s) => ({ ...s, [g]: !s[g] }))}
              className="w-full px-5 py-3 border-b border-border flex items-center justify-between hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
                <span className="text-sm font-medium">{g}</span>
                <span className="text-xs text-muted-foreground">({items.length})</span>
              </div>
              {canEdit && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    addRow(g);
                  }}
                  className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-background"
                >
                  <Plus className="size-3" /> Add
                </span>
              )}
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground bg-muted/30">
                    <tr>
                      <th className="text-start font-medium px-3 py-2 w-28">Category</th>
                      <th className="text-start font-medium px-3 py-2">Variable</th>
                      <th className="text-start font-medium px-3 py-2 w-28">Code Ref</th>
                      <th className="text-start font-medium px-3 py-2 w-24">Process</th>
                      <th className="text-start font-medium px-3 py-2">Qualified Value</th>
                      <th className="text-start font-medium px-3 py-2">Actual / Range</th>
                      {canEdit && <th className="w-10" />}
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={canEdit ? 7 : 6} className="px-4 py-6 text-center text-xs text-muted-foreground">
                          No variables in this group.
                          {canEdit && (
                            <Button size="sm" variant="link" onClick={() => addRow(g)}>
                              Add one
                            </Button>
                          )}
                        </td>
                      </tr>
                    )}
                    {items.map((r) => {
                      const meta = CAT_META[r.category as Cat];
                      return (
                        <tr key={r.id} className="border-t border-border/60">
                          <td className="px-3 py-1.5">
                            {canEdit ? (
                              <Select
                                defaultValue={r.category}
                                onValueChange={(v) => update(r.id, { category: v })}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="essential">Essential</SelectItem>
                                  <SelectItem value="supplementary_essential">Supplementary Essential</SelectItem>
                                  <SelectItem value="non_essential">Non-Essential</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline" className={`text-[10px] ${meta.tone}`}>{meta.short}</Badge>
                            )}
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              defaultValue={r.variable_label}
                              disabled={!canEdit}
                              className="h-8 text-sm"
                              onBlur={(e) =>
                                e.target.value !== r.variable_label && update(r.id, { variable_label: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              defaultValue={r.code_reference ?? ""}
                              disabled={!canEdit}
                              className="h-8 text-xs font-mono"
                              onBlur={(e) =>
                                e.target.value !== (r.code_reference ?? "") &&
                                update(r.id, { code_reference: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              defaultValue={r.process_ref ?? ""}
                              disabled={!canEdit}
                              placeholder="any"
                              className="h-8 text-xs"
                              onBlur={(e) =>
                                e.target.value !== (r.process_ref ?? "") &&
                                update(r.id, { process_ref: e.target.value || null })
                              }
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              defaultValue={r.qualified_value ?? ""}
                              disabled={!canEdit}
                              className="h-8 text-sm"
                              onBlur={(e) =>
                                e.target.value !== (r.qualified_value ?? "") &&
                                update(r.id, { qualified_value: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <Input
                              defaultValue={r.actual_range ?? ""}
                              disabled={!canEdit}
                              className="h-8 text-sm"
                              onBlur={(e) =>
                                e.target.value !== (r.actual_range ?? "") &&
                                update(r.id, { actual_range: e.target.value })
                              }
                            />
                          </td>
                          {canEdit && (
                            <td className="px-2 py-1.5">
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => remove(r.id)}>
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Footer hint */}
      <p className="text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 me-3"><span className="inline-block size-2 rounded-full bg-red-500" /> Essential — change requires requalification</span>
        <span className="inline-flex items-center gap-1.5 me-3"><span className="inline-block size-2 rounded-full bg-amber-500" /> Supplementary Essential — required when notch toughness applies</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2 rounded-full bg-sky-500" /> Non-Essential — may be changed without requalification</span>
      </p>
    </div>
  );
}
