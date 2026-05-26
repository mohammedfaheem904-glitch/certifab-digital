import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const METHODS = ["VT", "RT", "UT", "PT", "MT"] as const;
const RESULTS = ["Pending", "Pass", "Fail", "N/A"] as const;

type NdtRow = {
  id: string;
  company_id: string;
  pqr_id: string | null;
  method: string;
  test_date: string | null;
  technician_name: string | null;
  acceptance_criteria: string | null;
  report_number: string | null;
  findings: string | null;
  result: string;
  remarks: string | null;
};

export function NdtTestsTable({ pqrId, standard }: { pqrId: string; standard?: string | null }) {
  const { profile } = useAuth();
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<NdtRow[]>({
    queryKey: ["ndt", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("ndt_tests" as any) as any)
        .select("*")
        .eq("pqr_id", pqrId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as NdtRow[];
    },
  });

  const addRow = useMutation({
    mutationFn: async (method: string) => {
      const { error } = await (supabase.from("ndt_tests" as any) as any).insert({
        company_id: profile?.company_id,
        pqr_id: pqrId,
        method,
        result: "Pending",
        acceptance_criteria: standard ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ndt", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const updateRow = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<NdtRow> }) => {
      const { error } = await (supabase.from("ndt_tests" as any) as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ndt", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const deleteRow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("ndt_tests" as any) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ndt", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium me-2">Add test:</span>
        {METHODS.map((m) => (
          <Button key={m} size="sm" variant="outline" onClick={() => addRow.mutate(m)} disabled={addRow.isPending}>
            <Plus className="size-3.5 me-1" /> {m}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" />Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
          No NDT tests recorded. VT is mandatory; volumetric NDT (RT/UT) recommended for groove welds.
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Acceptance</TableHead>
                <TableHead>Report #</TableHead>
                <TableHead>Result</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <NdtRowEditor key={r.id} row={r} onPatch={(patch) => updateRow.mutate({ id: r.id, patch })} onDelete={() => deleteRow.mutate(r.id)} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function NdtRowEditor({ row, onPatch, onDelete }: { row: NdtRow; onPatch: (p: Partial<NdtRow>) => void; onDelete: () => void }) {
  const [local, setLocal] = useState(row);
  const set = <K extends keyof NdtRow>(k: K, v: NdtRow[K]) => {
    const next = { ...local, [k]: v };
    setLocal(next);
  };
  const commit = (patch: Partial<NdtRow>) => onPatch(patch);

  return (
    <>
      <TableRow>
        <TableCell>
          <select className="h-8 rounded-md border bg-transparent px-2 text-sm" value={local.method} onChange={(e) => { set("method", e.target.value); commit({ method: e.target.value }); }}>
            {METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </TableCell>
        <TableCell><Input className="h-8" type="date" value={local.test_date ?? ""} onChange={(e) => set("test_date", e.target.value || null)} onBlur={() => commit({ test_date: local.test_date })} /></TableCell>
        <TableCell><Input className="h-8" value={local.technician_name ?? ""} onChange={(e) => set("technician_name", e.target.value)} onBlur={() => commit({ technician_name: local.technician_name })} /></TableCell>
        <TableCell><Input className="h-8" value={local.acceptance_criteria ?? ""} onChange={(e) => set("acceptance_criteria", e.target.value)} onBlur={() => commit({ acceptance_criteria: local.acceptance_criteria })} placeholder="e.g. ASME V" /></TableCell>
        <TableCell><Input className="h-8" value={local.report_number ?? ""} onChange={(e) => set("report_number", e.target.value)} onBlur={() => commit({ report_number: local.report_number })} /></TableCell>
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
          <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="size-4" /></Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} className="bg-muted/30">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-1">{local.result}</Badge>
            <Textarea
              className="text-xs"
              rows={2}
              placeholder="Findings / observations"
              value={local.findings ?? ""}
              onChange={(e) => set("findings", e.target.value)}
              onBlur={() => commit({ findings: local.findings })}
            />
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
