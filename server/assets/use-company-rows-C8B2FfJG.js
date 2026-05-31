import { r as reactExports } from "./server-BEiNT1sm.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { b as useAuth, g as useQueryClient, s as supabase } from "./router-DGN8uIPq.js";
function useCompanyRows(table, opts) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const cid = profile?.company_id;
  const key = [table, cid];
  reactExports.useEffect(() => {
    if (!cid || !opts?.realtime) return;
    const ch = supabase.channel(`rt-${table}-${cid}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table, filter: `company_id=eq.${cid}` },
      () => qc.invalidateQueries({ queryKey: key })
    ).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [cid, table, opts?.realtime]);
  return useQuery({
    queryKey: key,
    enabled: !!cid,
    queryFn: async () => {
      let q = supabase.from(table).select(opts?.select ?? "*").eq("company_id", cid);
      if (opts?.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    }
  });
}
export {
  useCompanyRows as u
};
