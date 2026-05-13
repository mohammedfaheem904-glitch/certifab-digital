import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Printer, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";

export function ReportShell({
  title,
  subtitle,
  filters,
  onExportExcel,
  children,
}: {
  title: string;
  subtitle?: string;
  filters?: ReactNode;
  onExportExcel?: () => void;
  children: ReactNode;
}) {
  const { companyName, profile, user } = useAuth();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <Link to="/app/reports" className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3" /> All reports
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          {filters}
          {onExportExcel && (
            <Button variant="outline" size="sm" onClick={onExportExcel}>
              <FileSpreadsheet className="size-4 me-1" /> Excel
            </Button>
          )}
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-4 me-1" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block">
        <div className="flex items-center justify-between border-b-2 border-foreground pb-3 mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Weld Yard</div>
            <div className="text-xl font-semibold">{companyName ?? "Workspace"}</div>
          </div>
          <div className="text-end text-xs">
            <div className="font-semibold text-base">{title}</div>
            <div className="text-muted-foreground">Generated {new Date().toLocaleString()}</div>
            <div className="text-muted-foreground">By {profile?.display_name || user?.email}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden print:border-0 print:bg-transparent">
        {children}
      </div>

      <div className="hidden print:block text-[10px] text-muted-foreground text-center pt-4 border-t border-border mt-6">
        Weld Yard Digital Welding Management System · Audit-ready report · {companyName ?? ""}
      </div>
    </div>
  );
}
