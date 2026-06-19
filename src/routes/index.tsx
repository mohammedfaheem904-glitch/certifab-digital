import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, BarChart3, Cpu, ClipboardCheck, FileText, QrCode, Layers, Activity, Building2, Wrench, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://weldyard.com/" }],
    meta: [
      { title: "Weld Yard — Digital Welding Management System (DWMS)" },
      { name: "description", content: "Cloud DWMS for industrial welding QA/QC. Manage WPS/PQR, welders qualifications, weld traceability, NDT inspections, NCRs and equipment calibration in one platform." },
      { property: "og:title", content: "Weld Yard — Digital Welding Management" },
      { property: "og:description", content: "Replace paper and Excel with a modern industrial SaaS for welding QA/QC." },
      { property: "og:url", content: "https://weldyard.com/" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Weld Yard",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: "Digital Welding Management System for industrial QA/QC operations.",
      }),
    }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <MarketingShell>
      {/* HERO — dark */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <Eyebrow>pWPS → PQR → WPS</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl">
            The operating system for{" "}
            <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
              industrial welding
            </span>{" "}
            QA/QC.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Manage WPS, welders qualifications, weld traceability, NDT inspections,
            NCRs and equipment calibration — across every project, every site, every shift.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/demo">
              <Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
                Request a demo <ArrowRight className="size-4 ms-1" />
              </Button>
            </Link>
            <Link to="/app">
              <Button size="lg" variant="outline">Open live demo</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: "100%", l: "Audit-trail coverage" },
              { v: "5+", l: "Welding standards" },
              { v: "<1s", l: "Weld lookup via QR" },
              { v: "24/7", l: "Realtime dashboards" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border bg-card/40 p-4">
                <div className="text-2xl md:text-3xl font-semibold tracking-tight">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP — light */}
      <Section tone="light" className="border-y border-border">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Built for the standards your auditors actually check</div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-foreground/80">
            <span>ASME Section IX</span>
            <span>EN ISO 15614</span>
            <span>AWS D1.1</span>
            <span>API 1104</span>
            <span>AS/NZS 3992</span>
            <span>JIS Z 3801</span>
            <span>NORSOK M-101</span>
          </div>
        </div>
      </Section>

      {/* FEATURE GRID — light */}
      <Section tone="light">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            One platform from welder qualification to weld closeout.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Replace binders, spreadsheets and inbox approvals with a system that
            traces every joint, every NDT result, and every calibration certificate.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            { icon: FileText, title: "WPS & PQR control", body: "Author, revise and lock procedures. Heat-input engine validates every weld against the qualified range." },
            { icon: ClipboardCheck, title: "WPQ (Welder Performance Qualification)", body: "Track WPQ/PQR, expiry, scope of approval and continuity. Email reminders before lapses." },
            { icon: QrCode, title: "Weld traceability", body: "Every joint has a QR token linking welder, WPS, heat numbers, NDT results and NCRs." },
            { icon: ShieldCheck, title: "Inspections & NCRs workflow", body: "VT, RT, UT, PT, MT outcomes feed a status-driven NCR pipeline with root cause and CA/PA." },
            { icon: Gauge, title: "Calibration register", body: "Welding machines and QA/QC instruments with certificate uploads and overdue alerts." },
            { icon: BarChart3, title: "Realtime KPIs", body: "Acceptance rate, repair rate, welder performance and project burn-down — live." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 hover:shadow-[var(--shadow-elegant)] transition-shadow">
              <div className="size-10 rounded-md grid place-items-center bg-primary/10 text-primary mb-4">
                <f.icon className="size-5" />
              </div>
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* MODULES TEASER — dark */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <Eyebrow>Modules</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
                Modular by design. Deploy what you need today, expand tomorrow.
              </h2>
            </div>
            <Link to="/modules"><Button variant="outline">Explore modules <ArrowRight className="size-4 ms-1" /></Button></Link>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Layers, n: "WPS (Welding Procedure Specification)", d: "WPS / PQR" },
              { icon: ClipboardCheck, n: "Qualifications", d: "WPQ continuity" },
              { icon: Activity, n: "Welds", d: "Traceability" },
              { icon: ShieldCheck, n: "Inspections", d: "NDT outcomes" },
              { icon: FileText, n: "NCRs", d: "Root cause / CA/PA" },
              { icon: Wrench, n: "Equipment", d: "Welding machines" },
              { icon: Gauge, n: "Instruments", d: "Calibration" },
              { icon: BarChart3, n: "Reports", d: "Audit-ready PDF" },
            ].map((m) => (
              <div key={m.n} className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-5">
                <m.icon className="size-5 text-primary mb-3" />
                <div className="font-medium">{m.n}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES — light */}
      <Section tone="light">
        <Eyebrow>Industries</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          Trusted in the most regulated welding environments on earth.
        </h2>
        <div className="mt-10 grid md:grid-cols-4 gap-4">
          {[
            { icon: Building2, n: "Oil & Gas", d: "Refineries, pipelines, offshore platforms" },
            { icon: Cpu, n: "EPC Contractors", d: "Multi-project, multi-site fabrication" },
            { icon: Wrench, n: "Fabrication Shops", d: "Pressure vessels, structural steel" },
            { icon: Activity, n: "Power & Utilities", d: "Conventional, nuclear, renewables" },
          ].map((i) => (
            <div key={i.n} className="rounded-xl border border-border bg-card p-5">
              <i.icon className="size-5 text-primary mb-3" />
              <div className="font-medium">{i.n}</div>
              <div className="text-sm text-muted-foreground mt-1">{i.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIAL / QUOTE — dark */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="text-2xl md:text-3xl font-medium tracking-tight">
            “We replaced three spreadsheets, two binders and an email thread per weld.
            Our auditors got the same NCR pack in 30 seconds instead of three days.”
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            QA/QC Manager · Tier-1 EPC contractor (pilot)
          </div>
        </div>
      </section>

      {/* CTA — light */}
      <Section tone="light">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to see Weld Yard on your data?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Book a 30-minute demo. We'll walk through WPS control, weld traceability and NCR closeout on a project that looks like yours.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/demo"><Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">Request demo</Button></Link>
            <Link to="/pricing"><Button size="lg" variant="outline">See pricing</Button></Link>
          </div>
        </div>
      </Section>
    </MarketingShell>
  );
}
