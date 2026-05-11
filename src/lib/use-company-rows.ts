import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Tbl = "projects" | "procedures" | "qualifications" | "welds" | "inspections" | "equipment";

export function useCompanyRows<T = any>(table: Tbl, opts?: { select?: string; order?: { column: string; ascending?: boolean } }) {
  const { profile } = useAuth();
  const cid = profile?.company_id;
  return useQuery<T[]>({
    queryKey: [table, cid],
    enabled: !!cid,
    queryFn: async () => {
      let q = supabase.from(table).select(opts?.select ?? "*").eq("company_id", cid!);
      if (opts?.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}
