import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Flame, ShieldCheck, BarChart3, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Weld Yard — Digital Welding Management System" },
      {
        name: "description",
        content:
          "Cloud-based welding QA/QC platform for oil & gas, EPC, and heavy industry. Manage WPS, qualifications, weld traceability and inspections.",
      },
      { property: "og:title", content: "Weld Yard — Digital Welding Management System" },
      {
        property: "og:description",
        content:
          "Replace paper and Excel with a modern industrial SaaS for welding management.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, lang, toggle } = useI18n();
  return (
    <div className="min-h-screen">
      <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/40 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">{t("appName")}</div>
            <div className="text-[11px] text-muted-foreground">{t("tagline")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggle}>
            {lang === "en" ? "العربية" : "English"}
          </Button>
          <Link to="/login">
            <Button variant="ghost" size="sm">{t("signIn")}</Button>
          </Link>
          <Link to="/app">
            <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
              Launch Console <ArrowRight className="size-4 ms-1" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="px-6 py-20 md:py-28 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-card/60 mb-6">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          ASME IX · EN ISO 15614 · AWS D1.1 · AS/NZS · JIS
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl">
          The operating system for{" "}
          <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
            industrial welding
          </span>{" "}
          QA/QC.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Manage WPS, welder qualifications, weld traceability, NDT inspections and
          equipment calibration — across every project, every site, every shift.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/app">
            <Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
              Open Live Demo <ArrowRight className="size-4 ms-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">{t("signIn")}</Button>
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: "Compliance, automated", body: "Validate every weld against the active WPS and trigger NCRs on deviation." },
            { icon: BarChart3, title: "Live KPIs", body: "Acceptance rate, repair rate, welder performance and project burn-down." },
            { icon: Cpu, title: "Built for IoT & AI", body: "Connect welding machines, ingest parameters, and predict defects." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-[image:var(--gradient-surface)] p-5">
              <f.icon className="size-5 text-primary mb-3" />
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// touch redirect to silence unused import in case
void redirect;
