import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Eraser, PenLine } from "lucide-react";

const ROLES = [
  "QC Engineer",
  "QA/QC Manager",
  "Welding Engineer",
  "Witness",
  "Examiner",
  "Client Representative",
];

export function SignaturePad({
  qualificationId,
  signatures,
  onChange,
}: {
  qualificationId: string;
  signatures: any[];
  onChange: () => void;
}) {
  const { profile, user } = useAuth();
  const ref = useRef<SignatureCanvas>(null);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [role, setRole] = useState(ROLES[0]);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!profile?.company_id || !ref.current || ref.current.isEmpty()) {
      toast.error("Please draw a signature.");
      return;
    }
    if (!name.trim()) {
      toast.error("Name required.");
      return;
    }
    setBusy(true);
    const dataUrl = ref.current.toDataURL("image/png");
    const { error } = await (supabase.from("qualification_signatures" as any) as any).insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      role,
      name: name.trim(),
      signature_data_url: dataUrl,
      actor_id: user?.id ?? null,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    ref.current.clear();
    toast.success("Signature recorded.");
    onChange();
  };

  return (
    <div className="space-y-4">
      {signatures.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {signatures.map((s) => (
            <div key={s.id} className="rounded-md border border-border p-3 bg-card">
              <div className="text-xs text-muted-foreground">{s.role}</div>
              <div className="text-sm font-medium">{s.name}</div>
              {s.signature_data_url && (
                <img src={s.signature_data_url} alt="signature" className="mt-2 h-16 object-contain bg-white rounded" />
              )}
              <div className="text-[10px] text-muted-foreground mt-1">
                {new Date(s.signed_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-md border border-border p-4 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Signatory name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="rounded-md border border-dashed border-border bg-background">
          <SignatureCanvas
            ref={ref}
            penColor="black"
            backgroundColor="white"
            canvasProps={{ className: "w-full h-32 rounded-md" }}
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => ref.current?.clear()}>
            <Eraser className="size-4 me-1" /> Clear
          </Button>
          <Button size="sm" onClick={save} disabled={busy}>
            <PenLine className="size-4 me-1" /> Sign & save
          </Button>
        </div>
      </div>
    </div>
  );
}
