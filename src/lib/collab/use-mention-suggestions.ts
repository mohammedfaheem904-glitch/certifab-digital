import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const db = supabase as any;

export type UserSuggestion = { id: string; display_name: string | null };

export function useCompanyUsers() {
  const { profile } = useAuth();
  return useQuery<UserSuggestion[]>({
    queryKey: ["company-users", profile?.company_id],
    enabled: !!profile?.company_id,
    queryFn: async () => {
      const { data, error } = await db
        .from("profiles")
        .select("id, display_name")
        .eq("company_id", profile!.company_id)
        .eq("approval_status", "approved")
        .order("display_name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as UserSuggestion[];
    },
  });
}
