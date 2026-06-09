import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, ClipboardCheck, QrCode, Activity, Gauge, BarChart3, Users, Bell, Lock, Globe, FileSpreadsheet, Workflow, Database } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Weld Yard DWMS" },
      { name: "description", content: "Every capability you need for industrial welding QA/QC: WPS control, weld traceability, NDT inspections, NCR workflow, calibration register and realtime dashboards." },
      { property: "og:title", content: "Features — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/features" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/features" }],
  }),
  component: FeaturesPage,
});

const GROUPS = [
  {
    title: "Procedure & qualification control",
    items: [
      { icon: FileText, n: "WPS / PQR authoring", d: "Versioned procedures with revision lock, approval workflow and PDF exports." },
      { icon: ClipboardCheck, n: "Welders qualifications", d: "WPQ register with scope of approval, continuity tracking and expiry alerts." },
      { icon: Workflow, n: "Heat-input engine", d: "Automatic kJ/mm calculation from voltage, amperage and travel speed; validates against the WPS qualified range." },
    ],
  },
  {
    title: "Weld traceability & inspection",
    items: [
      { icon: QrCode, n: "QR-coded weld joints", d: "Every joint carries a unique token. Scan once for full chain — welder, WPS, heats, NDT, NCRs." },
      { icon: ShieldCheck, n: "NDT / inspection log", d: "VT, RT, UT, PT, MT outcomes with inspector signature and per-record evidence attachments." },
      { icon: FileSpreadsheet, n: "NCR pipeline", d: "Status stepper from Draft → Open → Root Cause → CA/PA → Review → Closed, with audit trail." },
    ],
  },
  {
    title: "Equipment & calibration",
    items: [
      { icon: Gauge, n: "Calibration register", d: "Welding machines + QA/QC instruments with certificate uploads and overdue alerts." },
      { icon: Bell, n: "Automated reminders", d: "Email reminders before calibrations and qualifications expire — no more surprise lapses." },
      { icon: Activity, n: "Activity timelines", d: "Every status change, reassignment and calibration is captured with actor and timestamp." },
    ],
  },
  {
    title: "Operations & analytics",
    items: [
      { icon: BarChart3, n: "Realtime dashboards", d: "Acceptance rate, repair rate, welder performance and project compliance — live, not nightly." },
      { icon: FileSpreadsheet, n: "Audit-ready reports", d: "Print-perfect PDFs for qualifications, welds, inspections, NCRs and calibration." },
      { icon: Users, n: "Roles & permissions", d: "Super-admin, QA/QC manager, welding engineer, inspector, welder, viewer." },
    ],
  },
  {
    title: "Security & enterprise",
    items: [
      { icon: Lock, n: "Multi-tenant isolation", d: "Row-level security at the database layer — every query scoped to your company." },
      { icon: Database, n: "Per-record attachments", d: "Photos, RT films, certificates — securely stored with signed URL access." },
      { icon: Globe, n: "Bilingual UI", d: "English and Arabic with full RTL support — built for the GCC." },
    ],
  },
];

function FeaturesPage() {
  return (
    <MarketingShell>
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28">
          <Eyebrow>Features</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
            Every capability your QA/QC team needs — out of the box.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Weld Yard covers the full welding lifecycle, from procedure authoring
            to weld closeout and audit. Built with the standards your inspectors actually cite.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="space-y-16">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h2 className="text-2xl font-semibold tracking-tight mb-6">{g.title}</h2>
              <div className="grid md:grid-cols-3 gap-5">
                {g.items.map((it) => (
                  <div key={it.n} className="rounded-xl border border-border bg-card p-6">
                    <div className="size-10 rounded-md grid place-items-center bg-primary/10 text-primary mb-4">
                      <it.icon className="size-5" />
                    </div>
                    <div className="font-medium">{it.n}</div>
                    <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{it.d}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">See it on your data</h2>
          <p className="mt-3 text-muted-foreground">A 30-minute walkthrough on a project that looks like yours.</p>
          <Link to="/demo" className="inline-block mt-6"><Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground">Request a demo</Button></Link>
        </div>
      </Section>
    </MarketingShell>
  );
}
