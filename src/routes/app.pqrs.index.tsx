import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useConfirm } from "@/components/ConfirmDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ModulePage } from "@/components/ModulePage";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ChevronRight, Eye, Trash2, LayoutDashboard, Download, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { exportCsv, exportExcel } from "@/lib/export";

type PqrRow = {
  id: string;
  pqr_no: string;
  pwps_id: string | null;
  revision: string;
  status: string;
  code_family: string;
  standard: string | null;
  overall_result: string;
  qualification_date: string | null;
  expiry_date: string | null;
  resulting_wps_id: string | null;
  created_at: string;
};
type PwpsOpt = { id: string; pwps_no: string; code_family: string | null };

export const Route = createFileRoute("/app/pqrs/")({
  component: PqrsIndexPage,
});

const RESULT_TONE: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Passed: "bg-success/15 text-success border-success/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  Inconclusive: "bg-warning/15 text-warning border-warning/30",
};

const STATUSES = ["Draft", "Under Review", "Approved", "Rejected", "Superseded"];
const RESULTS = ["Pending", "Passed", "Failed", "Inconclusive"];

function PqrsIndexPage() {
  const confirmDialog = useConfirm();
  const { profile, roles } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");
  const nav = useNavigate();
  const qc = useQueryClient();

  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fResult, setFResult] = useState("");
  const [fCode, setFCode] = useState("");
  const [fPwps, setFPwps] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery<PqrRow[]>({
    queryKey: ["pqrs", cid],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pqrs" as any) as any)
        .select("*").eq("company_id", cid!).is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PqrRow[];
    },
  });

  const { data: pwpsOpts } = useQuery<PwpsOpt[]>({
    queryKey: ["pwps-options", cid],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pwps" as any) as any)
        .select("id,pwps_no,code_family").eq("company_id", cid!).is("deleted_at", null).order("pwps_no");
      if (error) throw error;
      return (data ?? []) as PwpsOpt[];
    },
  });

  const allRows = data ?? [];
  const codes = useMemo(() => Array.from(new Set(allRows.map((r) => r.code_family).filter(Boolean))), [allRows]);
  const pwpsMap = useMemo(() => new Map((pwpsOpts ?? []).map((o) => [o.id, o.pwps_no])), [pwpsOpts]);

  const filtered = allRows.filter((p) => {
    if (fStatus && p.status !== fStatus) return false;
    if (fResult && p.overall_result !== fResult) return false;
    if (fCode && p.code_family !== fCode) return false;
    if (fPwps && p.pwps_id !== fPwps) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.pqr_no, p.standard, p.code_family, p.status, p.overall_result].filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });

  const hasFilters = !!(fStatus || fResult || fCode || fPwps);
  const clearFilters = () => { setFStatus(""); setFResult(""); setFCode(""); setFPwps(""); };

  const toggleAll = (checked: boolean) => setSelected(checked ? new Set(filtered.map((r) => r.id)) : new Set());
  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
  };

  const exportRows = (rows: PqrRow[]) => rows.map((r) => ({
    "PQR No": r.pqr_no, Revision: r.revision, Status: r.status, Result: r.overall_result,
    Code: r.code_family, Standard: r.standard ?? "",
    "Linked pWPS": r.pwps_id ? (pwpsMap.get(r.pwps_id) ?? "") : "",
    "Qualification Date": r.qualification_date ?? "",
    "Expiry Date": r.expiry_date ?? "",
    "Resulting WPS": r.resulting_wps_id ? "Yes" : "No",
    Created: new Date(r.created_at).toISOString().slice(0, 10),
  }));

  const toExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;

  const moveToTrash = async (ids: string[]) => {
    if (!(await confirmDialog(`Move ${ids.length} record${ids.length > 1 ? "s" : ""} to trash?`))) return;
    setBusy(true);
    const results = await Promise.all(ids.map((id) => (supabase.rpc as any)("soft_delete_pqr", { _id: id })));
    setBusy(false);
    const errs = results.filter((r: any) => r.error);
    if (errs.length) toast.error(`Failed for ${errs.length} record(s): ${errs[0].error.message}`);
    else toast.success(`Moved ${ids.length} to trash.`);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["pqrs", cid] });
  };

  return (
    <ModulePage
      title="PQR (Procedure Qualification Records)"
      subtitle="Qualification tests that validate a pWPS. A Passed and signed PQR auto-creates a Draft WPS in the Procedures module."
      action={
        <div className="flex items-center gap-2">
          <Link to="/app/pqrs/dashboard"><Button variant="outline" size="sm"><LayoutDashboard className="size-4 me-1" /> Dashboard</Button></Link>
          {isAdmin && <Link to="/app/pqrs/trash"><Button variant="outline" size="sm"><Trash2 className="size-4 me-1" /> Trash</Button></Link>}
          <NewRecordDialog table="pqrs" title="New PQR" trigger="New PQR" defaults={{ revision: "Rev 0", status: "Draft", code_family: "ASME IX", overall_result: "Pending", qualified_ranges: {} }}>
            {({ values, set }) => (
              <div className="grid grid-cols-2 gap-3">
                <F label="PQR number"><Input required value={values.pqr_no ?? ""} onChange={(e) => set("pqr_no", e.target.value)} placeholder="PQR-001" /></F>
                <F label="Linked pWPS">
                  <select className="h-9 rounded-md border border-input bg-background px-3 text-sm w-full" value={values.pwps_id ?? ""} onChange={(e) => set("pwps_id", e.target.value || null)}>
                    <option value="">— Select pWPS —</option>
                    {(pwpsOpts ?? []).map((o) => <option key={o.id} value={o.id}>{o.pwps_no}</option>)}
                  </select>
                </F>
                <F label="Code family"><Input value={values.code_family ?? "ASME IX"} onChange={(e) => set("code_family", e.target.value)} /></F>
                <F label="Standard"><Input value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX 2023" /></F>
                <F label="Test date"><Input type="date" value={values.test_date ?? ""} onChange={(e) => set("test_date", e.target.value || null)} /></F>
                <F label="Revision"><Input value={values.revision ?? "Rev 0"} onChange={(e) => set("revision", e.target.value)} /></F>
              </div>
            )}
          </NewRecordDialog>
        </div>
      }
    >
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search by number, standard…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs bg-background/60" />
          <Sel value={fStatus} onChange={setFStatus} placeholder="All statuses" options={STATUSES} />
          <Sel value={fResult} onChange={setFResult} placeholder="All results" options={RESULTS} />
          <Sel value={fCode} onChange={setFCode} placeholder="All codes" options={codes} />
          <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={fPwps} onChange={(e) => setFPwps(e.target.value)}>
            <option value="">All pWPS</option>
            {(pwpsOpts ?? []).map((o) => <option key={o.id} value={o.id}>{o.pwps_no}</option>)}
          </select>
          {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="size-3.5 me-1" /> Clear</Button>}
          <div className="ms-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => exportCsv(`pqrs-${selected.size > 0 ? "selected" : "filtered"}`, exportRows(toExport))} disabled={toExport.length === 0}>
              <Download className="size-3.5 me-1" /> CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportExcel(`pqrs-${selected.size > 0 ? "selected" : "filtered"}`, "PQR", exportRows(toExport))} disabled={toExport.length === 0}>
              <Download className="size-3.5 me-1" /> XLSX
            </Button>
          </div>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs">
            <span className="font-medium">{selected.size} selected</span>
            <div className="ms-auto flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={busy} onClick={() => moveToTrash(Array.from(selected))} className="text-destructive">
                <Trash2 className="size-3.5 me-1" /> Move to trash
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2.5 w-8"><Checkbox checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id))} onCheckedChange={(c) => toggleAll(!!c)} /></th>
              <Th>PQR No.</Th><Th>Code</Th><Th>Standard</Th><Th>Status</Th><Th>Result</Th><Th>Qualified</Th><Th>Resulting WPS</Th>
              <th className="text-end font-medium px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={9}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && filtered.length === 0 && <Empty colSpan={9}>No PQRs match.</Empty>}
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.has(p.id)} onCheckedChange={(c) => toggleOne(p.id, !!c)} />
                </td>
                <td className="px-5 py-3 font-medium cursor-pointer" onClick={() => nav({ to: "/app/pqrs/$pqrId", params: { pqrId: p.id } })}>{p.pqr_no}</td>
                <td className="px-5 py-3">{p.code_family}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.standard ?? "—"}</td>
                <td className="px-5 py-3">{p.status}</td>
                <td className="px-5 py-3"><Badge variant="outline" className={RESULT_TONE[p.overall_result] ?? ""}>{p.overall_result}</Badge></td>
                <td className="px-5 py-3 text-muted-foreground">{p.qualification_date ? new Date(p.qualification_date).toLocaleDateString() : "—"}</td>
                <td className="px-5 py-3">{p.resulting_wps_id ? <Badge variant="outline" className="bg-success/10 text-success border-success/30">Created</Badge> : "—"}</td>
                <td className="px-5 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => nav({ to: "/app/pqrs/$pqrId", params: { pqrId: p.id } })} aria-label="Open PQR"><Eye className="size-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={busy} onClick={() => moveToTrash([p.id])} aria-label="Move to trash"><Trash2 className="size-4" /></Button>
                    <ChevronRight className="size-4 ms-1 text-muted-foreground" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Sel({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
