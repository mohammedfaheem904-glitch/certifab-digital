import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/FileUploader";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, Download, ExternalLink, FileText, Loader2, Plus, QrCode, Trash2 } from "lucide-react";
import { daysUntil } from "@/lib/format";
import { exportExcel } from "@/lib/export";
import { signedUrl } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/app/instruments/$instrumentId")({
  component: InstrumentDetail,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

function InstrumentDetail() {
  const { instrumentId } = Route.useParams();
  const nav = useNavigate();
  const { profile } = useAuth();
  const qc = useQueryClient();

  const inst = useQuery({
    queryKey: ["instrument", instrumentId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments")
        .select("*")
        .eq("id", instrumentId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const cals = useQuery({
    queryKey: ["instrument_calibrations", instrumentId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instrument_calibrations")
        .select("*")
        .eq("instrument_id", instrumentId)
        .order("calibrated_on", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const events = useQuery<any[]>({
    queryKey: ["instrument_events", instrumentId],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data } = await (supabase.from("instrument_events" as any) as any)
        .select("*")
        .eq("instrument_id", instrumentId)
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  if (inst.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!inst.data) {
    return (
      <div className="text-center py-20">
        <div className="text-lg font-semibold">Instrument not found</div>
        <Button variant="link" onClick={() => nav({ to: "/app/instruments" })}>Back to instruments</Button>
      </div>
    );
  }

  const i: any = inst.data;
  const due = daysUntil(i.calibration_due);
  const status =
    due == null ? { label: "—", tone: "muted" as const } :
    due < 0 ? { label: `Overdue ${Math.abs(due)}d`, tone: "destructive" as const } :
    due <= 7 ? { label: `Due in ${due}d`, tone: "destructive" as const } :
    due <= 30 ? { label: `Due in ${due}d`, tone: "warning" as const } :
    { label: `${due}d remaining`, tone: "success" as const };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/instruments" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Instruments
        </Link>
        <span>/</span>
        <span className="text-foreground">{i.asset_id}</span>
      </div>

      <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{i.name}</h1>
              <Badge variant="outline">{i.category}</Badge>
              <Badge
                className={
                  status.tone === "destructive" ? "bg-destructive/10 text-destructive border-destructive/30" :
                  status.tone === "warning" ? "bg-warning/10 text-warning border-warning/30" :
                  status.tone === "success" ? "bg-success/10 text-success border-success/30" :
                  "bg-muted text-muted-foreground"
                }
                variant="outline"
              >
                {status.label}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Asset <span className="font-mono text-foreground">{i.asset_id}</span> · Serial {i.serial_number ?? "—"} · {i.manufacturer ?? ""}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/verify/instrument/$token" params={{ token: i.qr_token }} target="_blank">
              <Button variant="outline" size="sm">
                <QrCode className="size-4 me-1" /> QR Verify
              </Button>
            </Link>
            <LogCalibrationDialog instrumentId={instrumentId} onDone={() => { cals.refetch(); qc.invalidateQueries({ queryKey: ["instrument", instrumentId] }); }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Stat label="Model" value={i.model ?? "—"} />
          <Stat label="Status" value={i.status} />
          <Stat label="Calibration due" value={i.calibration_due ?? "—"} icon={<Calendar className="size-4" />} />
          <Stat label="Last calibrated" value={cals.data?.[0]?.calibrated_on ?? "—"} />
        </div>
      </div>

      <Tabs defaultValue="calibrations">
        <TabsList>
          <TabsTrigger value="calibrations">Calibrations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="upload">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="calibrations" className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-medium">Calibration history</h3>
              <Button
                variant="outline" size="sm"
                disabled={!(cals.data?.length)}
                onClick={() => exportExcel(`${i.asset_id}-calibrations`, "Calibrations", (cals.data ?? []).map((c: any) => ({
                  Date: c.calibrated_on, "Performed by": c.performed_by, "Next due": c.next_due, Notes: c.notes,
                })))}
              >
                <Download className="size-4 me-1" /> Export
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground bg-muted/40">
                  <tr>
                    <Th>Date</Th><Th>Performed by</Th><Th>Next due</Th><Th>Notes</Th><Th>Certificate</Th>
                  </tr>
                </thead>
                <tbody>
                  {cals.isLoading && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground"><Loader2 className="size-4 animate-spin inline" /></td></tr>}
                  {!cals.isLoading && (cals.data?.length ?? 0) === 0 && (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No calibrations recorded.</td></tr>
                  )}
                  {cals.data?.map((c: any) => (
                    <tr key={c.id} className="border-t border-border/60">
                      <td className="px-5 py-3 font-medium">{c.calibrated_on}</td>
                      <td className="px-5 py-3">{c.performed_by ?? "—"}</td>
                      <td className="px-5 py-3">{c.next_due ?? "—"}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{c.notes ?? "—"}</td>
                      <td className="px-5 py-3"><CertCell path={c.certificate_path} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium mb-4">Activity timeline</h3>
            <ol className="relative border-s border-border ms-2 space-y-4">
              {(events.data ?? []).map((e: any) => (
                <li key={e.id} className="ms-4">
                  <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" />
                  <div className="text-sm font-medium">{e.kind.replace("_", " ")}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleString()}
                  </div>
                  {e.payload && <pre className="mt-1 text-[11px] bg-muted/40 rounded p-2 overflow-x-auto">{JSON.stringify(e.payload, null, 2)}</pre>}
                </li>
              ))}
              {(events.data?.length ?? 0) === 0 && <div className="text-sm text-muted-foreground">No activity yet.</div>}
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <FileUploader
            bucket="instrument-files"
            folder={`${instrumentId}/docs`}
            table="instrument_calibrations"
            recordIdColumn="instrument_id"
            recordId={instrumentId}
            hint="Drag certificates, manuals, photos."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">{icon}{value}</div>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}

function CertCell({ path }: { path: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!path) return;
    signedUrl("instrument-files", path).then(setUrl).catch(() => {});
  }, [path]);
  if (!path) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <a href={url ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
      <FileText className="size-3" /> View <ExternalLink className="size-3" />
    </a>
  );
}

function LogCalibrationDialog({ instrumentId, onDone }: { instrumentId: string; onDone: () => void }) {
  const { profile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [calibratedOn, setCalibratedOn] = useState(new Date().toISOString().slice(0, 10));
  const [nextDue, setNextDue] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const submit = async () => {
    if (!profile?.company_id) return;
    setBusy(true);
    let certPath: string | null = null;
    if (file) {
      const path = `${profile.company_id}/${instrumentId}/cert-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("instrument-files").upload(path, file);
      if (error) { toast.error(error.message); setBusy(false); return; }
      certPath = path;
    }
    const { error } = await supabase.from("instrument_calibrations").insert({
      company_id: profile.company_id,
      instrument_id: instrumentId,
      calibrated_on: calibratedOn,
      next_due: nextDue || null,
      performed_by: performedBy || null,
      notes: notes || null,
      certificate_path: certPath,
      created_by: user?.id ?? null,
    });
    if (error) { toast.error(error.message); setBusy(false); return; }
    if (nextDue) {
      await supabase.from("instruments").update({ calibration_due: nextDue, status: "Active" }).eq("id", instrumentId);
    }
    setBusy(false);
    setOpen(false);
    toast.success("Calibration logged.");
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Plus className="size-4 me-1" /> Log calibration
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Log calibration</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <Field label="Calibrated on"><Input type="date" value={calibratedOn} onChange={(e) => setCalibratedOn(e.target.value)} /></Field>
          <Field label="Next due"><Input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} /></Field>
          <Field label="Performed by"><Input value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} placeholder="Lab / technician" /></Field>
          <Field label="Notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
          <Field label="Certificate (PDF/image)"><Input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
