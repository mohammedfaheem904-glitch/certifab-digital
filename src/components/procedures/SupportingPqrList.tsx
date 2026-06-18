import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export function SupportingPqrList({ ids }: { ids: string[] | null | undefined }) {
  const clean = (ids ?? []).filter(Boolean);
  const { data } = useQuery({
    queryKey: ["supporting-pqrs", clean.sort().join(",")],
    enabled: clean.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pqrs")
        .select("id, pqr_no, status, overall_result")
        .in("id", clean);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (clean.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-sm font-medium mb-2">
        <ShieldCheck className="size-4 text-primary" />
        Supporting PQR{clean.length > 1 ? "s" : ""}
        <span className="text-xs text-muted-foreground font-normal">({clean.length})</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(data ?? []).map((p: any) => (
          <Link
            key={p.id}
            to="/app/pqrs/$pqrId"
            params={{ pqrId: p.id }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-muted text-xs"
          >
            <span className="font-medium">{p.pqr_no}</span>
            {(p.overall_result || p.status) && (
              <Badge variant="outline" className="text-[10px] py-0 h-4">
                {p.overall_result ?? p.status}
              </Badge>
            )}
            <ExternalLink className="size-3 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
