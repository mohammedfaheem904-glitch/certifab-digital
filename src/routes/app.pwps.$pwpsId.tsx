import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouteErrorFallback, RouteNotFoundFallback } from "@/components/RouteErrorFallback";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Loader2, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  allowedPwpsTransitions,
  PWPS_STAGES,
  PWPS_STATUS_TONE,
  pwpsStageIndex,
  type PwpsStatus,
} from "@/lib/pwps-workflow";
import { CollaborationTab } from "@/components/collab/CollaborationTab";
import { calcHeatInput } from "@/lib/heat-input";
import { FillerDiameterCombobox } from "@/components/procedures/FillerDiameterCombobox";

type Pwps = {
  id: string;
  company_id: string;
  pwps_no: string;
  title: string | null;
  revision: string;
  status: PwpsStatus;
  code_family: string;
  standard: string | null;
  process: string | null;
  joint_type: string | null;
  groove_type: string | null;
  position: string | null;
  base_material: string | null;
  p_number: string | null;
  group_number: string | null;
  thickness_min_mm: number | null;
  thickness_max_mm: number | null;
  diameter_min_mm: number | null;
  diameter_max_mm: number | null;
  filler_material: string | null;
  filler_classification: string | null;
  filler_diameter_mm: string | null;
  shielding_gas: string | null;
  backing: string | null;
  preheat_min_c: number | null;
  interpass_max_c: number | null;
  pwht: string | null;
  voltage_min: number | null;
  voltage_max: number | null;
  current_min: number | null;
  current_max: number | null;
  travel_speed_min: number | null;
  travel_speed_max: number | null;
  heat_input_min: number | null;
  heat_input_max: number | null;
  polarity: string | null;
  technique_notes: string | null;
  notes: string | null;
  converted_to_procedure_id: string | null;
  qualified_at: string | null;
  rejected_at: string | null;
};

export const Route = createFileRoute("/app/pwps/$pwpsId")({
  component: PwpsDetailPage,
  errorComponent: RouteErrorFallback,
  notFoundComponent: RouteNotFoundFallback,
});

