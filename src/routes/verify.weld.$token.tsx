import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, ShieldCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/verify/weld/$token")({
  component: VerifyWeld,
});

function VerifyWeld() {
  const { token } = Route.useParams();
  const [data, setData] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("welds")
      .select("weld_no, welder_name, status, weld_date, drawing_ref, line_no, spool_no, joint_no, base_material, heat_number, filler_metal, joint_type, inspection_status")
      .eq("qr_token", token).maybeSingle()
      .then(({ data }) => { setData(data); setLoaded(true); });
  }, [token]);

  const accepted = data?.status === "Accepted";

  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]"><Flame className="size-5 text-primary-foreground" /></div>
          <div>
            <div className="font-semibold">Weld Yard</div>
            <div className="text-[11px] text-muted-foreground">Weld traceability verification</div>
          </div>
        </div>

        {!loaded && <div className="text-sm text-muted-foreground text-center py-10">Verifying…</div>}
        {loaded && !data && (
          <div className="text-center py-8">
            <AlertTriangle className="size-10 text-destructive mx-auto mb-3" />
            <div className="font-semibold">Weld not found</div>
          </div>
        )}
        {loaded && data && (
          <>
            <div className={`rounded-lg border p-4 mb-5 ${accepted ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
              <div className="flex items-center gap-2">
                {accepted ? <ShieldCheck className="size-5 text-success" /> : <AlertTriangle className="size-5 text-warning" />}
                <div className="font-semibold">{data.status}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Inspection: {data.inspection_status ?? "—"}</div>
            </div>
            <dl className="space-y-2 text-sm">
              <Row k="Weld No." v={data.weld_no} />
              <Row k="Welder" v={data.welder_name ?? "—"} />
              <Row k="Date" v={data.weld_date} />
              <Row k="Drawing" v={data.drawing_ref ?? "—"} />
              <Row k="Line / Spool / Joint" v={`${data.line_no ?? "—"} / ${data.spool_no ?? "—"} / ${data.joint_no ?? "—"}`} />
              <Row k="Base material" v={data.base_material ?? "—"} />
              <Row k="Heat number" v={data.heat_number ?? "—"} />
              <Row k="Filler metal" v={data.filler_metal ?? "—"} />
              <Row k="Joint type" v={data.joint_type ?? "—"} />
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-border/60 py-1.5"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium text-end">{v}</dd></div>;
}
