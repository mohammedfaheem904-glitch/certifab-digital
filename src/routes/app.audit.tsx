import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2, FileSpreadsheet, Eye } from "lucide-react";
import { exportExcel } from "@/lib/export";
import { formatDistanceToNow } from "@/lib/format";

type AuditRow = {
  id: string;
  table_name: string;
  record_id: string | null;
  action: string;
  actor_id: string | null;
  before: any;
  after: any;
  created_at: string;
};

export const Route = createFileRoute("/app/audit")({
  component: AuditPage,
});

function AuditPage() {
  const { profile } = useAuth();
  const [table, setTable] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [open, setOpen] = useState<AuditRow | null>(null);

  const { data, isLoading } = useQuery<AuditRow[]>({
    queryKey: ["audit", profile?.company_id, table, action, from, to],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500);
      if (table !== "all") q = q.eq("table_name", table);
      if (action !== "all") q = q.eq("action", action);
      if (from) q = q.gte("created_at", from);
      if (to) q = q.lte("created_at", to + "T23:59:59");
      const { data, error } = await q;
      if (error) throw error;
      return data as AuditRow[];
    },
  });

  const rows = data ?? [];
  const tables = useMemo(() => Array.from(new Set(rows.map((r) => r.table_name))), [rows]);

  const handleExport = () =>
    exportExcel("audit-log", "Audit", rows.map((r) => ({
      Time: new Date(r.created_at).toLocaleString(),
      Table: r.table_name,
      Action: r.action,
      RecordId: r.record_id,
      ActorId: r.actor_id,
    })));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Centralized, tamper-evident trail of all data changes.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileSpreadsheet className="size-4 me-1" /> Export Excel
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><Label className="text-xs">Module</Label>
          <Select value={table} onValueChange={setTable}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {["procedures","qualifications","welds","inspections","equipment","instruments","instrument_calibrations","projects"].map((t) =>
                <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Action</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="INSERT">INSERT</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">From</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div><Label className="text-xs">To</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-5 py-2.5">When</th>
              <th className="text-start font-medium px-5 py-2.5">Module</th>
              <th className="text-start font-medium px-5 py-2.5">Action</th>
              <th className="text-start font-medium px-5 py-2.5">Record</th>
              <th className="text-start font-medium px-5 py-2.5">Actor</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /> Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No audit entries match these filters.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-5 py-3 text-xs text-muted-foreground">{formatDistanceToNow(r.created_at)}</td>
                <td className="px-5 py-3 font-medium">{r.table_name}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${r.action === "DELETE" ? "bg-destructive/10 text-destructive" : r.action === "UPDATE" ? "bg-info/10 text-info" : "bg-success/10 text-success"}`}>{r.action}</span>
                </td>
                <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{r.record_id?.slice(0, 8)}</td>
                <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{r.actor_id?.slice(0, 8) ?? "—"}</td>
                <td className="px-5 py-3 text-end">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(r)}><Eye className="size-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{open?.table_name} · {open?.action}</SheetTitle>
          </SheetHeader>
          {open && (
            <div className="space-y-4 mt-4 text-xs">
              <div>
                <div className="font-medium mb-1 text-muted-foreground">Before</div>
                <pre className="p-3 rounded bg-muted/40 overflow-x-auto">{JSON.stringify(open.before, null, 2)}</pre>
              </div>
              <div>
                <div className="font-medium mb-1 text-muted-foreground">After</div>
                <pre className="p-3 rounded bg-muted/40 overflow-x-auto">{JSON.stringify(open.after, null, 2)}</pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
