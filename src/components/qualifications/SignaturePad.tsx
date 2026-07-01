import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Eraser, PenLine, Upload, Trash2 } from "lucide-react";

const ROLES = [
  "QC Engineer",
  "QA/QC Manager",
  "Welding Engineer",
  "Witness",
  "Examiner",
  "Client Representative",
];

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const MAX_BYTES = 4 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

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
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [role, setRole] = useState(ROLES[0]);
  const [busy, setBusy] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const persist = async (dataUrl: string) => {
    if (!profile?.company_id) return toast.error("Missing company context.");
    if (!name.trim()) return toast.error("Name required.");
    setBusy(true);
    const { error } = await (supabase.from("qualification_signatures" as any) as any).insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      role,
      name: name.trim(),
      signature_data_url: dataUrl,
      actor_id: user?.id ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    ref.current?.clear();
    setUploadedUrl(null);
    toast.success("Signature recorded.");
    onChange();
  };

  const saveDrawn = async () => {
    if (!ref.current || ref.current.isEmpty()) return toast.error("Please draw a signature.");
    await persist(ref.current.toDataURL("image/png"));
  };

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) return toast.error("Use JPG, PNG or WebP.");
    if (file.size > MAX_BYTES) return toast.error("Max size is 4MB.");
    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedUrl(dataUrl);
    } catch {
      toast.error("Failed to read image.");
    }
  };

  const saveUploaded = async () => {
    if (!uploadedUrl) return;
    await persist(uploadedUrl);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this signature?")) return;
    const { error } = await (supabase.from("qualification_signatures" as any) as any)
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Signature deleted.");
    onChange();
  };

  return (
    <div className="space-y-4">
      {signatures.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {signatures.map((s) => (
            <div key={s.id} className="rounded-md border border-border p-3 bg-card relative group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">{s.role}</div>
                  <div className="text-sm font-medium">{s.name}</div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-60 hover:opacity-100 hover:text-destructive"
                  onClick={() => remove(s.id)}
                  aria-label="Delete signature"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {s.signature_data_url && (
                <img src={s.signature_data_url} alt="signature" className="mt-2 h-16 object-contain bg-white rounded w-full" />
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

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`rounded-md border-2 border-dashed p-3 text-center transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          {uploadedUrl ? (
            <div className="space-y-2">
              <img src={uploadedUrl} alt="preview" className="mx-auto h-20 object-contain bg-white rounded" />
              <div className="flex justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setUploadedUrl(null)}>
                  <Trash2 className="size-4 me-1" /> Remove
                </Button>
                <Button size="sm" onClick={saveUploaded} disabled={busy}>
                  <Upload className="size-4 me-1" /> Save uploaded signature
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Drag & drop a signature image here, or
              </div>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="size-4 me-1" /> Browse files
              </Button>
              <div className="text-[10px] text-muted-foreground">JPG, PNG, WebP · max 4MB</div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div className="text-xs text-muted-foreground text-center">— or draw below —</div>

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
          <Button size="sm" onClick={saveDrawn} disabled={busy}>
            <PenLine className="size-4 me-1" /> Sign & save
          </Button>
        </div>
      </div>
    </div>
  );
}
