import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Loader2, AlertTriangle, AlertOctagon, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SEVERITIES = ["info", "warning", "error", "critical"] as const;

const SEV_ICON: Record<string, any> = {
  info: <Info className="size-3.5 me-1" />,
  warning: <AlertTriangle className="size-3.5 me-1" />,
  error: <AlertOctagon className="size-3.5 me-1" />,
  critical: <AlertOctagon className="size-3.5 me-1" />,
};

const SEV_TONE: Record<string, string> = {
  info: "bg-muted text-foreground",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-destructive/15 text-destructive border-destructive/30",
  critical: "bg-destructive/20 text-destructive border-destructive/40",
};

type Finding = {
  id: string;
  company_id: string;
  pqr_id: string;
  severity: string;
  title: string;
  message: string | null;
  remediation: string | null;
  affected_variable: string | null;
  code_reference: string | null;
  resolved: boolean;
};

export function PqrFindingsTable({ pqrId }: { pqrId: string }) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Finding>>({ severity: "warning", title: "" });

  const { data: rows = [], isLoading } = useQuery<Finding[]>({
    queryKey: ["findings", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("pqr_findings" as any) as any)
        .select("*")
        .eq("pqr_id", pqrId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Finding[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!draft.title?.trim()) throw new Error("Title required");
      const { error } = await (supabase.from("pqr_findings" as any) as any).insert({
        company_id: profile?.company_id,
        pqr_id: pqrId,
        severity: draft.severity ?? "warning",
        title: draft.title,
        message: draft.message ?? null,
        remediation: draft.remediation ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setAdding(false);
      setDraft({ severity: "warning", title: "" });
      qc.invalidateQueries({ queryKey: ["findings", pqrId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleResolved = useMutation({
    mutationFn: async (f: Finding) => {
      const { error } = await (supabase.from("pqr_findings" as any) as any)
        .update({
          resolved: !f.resolved,
          resolved_at: !f.resolved ? new Date().toISOString() : null,
          resolved_by: !f.resolved ? user?.id ?? null : null,
        })
        .eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["findings", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("pqr_findings" as any) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["findings", pqrId] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {rows.filter((r) => !r.resolved && (r.severity === "critical" || r.severity === "error")).length} unresolved blocker(s) · {rows.length} total
        </div>
        <Button size="sm" onClick={() => setAdding((a) => !a)}><Plus className="size-4 me-1" /> Add finding</Button>
      </div>

      {adding && (
        <div className="border rounded-md p-3 space-y-2 bg-muted/30">
          <div className="grid sm:grid-cols-3 gap-2">
            <select className="h-9 rounded-md border bg-transparent px-2 text-sm" value={draft.severity} onChange={(e) => setDraft({ ...draft, severity: e.target.value })}>
              {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <Input className="sm:col-span-2" placeholder="Title" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <Textarea rows={2} placeholder="Details" value={draft.message ?? ""} onChange={(e) => setDraft({ ...draft, message: e.target.value })} />
          <Textarea rows={2} placeholder="Remediation" value={draft.remediation ?? ""} onChange={(e) => setDraft({ ...draft, remediation: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={() => create.mutate()} disabled={create.isPending}>Save</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" />Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">No findings — add issues here as you evaluate test reports.</div>
      ) : (
        <div className="space-y-2">
          {rows.map((f) => (
            <div key={f.id} className={`border rounded-md p-3 ${f.resolved ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={SEV_TONE[f.severity]}>{SEV_ICON[f.severity]}{f.severity}</Badge>
                    {f.resolved && <Badge variant="outline" className="bg-success/15 text-success border-success/30"><CheckCircle2 className="size-3 me-1" />Resolved</Badge>}
                    {f.code_reference && <span className="text-[11px] text-muted-foreground">{f.code_reference}</span>}
                  </div>
                  <div className="font-medium text-sm mt-1">{f.title}</div>
                  {f.message && <div className="text-xs text-muted-foreground mt-1">{f.message}</div>}
                  {f.remediation && <div className="text-xs mt-1"><span className="font-medium">Remediation:</span> {f.remediation}</div>}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => toggleResolved.mutate(f)}>{f.resolved ? "Reopen" : "Resolve"}</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(f.id)}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
