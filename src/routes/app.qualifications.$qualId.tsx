import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useConfirm } from "@/components/ConfirmDialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, QrCode, Save, FileText, Trash2, Undo2, AlertTriangle, ShieldCheck } from "lucide-react";
import { QualificationComplianceReport } from "@/components/qualifications/QualificationComplianceReport";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useQualificationBundle } from "@/lib/use-qualification";
import { StatusBadge } from "@/components/StatusBadge";
import { FileUploader } from "@/components/FileUploader";
import { deriveQualStatus } from "@/lib/qualification-status";
import { QualificationVariablesMatrix } from "@/components/qualifications/QualificationVariablesMatrix";
import { QualificationTestsTable } from "@/components/qualifications/QualificationTestsTable";
import { ContinuityTimeline } from "@/components/qualifications/ContinuityTimeline";
import { SignaturePad } from "@/components/qualifications/SignaturePad";
import { WelderQualificationDocument } from "@/components/reports/WelderQualificationDocument";
import { fmtEngDate } from "@/lib/doc-number";
import {
  deriveQualificationRanges,
  formatRange,
} from "@/lib/qualification-intelligence";
import { QualificationGuidanceStrip } from "@/components/qualifications/QualificationGuidanceStrip";
import { CollaborationTab } from "@/components/collab/CollaborationTab";
import { WelderQualificationLineageStrip } from "@/components/qualifications/WelderQualificationLineageStrip";
import { WelderPhotoUploader } from "@/components/qualifications/WelderPhotoUploader";

