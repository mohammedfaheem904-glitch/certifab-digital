import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

export function JointConfigList({ procedureId, canEdit }: { procedureId: string; canEdit: boolean }) {
  const qc = useQueryClient();
  const { profile } = useAuth();
  const queryKey = ["wps_joint_configurations", procedureId] as const;

  const q = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wps_joint_configurations")
        .select("*")
        .eq("procedure_id", procedureId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey });

  const addJoint = async () => {
    if (!profile?.company_id) return;
    const { error } = await supabase.from("wps_joint_configurations").insert({
      company_id: profile.company_id,
      procedure_id: procedureId,
      label: `Joint ${(q.data?.length ?? 0) + 1}`,
      sort_order: q.data?.length ?? 0,
    });
    if (error) return toast.error(error.message);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Joint configurations</h3>
          <p className="text-xs text-muted-foreground">Multiple joints per WPS supported. Upload sketches to document each configuration.</p>
        </div>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={addJoint}><Plus className="size-4 me-1" />Add joint</Button>
        )}
      </div>

      {q.isLoading && <div className="text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin inline me-2" />Loading…</div>}
      {!q.isLoading && (q.data ?? []).length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No joint configurations yet.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {(q.data ?? []).map((j) => (
          <JointCard key={j.id} joint={j} canEdit={canEdit} onChange={refresh} />
        ))}
      </div>
    </div>
  );
}

function JointCard({ joint, canEdit, onChange }: { joint: any; canEdit: boolean; onChange: () => void }) {
  const { profile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [sketchUrl, setSketchUrl] = useState<string | null>(null);

  // Resolve sketch URL on mount/change
  useState(() => {
    let cancelled = false;
    (async () => {
      if (!joint.sketch_path) { setSketchUrl(null); return; }
      const { data } = await supabase.storage.from("wps-sketches").createSignedUrl(joint.sketch_path, 600);
      if (!cancelled) setSketchUrl(data?.signedUrl ?? null);
    })();
    return () => { cancelled = true; };
  });

  const update = async (patch: Record<string, any>) => {
    const { error } = await (supabase.from("wps_joint_configurations") as any).update(patch).eq("id", joint.id);
    if (error) return toast.error(error.message);
    onChange();
  };

  const onUpload = async (file: File) => {
    if (!profile?.company_id) return;
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "png";
    const path = `${profile.company_id}/${joint.id}/${Date.now()}.${ext}`;
    const up = await supabase.storage.from("wps-sketches").upload(path, file, { upsert: true });
    if (up.error) { setUploading(false); return toast.error(up.error.message); }
    if (joint.sketch_path && joint.sketch_path !== path) {
      await supabase.storage.from("wps-sketches").remove([joint.sketch_path]);
    }
    await update({ sketch_path: path });
    const { data } = await supabase.storage.from("wps-sketches").createSignedUrl(path, 600);
    setSketchUrl(data?.signedUrl ?? null);
    setUploading(false);
    toast.success("Sketch uploaded");
  };

  const removeJoint = async () => {
    if (!confirm("Delete this joint configuration?")) return;
    if (joint.sketch_path) await supabase.storage.from("wps-sketches").remove([joint.sketch_path]);
    const { error } = await supabase.from("wps_joint_configurations").delete().eq("id", joint.id);
    if (error) return toast.error(error.message);
    onChange();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Input
          defaultValue={joint.label ?? ""}
          placeholder="Joint label"
          disabled={!canEdit}
          className="font-medium"
          onBlur={(e) => { if (e.target.value !== (joint.label ?? "")) update({ label: e.target.value || null }); }}
        />
        {canEdit && (
          <Button size="icon" variant="ghost" onClick={removeJoint}><Trash2 className="size-4 text-destructive" /></Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Groove type" defaultValue={joint.groove_type} disabled={!canEdit} onSave={(v) => update({ groove_type: v })}
          options={["Square Groove","V-Groove","Bevel Groove","U-Groove","J-Groove","Flare-V Groove","Flare-Bevel Groove","Scarf Groove","Other"]} />
        <Field label="Joint type" defaultValue={joint.joint_type} disabled={!canEdit} onSave={(v) => update({ joint_type: v })} />
        <Field label="Progression" defaultValue={joint.welding_progression} disabled={!canEdit} onSave={(v) => update({ welding_progression: v })} />
        <SelectField label="Position" defaultValue={joint.position_qualified} disabled={!canEdit} onSave={(v) => update({ position_qualified: v })} options={positionOptions} />
        <Field label="Pipe / Plate" defaultValue={joint.pipe_or_plate} disabled={!canEdit} onSave={(v) => update({ pipe_or_plate: v })} />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Notes</Label>
        <Textarea
          defaultValue={joint.notes ?? ""}
          disabled={!canEdit}
          rows={2}
          onBlur={(e) => { if (e.target.value !== (joint.notes ?? "")) update({ notes: e.target.value || null }); }}
        />
      </div>

      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
        {sketchUrl ? (
          <img src={sketchUrl} alt="Joint sketch" className="max-h-48 mx-auto object-contain" />
        ) : (
          <div className="text-center text-xs text-muted-foreground py-6 flex flex-col items-center gap-1">
            <ImageIcon className="size-5" /> No sketch uploaded
          </div>
        )}
        {canEdit && (
          <div className="mt-2 flex justify-center">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.svg"
              hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
            />
            <Button size="sm" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? <Loader2 className="size-4 animate-spin me-1" /> : <Upload className="size-4 me-1" />}
              {sketchUrl ? "Replace sketch" : "Upload sketch"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, defaultValue, disabled, onSave }: { label: string; defaultValue: any; disabled: boolean; onSave: (v: string | null) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        defaultValue={defaultValue ?? ""}
        disabled={disabled}
        className="h-8 text-sm"
        onBlur={(e) => { if (e.target.value !== (defaultValue ?? "")) onSave(e.target.value || null); }}
      />
    </div>
  );
}

function SelectField({ label, defaultValue, disabled, onSave, options }: { label: string; defaultValue: any; disabled: boolean; onSave: (v: string | null) => void; options: string[] }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <select
        defaultValue={defaultValue ?? ""}
        disabled={disabled}
        className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onBlur={(e) => { if (e.target.value !== (defaultValue ?? "")) onSave(e.target.value || null); }}
      >
        <option value="">— Select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
