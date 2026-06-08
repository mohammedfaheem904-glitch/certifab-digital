import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ArrowRight } from "lucide-react";

export function DefectNcrTag({ link }: { link: { ncr_id: string; ncr_no: string; status: string } | null }) {
  if (!link) {
    return (
      <Badge variant="outline" className="text-muted-foreground border-dashed">
        No NCR
      </Badge>
    );
  }
  const isOpen = !["Closed", "Rejected", "Accepted As-Is"].includes(link.status);
  return (
    <Link
      to="/app/ncrs/$ncrId"
      params={{ ncrId: link.ncr_id }}
      className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 text-xs hover:bg-primary/10 transition-colors"
      aria-label={`Open ${link.ncr_no}`}
    >
      <ShieldAlert className="size-3 text-primary" />
      <span className="font-medium text-primary">{link.ncr_no}</span>
      <ArrowRight className="size-3 text-muted-foreground" />
      <Badge variant="outline" className={isOpen ? "bg-warning/10 text-warning border-warning/30" : "bg-success/10 text-success border-success/30"}>
        {link.status}
      </Badge>
    </Link>
  );
}
