import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ShieldCheck, FileText } from "lucide-react";

export function QualificationLineageStrip({
  pwpsId,
  pqrId,
}: {
  pwpsId: string | null | undefined;
  pqrId: string | null | undefined;
}) {
  const { data: pwps } = useQuery({
    enabled: !!pwpsId,
    queryKey: ["lineage-pwps", pwpsId],
    queryFn: async () => {
      const { data } = await (supabase.from("pwps" as any) as any)
        .select("id,pwps_no,status")
        .eq("id", pwpsId)
        .maybeSingle();
      return data;
    },
  });
  const { data: pqr } = useQuery({
    enabled: !!pqrId,
    queryKey: ["lineage-pqr", pqrId],
    queryFn: async () => {
      const { data } = await (supabase.from("pqrs" as any) as any)
        .select("id,pqr_no,overall_result,qualification_date,status")
        .eq("id", pqrId)
        .maybeSingle();
      return data;
    },
  });

  if (!pwpsId && !pqrId) return null;

  return (
    <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
      <GitBranch className="size-4 text-success shrink-0" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Qualification lineage</span>
      {pwps && (
        <>
          <Link
            to="/app/pwps/$pwpsId"
            params={{ pwpsId: pwps.id }}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <FileText className="size-3.5" /> {pwps.pwps_no}
          </Link>
          <span className="text-muted-foreground">→</span>
        </>
      )}
      {pqr && (
        <>
          <Link
            to="/app/pqrs/$pqrId"
            params={{ pqrId: pqr.id }}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <ShieldCheck className="size-3.5" /> {pqr.pqr_no}
          </Link>
          <Badge
            variant="outline"
            className={
              pqr.overall_result === "Passed"
                ? "bg-success/15 text-success border-success/30"
                : pqr.overall_result === "Failed"
                  ? "bg-destructive/15 text-destructive border-destructive/30"
                  : ""
            }
          >
            {pqr.overall_result}
          </Badge>
          {pqr.qualification_date && (
            <span className="text-xs text-muted-foreground">
              qualified {new Date(pqr.qualification_date).toLocaleDateString()}
            </span>
          )}
          <span className="text-muted-foreground">→</span>
        </>
      )}
      <span className="font-medium">this WPS</span>
    </div>
  );
}
