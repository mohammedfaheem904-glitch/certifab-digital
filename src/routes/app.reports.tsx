import { createFileRoute, Link } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { FileText, ChevronRight } from "lucide-react";

const REPORTS = [
  { slug: "qualifications", title: "Welder Qualifications Register", desc: "Personnel certificates, expiries and continuity status." },
  { slug: "procedures", title: "WPS / PQR Register", desc: "Approved procedures with revision and standard reference." },
  { slug: "welds", title: "Weld Traceability Report", desc: "Project → weld → procedure → inspection chain." },
  { slug: "inspections", title: "Inspection Outcomes Report", desc: "VT/PT/MT/RT/UT results with defect breakdown." },
  { slug: "ncrs", title: "NCR Register", desc: "Non-conformance log with severity and status." },
  { slug: "calibration", title: "Equipment & Instruments Calibration", desc: "Calibration due / overdue across the fleet." },
];

export const Route = createFileRoute("/app/reports")({
  component: () => (
    <ModulePage title="Reports" subtitle="Audit-ready industrial reports — print to PDF or export to Excel.">
      <ul className="divide-y divide-border">
        {REPORTS.map((r) => (
          <li key={r.slug}>
            <Link to="/app/reports/$slug" params={{ slug: r.slug }} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
              <div className="size-10 rounded-lg bg-primary/10 grid place-items-center"><FileText className="size-5 text-primary" /></div>
              <div className="flex-1">
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </ModulePage>
  ),
});
