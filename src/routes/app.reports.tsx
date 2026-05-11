import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/ModulePage";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  "Monthly QA/QC Compliance Summary",
  "Welder Performance Report",
  "Heat Input Deviation Log",
  "NDT Inspection Outcomes",
  "Equipment Calibration Report",
  "Project Weld Map (Aramco GOSP-7)",
];

export const Route = createFileRoute("/app/reports")({
  component: () => (
    <ModulePage title="Reports" subtitle="Audit-ready reporting — export to PDF or Excel.">
      <ul className="divide-y divide-border">
        {reports.map((r) => (
          <li key={r} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/20">
            <FileText className="size-4 text-muted-foreground" />
            <div className="flex-1">{r}</div>
            <Button variant="outline" size="sm">
              <Download className="size-4 me-1" /> PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4 me-1" /> Excel
            </Button>
          </li>
        ))}
      </ul>
    </ModulePage>
  ),
});
