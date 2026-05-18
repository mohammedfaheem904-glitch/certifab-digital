import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { fmtEngDate } from "@/lib/doc-number";

export const Route = createFileRoute("/verify/wps/$token")({
  component: VerifyWpsPage,
});

function VerifyWpsPage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any).rpc("get_wps_by_qr", { _token: token });
      if (!error && data && data[0]) setData(data[0]);
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="p-8 max-w-md text-center space-y-3">
          <ShieldAlert className="size-10 mx-auto text-destructive" />
          <h1 className="text-xl font-semibold">WPS Not Found</h1>
          <p className="text-sm text-muted-foreground">
            This QR code does not match any active Welding Procedure Specification.
          </p>
        </Card>
      </div>
    );
  }

  const valid = data.status === "Approved";

  return (
    <div className="min-h-screen bg-muted/30 grid place-items-center p-6">
      <Card className="p-8 max-w-lg w-full space-y-6">
        <div className="flex items-center gap-3">
          {data.company_logo_url && (
            <img src={data.company_logo_url} alt={data.company_name} className="h-10" />
          )}
          <div>
            <div className="text-sm text-muted-foreground">{data.company_name}</div>
            <div className="text-xs text-muted-foreground">WPS Document Verification</div>
          </div>
        </div>

        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            valid ? "border-emerald-500/50 bg-emerald-500/5" : "border-amber-500/50 bg-amber-500/5"
          }`}
        >
          {valid ? (
            <ShieldCheck className="size-8 text-emerald-500" />
          ) : (
            <ShieldAlert className="size-8 text-amber-500" />
          )}
          <div>
            <div className="font-semibold">{data.status}</div>
            <div className="text-xs text-muted-foreground">
              {valid ? "Procedure is approved for production" : "Procedure not yet approved for production"}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
          <dt className="text-muted-foreground">WPS Code</dt>
          <dd className="font-medium">{data.code}</dd>
          <dt className="text-muted-foreground">WPS No.</dt>
          <dd>{data.wps_no ?? "—"}</dd>
          <dt className="text-muted-foreground">Supporting PQR</dt>
          <dd>{data.pqr_no ?? "—"}</dd>
          <dt className="text-muted-foreground">Document No.</dt>
          <dd>{data.document_no ?? "—"}</dd>
          <dt className="text-muted-foreground">Process</dt>
          <dd>{data.process}</dd>
          <dt className="text-muted-foreground">Standard</dt>
          <dd>{data.standard}</dd>
          <dt className="text-muted-foreground">Groove</dt>
          <dd>{data.groove_type ?? "—"}</dd>
          <dt className="text-muted-foreground">Position</dt>
          <dd>{data.position_qualified ?? "—"}</dd>
          <dt className="text-muted-foreground">Revision</dt>
          <dd>{data.revision}</dd>
          <dt className="text-muted-foreground">Effective</dt>
          <dd>{data.wps_date ? fmtEngDate(data.wps_date) : "—"}</dd>
        </dl>

        <p className="text-[11px] text-muted-foreground text-center">
          Verified via Weld Yard digital certificate authority
        </p>
      </Card>
    </div>
  );
}
