import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { evaluateMechRow } from "@/lib/pqr-rules";

const TYPES = ["Tensile", "Bend", "Impact", "Hardness", "Macro Etch", "Fracture"] as const;
const RESULTS = ["Pending", "Pass", "Fail", "N/A"] as const;

type MechRow = {
  id: string;
  company_id: string;
  pqr_id: string | null;
  test_type: string;
  specimen_id: string | null;
  dimensions: any;
  results: any;
  minimum_requirement: string | null;
  result: string;
  laboratory: string | null;
  report_number: string | null;
  test_date: string | null;
  remarks: string | null;
};

export function MechanicalTestsTable({ pqrId }: { pqrId: string }) {
  const { profile } = useAuth();
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<MechRow[]>({
    queryKey: ["mech", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("mechanical_tests" as any) as any)
        .select("*")
        .eq("pqr_id", pqrId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MechRow[];
    },
  });

  const addRow = useMutation({
    mutationFn: async (test_type: string) => {
      const { error } = await (supabase.from("mechanical_tests" as any) as any).insert({
        company_id: profile?.company_id,
        pqr_id: pqrId,
        test_type,
        result: "Pending",
        results: {},
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mech", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const updateRow = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<MechRow> }) => {
      const { error } = await (supabase.from("mechanical_tests" as any) as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mech", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const deleteRow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("mechanical_tests" as any) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mech", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium me-2">Add specimen:</span>
        {TYPES.map((t) => (
          <Button key={t} size="sm" variant="outline" onClick={() => addRow.mutate(t)} disabled={addRow.isPending}>
            <Plus className="size-3.5 me-1" /> {t}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" />Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
          No mechanical tests recorded. Required matrix is shown in the Evaluation tab.
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Specimen</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Min req.</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <MechRowEditor key={r.id} row={r} onPatch={(patch) => updateRow.mutate({ id: r.id, patch })} onDelete={() => deleteRow.mutate(r.id)} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function MechRowEditor({ row, onPatch, onDelete }: { row: MechRow; onPatch: (p: Partial<MechRow>) => void; onDelete: () => void }) {
  const [local, setLocal] = useState<MechRow>(row);
  const set = <K extends keyof MechRow>(k: K, v: MechRow[K]) => setLocal((s) => ({ ...s, [k]: v }));
  const setRes = (k: string, v: any) => setLocal((s) => ({ ...s, results: { ...(s.results ?? {}), [k]: v } }));
  const commit = (patch: Partial<MechRow>) => onPatch(patch);

  const evalVerdict = useMemo(() => evaluateMechRow(local), [local]);

  return (
    <>
      <TableRow>
        <TableCell>
          <select className="h-8 rounded-md border bg-transparent px-2 text-sm" value={local.test_type} onChange={(e) => { set("test_type", e.target.value); commit({ test_type: e.target.value }); }}>
            {TYPES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </TableCell>
        <TableCell><Input className="h-8" value={local.specimen_id ?? ""} onChange={(e) => set("specimen_id", e.target.value)} onBlur={() => commit({ specimen_id: local.specimen_id })} /></TableCell>
        <TableCell><Input className="h-8" value={local.laboratory ?? ""} onChange={(e) => set("laboratory", e.target.value)} onBlur={() => commit({ laboratory: local.laboratory })} /></TableCell>
        <TableCell><Input className="h-8" type="date" value={local.test_date ?? ""} onChange={(e) => set("test_date", e.target.value || null)} onBlur={() => commit({ test_date: local.test_date })} /></TableCell>
        <TableCell><Input className="h-8 w-32" value={local.minimum_requirement ?? ""} onChange={(e) => set("minimum_requirement", e.target.value)} onBlur={() => commit({ minimum_requirement: local.minimum_requirement })} placeholder="485 MPa" /></TableCell>
        <TableCell>
          <select
            className="h-8 rounded-md border bg-transparent px-2 text-sm"
            value={local.result}
            onChange={(e) => { set("result", e.target.value); commit({ result: e.target.value }); }}
          >
            {RESULTS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </TableCell>
        <TableCell>
          {evalVerdict.pass ? (
            <Badge variant="outline" className="bg-success/10 text-success border-success/30"><CheckCircle2 className="size-3 me-1" />OK</Badge>
          ) : (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30" title={evalVerdict.reason}><XCircle className="size-3 me-1" />{evalVerdict.reason}</Badge>
          )}
          {evalVerdict.codeRef && <div className="text-[10px] text-muted-foreground mt-0.5">{evalVerdict.codeRef}</div>}
        </TableCell>
        <TableCell><Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="size-4" /></Button></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} className="bg-muted/30">
          <PerTypeFields type={local.test_type} results={local.results ?? {}} onChange={(k, v) => setRes(k, v)} onCommit={() => commit({ results: local.results })} />
        </TableCell>
      </TableRow>
    </>
  );
}

function PerTypeFields({ type, results, onChange, onCommit }: { type: string; results: any; onChange: (k: string, v: any) => void; onCommit: () => void }) {
  const num = (k: string, label: string, placeholder?: string) => (
    <div className="space-y-1">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <Input className="h-8" type="number" step="0.01" value={results[k] ?? ""} onChange={(e) => onChange(k, e.target.value === "" ? null : Number(e.target.value))} onBlur={onCommit} placeholder={placeholder} />
    </div>
  );
  const text = (k: string, label: string, placeholder?: string) => (
    <div className="space-y-1">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <Input className="h-8" value={results[k] ?? ""} onChange={(e) => onChange(k, e.target.value)} onBlur={onCommit} placeholder={placeholder} />
    </div>
  );
  const checkbox = (k: string, label: string) => (
    <label className="flex items-center gap-2 text-xs mt-5">
      <input type="checkbox" checked={!!results[k]} onChange={(e) => { onChange(k, e.target.checked); setTimeout(onCommit, 0); }} />
      {label}
    </label>
  );

  switch (type) {
    case "Tensile":
      return (
        <div className="grid sm:grid-cols-3 gap-3">
          {num("uts_mpa", "UTS (MPa)")}
          {text("failure_location", "Failure location", "Base / Weld / HAZ")}
          {num("elongation_pct", "Elongation %")}
        </div>
      );
    case "Bend":
      return (
        <div className="grid sm:grid-cols-3 gap-3">
          {num("angle_deg", "Bend angle (°)", "180")}
          {num("open_discontinuity_mm", "Open discontinuity (mm)", "max 3")}
          {text("orientation", "Orientation", "Face / Root / Side")}
        </div>
      );
    case "Impact":
      return (
        <div className="grid sm:grid-cols-4 gap-3">
          {num("temp_c", "Temp (°C)")}
          {num("avg_j", "Avg energy (J)")}
          {num("min_j_required", "Min req. (J)")}
          {text("specimens", "Per-specimen (J)", "60,55,62")}
        </div>
      );
    case "Hardness":
      return (
        <div className="grid sm:grid-cols-3 gap-3">
          {num("max_hv_haz", "Max HV in HAZ")}
          {num("limit_hv", "Limit (HV)", "248 (NACE)")}
          {text("location", "Location", "Cap / Mid / Root")}
        </div>
      );
    case "Macro Etch":
      return (
        <div className="grid sm:grid-cols-3 gap-3">
          {checkbox("examined", "Examined under magnification")}
          {text("defects", "Defects (comma-sep)", "LOF, Porosity")}
          {text("etchant", "Etchant", "Nital 5%")}
        </div>
      );
    case "Fracture":
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          {text("appearance", "Fracture appearance")}
          {text("defects", "Defects (comma-sep)")}
        </div>
      );
    default:
      return null;
  }
}
