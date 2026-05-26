import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Loader2, Save, ShieldCheck, CheckCircle2, XCircle, ArrowUpRightFromSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { promotePqrToWps } from "@/lib/pqr-promotion.client";

type Pqr = {
  id: string;
  company_id: string;
  pqr_no: string;
  pwps_id: string | null;
  revision: string;
  status: string;
  code_family: string;
  standard: string | null;
  test_date: string | null;
  qualification_date: string | null;
  expiry_date: string | null;
  overall_result: "Pending" | "Passed" | "Failed" | "Inconclusive";
  evaluator_name: string | null;
  evaluator_id: string | null;
  qualified_ranges: any;
  remarks: string | null;
  resulting_wps_id: string | null;
};

export const Route = createFileRoute("/app/pqrs/$pqrId")({
  component: PqrDetailPage,
});

const RESULT_TONE: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Passed: "bg-success/15 text-success border-success/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  Inconclusive: "bg-warning/15 text-warning border-warning/30",
};

function PqrDetailPage() {
  const { pqrId } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { roles, profile, user } = useAuth();
  const isEditor = roles.some((r) =>
    ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r),
  );

  const { data, isLoading } = useQuery<Pqr | null>({
    queryKey: ["pqr", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("pqrs" as any) as any)
        .select("*")
        .eq("id", pqrId)
        .maybeSingle();
      if (error) throw error;
      return data as Pqr | null;
    },
  });

  const [draft, setDraft] = useState<Partial<Pqr>>({});
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  const merged = useMemo(() => ({ ...(data ?? {}), ...draft }) as Pqr, [data, draft]);
  const set = (k: keyof Pqr, v: any) => setDraft((d) => ({ ...d, [k]: v }));

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin me-2 inline" /> Loading PQR…
      </div>
    );
  }
  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">PQR not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => nav({ to: "/app/pqrs" })}>
          Back to list
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!Object.keys(draft).length) return toast.info("Nothing to save.");
    setSaving(true);
    const { error } = await (supabase.from("pqrs" as any) as any).update(draft).eq("id", pqrId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("PQR saved.");
    setDraft({});
    qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    qc.invalidateQueries({ queryKey: ["pqrs"] });
  };

  const markPassed = async () => {
    if (!data.pwps_id) {
      toast.error("Link a pWPS first — promotion requires a source pWPS.");
      return;
    }
    setBusy(true);
    const update: any = {
      overall_result: "Passed",
      status: "Passed",
      qualification_date: new Date().toISOString().slice(0, 10),
      evaluator_id: user?.id ?? null,
      evaluator_name: profile?.display_name ?? null,
    };
    const { error } = await (supabase.from("pqrs" as any) as any).update(update).eq("id", pqrId);
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    // Auto-promote to draft WPS
    try {
      const { procedureId, created } = await promotePqrToWps(pqrId);
      toast.success(created ? "PQR Passed — Draft WPS created in Procedures." : "PQR Passed — WPS already existed.");
      qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
      qc.invalidateQueries({ queryKey: ["pqrs"] });
      qc.invalidateQueries({ queryKey: ["company-rows", "procedures"] });
      nav({ to: "/app/procedures/$procedureId", params: { procedureId } });
    } catch (e: any) {
      toast.error(`Saved as Passed, but WPS creation failed: ${e.message}`);
      qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    } finally {
      setBusy(false);
    }
  };

  const markFailed = async () => {
    setBusy(true);
    const { error } = await (supabase.from("pqrs" as any) as any)
      .update({ overall_result: "Failed", status: "Failed" })
      .eq("id", pqrId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("PQR marked as Failed.");
    qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    qc.invalidateQueries({ queryKey: ["pqrs"] });
  };

  const openResultingWps = () => {
    if (!data.resulting_wps_id) return;
    nav({ to: "/app/procedures/$procedureId", params: { procedureId: data.resulting_wps_id } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" onClick={() => nav({ to: "/app/pqrs" })} className="mb-2 -ms-2">
            <ArrowLeft className="size-4 me-1" /> Back to PQRs
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{data.pqr_no}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className={RESULT_TONE[merged.overall_result] ?? ""}>{merged.overall_result}</Badge>
            <span className="text-xs text-muted-foreground">{data.revision} · {data.code_family}</span>
            {data.qualification_date && (
              <span className="text-xs text-muted-foreground">
                Qualified {new Date(data.qualification_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditor && Object.keys(draft).length > 0 && (
            <Button onClick={handleSave} disabled={saving} variant="outline">
              {saving ? <Loader2 className="size-4 animate-spin me-1" /> : <Save className="size-4 me-1" />}
              Save changes
            </Button>
          )}
          {isEditor && merged.overall_result !== "Passed" && merged.overall_result !== "Failed" && (
            <>
              <Button onClick={markFailed} disabled={busy} variant="outline" className="text-destructive border-destructive/40">
                <XCircle className="size-4 me-1" /> Mark Failed
              </Button>
              <Button onClick={markPassed} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin me-1" /> : <CheckCircle2 className="size-4 me-1" />}
                Mark Passed & Promote to WPS
              </Button>
            </>
          )}
          {data.resulting_wps_id && (
            <Button onClick={openResultingWps} variant="outline">
              <ArrowUpRightFromSquare className="size-4 me-1" /> Open resulting WPS
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ranges">Qualified Ranges</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Identification</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Field label="PQR number">
                  <Input value={merged.pqr_no ?? ""} onChange={(e) => set("pqr_no", e.target.value)} disabled={!isEditor} />
                </Field>
                <Field label="Standard">
                  <Input value={merged.standard ?? ""} onChange={(e) => set("standard", e.target.value)} disabled={!isEditor} />
                </Field>
                <Field label="Code family">
                  <Input value={merged.code_family ?? ""} onChange={(e) => set("code_family", e.target.value)} disabled={!isEditor} />
                </Field>
                <Field label="Revision">
                  <Input value={merged.revision ?? ""} onChange={(e) => set("revision", e.target.value)} disabled={!isEditor} />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Dates & evaluator</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Field label="Test date">
                  <Input type="date" value={merged.test_date ?? ""} onChange={(e) => set("test_date", e.target.value || null)} disabled={!isEditor} />
                </Field>
                <Field label="Qualification date">
                  <Input type="date" value={merged.qualification_date ?? ""} onChange={(e) => set("qualification_date", e.target.value || null)} disabled={!isEditor} />
                </Field>
                <Field label="Expiry date">
                  <Input type="date" value={merged.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value || null)} disabled={!isEditor} />
                </Field>
                <Field label="Evaluator">
                  <Input value={merged.evaluator_name ?? ""} onChange={(e) => set("evaluator_name", e.target.value)} disabled={!isEditor} />
                </Field>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="size-4" /> Remarks</CardTitle></CardHeader>
              <CardContent>
                <Textarea rows={4} value={merged.remarks ?? ""} onChange={(e) => set("remarks", e.target.value)} disabled={!isEditor} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ranges" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Qualified ranges (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">
                Edit qualified ranges as JSON. Keys like <code>thickness_min_mm</code>, <code>thickness_max_mm</code>,
                <code>diameter_min_mm</code>, <code>diameter_max_mm</code>, <code>heat_input_min</code>,
                <code>heat_input_max</code>, <code>position</code> will override pWPS values when promoting to WPS.
              </p>
              <Textarea
                rows={10}
                className="font-mono text-xs"
                value={JSON.stringify(merged.qualified_ranges ?? {}, null, 2)}
                onChange={(e) => {
                  try {
                    set("qualified_ranges", JSON.parse(e.target.value || "{}"));
                  } catch {
                    /* ignore partial JSON */
                  }
                }}
                disabled={!isEditor}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-4">
          <Card>
            <CardContent className="py-10 text-sm text-muted-foreground text-center">
              NDT and Mechanical test builders ship in the next phase. For now, attach test reports via Remarks
              and set the overall result here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
