import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, FileText, History, Paperclip, ShieldCheck, Flame, Printer, Trash2, Download, GitBranch, Layers, Boxes, Wrench, Zap, Sparkles, PenLine, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { HeatInputCalculator } from "@/components/HeatInputCalculator";
import { FileUploader } from "@/components/FileUploader";
import { WpsDocument } from "@/components/reports/WpsDocument";
import { JointConfigList } from "@/components/procedures/JointConfigList";
import { BaseMetalsTable } from "@/components/procedures/BaseMetalsTable";
import { FillerMetalsTable } from "@/components/procedures/FillerMetalsTable";
import { ElectricalCharacteristicsTable } from "@/components/procedures/ElectricalCharacteristicsTable";
import { WpsCompliancePanel } from "@/components/procedures/WpsCompliancePanel";
import { WpsSignatureBlock } from "@/components/procedures/WpsSignatureBlock";
import { WpsRevisionCompare } from "@/components/procedures/WpsRevisionCompare";

export const Route = createFileRoute("/app/procedures/$procedureId")({
  component: ProcedureDetailPage,
});

function ProcedureDetailPage() {
  const { procedureId } = Route.useParams();
  const { profile, user, roles } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();

  const isEditor = roles.some((r) =>
    ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r),
  );
  const isApprover = roles.some((r) => ["super_admin", "qa_qc_manager"].includes(r));

  const procQ = useQuery({
    queryKey: ["procedure", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("procedures").select("*").eq("id", procedureId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const revsQ = useQuery({
    queryKey: ["procedure_revisions", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("procedure_revisions").select("*").eq("procedure_id", procedureId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const attsQ = useQuery({
    queryKey: ["procedure_attachments", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("procedure_attachments").select("*").eq("procedure_id", procedureId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const apprQ = useQuery({
    queryKey: ["procedure_approvals", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("procedure_approvals").select("*").eq("procedure_id", procedureId).order("signed_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const hiQ = useQuery({
    queryKey: ["heat_inputs", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("heat_inputs").select("*").eq("procedure_id", procedureId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const auditQ = useQuery({
    queryKey: ["audit_logs", "procedures", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs").select("*")
        .eq("table_name", "procedures").eq("record_id", procedureId)
        .order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Relational child queries for full printable WPS document
  const jointsQ = useQuery({
    queryKey: ["wps_joint_configurations", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("wps_joint_configurations").select("*").eq("procedure_id", procedureId).order("sort_order").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
  const baseMetalsQ = useQuery({
    queryKey: ["wps_base_metals", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("wps_base_metals").select("*").eq("procedure_id", procedureId).order("sort_order").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
  const fillersQ = useQuery({
    queryKey: ["wps_filler_metals", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("wps_filler_metals").select("*").eq("procedure_id", procedureId).order("sort_order").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
  const electricalQ = useQuery({
    queryKey: ["wps_electrical_characteristics", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("wps_electrical_characteristics").select("*").eq("procedure_id", procedureId).order("sort_order").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
  const sigsQ = useQuery({
    queryKey: ["wps_signatures", procedureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("wps_signatures").select("*").eq("procedure_id", procedureId).order("signed_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Resolve signed URLs for joint sketches (for printable doc)
  const [sketchUrls, setSketchUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out: Record<string, string> = {};
      for (const j of jointsQ.data ?? []) {
        if (!j.sketch_path) continue;
        const { data } = await supabase.storage.from("wps-sketches").createSignedUrl(j.sketch_path, 600);
        if (data?.signedUrl) out[j.id] = data.signedUrl;
      }
      if (!cancelled) setSketchUrls(out);
    })();
    return () => { cancelled = true; };
  }, [jointsQ.data]);

  const proc = procQ.data;

  const sign = async (action: "submitted" | "reviewed" | "approved" | "rejected" | "revoked", comment?: string) => {
    if (!profile?.company_id || !user) return;
    const ts = new Date().toISOString();
    const patch: Record<string, any> = {};
    if (action === "submitted") { patch.status = "Review"; patch.submitted_for_review_at = ts; patch.submitted_by = user.id; }
    if (action === "reviewed") { patch.reviewed_at = ts; patch.reviewed_by = user.id; }
    if (action === "approved") { patch.status = "Approved"; patch.approved_at = ts; patch.approved_by = user.id; }
    if (action === "rejected") { patch.status = "Rejected"; }
    if (action === "revoked") { patch.status = "Draft"; patch.approved_at = null; patch.approved_by = null; }

    const { error: e1 } = await (supabase.from("procedures") as any).update(patch).eq("id", procedureId);
    if (e1) return toast.error(e1.message);
    const { error: e2 } = await supabase.from("procedure_approvals").insert({
      procedure_id: procedureId,
      company_id: profile.company_id,
      action,
      actor_id: user.id,
      actor_name: profile.display_name ?? user.email ?? null,
      actor_role: roles[0] ?? null,
      comment: comment ?? null,
    });
    if (e2) return toast.error(e2.message);
    toast.success(`Procedure ${action}`);
    qc.invalidateQueries({ queryKey: ["procedure", procedureId] });
    qc.invalidateQueries({ queryKey: ["procedure_approvals", procedureId] });
    qc.invalidateQueries({ queryKey: ["audit_logs", "procedures", procedureId] });
  };

  const newRevision = async () => {
    if (!proc || !profile?.company_id) return;
    const next = window.prompt("New revision label (e.g. Rev 1):", incrementRev(proc.revision));
    if (!next) return;
    const summary = window.prompt("Change summary (optional):") ?? "";
    // snapshot first
    const { error: snapErr } = await supabase.from("procedure_revisions").insert({
      procedure_id: procedureId,
      company_id: profile.company_id,
      revision: proc.revision,
      change_summary: summary,
      snapshot: proc,
      created_by: user?.id ?? null,
    });
    if (snapErr) return toast.error(snapErr.message);
    // bump revision and reset workflow
    const { error: upErr } = await supabase.from("procedures")
      .update({ revision: next, status: "Draft", approved_at: null, approved_by: null, reviewed_at: null, reviewed_by: null })
      .eq("id", procedureId);
    if (upErr) return toast.error(upErr.message);
    toast.success(`Snapshotted ${proc.revision}, now editing ${next}`);
    qc.invalidateQueries({ queryKey: ["procedure", procedureId] });
    qc.invalidateQueries({ queryKey: ["procedure_revisions", procedureId] });
  };

  const downloadAttachment = async (path: string, filename: string) => {
    const { data, error } = await supabase.storage.from("procedure-files").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    const a = document.createElement("a");
    a.href = data.signedUrl; a.download = filename; a.target = "_blank";
    document.body.appendChild(a); a.click(); a.remove();
  };

  const deleteAttachment = async (id: string, path: string) => {
    if (!confirm("Delete this attachment?")) return;
    await supabase.storage.from("procedure-files").remove([path]);
    const { error } = await supabase.from("procedure_attachments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["procedure_attachments", procedureId] });
  };

  if (procQ.isLoading) return <div className="p-8 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" /> Loading…</div>;
  if (!proc) return <div className="p-8">Not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <Button variant="ghost" size="sm" onClick={() => nav({ to: "/app/procedures" })} className="mb-2 -ms-2">
            <ArrowLeft className="size-4 me-1" /> Back to procedures
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            {proc.code}
            <StatusBadge status={proc.status} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {proc.standard} · {proc.process} · {proc.revision}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-4 me-1" /> Print / PDF
          </Button>
          {isEditor && (
            <Button variant="outline" size="sm" onClick={newRevision}>
              <GitBranch className="size-4 me-1" /> New revision
            </Button>
          )}
          {isEditor && proc.status === "Draft" && (
            <Button size="sm" onClick={() => sign("submitted")}>Submit for review</Button>
          )}
          {isEditor && proc.status === "Review" && (
            <Button variant="outline" size="sm" onClick={() => sign("reviewed", window.prompt("Reviewer comment (optional):") ?? "")}>
              Mark reviewed
            </Button>
          )}
          {isApprover && proc.status === "Review" && (
            <>
              <Button size="sm" onClick={() => sign("approved", window.prompt("Approval comment (optional):") ?? "")}>Approve</Button>
              <Button variant="destructive" size="sm" onClick={() => sign("rejected", window.prompt("Reason for rejection:") ?? "")}>Reject</Button>
            </>
          )}
          {isApprover && proc.status === "Approved" && (
            <Button variant="destructive" size="sm" onClick={() => sign("revoked", window.prompt("Reason for revocation:") ?? "")}>
              Revoke approval
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="print:hidden flex-wrap h-auto">
          <TabsTrigger value="details"><FileText className="size-4 me-1.5" /> Details</TabsTrigger>
          <TabsTrigger value="joints"><Layers className="size-4 me-1.5" /> Joints</TabsTrigger>
          <TabsTrigger value="basemetals"><Boxes className="size-4 me-1.5" /> Base metals</TabsTrigger>
          <TabsTrigger value="fillers"><Wrench className="size-4 me-1.5" /> Fillers</TabsTrigger>
          <TabsTrigger value="electrical"><Zap className="size-4 me-1.5" /> Electrical</TabsTrigger>
          <TabsTrigger value="compliance"><Sparkles className="size-4 me-1.5" /> Compliance</TabsTrigger>
          <TabsTrigger value="heat"><Flame className="size-4 me-1.5" /> Heat input</TabsTrigger>
          <TabsTrigger value="revisions"><GitBranch className="size-4 me-1.5" /> Revisions ({revsQ.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="compare"><GitCompare className="size-4 me-1.5" /> Compare</TabsTrigger>
          <TabsTrigger value="files"><Paperclip className="size-4 me-1.5" /> Attachments ({attsQ.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="signatures"><PenLine className="size-4 me-1.5" /> Signatures ({sigsQ.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="approvals"><ShieldCheck className="size-4 me-1.5" /> Approvals ({apprQ.data?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="audit"><History className="size-4 me-1.5" /> Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <WpsDocument
            proc={proc}
            approvals={apprQ.data ?? []}
            revisions={revsQ.data ?? []}
            children={{
              joints: jointsQ.data ?? [],
              baseMetals: baseMetalsQ.data ?? [],
              fillers: fillersQ.data ?? [],
              electrical: electricalQ.data ?? [],
              signatures: sigsQ.data ?? [],
              sketchUrls,
            }}
          />
        </TabsContent>

        <TabsContent value="joints" className="mt-4">
          <JointConfigList procedureId={procedureId} canEdit={isEditor} />
        </TabsContent>

        <TabsContent value="basemetals" className="mt-4">
          <BaseMetalsTable procedureId={procedureId} canEdit={isEditor} />
        </TabsContent>

        <TabsContent value="fillers" className="mt-4">
          <FillerMetalsTable procedureId={procedureId} canEdit={isEditor} />
        </TabsContent>

        <TabsContent value="electrical" className="mt-4">
          <ElectricalCharacteristicsTable procedureId={procedureId} canEdit={isEditor} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <WpsCompliancePanel proc={proc} />
        </TabsContent>

        <TabsContent value="heat" className="mt-4 space-y-4">
          <HeatInputCalculator
            procedureId={procedureId}
            limits={{
              voltage_min: proc.voltage_min, voltage_max: proc.voltage_max,
              current_min: proc.current_min, current_max: proc.current_max,
              travel_speed_min: proc.travel_speed_min, travel_speed_max: proc.travel_speed_max,
              heat_input_min: proc.heat_input_min, heat_input_max: proc.heat_input_max,
            }}
          />
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border text-sm font-medium">Calculation history</div>
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr><Th>Date</Th><Th>V</Th><Th>I (A)</Th><Th>Travel (mm/min)</Th><Th>Heat input (kJ/mm)</Th><Th>Within limits</Th></tr>
              </thead>
              <tbody>
                {(hiQ.data ?? []).length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">No calculations logged yet.</td></tr>}
                {(hiQ.data ?? []).map((h: any) => (
                  <tr key={h.id} className="border-t border-border/60">
                    <td className="px-5 py-2.5 text-muted-foreground">{new Date(h.created_at).toLocaleString()}</td>
                    <td className="px-5 py-2.5 tabular-nums">{h.voltage}</td>
                    <td className="px-5 py-2.5 tabular-nums">{h.current_amp}</td>
                    <td className="px-5 py-2.5 tabular-nums">{h.travel_speed}</td>
                    <td className="px-5 py-2.5 font-medium tabular-nums">{Number(h.heat_input).toFixed(3)}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={h.within_limits ? "Accepted" : "Rejected"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="revisions" className="mt-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr><Th>Revision</Th><Th>Date</Th><Th>Summary</Th></tr>
              </thead>
              <tbody>
                {(revsQ.data ?? []).length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-muted-foreground">No previous revisions. The current revision is {proc.revision}.</td></tr>}
                {(revsQ.data ?? []).map((r: any) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-5 py-2.5 font-medium">{r.revision}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-5 py-2.5">{r.change_summary || <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          <WpsRevisionCompare
            currentSnapshot={proc}
            currentLabel={proc.revision}
            revisions={(revsQ.data ?? []) as any}
          />
        </TabsContent>
        <TabsContent value="files" className="mt-4 space-y-4">

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr><Th>File</Th><Th>Size</Th><Th>Uploaded</Th><Th>{" "}</Th></tr>
              </thead>
              <tbody>
                {(attsQ.data ?? []).length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No attachments yet.</td></tr>}
                {(attsQ.data ?? []).map((a: any) => (
                  <tr key={a.id} className="border-t border-border/60">
                    <td className="px-5 py-2.5 font-medium">{a.filename}</td>
                    <td className="px-5 py-2.5 text-muted-foreground tabular-nums">{formatBytes(a.size_bytes)}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-2.5 text-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => downloadAttachment(a.storage_path, a.filename)}>
                        <Download className="size-4" />
                      </Button>
                      {isEditor && (
                        <Button variant="ghost" size="sm" onClick={() => deleteAttachment(a.id, a.storage_path)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr><Th>Action</Th><Th>By</Th><Th>Role</Th><Th>Date</Th><Th>Comment</Th></tr>
              </thead>
              <tbody>
                {(apprQ.data ?? []).length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">No signatures yet.</td></tr>}
                {(apprQ.data ?? []).map((a: any) => (
                  <tr key={a.id} className="border-t border-border/60">
                    <td className="px-5 py-2.5"><StatusBadge status={prettyAction(a.action)} /></td>
                    <td className="px-5 py-2.5 font-medium">{a.actor_name ?? a.actor_id}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{a.actor_role ?? "—"}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{new Date(a.signed_at).toLocaleString()}</td>
                    <td className="px-5 py-2.5">{a.comment || <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/40">
                <tr><Th>When</Th><Th>Action</Th><Th>By</Th></tr>
              </thead>
              <tbody>
                {(auditQ.data ?? []).length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-muted-foreground">No history yet.</td></tr>}
                {(auditQ.data ?? []).map((a: any) => (
                  <tr key={a.id} className="border-t border-border/60">
                    <td className="px-5 py-2.5 text-muted-foreground">{new Date(a.created_at).toLocaleString()}</td>
                    <td className="px-5 py-2.5">{a.action}</td>
                    <td className="px-5 py-2.5 text-muted-foreground">{a.actor_id ?? "system"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WpsSheet({ proc }: { proc: any }) {
  const groups: { title: string; rows: [string, any][] }[] = [
    {
      title: "1. Identification",
      rows: [
        ["WPS Code", proc.code], ["Standard / Code", proc.standard],
        ["Welding process", proc.process], ["Revision", proc.revision],
        ["Status", proc.status],
      ],
    },
    {
      title: "2. Joint design",
      rows: [
        ["Joint type", proc.joint_type], ["Welding position", proc.position],
        ["Thickness range", proc.thickness_range],
      ],
    },
    {
      title: "3. Materials",
      rows: [
        ["Base material", proc.base_material],
        ["Filler material", proc.filler_material],
        ["Shielding gas", proc.shielding_gas],
      ],
    },
    {
      title: "4. Thermal treatment",
      rows: [
        ["Preheat temperature", proc.preheat_temp],
        ["Interpass temperature", proc.interpass_temp],
        ["PWHT", proc.pwht],
      ],
    },
    {
      title: "5. Electrical & mechanical parameters",
      rows: [
        ["Voltage", range(proc.voltage_min, proc.voltage_max, "V")],
        ["Current", range(proc.current_min, proc.current_max, "A")],
        ["Travel speed", range(proc.travel_speed_min, proc.travel_speed_max, "mm/min")],
        ["Heat input", range(proc.heat_input_min, proc.heat_input_max, "kJ/mm")],
      ],
    },
  ];
  return (
    <div className="doc-sheet print:!shadow-none print:!border-0 print:!p-0 print:!max-w-none">
      <header className="border-b-2 border-foreground pb-3 mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Welding Procedure Specification</div>
          <div className="text-lg font-bold">{proc.code}</div>
          <div className="text-xs text-muted-foreground">{proc.standard} · {proc.process}</div>
        </div>
        <table className="text-[10px]">
          <tbody>
            <tr><td className="pe-3 uppercase text-muted-foreground">Revision</td><td className="font-medium">{proc.revision}</td></tr>
            <tr><td className="pe-3 uppercase text-muted-foreground">Status</td><td className="font-medium">{proc.status}</td></tr>
            <tr><td className="pe-3 uppercase text-muted-foreground">Issued</td><td className="font-medium">{new Date().toLocaleDateString()}</td></tr>
          </tbody>
        </table>
      </header>

      <div className="space-y-4">
        {groups.map((g) => (
          <section key={g.title} className="avoid-break">
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 bg-muted px-2 py-1 border border-foreground/40">{g.title}</div>
            <table className="w-full">
              <tbody>
                {g.rows.map(([k, v]) => (
                  <tr key={k}>
                    <th style={{ width: "32%" }}>{k}</th>
                    <td>{v ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <section className="mt-8 avoid-break">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Approvals</div>
        <table className="w-full">
          <thead><tr><th>Welding Engineer</th><th>QA/QC Manager</th><th>Client / Inspector</th></tr></thead>
          <tbody><tr>
            <td style={{ height: 70 }}><div className="text-[10px] text-muted-foreground">Signature & date</div></td>
            <td><div className="text-[10px] text-muted-foreground">Signature & date</div></td>
            <td><div className="text-[10px] text-muted-foreground">Signature & date</div></td>
          </tr></tbody>
        </table>
      </section>
    </div>
  );
}

function range(min: any, max: any, unit: string) {
  if (min == null && max == null) return null;
  return `${min ?? "—"} – ${max ?? "—"} ${unit}`;
}
function prettyAction(a: string) {
  return ({ submitted: "Pending", reviewed: "Review", approved: "Approved", rejected: "Rejected", revoked: "Draft" } as any)[a] ?? a;
}
function formatBytes(n: number | null) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function incrementRev(rev?: string) {
  if (!rev) return "Rev 1";
  const m = /(\d+)\s*$/.exec(rev);
  if (!m) return `${rev}.1`;
  return rev.replace(/\d+\s*$/, String(parseInt(m[1], 10) + 1));
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
