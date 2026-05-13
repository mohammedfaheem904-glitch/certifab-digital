import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Target, Compass, Globe2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Weld Yard" },
      { name: "description", content: "Weld Yard is a Digital Welding Management System built by engineers who have lived on real fabrication sites — for the QA/QC teams who keep critical infrastructure safe." },
      { property: "og:title", content: "About — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <MarketingShell>
      <section>
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 md:pt-28">
          <Eyebrow>About</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Built by people who've stood in front of a weld test rejection.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Weld Yard exists because the people doing welding QA/QC deserve better than three spreadsheets, two binders and an email thread per joint. We build for the engineers, inspectors and managers who keep refineries, pipelines and power plants safe.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Our mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Make industrial welding QA/QC fully digital, fully traceable, and fully auditable — without forcing teams to abandon the standards their inspectors actually cite. Every joint, every NDT result, every calibration certificate should be one query away.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">How we build</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We work alongside QA/QC managers from oil & gas, EPC and fabrication. We ship weekly. We don't patronize our users with toy software. Every screen has been pressure-tested against the question: "Would my old inspector accept this?"
            </p>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-4 gap-5">
          {[
            { icon: Target, n: "Field-tested", d: "Designed with inspectors on real projects." },
            { icon: ShieldCheck, n: "Standards-first", d: "ASME, EN, AWS, API, JIS, NORSOK." },
            { icon: Compass, n: "Audit-ready", d: "Every change captured, every record signed." },
            { icon: Globe2, n: "Bilingual", d: "EN / AR with full RTL support." },
          ].map((v) => (
            <div key={v.n} className="rounded-xl border border-border bg-card p-5">
              <v.icon className="size-5 text-primary mb-3" />
              <div className="font-medium">{v.n}</div>
              <div className="text-sm text-muted-foreground mt-1">{v.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight">Want to help shape the next release?</h2>
          <p className="mt-3 text-muted-foreground">
            We're actively running pilots with EPC contractors and fabrication shops. If you have an opinion on how welding QA/QC should work, we'd like to hear it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/demo"><Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground">Request a pilot</Button></Link>
            <Link to="/contact"><Button size="lg" variant="outline">Get in touch</Button></Link>
          </div>
        </div>
      </Section>
    </MarketingShell>
  );
}
