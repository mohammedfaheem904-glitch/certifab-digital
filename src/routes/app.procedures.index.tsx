import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { StatusBadge } from "@/components/StatusBadge";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, Eye, Trash2, BarChart3, Download } from "lucide-react";
import { bulkExportProceduresCsv, bulkExportProceduresXlsx } from "@/lib/wps-export";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

type Row = {
  id: string;
  code: string;
  standard: string;
  process: string;
  thickness_range: string | null;
  revision: string;
  status: string;
  pqr_id: string | null;
  pqr_no: string | null;
};

export const Route = createFileRoute("/app/procedures/")({
  component: ProceduresPage,
});

function ProceduresPage() {
  const { data, isLoading } = useCompanyRows<Row>("procedures", { order: { column: "created_at" } });
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "qualified" | "legacy">("all");
  const nav = useNavigate();
  const qc = useQueryClient();
  const { roles } = useAuth();
  const canDelete = roles.includes("super_admin") || roles.includes("qa_qc_manager");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const all = data ?? [];
  const qualifiedAll = all.filter((p) => !!p.pqr_id);
  const legacyAll = all.filter((p) => !p.pqr_id);
  const pendingApproval = qualifiedAll.filter((p) => p.status === "Draft").length;

  const scoped = tab === "qualified" ? qualifiedAll : tab === "legacy" ? legacyAll : all;
  const filtered = scoped.filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.code, p.standard, p.process, p.revision, p.status, p.pqr_no]
      .filter(Boolean).some((x) => String(x).toLowerCase().includes(s));
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabase.rpc("soft_delete_procedure" as never, { _id: deleteId } as never);
    setDeleting(false);
    if (error) {
      toast.error(error.message || "Failed to delete WPS");
      return;
    }
    toast.success("WPS moved to Trash");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["company-rows", "procedures"] });
  };

  return (
    <TooltipProvider delayDuration={200}>
    <ModulePage
      title="Procedures"
      subtitle="Create, revise and approve ( P WPS - PQR - WPS ) across ASME, EN ISO, AWS, AS/NZS and JIS."
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => nav({ to: "/app/procedures/dashboard" })}>
            <BarChart3 className="size-4 me-1.5" /> Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4 me-1.5" /> Bulk Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { bulkExportProceduresCsv(filtered, "wps-export"); toast.success("CSV exported"); }}>
                Export visible to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => { await bulkExportProceduresXlsx(filtered, "wps-export"); toast.success("Excel exported"); }}>
                Export visible to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { bulkExportProceduresCsv(data ?? [], "wps-all"); toast.success("CSV exported"); }}>
                Export all to CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        <NewRecordDialog
          table="procedures"
          quota="procedures"
          title="​Pre Welding Procedure Specification ( PWPS )"
          trigger="New P WPS"
          defaults={{ revision: "Rev 0", status: "Draft" }}
        >
          {({ values, set }) => (
            <div className="grid grid-cols-2 gap-3">
              <F label="Code"><Input required value={values.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="WPS-GTAW-042" /></F>
              <F label="Standard"><Input required value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX" /></F>
              <F label="Process"><Input required value={values.process ?? ""} onChange={(e) => set("process", e.target.value)} placeholder="GTAW" /></F>
              <F label="Revision"><Input value={values.revision ?? ""} onChange={(e) => set("revision", e.target.value)} /></F>
              <F label="Thickness range"><Input value={values.thickness_range ?? ""} onChange={(e) => set("thickness_range", e.target.value)} placeholder="3–25 mm" /></F>
              <F label="Joint type"><Input value={values.joint_type ?? ""} onChange={(e) => set("joint_type", e.target.value)} placeholder="Butt" /></F>
              <F label="Position"><Input value={values.position ?? ""} onChange={(e) => set("position", e.target.value)} placeholder="6G" /></F>
              <F label="Base material"><Input value={values.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} placeholder="P-No 1 Gr 1" /></F>
              <F label="Filler material"><Input value={values.filler_material ?? ""} onChange={(e) => set("filler_material", e.target.value)} placeholder="ER70S-2" /></F>
              <F label="Shielding gas"><Input value={values.shielding_gas ?? ""} onChange={(e) => set("shielding_gas", e.target.value)} placeholder="Ar 100%" /></F>
              <F label="Voltage min"><Input type="number" value={values.voltage_min ?? ""} onChange={(e) => set("voltage_min", parseFloat(e.target.value) || null)} /></F>
              <F label="Voltage max"><Input type="number" value={values.voltage_max ?? ""} onChange={(e) => set("voltage_max", parseFloat(e.target.value) || null)} /></F>
              <F label="Current min"><Input type="number" value={values.current_min ?? ""} onChange={(e) => set("current_min", parseFloat(e.target.value) || null)} /></F>
              <F label="Current max"><Input type="number" value={values.current_max ?? ""} onChange={(e) => set("current_max", parseFloat(e.target.value) || null)} /></F>
              <F label="Heat input min (kJ/mm)"><Input type="number" step="0.01" value={values.heat_input_min ?? ""} onChange={(e) => set("heat_input_min", parseFloat(e.target.value) || null)} /></F>
              <F label="Heat input max (kJ/mm)"><Input type="number" step="0.01" value={values.heat_input_max ?? ""} onChange={(e) => set("heat_input_max", parseFloat(e.target.value) || null)} /></F>
            </div>
          )}
        </NewRecordDialog>
        </div>
      }

    >
      <div className="p-3 border-b border-border">
        <Input placeholder="Search by code, standard, process, status…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm bg-background/60" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>Code</Th><Th>Standard</Th><Th>Process</Th><Th>Thickness</Th><Th>Revision</Th><Th>Status</Th>
              <th className="text-end font-medium px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={7}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && filtered.length === 0 && <Empty colSpan={7}>No procedures yet — try “Seed demo data” in the header.</Empty>}
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => nav({ to: "/app/procedures/$procedureId", params: { procedureId: p.id } })}
                className="border-t border-border/60 hover:bg-muted/20 cursor-pointer"
              >
                <td className="px-5 py-3 font-medium">{p.code}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.standard}</td>
                <td className="px-5 py-3">{p.process}</td>
                <td className="px-5 py-3">{p.thickness_range}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.revision}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3 text-end">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            nav({ to: "/app/procedures/$procedureId", params: { procedureId: p.id } });
                          }}
                          aria-label="Open WPS"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Open WPS</TooltipContent>
                    </Tooltip>
                    {canDelete && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(p.id)}
                            aria-label="Delete WPS"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to Trash</TooltipContent>
                      </Tooltip>
                    )}
                    <ChevronRight className="size-4 ms-1 text-muted-foreground" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move WPS to Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This procedure will be soft-deleted. Super admins can restore it from Trash.
              The action is recorded in the audit log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="size-4 animate-spin me-2" /> : null}
              Move to Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModulePage>
    </TooltipProvider>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>
  );
}
