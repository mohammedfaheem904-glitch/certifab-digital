import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, ShieldCheck, AlertTriangle } from "lucide-react";
import { daysUntil } from "@/lib/format";

export const Route = createFileRoute("/verify/instrument/$token")({
  component: VerifyInstrument,
});

type Row = { asset_id: string; name: string; category: string; model: string | null; serial_number: string | null; manufacturer: string | null; calibration_due: string | null; status: string };

function VerifyInstrument() {
  const { token } = Route.useParams();
  const [data, setData] = useState<Row | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("instruments")
      .select("asset_id, name, category, model, serial_number, manufacturer, calibration_due, status")
      .eq("qr_token", token)
      .maybeSingle()
      .then(({ data }) => { setData(data as Row | null); setLoaded(true); });
  }, [token]);

  const d = daysUntil(data?.calibration_due);
  const valid = data && d != null && d >= 0;

  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]"><Flame className="size-5 text-primary-foreground" /></div>
          <div>
            <div className="font-semibold">Weld Yard</div>
            <div className="text-[11px] text-muted-foreground">Instrument calibration verification</div>
          </div>
        </div>

        {!loaded && <div className="text-sm text-muted-foreground text-center py-10">Verifying…</div>}
        {loaded && !data && (
          <div className="text-center py-8">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <div className="font-semibold">Instrument not found</div>
            <div className="text-xs text-muted-foreground mt-1">This QR code is invalid or has been revoked.</div>
          </div>
        )}
        {loaded && data && (
          <>
            <div className={`rounded-lg border p-4 mb-5 ${valid ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
              <div className="flex items-center gap-2">
                {valid ? <ShieldCheck className="size-5 text-success" /> : <AlertTriangle className="size-5 text-destructive" />}
                <div className="font-semibold">{valid ? "Calibration valid" : "Calibration expired"}</div>
              </div>
              {data.calibration_due && (
                <div className="text-xs text-muted-foreground mt-1">
                  {valid ? `Valid until ${data.calibration_due} (${d}d remaining)` : `Expired on ${data.calibration_due}`}
                </div>
              )}
            </div>
            <dl className="space-y-2 text-sm">
              <Field k="Asset ID" v={data.asset_id} />
              <Field k="Name" v={data.name} />
              <Field k="Category" v={data.category} />
              <Field k="Model" v={data.model ?? "—"} />
              <Field k="Serial" v={data.serial_number ?? "—"} />
              <Field k="Manufacturer" v={data.manufacturer ?? "—"} />
              <Field k="Status" v={data.status} />
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-1.5">
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-medium text-end">{v}</dd>
    </div>
  );
}
