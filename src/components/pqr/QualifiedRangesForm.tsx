import { useState, useEffect } from "react";
import { Wand2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestQualifiedRanges } from "@/lib/pqr-rules";
import { useQueryClient } from "@tanstack/react-query";

export function QualifiedRangesForm({ pqrId, ranges, pwps, disabled }: { pqrId: string; ranges: any; pwps: any | null; disabled?: boolean }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<any>(ranges ?? {});
  const [saving, setSaving] = useState(false);
  useEffect(() => { setDraft(ranges ?? {}); }, [ranges]);

  const set = (k: string, v: any) => setDraft((d: any) => ({ ...d, [k]: v }));
  const setNum = (k: string, v: string) => set(k, v === "" ? null : Number(v));

  const applySuggested = () => {
    if (!pwps) return toast.error("Link a pWPS first to compute suggested ranges.");
    setDraft({ ...draft, ...suggestQualifiedRanges(pwps) });
    toast.success("Code-suggested ranges applied (review before saving).");
  };

  const save = async () => {
    setSaving(true);
    const { error } = await (supabase.from("pqrs" as any) as any).update({ qualified_ranges: draft }).eq("id", pqrId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Qualified ranges saved.");
    qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
  };

  const field = (k: string, label: string, type: "number" | "text" = "text", unit?: string) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{unit ? <span className="text-muted-foreground"> ({unit})</span> : null}</Label>
      <Input
        type={type}
        step={type === "number" ? "0.01" : undefined}
        value={draft[k] ?? ""}
        onChange={(e) => (type === "number" ? setNum(k, e.target.value) : set(k, e.target.value))}
        disabled={disabled}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Define the variables qualified by this PQR. These ranges override the source pWPS when promoting to a WPS.
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={applySuggested} disabled={disabled || !pwps}><Wand2 className="size-4 me-1" />Use code-suggested defaults</Button>
          <Button size="sm" onClick={save} disabled={disabled || saving}>{saving ? <Loader2 className="size-4 animate-spin me-1" /> : <Save className="size-4 me-1" />}Save</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-md p-4 space-y-3">
          <div className="font-medium text-sm">Geometry</div>
          <div className="grid grid-cols-2 gap-3">
            {field("thickness_min_mm", "Thickness min", "number", "mm")}
            {field("thickness_max_mm", "Thickness max", "number", "mm")}
            {field("diameter_min_mm", "Diameter min", "number", "mm")}
            {field("diameter_max_mm", "Diameter max", "number", "mm")}
          </div>
          {field("position", "Position envelope", "text", "e.g. 1G, 2G, 6G")}
        </div>
        <div className="border rounded-md p-4 space-y-3">
          <div className="font-medium text-sm">Welding parameters</div>
          <div className="grid grid-cols-2 gap-3">
            {field("heat_input_min", "Heat input min", "number", "kJ/mm")}
            {field("heat_input_max", "Heat input max", "number", "kJ/mm")}
          </div>
          {field("p_number", "P-number qualified")}
          {field("group_number", "Group qualified")}
          {field("filler_classification", "Filler classification")}
          {field("pwht", "PWHT")}
        </div>
      </div>
    </div>
  );
}
