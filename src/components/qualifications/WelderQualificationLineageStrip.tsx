import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { GitBranch, FileCheck2, ShieldCheck, Hammer } from "lucide-react";

type Current = "wpq" | "weld";

/**
 * Lineage strip for the Welder Qualification chain:
 *   WPS  →  WPQ  →  Weld Log
 *
 * Independent of the pWPS/PQR/WPS lineage component
 * (`QualificationLineageStrip`) used in the procedure/PQR modules.
 */
export function WelderQualificationLineageStrip({
  current,
  qualId,
  welderName,
  wpsNumber,
  weldId,
  wpsId,
}: {
  current: Current;
  qualId?: string | null;
  welderName?: string | null;
  /** WPS code/number recorded on the WPQ (text). Used when current === "wpq". */
  wpsNumber?: string | null;
  weldId?: string | null;
  /** WPS UUID recorded on the weld (procedure_id). Used when current === "weld". */
  wpsId?: string | null;
}) {
  // Resolve the WPS row (procedure) from either id or code/wps_no
  const { data: wps } = useQuery({
    enabled: !!wpsId || !!wpsNumber,
    queryKey: ["wpq-lineage-wps", wpsId ?? "", wpsNumber ?? ""],
    queryFn: async () => {
      const q = (supabase.from("procedures" as any) as any).select(
        "id,code,wps_no,status",
      );
      if (wpsId) {
        const { data } = await q.eq("id", wpsId).maybeSingle();
        return data;
      }
      const { data } = await q
        .or(`code.eq.${wpsNumber},wps_no.eq.${wpsNumber}`)
        .maybeSingle();
      return data;
    },
  });

  const resolvedWpsId = wps?.id ?? wpsId ?? null;
  const resolvedWpsCode = wps?.code ?? wps?.wps_no ?? wpsNumber ?? null;

  // WPQs: when on weld page, find WPQs matching welder + wps code
  const { data: wpqs = [] } = useQuery({
    enabled: current === "weld" && !!welderName,
    queryKey: ["wpq-lineage-wpqs", welderName ?? "", resolvedWpsCode ?? ""],
    queryFn: async () => {
      let q = (supabase.from("qualifications") as any)
        .select("id,wpq_number,welder_name,wps_number,status,result,qualification_date")
        .eq("welder_name", welderName!);
      if (resolvedWpsCode) q = q.eq("wps_number", resolvedWpsCode);
      const { data } = await q;
      return (data ?? []) as any[];
    },
  });

  // Welds: when on WPQ page, find welds matching welder + procedure
  const { data: welds = [] } = useQuery({
    enabled: current === "wpq" && !!welderName,
    queryKey: ["wpq-lineage-welds", welderName ?? "", resolvedWpsId ?? ""],
    queryFn: async () => {
      let q = (supabase.from("welds") as any)
        .select("id,weld_no,status,weld_date,procedure_id")
        .eq("welder_name", welderName!);
      if (resolvedWpsId) q = q.eq("procedure_id", resolvedWpsId);
      const { data } = await q.order("weld_date", { ascending: false }).limit(25);
      return (data ?? []) as any[];
    },
  });

  const Arrow = () => <span className="text-muted-foreground">→</span>;
  const Muted = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs italic text-muted-foreground">{children}</span>
  );

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
      <GitBranch className="size-4 text-primary shrink-0" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        Qualification lineage
      </span>

      {/* WPS node */}
      {wps ? (
        <Link
          to="/app/procedures/$procedureId"
          params={{ procedureId: wps.id }}
          className="inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <FileCheck2 className="size-3.5" /> {wps.code ?? wps.wps_no}
        </Link>
      ) : resolvedWpsCode ? (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <FileCheck2 className="size-3.5" /> {resolvedWpsCode}
        </span>
      ) : (
        <Muted>No WPS linked</Muted>
      )}

      <Arrow />

      {/* WPQ node */}
      {current === "wpq" ? (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="size-3.5" /> this WPQ
        </span>
      ) : wpqs.length > 0 ? (
        <span className="inline-flex items-center gap-2 flex-wrap">
          {wpqs.map((wpq, i) => (
            <span key={wpq.id} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground">,</span>}
              <Link
                to="/app/qualifications/$qualId"
                params={{ qualId: wpq.id }}
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                <ShieldCheck className="size-3.5" /> {wpq.wpq_number ?? "WPQ"}
              </Link>
            </span>
          ))}
        </span>
      ) : (
        <Muted>No WPQ linked</Muted>
      )}

      <Arrow />

      {/* Weld node */}
      {current === "weld" ? (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Hammer className="size-3.5" /> this Weld
        </span>
      ) : welds.length > 0 ? (
        <span className="inline-flex items-center gap-2 flex-wrap">
          {welds.slice(0, 10).map((w, i) => (
            <span key={w.id} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground">,</span>}
              <Link
                to="/app/welds/$weldId"
                params={{ weldId: w.id }}
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                <Hammer className="size-3.5" /> {w.weld_no}
              </Link>
            </span>
          ))}
          {welds.length > 10 && (
            <span className="text-xs text-muted-foreground">+{welds.length - 10} more</span>
          )}
        </span>
      ) : (
        <Muted>No welds logged yet</Muted>
      )}
    </div>
  );
}
