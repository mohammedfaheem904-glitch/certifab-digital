import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
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
import { NdtTestsTable } from "@/components/pqr/NdtTestsTable";
import { MechanicalTestsTable } from "@/components/pqr/MechanicalTestsTable";
import { PqrFindingsTable } from "@/components/pqr/PqrFindingsTable";
import { QualifiedRangesForm } from "@/components/pqr/QualifiedRangesForm";
import { PqrEvaluationPanel } from "@/components/pqr/PqrEvaluationPanel";
import { PqrWorkflowStepper, type StepperStep } from "@/components/pqr/PqrWorkflowStepper";
import { evaluatePqr } from "@/lib/pqr-evaluation";

export const Route = createFileRoute("/app/pqrs/$pqrId")({
  component: PqrDetailPage,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

const RESULT_TONE: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Pass: "bg-success/15 text-success border-success/30",
  Passed: "bg-success/15 text-success border-success/30",
  Fail: "bg-destructive/15 text-destructive border-destructive/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  "N/A": "bg-muted text-muted-foreground border-border",
};

function PqrDetailPage() {
  const { pqrId } = Route.useParams();
  const nav = useNavigate();
  const { roles } = useAuth();
  const isEditor = roles.some((r) =>
    ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r),
  );

  const { data, isLoading } = useQuery<any>({
    queryKey: ["pqr", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("pqrs" as any) as any)
        .select("*")
        .eq("id", pqrId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: pwps } = useQuery<any>({
    queryKey: ["pwps-for-pqr", data?.pwps_id],
    queryFn: async () => {
      if (!data?.pwps_id) return null;
      const { data: row, error } = await (supabase.from("pwps" as any) as any)
        .select("*")
        .eq("id", data.pwps_id)
        .maybeSingle();
      if (error) throw error;
      return row;
    },
    enabled: !!data?.pwps_id,
  });

  const { data: ndt = [] } = useQuery<any[]>({
    queryKey: ["ndt", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("ndt_tests" as any) as any).select("*").eq("pqr_id", pqrId);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: mech = [] } = useQuery<any[]>({
    queryKey: ["mech", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("mechanical_tests" as any) as any).select("*").eq("pqr_id", pqrId);
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: findings = [] } = useQuery<any[]>({
    queryKey: ["findings", pqrId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("pqr_findings" as any) as any).select("*").eq("pqr_id", pqrId);
      if (error) throw error;
      return data ?? [];
    },
  });

  const evaluation = useMemo(
    () => evaluatePqr({ pqr: data ?? {}, pwps: pwps ?? null, ndt, mech, findings }),
    [data, pwps, ndt, mech, findings],
  );

  const steps: StepperStep[] = useMemo(() => {
    const overall = data?.overall_result;
    const ck = (id: string) => evaluation.checklist.find((c) => c.id === id);
    const setup = ck("pwps_linked")?.status === "pass" ? "done" : "active";
    const ndtDone = ck("ndt_coverage")?.status === "pass" && ck("ndt_results")?.status === "pass" ? "done" : ndt.length ? "active" : "todo";
    const mechDone = ck("mech_coverage")?.status === "pass" && ck("mech_results")?.status === "pass" ? "done" : mech.length ? "active" : "todo";
    const evalDone = evaluation.ready ? "done" : (ndtDone === "done" || mechDone === "done") ? "active" : "todo";
    const signed = overall === "Pass" || overall === "Passed" ? "done" : overall === "Fail" || overall === "Failed" ? "active" : evalDone === "done" ? "active" : "todo";
    return [
      { id: "setup", label: "Setup", status: setup as any },
      { id: "ndt", label: "NDT", status: ndtDone as any },
      { id: "mech", label: "Mechanical", status: mechDone as any },
      { id: "eval", label: "Evaluation", status: evalDone as any },
      { id: "sign", label: "Sign & Promote", status: signed as any },
    ];
  }, [data, evaluation, ndt.length, mech.length]);

  const [draft, setDraft] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const merged = useMemo(() => ({ ...(data ?? {}), ...draft }), [data, draft]);
  const set = (k: string, v: any) => setDraft((d: any) => ({ ...d, [k]: v }));

  if (isLoading) {
    return <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin me-2 inline" /> Loading PQR…</div>;
  }
  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">PQR not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => nav({ to: "/app/pqrs" })}>Back to list</Button>
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
  };

  const overall = data.overall_result;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" onClick={() => nav({ to: "/app/pqrs" })} className="mb-2 -ms-2">
            <ArrowLeft className="size-4 me-1" /> Back to PQRs
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{data.pqr_no}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className={RESULT_TONE[overall] ?? ""}>{overall}</Badge>
            <span className="text-xs text-muted-foreground">{data.revision} · {data.code_family}</span>
            {data.qualification_date && (
              <span className="text-xs text-muted-foreground">Qualified {new Date(data.qualification_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        {isEditor && Object.keys(draft).length > 0 && (
          <Button onClick={handleSave} disabled={saving} variant="outline">
            {saving ? <Loader2 className="size-4 animate-spin me-1" /> : <Save className="size-4 me-1" />}Save changes
          </Button>
        )}
      </div>

      <PqrWorkflowStepper steps={steps} />

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ndt">NDT ({ndt.length})</TabsTrigger>
          <TabsTrigger value="mech">Mechanical ({mech.length})</TabsTrigger>
          <TabsTrigger value="findings">Findings ({findings.filter((f: any) => !f.resolved).length})</TabsTrigger>
          <TabsTrigger value="ranges">Qualified Ranges</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Identification</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Field label="PQR number"><Input value={merged.pqr_no ?? ""} onChange={(e) => set("pqr_no", e.target.value)} disabled={!isEditor} /></Field>
                <Field label="Standard"><Input value={merged.standard ?? ""} onChange={(e) => set("standard", e.target.value)} disabled={!isEditor} /></Field>
                <Field label="Code family"><Input value={merged.code_family ?? ""} onChange={(e) => set("code_family", e.target.value)} disabled={!isEditor} /></Field>
                <Field label="Revision"><Input value={merged.revision ?? ""} onChange={(e) => set("revision", e.target.value)} disabled={!isEditor} /></Field>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Dates & evaluator</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Field label="Test date"><Input type="date" value={merged.test_date ?? ""} onChange={(e) => set("test_date", e.target.value || null)} disabled={!isEditor} /></Field>
                <Field label="Qualification date"><Input type="date" value={merged.qualification_date ?? ""} onChange={(e) => set("qualification_date", e.target.value || null)} disabled={!isEditor} /></Field>
                <Field label="Expiry date"><Input type="date" value={merged.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value || null)} disabled={!isEditor} /></Field>
                <Field label="Evaluator"><Input value={merged.evaluator_name ?? ""} onChange={(e) => set("evaluator_name", e.target.value)} disabled={!isEditor} /></Field>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base">Remarks</CardTitle></CardHeader>
              <CardContent>
                <Textarea rows={4} value={merged.remarks ?? ""} onChange={(e) => set("remarks", e.target.value)} disabled={!isEditor} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ndt" className="mt-4">
          <NdtTestsTable pqrId={pqrId} standard={data.standard} />
        </TabsContent>
        <TabsContent value="mech" className="mt-4">
          <MechanicalTestsTable pqrId={pqrId} />
        </TabsContent>
        <TabsContent value="findings" className="mt-4">
          <PqrFindingsTable pqrId={pqrId} />
        </TabsContent>
        <TabsContent value="ranges" className="mt-4">
          <QualifiedRangesForm pqrId={pqrId} ranges={data.qualified_ranges} pwps={pwps} disabled={!isEditor} />
        </TabsContent>
        <TabsContent value="evaluation" className="mt-4">
          <PqrEvaluationPanel pqrId={pqrId} pqr={data} evaluation={evaluation} canEdit={isEditor} />
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
