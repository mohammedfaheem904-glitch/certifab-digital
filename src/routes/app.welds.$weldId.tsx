import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { FileUploader } from "@/components/FileUploader";
import { ArrowLeft, ChevronRight, QrCode, FileText, ShieldCheck } from "lucide-react";
import { WeldTraceabilityDocument } from "@/components/reports/WeldTraceabilityDocument";
import { WeldComplianceCheck } from "@/components/welds/WeldComplianceCheck";

export const Route = createFileRoute("/app/welds/$weldId")({
  component: WeldDetail,
});

function WeldDetail() {
  const { weldId } = Route.useParams();
  const nav = useNavigate();
  const { profile } = useAuth();

  const weld = useQuery({
    queryKey: ["weld", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await supabase.from("welds").select("*").eq("id", weldId).maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  const events = useQuery<any[]>({
    queryKey: ["weld_events", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("weld_events" as any) as any)
        .select("*").eq("weld_id", weldId).order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const inspections = useQuery<any[]>({
    queryKey: ["inspections-weld", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weldId).order("inspected_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const ncrs = useQuery<any[]>({
    queryKey: ["ncrs-weld", weldId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("ncrs" as any) as any).select("*").eq("weld_id", weldId);
      return (data ?? []) as any[];
    },
  });

  if (weld.isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!weld.data) return (
    <div className="text-center py-20">
      <div className="text-lg font-semibold">Weld not found</div>
      <Button variant="link" onClick={() => nav({ to: "/app/welds" })}>Back to welds</Button>
    </div>
  );

  const w = weld.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/welds" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Welds
        </Link>
        <span>/</span>
        <span className="text-foreground">{w.weld_no}</span>
      </div>

      <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">{w.weld_no}</h1>
              <StatusBadge status={w.status} />
              {w.inspection_status && <Badge variant="outline">{w.inspection_status}</Badge>}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Welder {w.welder_name ?? "—"} · {w.weld_date}
            </div>
          </div>
          <Link to="/verify/weld/$token" params={{ token: w.qr_token }} target="_blank">
            <Button variant="outline" size="sm"><QrCode className="size-4 me-1" /> QR Verify</Button>
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Chip>{w.drawing_ref ?? "—"}</Chip><ChevronRight className="size-3" />
          <Chip>Line {w.line_no ?? "—"}</Chip><ChevronRight className="size-3" />
          <Chip>Spool {w.spool_no ?? "—"}</Chip><ChevronRight className="size-3" />
          <Chip>Joint {w.joint_no ?? "—"}</Chip><ChevronRight className="size-3" />
          <Chip className="text-foreground">{w.weld_no}</Chip>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Field label="Joint type" value={w.joint_type ?? "—"} />
          <Field label="Base material" value={w.base_material ?? "—"} />
          <Field label="Heat number" value={w.heat_number ?? "—"} />
          <Field label="Filler metal" value={w.filler_metal ?? "—"} />
          <Field label="Heat input" value={w.heat_input ?? "—"} />
          <Field label="WPS" value={w.procedure_id ? "Linked" : "—"} />
        </div>
      </div>

      <Tabs defaultValue="compliance">
        <TabsList className="print:hidden">
          <TabsTrigger value="compliance"><ShieldCheck className="size-4 me-1.5" />Compliance</TabsTrigger>
          <TabsTrigger value="inspections">Inspections ({inspections.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="ncrs">NCRs ({ncrs.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="certificate"><FileText className="size-4 me-1.5" />Traceability Report</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance">
          <WeldComplianceCheck weld={w} />
        </TabsContent>

        <TabsContent value="inspections">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr><Th>Date</Th><Th>Type</Th><Th>Defect</Th><Th>Severity</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {(inspections.data ?? []).map((i) => (
                  <tr key={i.id} className="border-t border-border/60">
                    <td className="px-5 py-3">{new Date(i.inspected_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-medium">{i.inspection_type}</td>
                    <td className="px-5 py-3">{i.defect_type ?? "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={i.severity ?? "—"} /></td>
                    <td className="px-5 py-3 text-xs">{i.status}</td>
                  </tr>
                ))}
                {(inspections.data?.length ?? 0) === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No inspections.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="ncrs">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40"><tr><Th>NCR</Th><Th>Title</Th><Th>Severity</Th><Th>Status</Th><Th>Due</Th></tr></thead>
              <tbody>
                {(ncrs.data ?? []).map((n) => (
                  <tr key={n.id} className="border-t border-border/60">
                    <td className="px-5 py-3 font-medium"><Link to="/app/ncrs/$ncrId" params={{ ncrId: n.id }} className="hover:text-primary">{n.ncr_no}</Link></td>
                    <td className="px-5 py-3">{n.title}</td>
                    <td className="px-5 py-3"><StatusBadge status={n.severity ?? "—"} /></td>
                    <td className="px-5 py-3 text-xs">{n.status}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{n.due_date ?? "—"}</td>
                  </tr>
                ))}
                {(ncrs.data?.length ?? 0) === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No NCRs against this weld.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="rounded-xl border border-border bg-card p-5">
            <ol className="relative border-s border-border ms-2 space-y-4">
              {(events.data ?? []).map((e: any) => (
                <li key={e.id} className="ms-4">
                  <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" />
                  <div className="text-sm font-medium">{e.kind.replace("_", " ")}</div>
                  <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                  {e.payload && <pre className="mt-1 text-[11px] bg-muted/40 rounded p-2">{JSON.stringify(e.payload, null, 2)}</pre>}
                </li>
              ))}
              {(events.data?.length ?? 0) === 0 && <div className="text-sm text-muted-foreground">No events.</div>}
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="attachments">
          <FileUploader
            bucket="weld-attachments"
            folder={`${weldId}`}
            table="weld_attachments"
            recordIdColumn="weld_id"
            recordId={weldId}
            hint="Photos, RT films, sketches."
            accept="image/*,application/pdf"
          />
        </TabsContent>

        <TabsContent value="certificate" className="mt-4">
          <WeldTraceabilityDocument
            weld={w}
            inspections={inspections.data ?? []}
            ncrs={ncrs.data ?? []}
            events={events.data ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`px-2 py-1 rounded bg-muted/40 ${className}`}>{children}</span>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-start font-medium px-5 py-2.5">{children}</th>; }
