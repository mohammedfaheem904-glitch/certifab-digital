import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Weld Yard DWM" },
      { name: "description", content: "Simple, per-project pricing for industrial welding QA/QC. Pilot, Professional and Enterprise plans. Custom on-prem deployments available." },
      { property: "og:title", content: "Pricing — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/pricing" }],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Pilot",
    price: "$0",
    period: "30-day trial",
    desc: "Validate Weld Yard on a real project, with our team.",
    cta: { label: "Start pilot", to: "/demo" },
    features: ["Up to 25 welders", "1 project", "All core modules", "Email support", "Sample data preloaded"],
  },
  {
    name: "Professional",
    price: "$199",
    period: "/ month",
    desc: "For active fabrication shops and single-project EPC teams.",
    highlight: true,
    cta: { label: "Request demo", to: "/demo" },
    features: ["Up to 100 welders", "5 projects", "All modules + reports", "Email + chat support", "Custom branding on PDFs", "Bilingual UI (EN / AR)"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    desc: "Multi-project EPCs, owner-operators and regulators.",
    cta: { label: "Contact sales", to: "/contact" },
    features: ["Unlimited welders & projects", "SSO / SAML", "Dedicated tenant", "On-prem option", "SLA & priority support", "Custom integrations (ERP, IoT)"],
  },
];

function PricingPage() {
  return (
    <MarketingShell>
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Honest pricing for industrial teams.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            No per-seat surprises. Pricing is per project workspace, with unlimited inspectors and viewers on every plan.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-7 flex flex-col ${
                t.highlight
                  ? "border-primary bg-card shadow-[var(--shadow-elegant)] relative"
                  : "border-border bg-card"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="text-4xl font-semibold tracking-tight">{t.price}</div>
                <div className="text-sm text-muted-foreground">{t.period}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to={t.cta.to as any} className="mt-7">
                <Button
                  className={`w-full ${t.highlight ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : ""}`}
                  variant={t.highlight ? "default" : "outline"}
                >
                  {t.cta.label}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-sm text-muted-foreground">
          All plans include: multi-tenant isolation · audit log · email notifications · CSV / Excel / PDF exports · GDPR-aligned data handling.
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Frequently asked</h2>
          <div className="space-y-4">
            {[
              { q: "Can we self-host Weld Yard?", a: "Yes. Enterprise customers can deploy Weld Yard on their own VPC or on-prem; we provide migration tooling and a maintenance SLA." },
              { q: "Do you charge per inspector?", a: "No. Inspectors and viewers are unlimited on every plan. Pricing is per active project workspace." },
              { q: "Is data isolated between companies?", a: "Yes. Multi-tenant isolation is enforced at the database layer using row-level security. Your data never leaves your tenant." },
              { q: "Do you support Arabic?", a: "Yes — full bilingual EN / AR UI with RTL layout, Cairo font, and printed reports in either language." },
            ].map((f) => (
              <div key={f.q} className="rounded-lg border border-border bg-card p-5">
                <div className="font-medium">{f.q}</div>
                <div className="text-sm text-muted-foreground mt-1.5">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </MarketingShell>
  );
}
