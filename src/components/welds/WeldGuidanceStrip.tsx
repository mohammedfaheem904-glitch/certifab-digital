import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { evaluateReleaseReadiness } from "@/lib/weld-readiness";
import { recommendForWeld, weldVerdict } from "@/lib/recommendations";
import { OperationalBanner } from "@/components/common/OperationalBanner";
import { RecommendedActionsCard } from "@/components/common/RecommendedActionsCard";
import {
  QuickActionDialogs,
  type QuickActionState,
} from "@/components/common/QuickActionDialogs";

/**
 * Weld Guidance Strip — banner + recommended actions panel above the tabs.
 * Self-contained: loads the same operational facts as ComplianceCenter, runs
 * the readiness engine, and turns the output into actionable recommendations
 * with one-click remediation dialogs.
 */
export function WeldGuidanceStrip({ weld }: { weld: any }) {
  const { roles } = useAuth();
  const [dialog, setDialog] = useState<QuickActionState>(null);

  const wps = useQuery({
    queryKey: ["wps-for-weld", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data as any;
    },
  });

  const wpqs = useQuery<any[]>({
    queryKey: ["wpq-options", weld.welder_name],
    queryFn: async () => {
      const q = supabase.from("qualifications").select("*");
      const { data } = weld.welder_name
        ? await q.ilike("welder_name", `%${weld.welder_name}%`).order("created_at", { ascending: false })
        : await q.order("created_at", { ascending: false }).limit(1);
      return (data ?? []) as any[];
    },
  });

  const inspections = useQuery<any[]>({
    queryKey: ["inspections-cc", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weld.id);
      return (data ?? []) as any[];
    },
  });

  const ncrs = useQuery<any[]>({
    queryKey: ["ncrs-cc", weld.id],
    queryFn: async () => {
      const { data } = await (supabase.from("ncrs" as any) as any).select("*").eq("weld_id", weld.id);
      return (data ?? []) as any[];
    },
  });

  const instruments = useQuery<any[]>({
    queryKey: ["instr-cc", weld.company_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("instruments")
        .select("*")
        .order("calibration_due", { ascending: true })
        .limit(6);
      return (data ?? []) as any[];
    },
  });

  const readiness = useMemo(
    () =>
      evaluateReleaseReadiness({
        weld,
        wps: wps.data ?? null,
        wpq: wpqs.data?.[0] ?? null,
        inspections: inspections.data ?? [],
        ncrs: ncrs.data ?? [],
        instruments: instruments.data ?? [],
      }),
    [weld, wps.data, wpqs.data, inspections.data, ncrs.data, instruments.data],
  );

  const recs = useMemo(
    () => recommendForWeld({ weldId: weld.id, weld, readiness }),
    [weld, readiness],
  );

  const verdict = weldVerdict(readiness, recs);
  const topAction = recs.find((r) => r.severity === verdict.severity && r.action) ?? recs.find((r) => r.action);

  return (
    <div className="space-y-3">
      <OperationalBanner
        verdict={verdict}
        actionLabel={topAction?.action?.label}
        onAction={
          topAction?.action?.kind === "open-dialog" && topAction.action.dialog
            ? () => setDialog({ kind: topAction.action!.dialog as any, payload: topAction.action!.payload })
            : undefined
        }
        actionTo={topAction?.action?.kind === "navigate" ? topAction.action.to : undefined}
      />

      <RecommendedActionsCard
        recommendations={recs}
        roles={roles}
        onDialog={(d, p) => setDialog({ kind: d as any, payload: p })}
      />

      <QuickActionDialogs state={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
