import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { fmtEngDate } from "@/lib/doc-number";
import { deriveQualStatus } from "@/lib/qualification-status";

export const Route = createFileRoute("/verify/qualification/$token")({
  component: VerifyQualificationPage,
});

function VerifyQualificationPage() {
  const { token } = Route.useParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await (supabase as any).rpc("get_qualification_by_qr", { _token: token });
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
          <h1 className="text-xl font-semibold">Certificate Not Found</h1>
          <p className="text-sm text-muted-foreground">
            This QR code does not match any active qualification certificate.
          </p>
        </Card>
      </div>
    );
  }

  const status = deriveQualStatus(data);
  const valid = status === "Active" || status === "Expiring Soon";

  return (
    <div className="min-h-screen bg-muted/30 grid place-items-center p-6">
      <Card className="p-8 max-w-lg w-full space-y-6">
        <div className="flex items-center gap-3">
          {data.company_logo_url && (
            <img src={data.company_logo_url} alt={data.company_name} className="h-10" />
          )}
          <div>
            <div className="text-sm text-muted-foreground">{data.company_name}</div>
            <div className="text-xs text-muted-foreground">Welder Qualification Verification</div>
          </div>
        </div>

        <div
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            valid ? "border-emerald-500/50 bg-emerald-500/5" : "border-destructive/50 bg-destructive/5"
          }`}
        >
          {valid ? (
            <ShieldCheck className="size-8 text-emerald-500" />
          ) : (
            <ShieldAlert className="size-8 text-destructive" />
          )}
          <div>
            <div className="font-semibold">{status}</div>
            <div className="text-xs text-muted-foreground">
              {valid ? "Certificate is currently valid" : "Certificate is not valid for production welding"}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
          <dt className="text-muted-foreground">Welder</dt>
          <dd className="font-medium">{data.welder_name}</dd>
          <dt className="text-muted-foreground">Employee ID</dt>
          <dd>{data.employee_id}</dd>
          <dt className="text-muted-foreground">WPQ No.</dt>
          <dd>{data.wpq_number ?? "—"}</dd>
          <dt className="text-muted-foreground">Process</dt>
          <dd>{data.process}</dd>
          <dt className="text-muted-foreground">Code</dt>
          <dd>{data.code_family ?? data.standard}</dd>
          <dt className="text-muted-foreground">Position</dt>
          <dd>{data.position_qualified ?? "—"}</dd>
          <dt className="text-muted-foreground">Qualified On</dt>
          <dd>{fmtEngDate(data.qualification_date)}</dd>
          <dt className="text-muted-foreground">Expires</dt>
          <dd>{fmtEngDate(data.expiry_date)}</dd>
        </dl>

        <p className="text-[11px] text-muted-foreground text-center">
          Verified via Weld Yard digital certificate authority
        </p>
      </Card>
    </div>
  );
}
