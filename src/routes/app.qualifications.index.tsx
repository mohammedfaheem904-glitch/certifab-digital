import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Download, ShieldCheck, Clock, AlertTriangle, Users, Trash2, Eye } from "lucide-react";
import { deriveQualStatus, continuityBroken } from "@/lib/qualification-status";
import { exportExcel } from "@/lib/export";
import { fmtEngDate } from "@/lib/doc-number";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string;
  wpq_number?: string | null;
  welder_name: string;
  employee_id: string;
  process: string;
  standard: string;
  code_family?: string | null;
  position_qualified?: string | null;
  expiry_date: string;
  status: string;
  last_continuity_date?: string | null;
  stamp_number?: string | null;
};

export const Route = createFileRoute("/app/qualifications/")({
  component: QualificationsPage,
});

function QualificationsPage() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("super_admin");
  const canDelete = isAdmin || roles.includes("qa_qc_manager");
  const nav = useNavigate();
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { data, isLoading } = useCompanyRows<Row>("qualifications", {
    order: { column: "expiry_date", ascending: true },
  });
  const { data: wpsList = [] } = useCompanyRows<any>("procedures", {
    select: "id,wps_no,document_no,revision,status",
    order: { column: "updated_at", ascending: false },
  });
  const { data: pqrList = [] } = useCompanyRows<any>("pqrs", {
    select: "id,pqr_no,revision,status",
    order: { column: "updated_at", ascending: false },
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processFilter, setProcessFilter] = useState<string>("all");
  const [codeFilter, setCodeFilter] = useState<string>("all");

  const enriched = useMemo(
    () =>
      (data ?? []).map((r) => ({
        ...r,
        derived: deriveQualStatus(r),
        continuity_broken: continuityBroken(r.last_continuity_date),
      })),
    [data],
  );

  const processes = Array.from(new Set(enriched.map((r) => r.process).filter(Boolean)));
  const codes = Array.from(new Set(enriched.map((r) => r.code_family ?? r.standard).filter(Boolean)));

  const filtered = enriched.filter((r) => {
    if (statusFilter !== "all" && r.derived !== statusFilter) return false;
    if (processFilter !== "all" && r.process !== processFilter) return false;
    if (codeFilter !== "all" && (r.code_family ?? r.standard) !== codeFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (
        ![r.welder_name, r.employee_id, r.wpq_number, r.stamp_number]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(s))
      )
        return false;
    }
    return true;
  });

  const kpi = {
    total: enriched.length,
    active: enriched.filter((r) => r.derived === "Active").length,
    expiring: enriched.filter((r) => r.derived === "Expiring Soon").length,
    expired: enriched.filter((r) => r.derived === "Expired").length,
    continuityIssues: enriched.filter((r) => r.continuity_broken).length,
  };

  return (
    <ModulePage
      title="WPQ (Welder Performance Qualification)"
      subtitle="ASME Section IX WPQ certificates — issuance, expiry, continuity & verification."
      action={
        <div className="flex gap-2">
          <Link to="/app/qualifications/dashboard">
            <Button size="sm" variant="outline">WPQ Dashboard</Button>
          </Link>
          <Link to="/app/qualifications/new">
            <Button size="sm" variant="outline">Build WPQ</Button>
          </Link>
          {isAdmin && (
            <Link to="/app/qualifications/trash">
              <Button size="sm" variant="outline"><Trash2 className="size-4 me-1" /> Trash</Button>
            </Link>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              exportExcel(
                "welder-qualifications",
                "WPQ",
                filtered.map((r) => ({
                  WPQ: r.wpq_number ?? "",
                  Welder: r.welder_name,
                  Employee: r.employee_id,
                  Stamp: r.stamp_number ?? "",
                  Process: r.process,
                  Code: r.code_family ?? r.standard,
                  Position: r.position_qualified ?? "",
                  Expiry: r.expiry_date,
                  Status: r.derived,
                  "Last Continuity": r.last_continuity_date ?? "",
                })),
              )
            }
          >
            <Download className="size-4 me-1" /> Export
          </Button>
          <NewRecordDialog
            table="qualifications"
            title="New welder qualification (WPQ)"
            trigger="New WPQ"
            defaults={{ status: "Active", code_family: "ASME IX", revision: "Rev 0" }}
          >
            {({ values, set }) => (
              <div className="grid grid-cols-2 gap-3">
                <F label="Welder name">
                  <Input required value={values.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} />
                </F>
                <F label="Employee ID">
                  <Input required value={values.employee_id ?? ""} onChange={(e) => set("employee_id", e.target.value)} />
                </F>
                <F label="WPQ Number">
                  <Input value={values.wpq_number ?? ""} onChange={(e) => set("wpq_number", e.target.value)} placeholder="WPQ-2026-001" />
                </F>
                <F label="Stamp Number">
                  <Input value={values.stamp_number ?? ""} onChange={(e) => set("stamp_number", e.target.value)} />
                </F>
                <F label="WPS Number">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.wps_number ?? ""} onChange={(e) => set("wps_number", e.target.value)}>
                    <option value="">— Select WPS —</option>
                    {wpsList.map((w: any) => {
                      const label = w.wps_no || w.document_no;
                      if (!label) return null;
                      return (
                        <option key={w.id} value={label}>
                          {label}{w.revision ? ` (${w.revision})` : ""}{w.status ? ` — ${w.status}` : ""}
                        </option>
                      );
                    })}
                  </select>
                </F>
                <F label="PQR Number">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.pqr_number ?? ""} onChange={(e) => set("pqr_number", e.target.value)}>
                    <option value="">— Select PQR —</option>
                    {pqrList.map((p: any) => {
                      const label = p.pqr_no;
                      if (!label) return null;
                      return (
                        <option key={p.id} value={label}>
                          {label}{p.revision ? ` (${p.revision})` : ""}{p.status ? ` — ${p.status}` : ""}
                        </option>
                      );
                    })}
                  </select>
                </F>
                <F label="Process">
                  <select required className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.process ?? ""} onChange={(e) => set("process", e.target.value)}>
                    <option value="">— Select process —</option>
                    <option value="SMAW">SMAW (Shielded Metal Arc Welding)</option>
                    <option value="GMAW">GMAW (Gas Metal Arc Welding)</option>
                    <option value="FCAW">FCAW (Flux-Cored Arc Welding)</option>
                    <option value="SAW">SAW (Submerged Arc Welding)</option>
                    <option value="GTAW">GTAW (Gas Tungsten Arc Welding)</option>
                    <option value="PAW">PAW (Plasma Arc Welding)</option>
                    <option value="ESW">ESW (Electroslag Welding)</option>
                    <option value="EGW">EGW (Electrogas Welding)</option>
                    <option value="OAW">OAW (Oxyacetylene Welding)</option>
                    <option value="LBW">LBW (Laser Beam Welding)</option>
                    <option value="EBW">EBW (Electron Beam Welding)</option>
                    <option value="RW">RW (Resistance Welding)</option>
                    <option value="BRAZING">Brazing</option>
                  </select>
                </F>
                <F label="Process Type">
                  <Input value={values.process_type ?? ""} onChange={(e) => set("process_type", e.target.value)} placeholder="Manual" />
                </F>
                <F label="Code Family">
                  <select
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                    value={values.code_family ?? "ASME IX"}
                    onChange={(e) => set("code_family", e.target.value)}
                  >
                    <option>ASME IX</option>
                    <option>AWS</option>
                    <option>EN ISO</option>
                    <option>AS/NZS</option>
                    <option>JIS</option>
                  </select>
                </F>
                <F label="Standard / Edition">
                  <Input required value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX 2023" />
                </F>
                <F label="Position">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={values.position_qualified ?? ""} onChange={(e) => set("position_qualified", e.target.value)}>
                    <option value="">— Select position —</option>
                    <option value="1G (Flat Groove)">1G (Flat Groove)</option>
                    <option value="2G (Horizontal Groove)">2G (Horizontal Groove)</option>
                    <option value="3G (Vertical Groove)">3G (Vertical Groove)</option>
                    <option value="4G (Overhead Groove)">4G (Overhead Groove)</option>
                    <option value="5G (Fixed Horizontal Pipe)">5G (Fixed Horizontal Pipe)</option>
                    <option value="6G (Fixed 45° Pipe)">6G (Fixed 45° Pipe)</option>
                    <option value="1F (Flat Fillet)">1F (Flat Fillet)</option>
                    <option value="2F (Horizontal Fillet)">2F (Horizontal Fillet)</option>
                    <option value="3F (Vertical Fillet)">3F (Vertical Fillet)</option>
                    <option value="4F (Overhead Fillet)">4F (Overhead Fillet)</option>
                    <option value="5F (Fixed Horizontal Pipe Fillet)">5F (Fixed Horizontal Pipe Fillet)</option>
                  </select>
                </F>
                <F label="Test Coupon">
                  <Input value={values.test_coupon_type ?? ""} onChange={(e) => set("test_coupon_type", e.target.value)} placeholder="Pipe 6 in. Sch 80" />
                </F>
                <F label="Qualification Date">
                  <Input type="date" value={values.qualification_date ?? ""} onChange={(e) => set("qualification_date", e.target.value)} />
                </F>
                <F label="Expiry Date">
                  <Input type="date" required value={values.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value)} />
                </F>
                <F label="Result">
                  <select
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                    value={values.result ?? "Satisfactory"}
                    onChange={(e) => set("result", e.target.value)}
                  >
                    <option>Satisfactory</option>
                    <option>Unsatisfactory</option>
                  </select>
                </F>
              </div>
            )}
          </NewRecordDialog>
        </div>
      }
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <Kpi icon={<Users className="size-4" />} label="Total Welders" value={kpi.total} />
        <Kpi icon={<ShieldCheck className="size-4 text-emerald-500" />} label="Active" value={kpi.active} />
        <Kpi icon={<Clock className="size-4 text-amber-500" />} label="Expiring Soon" value={kpi.expiring} />
        <Kpi icon={<AlertTriangle className="size-4 text-destructive" />} label="Expired" value={kpi.expired} />
        <Kpi icon={<AlertTriangle className="size-4 text-destructive" />} label="Continuity Broken" value={kpi.continuityIssues} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Input className="max-w-xs" placeholder="Search welder, ID, WPQ, stamp…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={statusFilter} onChange={setStatusFilter} options={["all", "Active", "Expiring Soon", "Expired", "Suspended"]} />
        <Select value={processFilter} onChange={setProcessFilter} options={["all", ...processes]} />
        <Select value={codeFilter} onChange={setCodeFilter} options={["all", ...codes]} />
      </div>

      <TooltipProvider delayDuration={200}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>WPQ No.</Th>
              <Th>Welder</Th>
              <Th>Employee</Th>
              <Th>Process</Th>
              <Th>Code</Th>
              <Th>Position</Th>
              <Th>Expiry</Th>
              <Th>Continuity</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <Empty colSpan={10}>
                <Loader2 className="size-4 animate-spin inline" /> Loading…
              </Empty>
            )}
            {!isLoading && filtered.length === 0 && <Empty colSpan={10}>No qualifications match.</Empty>}
            {filtered.map((q) => (
              <tr
                key={q.id}
                className="border-t border-border/60 hover:bg-muted/20 cursor-pointer"
                onClick={() => nav({ to: "/app/qualifications/$qualId", params: { qualId: q.id } })}
              >
                <td className="px-5 py-3 font-mono text-xs">
                  <Link to="/app/qualifications/$qualId" params={{ qualId: q.id }} className="hover:text-primary" onClick={(e) => e.stopPropagation()}>
                    {q.wpq_number ?? q.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-5 py-3 font-medium">
                  <Link to="/app/qualifications/$qualId" params={{ qualId: q.id }} className="hover:text-primary" onClick={(e) => e.stopPropagation()}>
                    {q.welder_name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{q.employee_id}</td>
                <td className="px-5 py-3">{q.process}</td>
                <td className="px-5 py-3 text-muted-foreground">{q.code_family ?? q.standard}</td>
                <td className="px-5 py-3">{q.position_qualified ?? "—"}</td>
                <td className="px-5 py-3">{fmtEngDate(q.expiry_date)}</td>
                <td className="px-5 py-3">
                  {q.continuity_broken ? (
                    <span className="text-destructive text-xs">Broken</span>
                  ) : q.last_continuity_date ? (
                    <span className="text-xs text-muted-foreground">{fmtEngDate(q.last_continuity_date)}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={q.derived} />
                </td>
                <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/app/qualifications/$qualId" params={{ qualId: q.id }}>
                          <Button size="icon" variant="ghost" className="size-8" aria-label="Open certificate">
                            <Eye className="size-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Open certificate</TooltipContent>
                    </Tooltip>
                    {canDelete && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-destructive hover:text-destructive"
                            aria-label="Delete certificate"
                            onClick={() => setDeleteId(q.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to Trash</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </TooltipProvider>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move WPQ to Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This certificate will be soft-deleted and hidden from standard lists and reports.
              Super admins can restore it from Trash. The action is audit-logged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async (e) => {
                e.preventDefault();
                if (!deleteId) return;
                setDeleting(true);
                const { error } = await (supabase.rpc as any)("soft_delete_qualification", { _id: deleteId });
                setDeleting(false);
                if (error) {
                  toast.error(error.message);
                  return;
                }
                toast.success("Moved to Trash.");
                setDeleteId(null);
                qc.invalidateQueries({ queryKey: ["qualifications"] });
              }}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : "Move to Trash"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModulePage>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </Card>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      className="h-9 rounded-md border bg-transparent px-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "all" ? "All" : o}
        </option>
      ))}
    </select>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
