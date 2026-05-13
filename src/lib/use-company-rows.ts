import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Tbl =
  | "projects"
  | "procedures"
  | "qualifications"
  | "welds"
  | "inspections"
  | "equipment"
  | "instruments"
  | "instrument_calibrations"
  | "ncrs";

export function useCompanyRows<T = any>(
  table: Tbl,
  opts?: { select?: string; order?: { column: string; ascending?: boolean }; realtime?: boolean },
) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const cid = profile?.company_id;
  const key = [table, cid];

  useEffect(() => {
    if (!cid || !opts?.realtime) return;
    const ch = supabase
      .channel(`rt-${table}-${cid}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `company_id=eq.${cid}` },
        () => qc.invalidateQueries({ queryKey: key }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, table, opts?.realtime]);

  return useQuery<T[]>({
    queryKey: key,
    enabled: !!cid,
    queryFn: async () => {
      let q = supabase.from(table as any).select(opts?.select ?? "*").eq("company_id", cid!);
      if (opts?.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}
