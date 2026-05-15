import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useQualificationBundle(qualId: string | undefined) {
  const enabled = !!qualId;
  const qualification = useQuery({
    queryKey: ["qualification", qualId],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qualifications")
        .select("*")
        .eq("id", qualId!)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  const variables = useQuery<any[]>({
    queryKey: ["qualification_variables", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await (supabase.from("qualification_variables" as any) as any)
        .select("*")
        .eq("qualification_id", qualId!)
        .order("sort_order", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const tests = useQuery<any[]>({
    queryKey: ["qualification_tests", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await (supabase.from("qualification_tests" as any) as any)
        .select("*")
        .eq("qualification_id", qualId!)
        .order("created_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const signatures = useQuery<any[]>({
    queryKey: ["qualification_signatures", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await (supabase.from("qualification_signatures" as any) as any)
        .select("*")
        .eq("qualification_id", qualId!)
        .order("signed_at", { ascending: true });
      return (data ?? []) as any[];
    },
  });

  const continuity = useQuery<any[]>({
    queryKey: ["qualification_continuity", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await (supabase.from("qualification_continuity" as any) as any)
        .select("*")
        .eq("qualification_id", qualId!)
        .order("activity_date", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const attachments = useQuery<any[]>({
    queryKey: ["qualification_attachments", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await (supabase.from("qualification_attachments" as any) as any)
        .select("*")
        .eq("qualification_id", qualId!)
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const audit = useQuery<any[]>({
    queryKey: ["qualification_audit", qualId],
    enabled,
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("table_name", "qualifications")
        .eq("record_id", qualId!)
        .order("created_at", { ascending: false })
        .limit(50);
      return (data ?? []) as any[];
    },
  });

  return { qualification, variables, tests, signatures, continuity, attachments, audit };
}
