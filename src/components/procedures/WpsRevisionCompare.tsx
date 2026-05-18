import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Printer } from "lucide-react";

type Snapshot = Record<string, any>;
type RevisionRow = { id: string; revision: string; created_at: string; change_summary?: string | null; snapshot: Snapshot };

const TRACKED_FIELDS: { key: string; label: string; group: string }[] = [
  { key: "status", label: "Status", group: "Workflow" },
  { key: "approved_at", label: "Approved at", group: "Workflow" },
  { key: "reviewed_at", label: "Reviewed at", group: "Workflow" },
  { key: "wps_no", label: "WPS No.", group: "Header" },
  { key: "pqr_no", label: "Supporting PQR", group: "Header" },
  { key: "document_no", label: "Document No.", group: "Header" },
  { key: "standard", label: "Standard", group: "Header" },
  { key: "process", label: "Process", group: "Header" },
  { key: "groove_type", label: "Groove", group: "Joint" },
  { key: "position_qualified", label: "Position", group: "Joint" },
  { key: "welding_progression", label: "Progression", group: "Joint" },
  { key: "pipe_or_plate", label: "Pipe / Plate", group: "Joint" },
  { key: "thickness_range", label: "Thickness range", group: "Joint" },
  { key: "base_material", label: "Base material (legacy)", group: "Base metals" },
  { key: "filler_material", label: "Filler classification (legacy)", group: "Filler" },
  { key: "shielding_gas", label: "Shielding gas", group: "Filler" },
  { key: "preheat_min_c", label: "Preheat min (°C)", group: "Thermal" },
  { key: "interpass_max_c", label: "Interpass max (°C)", group: "Thermal" },
  { key: "preheat_method", label: "Preheat method", group: "Thermal" },
  { key: "pwht", label: "PWHT", group: "Thermal" },
  { key: "voltage_min", label: "Voltage min", group: "Electrical" },
  { key: "voltage_max", label: "Voltage max", group: "Electrical" },
  { key: "current_min", label: "Current min", group: "Electrical" },
  { key: "current_max", label: "Current max", group: "Electrical" },
  { key: "travel_speed_min", label: "Travel min", group: "Electrical" },
  { key: "travel_speed_max", label: "Travel max", group: "Electrical" },
  { key: "heat_input_min", label: "Heat input min", group: "Electrical" },
  { key: "heat_input_max", label: "Heat input max", group: "Electrical" },
  { key: "technique_string_weave", label: "String / weave", group: "Technique" },
  { key: "cleaning_method", label: "Cleaning method", group: "Technique" },
  { key: "back_gouging", label: "Back gouging", group: "Technique" },
  { key: "automation", label: "Automation", group: "Technique" },
];

function fmt(v: any) {
  if (v == null || v === "") return "—";
  if (typeof v === "string" && /\d{4}-\d{2}-\d{2}T/.test(v)) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleString();
  }
  return String(v);
}

export function WpsRevisionCompare({
  currentSnapshot,
  currentLabel,
  revisions,
}: {
  currentSnapshot: Snapshot;
  currentLabel: string;
  revisions: RevisionRow[];
}) {
  // Build options: every historical revision + "current"
  const options = useMemo(() => {
    const opts = [{ id: "current", label: `${currentLabel} (current)`, snapshot: currentSnapshot }];
    for (const r of revisions) opts.push({ id: r.id, label: r.revision, snapshot: r.snapshot ?? {} });
    return opts;
  }, [currentSnapshot, currentLabel, revisions]);

  const [leftId, setLeftId] = useState<string>(options[1]?.id ?? "current");
  const [rightId, setRightId] = useState<string>("current");

  const left = options.find((o) => o.id === leftId) ?? options[0];
  const right = options.find((o) => o.id === rightId) ?? options[0];

  const grouped = useMemo(() => {
    const out: Record<string, { key: string; label: string; left: any; right: any; changed: boolean }[]> = {};
    for (const f of TRACKED_FIELDS) {
      const lv = left.snapshot?.[f.key];
      const rv = right.snapshot?.[f.key];
      const changed = (lv ?? null) !== (rv ?? null) && String(lv ?? "") !== String(rv ?? "");
      (out[f.group] ??= []).push({ key: f.key, label: f.label, left: lv, right: rv, changed });
    }
    return out;
  }, [left, right]);

  const changedCount = Object.values(grouped).flat().filter((r) => r.changed).length;

  if (options.length < 2) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No previous revisions to compare. Snapshot the current revision first, then create a new revision.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">From (base)</div>
          <select className="h-9 rounded-md border bg-transparent px-2 text-sm min-w-[12rem]"
            value={leftId} onChange={(e) => setLeftId(e.target.value)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <ArrowRight className="size-4 text-muted-foreground mb-2.5" />
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">To (compare)</div>
          <select className="h-9 rounded-md border bg-transparent px-2 text-sm min-w-[12rem]"
            value={rightId} onChange={(e) => setRightId(e.target.value)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        <div className="ms-auto flex items-center gap-3">
          <Badge variant={changedCount > 0 ? "destructive" : "secondary"}>
            {changedCount} change{changedCount === 1 ? "" : "s"}
          </Badge>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="size-4 me-1" /> Print
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-4 py-2 w-1/4">Variable</th>
              <th className="text-start font-medium px-4 py-2 w-1/3">{left.label}</th>
              <th className="text-start font-medium px-4 py-2 w-1/3">{right.label}</th>
              <th className="text-start font-medium px-4 py-2"> </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([group, rows]) => (
              <RowGroup key={group} group={group} rows={rows} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowGroup({ group, rows }: { group: string; rows: { key: string; label: string; left: any; right: any; changed: boolean }[] }) {
  return (
    <>
      <tr className="bg-muted/20">
        <td colSpan={4} className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {group}
        </td>
      </tr>
      {rows.map((r) => (
        <tr key={r.key} className={`border-t border-border/60 ${r.changed ? "bg-amber-500/5" : ""}`}>
          <td className="px-4 py-2 text-muted-foreground">{r.label}</td>
          <td className={`px-4 py-2 ${r.changed ? "line-through text-destructive/80" : ""}`}>{fmt(r.left)}</td>
          <td className={`px-4 py-2 ${r.changed ? "font-medium text-emerald-700 dark:text-emerald-400" : ""}`}>{fmt(r.right)}</td>
          <td className="px-4 py-2">
            {r.changed && <Badge variant="outline" className="text-[10px]">changed</Badge>}
          </td>
        </tr>
      ))}
    </>
  );
}