function PwpsDetailPage() {
  const { pwpsId } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { roles } = useAuth();
  const isEditor = roles.some((r) =>
    ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r),
  );

  const { data, isLoading } = useQuery<Pwps | null>({
    queryKey: ["pwps", pwpsId],
    queryFn: async () => {
      const { data, error } = await (supabase.from("pwps" as any) as any)
        .select("*")
        .eq("id", pwpsId)
        .maybeSingle();
      if (error) throw error;
      return data as Pwps | null;
    },
  });

  const [draft, setDraft] = useState<Partial<Pwps>>({});
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const merged = useMemo(() => ({ ...(data ?? {}), ...draft }) as Pwps, [data, draft]);
  const set = (k: keyof Pwps, v: any) => setDraft((d) => ({ ...d, [k]: v }));
  const setElectrical = (k: keyof Pwps, v: any) => {
    setDraft((d) => {
      const next: Partial<Pwps> = { ...d, [k]: v };
      const cur = { ...(data ?? {}), ...next } as Pwps;
      if (k === "voltage_min" || k === "current_min" || k === "travel_speed_min") {
        const hi = calcHeatInput(
          Number(cur.voltage_min) || 0,
          Number(cur.current_min) || 0,
          Number(cur.travel_speed_min) || 0,
        );
        next.heat_input_min = hi > 0 ? Number(hi.toFixed(3)) : null;
      }
      if (k === "voltage_max" || k === "current_max" || k === "travel_speed_max") {
        const hi = calcHeatInput(
          Number(cur.voltage_max) || 0,
          Number(cur.current_max) || 0,
          Number(cur.travel_speed_max) || 0,
        );
        next.heat_input_max = hi > 0 ? Number(hi.toFixed(3)) : null;
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin me-2 inline" /> Loading pWPS…
      </div>
    );
  }
  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">pWPS not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => nav({ to: "/app/pwps" })}>
          Back to list
        </Button>
      </div>
    );
  }

  const transitions = allowedPwpsTransitions(merged.status);
  const stageIdx = pwpsStageIndex(merged.status);

  const handleSave = async () => {
    if (!Object.keys(draft).length) {
      toast.info("Nothing to save.");
      return;
    }
    setSaving(true);
    const { error } = await (supabase.from("pwps" as any) as any).update(draft).eq("id", pwpsId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("pWPS saved.");
    setDraft({});
    qc.invalidateQueries({ queryKey: ["pwps", pwpsId] });
    qc.invalidateQueries({ queryKey: ["pwps"] });
  };

  const handleTransition = async (to: PwpsStatus, _label: string) => {
    setTransitioning(true);
    // Special-case: Promote to WPS — find a Passed PQR and create the procedure.
    if (to === "Converted") {
      const { data: pqrRow, error: pqrErr } = await (supabase.from("pqrs" as any) as any)
        .select("id")
        .eq("pwps_id", pwpsId)
        .eq("overall_result", "Passed")
        .order("qualification_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (pqrErr) { setTransitioning(false); return toast.error(pqrErr.message); }
      if (!pqrRow) {
        setTransitioning(false);
        return toast.error("No Passed PQR linked to this WPS. Pass a PQR first.");
      }
      try {
        const { promotePqrToWps } = await import("@/lib/pqr-promotion-runtime");
        const { procedureId } = await promotePqrToWps(pqrRow.id);
        toast.success("Promoted — opening new WPS draft");
        qc.invalidateQueries({ queryKey: ["pwps", pwpsId] });
        qc.invalidateQueries({ queryKey: ["company-rows", "procedures"] });
        nav({ to: "/app/procedures/$procedureId", params: { procedureId } });
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setTransitioning(false);
      }
      return;
    }
    const payload: Record<string, any> = { status: to };
    if (to === "Qualified") payload.qualified_at = new Date().toISOString();
    if (to === "Rejected") payload.rejected_at = new Date().toISOString();
    const { error } = await (supabase.from("pwps" as any) as any).update(payload).eq("id", pwpsId);
    setTransitioning(false);
    if (error) return toast.error(error.message);
    toast.success(`Status → ${to}`);
    qc.invalidateQueries({ queryKey: ["pwps", pwpsId] });
    qc.invalidateQueries({ queryKey: ["pwps"] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" onClick={() => nav({ to: "/app/pwps" })} className="mb-2 -ms-2">
            <ArrowLeft className="size-4 me-1" /> Back to pWPS (Preliminary Welding Procedure Specification)
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">{data.pwps_no}</h1>
          {data.title && <p className="text-sm text-muted-foreground mt-1">{data.title}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs",
                PWPS_STATUS_TONE[merged.status],
              )}
            >
              {merged.status}
            </span>
            <span className="text-xs text-muted-foreground">{data.revision}</span>
            <span className="text-xs text-muted-foreground">· {data.code_family}</span>
          </div>
        </div>
        {isEditor && (
          <Button onClick={handleSave} disabled={saving || !Object.keys(draft).length}>
            {saving ? <Loader2 className="size-4 animate-spin me-1" /> : <Save className="size-4 me-1" />}
            Save changes
          </Button>
        )}
      </div>

      {/* Workflow stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="size-4" /> Qualification workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs">
            {PWPS_STAGES.map((stage, i) => {
              const done = i < stageIdx;
              const current = i === stageIdx;
              return (
                <li key={stage} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-medium",
                      done && "bg-success/20 border-success/40 text-success",
                      current && "bg-primary/20 border-primary/40 text-primary",
                      !done && !current && "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn(current ? "font-medium" : "text-muted-foreground")}>{stage}</span>
                  {i < PWPS_STAGES.length - 1 && <span className="text-muted-foreground/60">→</span>}
                </li>
              );
            })}
          </ol>
          {isEditor && transitions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {transitions.map((t) => (
                <Button
                  key={t.to}
                  size="sm"
                  variant={t.variant ?? "default"}
                  disabled={transitioning}
                  onClick={() => handleTransition(t.to, t.label)}
                  title={t.requires}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          )}
          {merged.status === "Converted" && data.converted_to_procedure_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                nav({
                  to: "/app/procedures/$procedureId",
                  params: { procedureId: data.converted_to_procedure_id! },
                })
              }
            >
              Open resulting WPS →
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Variables */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Identification">
          <Field label="Title">
            <Input value={merged.title ?? ""} onChange={(e) => set("title", e.target.value)} disabled={!isEditor} />
          </Field>
          <Field label="Code family">
            <Input value={merged.code_family ?? ""} onChange={(e) => set("code_family", e.target.value)} disabled={!isEditor} />
          </Field>
          <Field label="Standard">
            <Input value={merged.standard ?? ""} onChange={(e) => set("standard", e.target.value)} disabled={!isEditor} />
          </Field>
          <Field label="Revision">
            <Input value={merged.revision ?? ""} onChange={(e) => set("revision", e.target.value)} disabled={!isEditor} />
          </Field>
        </Section>

        <Section title="Process & joint">
          <Field label="Process">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              value={merged.process ?? ""} onChange={(e) => set("process", e.target.value)} disabled={!isEditor}>
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
          </Field>
          <Field label="Joint type">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              value={merged.joint_type ?? ""} onChange={(e) => set("joint_type", e.target.value)} disabled={!isEditor}>
              <option value="">— Select joint type —</option>
              <option value="Butt Joint">Butt Joint</option>
              <option value="Lap Joint">Lap Joint</option>
              <option value="T-Joint">T-Joint</option>
              <option value="Corner Joint">Corner Joint</option>
              <option value="Edge Joint">Edge Joint</option>
              <option value="Flare Bevel Joint">Flare Bevel Joint</option>
              <option value="Flare V-Groove Joint">Flare V-Groove Joint</option>
              <option value="Slot Joint">Slot Joint</option>
              <option value="Plug Joint">Plug Joint</option>
              <option value="Scarf Joint">Scarf Joint</option>
              <option value="Seam Joint">Seam Joint</option>
              <option value="Spot Joint">Spot Joint</option>
              <option value="Other">Other</option>
            </select>
          </Field>
          <Field label="Groove type">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              value={merged.groove_type ?? ""} onChange={(e) => set("groove_type", e.target.value)} disabled={!isEditor}>
              <option value="">— Select groove type —</option>
              <option value="Square Groove">Square Groove</option>
              <option value="V-Groove">V-Groove</option>
              <option value="Bevel Groove">Bevel Groove</option>
              <option value="U-Groove">U-Groove</option>
              <option value="J-Groove">J-Groove</option>
              <option value="Flare-V Groove">Flare-V Groove</option>
              <option value="Flare-Bevel Groove">Flare-Bevel Groove</option>
              <option value="Scarf Groove">Scarf Groove</option>
              <option value="Other">Other</option>
            </select>
          </Field>
          <Field label="Position">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={merged.position ?? ""} onChange={(e) => set("position", e.target.value)} disabled={!isEditor}>
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
          </Field>
        </Section>

        <Section title="Base material">
          <Field label="Base material"><Input value={merged.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} disabled={!isEditor} /></Field>
          <Field label="P-Number"><Input value={merged.p_number ?? ""} onChange={(e) => set("p_number", e.target.value)} disabled={!isEditor} /></Field>
          <Field label="Group No."><Input value={merged.group_number ?? ""} onChange={(e) => set("group_number", e.target.value)} disabled={!isEditor} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Thickness min (mm)"><Input type="number" step="0.1" value={merged.thickness_min_mm ?? ""} onChange={(e) => set("thickness_min_mm", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Thickness max (mm)"><Input type="number" step="0.1" value={merged.thickness_max_mm ?? ""} onChange={(e) => set("thickness_max_mm", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Diameter min (mm)"><Input type="number" step="0.1" value={merged.diameter_min_mm ?? ""} onChange={(e) => set("diameter_min_mm", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Diameter max (mm)"><Input type="number" step="0.1" value={merged.diameter_max_mm ?? ""} onChange={(e) => set("diameter_max_mm", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
          </div>
        </Section>

        <Section title="Filler & gas">
          <Field label="Filler material">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              value={merged.filler_material ?? ""} onChange={(e) => set("filler_material", e.target.value)} disabled={!isEditor}>
              <option value="">— Select filler material —</option>
              <option value="Carbon Steel Electrodes">Carbon Steel Electrodes</option>
              <option value="Stainless Steel Electrodes">Stainless Steel Electrodes</option>
              <option value="Aluminum Fillers">Aluminum Fillers</option>
              <option value="Nickel Alloy Fillers">Nickel Alloy Fillers</option>
              <option value="Low Alloy / Cr-Mo Steel Fillers">Low Alloy / Cr-Mo Steel Fillers</option>
              <option value="Submerged Arc Welding (SAW) Wires">Submerged Arc Welding (SAW) Wires</option>
              <option value="Oxy-Fuel Rods">Oxy-Fuel Rods</option>
            </select>
          </Field>
          <Field label="Filler classification"><Input value={merged.filler_classification ?? ""} onChange={(e) => set("filler_classification", e.target.value)} disabled={!isEditor} /></Field>
          <Field label="Filler Metal Diameter (mm)">
            <FillerDiameterCombobox
              value={merged.filler_diameter_mm ?? ""}
              onChange={(v) => set("filler_diameter_mm", v)}
              disabled={!isEditor}
            />
          </Field>
          <Field label="Shielding gas">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              value={merged.shielding_gas ?? ""} onChange={(e) => set("shielding_gas", e.target.value)} disabled={!isEditor}>
              <option value="">— Select shielding gas —</option>
              <optgroup label="Inert gases (GTAW / GMAW non-ferrous)">
                <option value="Argon (Ar 100%)">Argon (Ar 100%)</option>
                <option value="Helium (He 100%)">Helium (He 100%)</option>
                <option value="Ar/He 75/25">Argon + Helium (Ar/He 75/25)</option>
                <option value="Ar/He 50/50">Argon + Helium (Ar/He 50/50)</option>
              </optgroup>
              <optgroup label="Active / mixed gases (GMAW / FCAW carbon & low-alloy steel)">
                <option value="CO2 100%">CO₂ 100%</option>
                <option value="Ar/CO2 75/25 (C25)">Ar + CO₂ (75/25) — C25</option>
                <option value="Ar/CO2 80/20">Ar + CO₂ (80/20)</option>
                <option value="Ar/CO2 90/10">Ar + CO₂ (90/10)</option>
                <option value="Ar/CO2 95/5">Ar + CO₂ (95/5)</option>
                <option value="Ar/O2 98/2">Ar + O₂ (98/2)</option>
                <option value="Ar/O2 95/5">Ar + O₂ (95/5)</option>
              </optgroup>
              <optgroup label="Tri-mix (stainless / spray transfer)">
                <option value="Ar/CO2/O2 tri-mix">Ar + CO₂ + O₂ (tri-mix)</option>
                <option value="He/Ar/CO2 tri-mix">He + Ar + CO₂ (tri-mix, stainless)</option>
              </optgroup>
              <optgroup label="Purge / backing gases">
                <option value="Argon purge">Argon purge</option>
                <option value="Nitrogen purge">Nitrogen purge</option>
                <option value="N2/H2 95/5 purge">N₂ + H₂ (95/5) purge</option>
              </optgroup>
              <optgroup label="Other">
                <option value="None (SAW/SMAW)">None (SAW / SMAW)</option>
                <option value="Other">Other (specify in notes)</option>
              </optgroup>
            </select>
          </Field>
          <Field label="Backing">
            <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={merged.backing ?? ""} onChange={(e) => set("backing", e.target.value)} disabled={!isEditor}>
              <option value="">— Select backing —</option>
              <option value="None">None</option>
              <option value="Ceramic Backing">Ceramic Backing</option>
              <option value="Steel Backing Strip">Steel Backing Strip</option>
              <option value="Copper Backing Bar">Copper Backing Bar</option>
              <option value="Consumable Insert">Consumable Insert</option>
              <option value="Argon Purge">Argon Purge</option>
              <option value="Nitrogen Purge">Nitrogen Purge</option>
              <option value="Back Gouged and Welded">Back Gouged and Welded</option>
              <option value="Back Chipped and Welded">Back Chipped and Welded</option>
            </select>
          </Field>
        </Section>

        <Section title="Electrical & thermal">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Voltage min"><Input type="number" value={merged.voltage_min ?? ""} onChange={(e) => setElectrical("voltage_min", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Voltage max"><Input type="number" value={merged.voltage_max ?? ""} onChange={(e) => setElectrical("voltage_max", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Current min"><Input type="number" value={merged.current_min ?? ""} onChange={(e) => setElectrical("current_min", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Current max"><Input type="number" value={merged.current_max ?? ""} onChange={(e) => setElectrical("current_max", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Travel min"><Input type="number" value={merged.travel_speed_min ?? ""} onChange={(e) => setElectrical("travel_speed_min", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Travel max"><Input type="number" value={merged.travel_speed_max ?? ""} onChange={(e) => setElectrical("travel_speed_max", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Heat input min (kJ/mm)"><Input type="number" step="0.01" value={merged.heat_input_min ?? ""} onChange={(e) => set("heat_input_min", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Heat input max (kJ/mm)"><Input type="number" step="0.01" value={merged.heat_input_max ?? ""} onChange={(e) => set("heat_input_max", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Polarity">
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={merged.polarity ?? ""} onChange={(e) => set("polarity", e.target.value)} disabled={!isEditor}>
                <option value="">— Select polarity —</option>
                <option value="AC">AC</option>
                <option value="DCEN (Straight Polarity)">DCEN (Straight Polarity)</option>
                <option value="DCEP (Reverse Polarity)">DCEP (Reverse Polarity)</option>
              </select>
            </Field>
            <Field label="Preheat min (°C)"><Input type="number" value={merged.preheat_min_c ?? ""} onChange={(e) => set("preheat_min_c", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="Interpass max (°C)"><Input type="number" value={merged.interpass_max_c ?? ""} onChange={(e) => set("interpass_max_c", parseFloat(e.target.value) || null)} disabled={!isEditor} /></Field>
            <Field label="PWHT">
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={merged.pwht ?? ""} onChange={(e) => set("pwht", e.target.value)} disabled={!isEditor}>
                <option value="">— Select PWHT —</option>
                <option value="None">None</option>
                <option value="Stress Relieving">Stress Relieving</option>
                <option value="Solution Annealing">Solution Annealing</option>
                <option value="Normalizing">Normalizing</option>
                <option value="Normalizing and Tempering">Normalizing and Tempering</option>
                <option value="Tempering">Tempering</option>
                <option value="Hydrogen Bake-Out">Hydrogen Bake-Out</option>
                <option value="Age Hardening">Age Hardening</option>
                <option value="Precipitation Hardening">Precipitation Hardening</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Technique & notes">
          <Field label="Technique notes">
            <Textarea rows={4} value={merged.technique_notes ?? ""} onChange={(e) => set("technique_notes", e.target.value)} disabled={!isEditor} />
          </Field>
          <Field label="General notes">
            <Textarea rows={3} value={merged.notes ?? ""} onChange={(e) => set("notes", e.target.value)} disabled={!isEditor} />
          </Field>
        </Section>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Collaboration</CardTitle>
        </CardHeader>
        <CardContent>
          <CollaborationTab entityType="pwps" entityId={pwpsId} />
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
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
