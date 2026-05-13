import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Building2, Wrench, Activity, Cpu, Anchor, Factory, Zap, Hammer } from "lucide-react";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — Weld Yard DWMS" },
      { name: "description", content: "Weld Yard powers welding QA/QC across oil & gas, EPC, fabrication shops, power generation, shipbuilding and heavy structural steel." },
      { property: "og:title", content: "Industries — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/industries" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/industries" }],
  }),
  component: IndustriesPage,
});

const INDUSTRIES = [
  { icon: Building2, n: "Oil & Gas", d: "Refineries, midstream pipelines, offshore platforms.", points: ["API 1104 pipeline welds", "B31.3 process piping", "Sour-service traceability"] },
  { icon: Cpu, n: "EPC Contractors", d: "Multi-project, multi-site fabrication and erection.", points: ["Project-scoped dashboards", "Subcontractor visibility", "Client handover packs"] },
  { icon: Wrench, n: "Fabrication Shops", d: "Pressure vessels, structural steel, modular skids.", points: ["ASME U-stamp prep", "Heat-number reconciliation", "Shop-to-site continuity"] },
  { icon: Zap, n: "Power & Utilities", d: "Conventional, nuclear, hydro and renewables.", points: ["ASME III tracking", "Long-cycle qualification", "Outage repair NCRs"] },
  { icon: Anchor, n: "Shipbuilding & Marine", d: "Hull, piping and structural welds with class society oversight.", points: ["DNV / ABS / LR ready", "Block-level traceability", "Surveyor witness logs"] },
  { icon: Hammer, n: "Heavy Structural Steel", d: "Bridges, towers, cranes, mining infrastructure.", points: ["AWS D1.1 / D1.5", "Critical joint flagging", "Erection sequence audit"] },
  { icon: Factory, n: "Process Industries", d: "Petrochemical, chemical, fertilizer plants.", points: ["Material traceability", "Service-class welds", "Turnaround NCR closeout"] },
  { icon: Activity, n: "Mining & Metals", d: "Mills, conveyors, pressure equipment, structural.", points: ["Site + camp coverage", "Mobile-first inspection", "Offline-tolerant sync"] },
];

function IndustriesPage() {
  return (
    <MarketingShell>
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28">
          <Eyebrow>Industries</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
            Built for industries where one bad weld is a national headline.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Weld Yard adapts to the standards, audits and pace of your sector — from refinery turnarounds to nuclear new-build.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid md:grid-cols-2 gap-5">
          {INDUSTRIES.map((i) => (
            <div key={i.n} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="size-11 shrink-0 rounded-md grid place-items-center bg-primary/10 text-primary">
                  <i.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.n}</div>
                  <div className="text-sm text-muted-foreground mt-1">{i.d}</div>
                  <ul className="mt-3 space-y-1 text-sm">
                    {i.points.map((p) => (
                      <li key={p} className="text-muted-foreground">· {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Don't see your industry?</h2>
          <p className="mt-3 text-muted-foreground">If you weld it and audit it, we can help.</p>
          <Link to="/contact" className="inline-block mt-6"><Button size="lg" variant="outline">Talk to us</Button></Link>
        </div>
      </Section>
    </MarketingShell>
  );
}
