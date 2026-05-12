import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calcHeatInput, checkCompliance, type WpsLimits } from "@/lib/heat-input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Flame, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeatInputCalculator({
  procedureId,
  weldId,
  limits,
  compact,
}: {
  procedureId?: string;
  weldId?: string;
  limits?: WpsLimits;
  compact?: boolean;
}) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [v, setV] = useState("");
  const [i, setI] = useState("");
  const [ts, setTs] = useState("");
  const [busy, setBusy] = useState(false);

  const vN = parseFloat(v), iN = parseFloat(i), tsN = parseFloat(ts);
  const hi = useMemo(() => calcHeatInput(vN, iN, tsN), [vN, iN, tsN]);
  const check = useMemo(
    () => (limits ? checkCompliance(vN, iN, tsN, hi, limits) : { ok: true, issues: [] }),
    [vN, iN, tsN, hi, limits],
  );
  const ready = vN > 0 && iN > 0 && tsN > 0;

  const save = async () => {
    if (!profile?.company_id || !ready) return;
    setBusy(true);
    const { error } = await supabase.from("heat_inputs").insert({
      company_id: profile.company_id,
      procedure_id: procedureId ?? null,
      weld_id: weldId ?? null,
      voltage: vN, current_amp: iN, travel_speed: tsN,
      heat_input: Number(hi.toFixed(4)),
      within_limits: check.ok,
      created_by: user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Heat input saved");
    setV(""); setI(""); setTs("");
    qc.invalidateQueries({ queryKey: ["heat_inputs"] });
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 space-y-4", compact && "p-3")}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Flame className="size-4 text-primary" /> Heat Input Calculator
        <span className="text-xs text-muted-foreground ms-auto">
          (V × I × 60) / (Travel × 1000)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Voltage (V)</Label>
          <Input type="number" step="0.1" value={v} onChange={(e) => setV(e.target.value)} placeholder="e.g. 22" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Current (A)</Label>
          <Input type="number" step="0.1" value={i} onChange={(e) => setI(e.target.value)} placeholder="e.g. 180" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Travel speed (mm/min)</Label>
          <Input type="number" step="0.1" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="e.g. 250" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 border border-border px-4 py-3">
        <div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Heat input</div>
          <div className="text-2xl font-semibold tabular-nums">
            {ready ? hi.toFixed(3) : "—"} <span className="text-sm font-normal text-muted-foreground">kJ/mm</span>
          </div>
        </div>
        {ready && limits && (
          <div className={cn(
            "flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border",
            check.ok
              ? "bg-success/10 text-success border-success/30"
              : "bg-destructive/10 text-destructive border-destructive/30",
          )}>
            {check.ok ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
            {check.ok ? "Within WPS limits" : `${check.issues.length} violation(s)`}
          </div>
        )}
        <Button size="sm" disabled={!ready || busy} onClick={save}>
          <Save className="size-4 me-1" /> Log
        </Button>
      </div>

      {ready && limits && !check.ok && (
        <ul className="text-xs text-destructive space-y-1">
          {check.issues.map((iss) => <li key={iss}>• {iss}</li>)}
        </ul>
      )}
    </div>
  );
}
