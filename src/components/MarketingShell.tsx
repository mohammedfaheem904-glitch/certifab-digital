import { ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X, ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { BrandLogo } from "@/components/BrandLogo";

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/modules", label: "Modules" },
  { to: "/industries", label: "Industries" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function MarketingShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo className="size-9" />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight"><Wordmark /></div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">DWM</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/demo">
              <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
                Request demo <ArrowRight className="size-4 ms-1" />
              </Button>
            </Link>
            <button
              type="button"
              className="lg:hidden ms-1 size-9 grid place-items-center rounded-md border border-border"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-sm">Sign in</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4 text-sm">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <BrandLogo className="size-8" />
              <span className="font-semibold"><Wordmark /></span>
            </div>
            <p className="text-muted-foreground">
              The operating system for industrial welding QA/QC.
            </p>
          </div>
          <FooterCol title="Product" links={[
            { to: "/features", label: "Features" },
            { to: "/modules", label: "Modules" },
            { to: "/pricing", label: "Pricing" },
            { to: "/demo", label: "Request a demo" },
          ]} />
          <FooterCol title="Industries" links={[
            { to: "/industries", label: "Oil & Gas" },
            { to: "/industries", label: "EPC Contractors" },
            { to: "/industries", label: "Fabrication Shops" },
            { to: "/industries", label: "Power & Utilities" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/login", label: "Sign in" },
          ]} />
        </div>
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} <Wordmark />. All rights reserved.</div>
            <div className="flex items-center gap-3">
              <span>pWPS → PQR → WPS →&nbsp;WPQ → Weld Log → Inspection → NCR → Closed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-foreground mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to as any} className="text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Section({
  tone = "dark",
  className = "",
  children,
}: {
  tone?: "dark" | "light";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${tone === "light" ? "marketing-light" : ""} ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-card/60 mb-5">
      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
      <span className="uppercase tracking-widest text-muted-foreground">{children}</span>
    </div>
  );
}
