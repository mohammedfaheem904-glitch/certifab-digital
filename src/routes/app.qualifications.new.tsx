import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCompanyRows } from "@/lib/use-company-rows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { deriveQualificationRanges, formatRange } from "@/lib/qualification-intelligence";

export const Route = createFileRoute("/app/qualifications/new")({
  component: WpqWizard,
});

const STEPS = [
  "Identity",
  "Process & Code",
  "Test Coupon",
  "Variables",
  "Result",
  "Review",
];

const DRAFT_KEY = "wpq-wizard-draft";

function WpqWizard() {
  const { profile } = useAuth();
  const nav = useNavigate();
  const { data: wpsList = [] } = useCompanyRows<any>("procedures", {
    select: "id,wps_no,document_no,revision,status",
    order: { column: "updated_at", ascending: false },
  });
  const { data: pqrList = [] } = useCompanyRows<any>("pqrs", {
    select: "id,pqr_no,revision,status",
    order: { column: "updated_at", ascending: false },
  });
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState<Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) return JSON.parse(raw);
      } catch {/* */}
    }
    return {
      code_family: "ASME IX",
      revision: "Rev 0",
      result: "Satisfactory",
      status: "Active",
      process_type: "Manual",
      qualification_date: new Date().toISOString().slice(0, 10),
    };
  });

  const set = (k: string, val: any) => setV((s) => ({ ...s, [k]: val }));

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(v));
    toast.success("Draft saved locally.");
  };

  const validate = (): string | null => {
    if (step === 0) {
      if (!v.welder_name) return "Welder name required.";
      if (!v.employee_id) return "Employee ID required.";
    }
    if (step === 1) {
      if (!v.process) return "Process required.";
      if (!v.standard) return "Standard / Edition required.";
    }
    if (step === 2) {
      if (!v.expiry_date) return "Expiry date required.";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!profile?.company_id) return;
    const err = validate();
    if (err) { toast.error(err); return; }
    setBusy(true);
    const { data, error } = await (supabase.from("qualifications") as any)
      .insert({ ...v, company_id: profile.company_id })
      .select()
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    localStorage.removeItem(DRAFT_KEY);
    toast.success("WPQ created.");
    nav({ to: "/app/qualifications/$qualId", params: { qualId: (data as any).id } });
  };

  // intelligence preview
  const ranges = deriveQualificationRanges({
    code: (v.code_family as any) ?? "ASME IX",
    process: v.process ?? "",
    testCouponThicknessMm: Number(v.test_thickness_mm) || undefined,
    testCouponDiameterMm: Number(v.test_diameter_mm) || undefined,
    testPosition: v.position_qualified,
    isPipe: v.test_coupon_type?.toLowerCase().includes("pipe"),
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/app/qualifications" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Qualifications
        </Link>
        <span>/</span>
        <span className="text-foreground">New WPQ</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => i <= step && setStep(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition
              ${i === step ? "bg-primary text-primary-foreground" :
                i < step ? "bg-success/15 text-success border border-success/30" :
                "bg-muted text-muted-foreground"}`}
          >
            <span className="size-5 rounded-full bg-background/30 flex items-center justify-center text-[10px]">
              {i < step ? <CheckCircle2 className="size-3" /> : i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      <Card className="p-6 space-y-5">
        {step === 0 && (
          <Section title="Welder identity">
            <div className="grid sm:grid-cols-2 gap-3">
              <F label="Welder name *"><Input value={v.welder_name ?? ""} onChange={(e) => set("welder_name", e.target.value)} /></F>
              <F label="Employee ID *"><Input value={v.employee_id ?? ""} onChange={(e) => set("employee_id", e.target.value)} /></F>
              <F label="Stamp number"><Input value={v.stamp_number ?? ""} onChange={(e) => set("stamp_number", e.target.value)} /></F>
              <F label="WPQ number"><Input value={v.wpq_number ?? ""} onChange={(e) => set("wpq_number", e.target.value)} placeholder="WPQ-2026-001" /></F>
              <F label="Welder test number"><Input value={v.welder_test_number ?? ""} onChange={(e) => set("welder_test_number", e.target.value)} /></F>
              <F label="Revision"><Input value={v.revision ?? "Rev 0"} onChange={(e) => set("revision", e.target.value)} /></F>
            </div>
          </Section>
        )}

        {step === 1 && (
          <Section title="Process & code">
            <div className="grid sm:grid-cols-2 gap-3">
              <F label="Process *">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.process ?? ""} onChange={(e) => set("process", e.target.value)}>
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
              <F label="Process type">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.process_type ?? "Manual"} onChange={(e) => set("process_type", e.target.value)}>
                  <option>Manual</option>
                  <option>Semi-Automatic</option>
                  <option>Mechanized</option>
                  <option>Automatic</option>
                </select>
              </F>
              <F label="Code family">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.code_family ?? "ASME IX"} onChange={(e) => set("code_family", e.target.value)}>
                  <option>ASME IX</option><option>AWS</option><option>EN ISO</option>
                  <option>AS/NZS</option><option>JIS</option>
                </select>
              </F>
              <F label="Standard / Edition *"><Input value={v.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX 2023" /></F>
              <F label="WPS reference">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.wps_number ?? ""} onChange={(e) => set("wps_number", e.target.value)}>
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
              <F label="PQR reference">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.pqr_number ?? ""} onChange={(e) => set("pqr_number", e.target.value)}>
                  <option value="">— Select PQR —</option>
                  {pqrList.map((p: any) => (
                    p.pqr_no ? (
                      <option key={p.id} value={p.pqr_no}>
                        {p.pqr_no}{p.revision ? ` (${p.revision})` : ""}{p.status ? ` — ${p.status}` : ""}
                      </option>
                    ) : null
                  ))}
                </select>
              </F>
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section title="Test coupon & qualification range">
            <div className="grid sm:grid-cols-2 gap-3">
              <F label="Coupon type"><Input value={v.test_coupon_type ?? ""} onChange={(e) => set("test_coupon_type", e.target.value)} placeholder="Pipe 6 in. Sch 80" /></F>
              <F label="Position">
                <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={v.position_qualified ?? ""} onChange={(e) => set("position_qualified", e.target.value)}>
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
              <F label="Coupon thickness (mm)"><Input type="number" step="0.1" value={v.test_thickness_mm ?? ""} onChange={(e) => set("test_thickness_mm", e.target.value)} /></F>
              <F label="Coupon diameter (mm)"><Input type="number" step="0.1" value={v.test_diameter_mm ?? ""} onChange={(e) => set("test_diameter_mm", e.target.value)} /></F>
              <F label="Qualification date"><Input type="date" value={v.qualification_date ?? ""} onChange={(e) => set("qualification_date", e.target.value)} /></F>
              <F label="Expiry date *"><Input type="date" value={v.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value)} /></F>
            </div>

            <div className="rounded-md border border-border bg-muted/20 p-3 text-xs space-y-1">
              <div className="font-medium text-foreground mb-1">Auto-derived qualification ranges (preview)</div>
              <div>Base thickness: <span className="font-mono">{formatRange(ranges.baseThickness)}</span></div>
              <div>Deposit thickness: <span className="font-mono">{formatRange(ranges.depositThickness)}</span></div>
              <div>Diameter: <span className="font-mono">{formatRange(ranges.diameter)}</span></div>
              <div>Positions qualified: <span className="font-mono">{ranges.positions.join(", ") || "—"}</span></div>
              <div className="text-muted-foreground italic">{ranges.notes.join(" ")}</div>
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title="Variables">
            <p className="text-sm text-muted-foreground">
              The full QW-4xx variables matrix can be edited after creating the WPQ — we pre-seed
              the standard ASME IX rows on the detail page.
            </p>
          </Section>
        )}

        {step === 4 && (
          <Section title="Result">
            <div className="grid sm:grid-cols-2 gap-3">
              <F label="Result">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.result ?? "Satisfactory"} onChange={(e) => set("result", e.target.value)}>
                  <option>Satisfactory</option>
                  <option>Unsatisfactory</option>
                </select>
              </F>
              <F label="Status">
                <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                  value={v.status ?? "Active"} onChange={(e) => set("status", e.target.value)}>
                  <option>Active</option>
                  <option>Suspended</option>
                </select>
              </F>
              <F label="Remarks" className="sm:col-span-2">
                <Input value={v.remarks ?? ""} onChange={(e) => set("remarks", e.target.value)} />
              </F>
              {v.result === "Unsatisfactory" && (
                <F label="Rejection reason" className="sm:col-span-2">
                  <Input value={v.rejection_reason ?? ""} onChange={(e) => set("rejection_reason", e.target.value)} />
                </F>
              )}
            </div>
          </Section>
        )}

        {step === 5 && (
          <Section title="Review">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {Object.entries(v).filter(([, val]) => val).map(([k, val]) => (
                <div key={k} className="border-b border-border/40 pb-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="font-medium">{String(val)}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-border">
          <Button variant="ghost" onClick={saveDraft}><Save className="size-4 me-1" /> Save draft</Button>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" onClick={prev}><ArrowLeft className="size-4 me-1" /> Back</Button>}
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Next <ArrowRight className="size-4 ms-1" /></Button>
            ) : (
              <Button onClick={submit} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Create WPQ"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function F({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
