import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { FileText, ClipboardCheck, Activity, ShieldCheck, AlertTriangle, Wrench, Gauge, BarChart3, Users, Bell, FolderOpen } from "lucide-react";

export const Route = createFileRoute("/modules")({
  head: () => ({
    meta: [
      { title: "Modules — Weld Yard DWM" },
      { name: "description", content: "Procedures, Qualifications, Welds, Inspections, NCRs, Equipment, Instruments, Reports, Team and Audit. Modular DWM, deploy what you need." },
      { property: "og:title", content: "Modules — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/modules" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/modules" }],
  }),
  component: ModulesPage,
});

const MODULES = [
  { icon: FolderOpen, n: "Projects", d: "Multi-project workspace with client, location and scope." },
  { icon: FileText, n: "WPS (Welding Procedure Specification)", d: "Versioned procedure register with approval, lock, attachments and PDF export." },
  { icon: ClipboardCheck, n: "WPQ (Welder Performance Qualification)", d: "WPQ register, scope of approval, continuity, expiry alerts." },
  { icon: Activity, n: "Weld Traceability", d: "Joint log with QR token, heat numbers, filler metals, drawing/spool/line." },
  { icon: ShieldCheck, n: "Inspections (NDT)", d: "VT, RT, UT, PT, MT outcomes with inspector and signed-off evidence." },
  { icon: AlertTriangle, n: "Non-Conformance (NCR)", d: "Status-driven NCR pipeline with root cause, CA/PA and review." },
  { icon: Wrench, n: "Equipment", d: "Welding machines with calibration, location and assignment." },
  { icon: Gauge, n: "Instruments", d: "QA/QC instruments with calibration certificates and QR verification." },
  { icon: BarChart3, n: "Reports", d: "Print-perfect PDFs and Excel exports for every register." },
  { icon: Users, n: "Team & Roles", d: "Role-based access: super-admin, QA/QC, engineer, inspector, welder, viewer." },
  { icon: Bell, n: "Notifications", d: "Email alerts for expiries, calibrations, NCR assignments and approvals." },
  { icon: Activity, n: "Audit Log", d: "Every change captured with actor, timestamp, before/after JSON." },
];

function ModulesPage() {
  return (
    <MarketingShell>
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28">
          <Eyebrow>Modules</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
            Twelve modules. One operational record.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Each module is independently useful and tightly integrated. Start with welders qualifications today, add weld traceability and NCR management as you scale.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid md:grid-cols-3 gap-5">
          {MODULES.map((m) => (
            <div key={m.n} className="rounded-xl border border-border bg-card p-6 hover:shadow-[var(--shadow-elegant)] transition-shadow">
              <div className="size-10 rounded-md grid place-items-center bg-primary/10 text-primary mb-4">
                <m.icon className="size-5" />
              </div>
              <div className="font-medium">{m.n}</div>
              <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{m.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Open the live demo workspace</h2>
          <p className="mt-3 text-muted-foreground">Click around a fully populated EPC project right now.</p>
          <Link to="/app" className="inline-block mt-6"><Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground">Launch demo</Button></Link>
        </div>
      </Section>
    </MarketingShell>
  );
}
