import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ShieldCheck, FileText, FileCheck2 } from "lucide-react";

type Current = "pwps" | "pqr" | "wps";

export function QualificationLineageStrip({
  pwpsId,
  pqrId,
  pqrIds,
  wpsId,
  wpsIds,
  current = "wps",
}: {
  pwpsId?: string | null;
  pqrId?: string | null;
  pqrIds?: (string | null | undefined)[];
  wpsId?: string | null;
  wpsIds?: (string | null | undefined)[];
  current?: Current;
}) {
  const pqrList = (pqrIds ?? (pqrId ? [pqrId] : [])).filter(Boolean) as string[];
  const wpsList = (wpsIds ?? (wpsId ? [wpsId] : [])).filter(Boolean) as string[];

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

  const { data: pqrs = [] } = useQuery({
    enabled: pqrList.length > 0,
    queryKey: ["lineage-pqrs", pqrList.join(",")],
    queryFn: async () => {
      const { data } = await (supabase.from("pqrs" as any) as any)
        .select("id,pqr_no,overall_result,qualification_date,status,resulting_wps_id")
        .in("id", pqrList);
      return (data ?? []) as any[];
    },
  });

  // For pWPS current view, derive resulting WPS IDs from PQRs if not provided
  const derivedWpsIds = current === "pwps" && wpsList.length === 0
    ? (pqrs.map((p) => p.resulting_wps_id).filter(Boolean) as string[])
    : wpsList;

  const { data: wpsRows = [] } = useQuery({
    enabled: derivedWpsIds.length > 0,
    queryKey: ["lineage-wps", derivedWpsIds.join(",")],
    queryFn: async () => {
      const { data } = await (supabase.from("procedures" as any) as any)
        .select("id,code,wps_no,status")
        .in("id", derivedWpsIds);
      return (data ?? []) as any[];
    },
  });

  if (!pwpsId && pqrList.length === 0 && derivedWpsIds.length === 0 && current !== "pwps") return null;

  const Arrow = () => <span className="text-muted-foreground">→</span>;
  const Muted = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs italic text-muted-foreground">{children}</span>
  );

  return (
    <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
      <GitBranch className="size-4 text-success shrink-0" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">Qualification lineage</span>

      {/* pWPS node */}
      {current === "pwps" ? (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <FileText className="size-3.5" /> this pWPS
        </span>
      ) : pwps ? (
        <Link
          to="/app/pwps/$pwpsId"
          params={{ pwpsId: pwps.id }}
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <FileText className="size-3.5" /> {pwps.pwps_no}
        </Link>
      ) : (
        <Muted>No pWPS linked</Muted>
      )}

      <Arrow />

      {/* PQR node(s) */}
      {current === "pqr" ? (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="size-3.5" /> this PQR
        </span>
      ) : pqrs.length > 0 ? (
        <span className="inline-flex items-center gap-2 flex-wrap">
          {pqrs.map((pqr, i) => (
            <span key={pqr.id} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground">,</span>}
              <Link
                to="/app/pqrs/$pqrId"
                params={{ pqrId: pqr.id }}
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                <ShieldCheck className="size-3.5" /> {pqr.pqr_no}
              </Link>
              {pqr.overall_result && (
                <Badge
                  variant="outline"
                  className={
                    pqr.overall_result === "Passed" || pqr.overall_result === "Pass"
                      ? "bg-success/15 text-success border-success/30"
                      : pqr.overall_result === "Failed" || pqr.overall_result === "Fail"
                        ? "bg-destructive/15 text-destructive border-destructive/30"
                        : ""
                  }
                >
                  {pqr.overall_result}
                </Badge>
              )}
              {pqr.qualification_date && (
                <span className="text-xs text-muted-foreground">
                  {new Date(pqr.qualification_date).toLocaleDateString()}
                </span>
              )}
            </span>
          ))}
        </span>
      ) : (
        <Muted>Awaiting qualification</Muted>
      )}

      <Arrow />

      {/* WPS node(s) */}
      {current === "wps" ? (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <FileCheck2 className="size-3.5" /> this WPS
        </span>
      ) : wpsRows.length > 0 ? (
        <span className="inline-flex items-center gap-2 flex-wrap">
          {wpsRows.map((w, i) => (
            <span key={w.id} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground">,</span>}
              <Link
                to="/app/procedures/$procedureId"
                params={{ procedureId: w.id }}
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                <FileCheck2 className="size-3.5" /> {w.code ?? w.wps_no}
              </Link>
            </span>
          ))}
        </span>
      ) : (
        <Muted>No resulting WPS yet</Muted>
      )}
    </div>
  );
}