export const Route = createFileRoute("/app/qualifications/$qualId")({
  component: QualDetail,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

function QualDetail() {
  const confirmDialog = useConfirm();
  const { qualId } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { roles } = useAuth();
  const isAdmin = roles.includes("super_admin");

  const bundle = useQualificationBundle(qualId);
  const q = bundle.qualification.data;
  const [edit, setEdit] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  if (bundle.qualification.isLoading) {
    return <div className="space-y-3"><Skeleton className="h-10 w-64" /><Skeleton className="h-64 w-full" /></div>;
  }
  if (!q) {
    return (
      <div className="text-center py-20">
        <div className="text-lg font-semibold">WPQ not found</div>
        <Button variant="link" onClick={() => nav({ to: "/app/qualifications" })}>Back</Button>
      </div>
    );
  }

  const merged = { ...q, ...edit };
  const status = deriveQualStatus(merged);

  const dirty = Object.keys(edit).length > 0;

  const setF = (k: string, v: any) => setEdit((s) => ({ ...s, [k]: v }));

  const save = async () => {
    if (!dirty) return;
    setSaving(true);
    const { error } = await (supabase.from("qualifications") as any).update(edit).eq("id", qualId);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEdit({});
    qc.invalidateQueries({ queryKey: ["qualification", qualId] });
    qc.invalidateQueries({ queryKey: ["qualifications"] });
    toast.success("Saved.");
  };

  const softDelete = async () => {
    if (!(await confirmDialog("Move this WPQ to Trash? Super admins can restore it later."))) return;
    const { error } = await (supabase.rpc as any)("soft_delete_qualification", { _id: qualId });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Trash.");
    qc.invalidateQueries({ queryKey: ["qualifications"] });
    nav({ to: "/app/qualifications" });
  };

  const restore = async () => {
    const { error } = await (supabase.rpc as any)("restore_qualification", { _id: qualId });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Restored.");
    qc.invalidateQueries({ queryKey: ["qualification", qualId] });
    qc.invalidateQueries({ queryKey: ["qualifications"] });
    qc.invalidateQueries({ queryKey: ["qualifications_trash"] });
  };

  const hardDelete = async () => {
    if (!(await confirmDialog("Permanently delete this WPQ and ALL related records? This cannot be undone."))) return;
    const { error } = await supabase.from("qualifications").delete().eq("id", qualId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Permanently deleted.");
    nav({ to: "/app/qualifications" });
  };

  const ranges = deriveQualificationRanges({
    code: (merged.code_family as any) ?? "ASME IX",
    process: merged.process ?? "",
    testCouponThicknessMm: Number(merged.test_thickness_mm) || undefined,
    testCouponDiameterMm: Number(merged.test_diameter_mm) || undefined,
    testPosition: merged.position_qualified,
    isPipe: merged.test_coupon_type?.toLowerCase().includes("pipe"),
  });

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/qualification/${q.qr_token}`
    : `/verify/qualification/${q.qr_token}`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/qualifications" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Qualifications
        </Link>
        <span>/</span>
        <span className="text-foreground">{q.wpq_number ?? q.id.slice(0, 8)}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight">{q.welder_name}</h1>
              <StatusBadge status={status} />
              <span className="text-xs px-2 py-0.5 rounded bg-muted">{q.code_family ?? "ASME IX"}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-muted">{q.revision}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {q.wpq_number ?? "—"} · Employee {q.employee_id} · Process {q.process}
              {q.position_qualified && ` · Position ${q.position_qualified}`}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/verify/qualification/$token" params={{ token: q.qr_token }} target="_blank">
              <Button variant="outline" size="sm"><QrCode className="size-4 me-1" /> Verify QR</Button>
            </Link>
            {dirty && <Button size="sm" onClick={save} disabled={saving}><Save className="size-4 me-1" /> Save changes</Button>}
            {q.deleted_at ? (
              <>
                {isAdmin && (
                  <Button size="sm" variant="outline" onClick={restore}>
                    <Undo2 className="size-4 me-1" /> Restore
                  </Button>
                )}
                {isAdmin && (
                  <Button size="sm" variant="outline" onClick={hardDelete} className="text-destructive">
                    <Trash2 className="size-4 me-1" /> Delete permanently
                  </Button>
                )}
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={softDelete} className="text-destructive">
                <Trash2 className="size-4 me-1" /> Delete
              </Button>
            )}
          </div>
        </div>

        {q.deleted_at && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="size-4" />
            This WPQ is in Trash (soft-deleted on {fmtEngDate(q.deleted_at)}). It is hidden from standard lists and reports.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Field label="Qualified" value={q.qualification_date ? fmtEngDate(q.qualification_date) : "—"} />
          <Field label="Expires" value={fmtEngDate(q.expiry_date)} />
          <Field label="Last activity" value={q.last_continuity_date ? fmtEngDate(q.last_continuity_date) : "—"} />
          <Field label="Result" value={q.result ?? "—"} />
        </div>
      </div>
      {!q.deleted_at && <QualificationGuidanceStrip qualification={merged} />}
      <WelderQualificationLineageStrip
        current="wpq"
        qualId={qualId}
        welderName={q.welder_name}
        wpsNumber={q.wps_number}
      />

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance"><ShieldCheck className="size-4 me-1" /> Compliance</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="tests">Tests ({bundle.tests.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="continuity">Continuity ({bundle.continuity.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="signatures">Signatures ({bundle.signatures.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="attachments">Attachments ({bundle.attachments.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="audit">Audit ({bundle.audit.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="certificate"><FileText className="size-4 me-1" /> Certificate</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-5">
            <WelderPhotoUploader
              qualId={qualId}
              companyId={q.company_id}
              value={q.welder_photo_url}
              welderName={q.welder_name}
              onChange={() => qc.invalidateQueries({ queryKey: ["qualification", qualId] })}
            />
          </Card>
          <Card className="p-5 grid sm:grid-cols-2 gap-3">
            <Edit label="Welder name" value={merged.welder_name} onChange={(v) => setF("welder_name", v)} />
            <Edit label="Employee ID" value={merged.employee_id} onChange={(v) => setF("employee_id", v)} />
            <Edit label="WPQ number" value={merged.wpq_number} onChange={(v) => setF("wpq_number", v)} />
            <Edit label="Stamp number" value={merged.stamp_number} onChange={(v) => setF("stamp_number", v)} />
            <Edit label="Process" value={merged.process} onChange={(v) => setF("process", v)} />
            <SelectEdit label="Process type" value={merged.process_type} onChange={(v) => setF("process_type", v)} options={processTypeOptions} />
            <SelectEdit label="Position" value={merged.position_qualified} onChange={(v) => setF("position_qualified", v)} options={positionOptions} />
            <Edit label="Standard" value={merged.standard} onChange={(v) => setF("standard", v)} />
            <Edit label="Code family" value={merged.code_family} onChange={(v) => setF("code_family", v)} />
            <Edit label="Test coupon" value={merged.test_coupon_type} onChange={(v) => setF("test_coupon_type", v)} />
            <Edit label="Coupon thickness (mm)" value={merged.test_thickness_mm} onChange={(v) => setF("test_thickness_mm", v)} type="number" />
            <Edit label="Coupon diameter (mm)" value={merged.test_diameter_mm} onChange={(v) => setF("test_diameter_mm", v)} type="number" />
            <Edit label="Qualification date" value={merged.qualification_date} onChange={(v) => setF("qualification_date", v)} type="date" />
            <Edit label="Expiry date" value={merged.expiry_date} onChange={(v) => setF("expiry_date", v)} type="date" />
            <Edit label="Revision" value={merged.revision} onChange={(v) => setF("revision", v)} />
            <Edit label="Remarks" value={merged.remarks} onChange={(v) => setF("remarks", v)} className="sm:col-span-2" />
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Auto-derived qualification ranges</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Range label="Base thickness" value={formatRange(ranges.baseThickness)} />
              <Range label="Deposit thickness" value={formatRange(ranges.depositThickness)} />
              <Range label="Diameter" value={formatRange(ranges.diameter)} />
              <Range label="Positions qualified" value={ranges.positions.join(", ") || "—"} />
            </div>
            <div className="text-xs text-muted-foreground italic mt-3">{ranges.notes.join(" ")}</div>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <QualificationComplianceReport qualification={merged} />
        </TabsContent>

        <TabsContent value="variables">
          <QualificationVariablesMatrix
            qualificationId={qualId}
            rows={bundle.variables.data ?? []}
            onChange={() => qc.invalidateQueries({ queryKey: ["qualification_variables", qualId] })}
          />
        </TabsContent>

        <TabsContent value="tests">
          <QualificationTestsTable
            qualificationId={qualId}
            rows={bundle.tests.data ?? []}
            onChange={() => qc.invalidateQueries({ queryKey: ["qualification_tests", qualId] })}
          />
        </TabsContent>

        <TabsContent value="continuity">
          <ContinuityTimeline
            qualificationId={qualId}
            rows={bundle.continuity.data ?? []}
            onChange={() => {
              qc.invalidateQueries({ queryKey: ["qualification_continuity", qualId] });
              qc.invalidateQueries({ queryKey: ["qualification", qualId] });
            }}
          />
        </TabsContent>

        <TabsContent value="signatures">
          <SignaturePad
            qualificationId={qualId}
            signatures={bundle.signatures.data ?? []}
            onChange={() => qc.invalidateQueries({ queryKey: ["qualification_signatures", qualId] })}
          />
        </TabsContent>

        <TabsContent value="attachments">
          <div className="space-y-3">
            <FileUploader
              bucket="qualification-files"
              folder={qualId}
              table="qualification_attachments"
              recordIdColumn="qualification_id"
              recordId={qualId}
              hint="Test reports, photos, NDT films, certificates."
            />
            <ul className="text-sm divide-y divide-border rounded-md border border-border">
              {(bundle.attachments.data ?? []).map((a) => (
                <li key={a.id} className="px-4 py-2 flex justify-between items-center">
                  <span>{a.filename}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.size_bytes ? `${(a.size_bytes / 1024).toFixed(0)} KB` : ""} · {fmtEngDate(a.created_at)}
                  </span>
                </li>
              ))}
              {(bundle.attachments.data?.length ?? 0) === 0 && (
                <li className="px-4 py-6 text-center text-muted-foreground">No attachments yet.</li>
              )}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <ol className="relative border-s border-border ms-2 space-y-4">
            {(bundle.audit.data ?? []).map((e) => {
              const before = (e.before ?? {}) as Record<string, any>;
              const after = (e.after ?? {}) as Record<string, any>;
              const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
              const changed = keys.filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
              const tone =
                e.action === "DELETE" ? "bg-destructive" :
                e.action === "INSERT" ? "bg-emerald-500" : "bg-primary/70";
              return (
                <li key={e.id} className="ms-4 relative">
                  <div className={`absolute -start-[22px] mt-1.5 size-3 rounded-full ${tone}`} />
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{e.action}</div>
                    <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                  </div>
                  {e.action === "UPDATE" && changed.length > 0 && (
                    <div className="mt-2 rounded border border-border bg-muted/20 text-xs divide-y divide-border">
                      {changed.slice(0, 12).map((k) => (
                        <div key={k} className="grid grid-cols-[140px_1fr_1fr] gap-2 px-2 py-1.5 items-start">
                          <div className="font-mono text-muted-foreground">{k}</div>
                          <div className="font-mono break-all text-destructive/80 line-through">
                            {fmtVal(before[k])}
                          </div>
                          <div className="font-mono break-all text-emerald-600 dark:text-emerald-400">
                            {fmtVal(after[k])}
                          </div>
                        </div>
                      ))}
                      {changed.length > 12 && (
                        <div className="px-2 py-1.5 text-muted-foreground italic">
                          +{changed.length - 12} more changes…
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
            {(bundle.audit.data?.length ?? 0) === 0 && (
              <div className="text-sm text-muted-foreground ms-4">No audit entries.</div>
            )}
          </ol>
        </TabsContent>

        <TabsContent value="certificate" className="mt-4">
          <WelderQualificationDocument
            q={q}
            variables={bundle.variables.data ?? []}
            tests={bundle.tests.data ?? []}
            signatures={bundle.signatures.data ?? []}
            verifyUrl={verifyUrl}
          />
        </TabsContent>
        <TabsContent value="discussion" className="mt-4">
          <CollaborationTab entityType="qualification" entityId={qualId} />
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

const positionOptions = [
  "1G (Flat Groove)",
  "2G (Horizontal Groove)",
  "3G (Vertical Groove)",
  "4G (Overhead Groove)",
  "5G (Fixed Horizontal Pipe)",
  "6G (Fixed 45° Pipe)",
  "1F (Flat Fillet)",
  "2F (Horizontal Fillet)",
  "3F (Vertical Fillet)",
  "4F (Overhead Fillet)",
  "5F (Fixed Horizontal Pipe Fillet)",
];

function Edit({
  label, value, onChange, type = "text", className = "",
}: { label: string; value: any; onChange: (v: any) => void; type?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SelectEdit({
  label, value, onChange, options, className = "",
}: { label: string; value: any; onChange: (v: string) => void; options: string[]; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs">{label}</Label>
      <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">— Select position —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Range({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-2.5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-sm mt-0.5">{value}</div>
    </div>
  );
}

function fmtVal(v: any): string {
  if (v == null || v === "") return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
