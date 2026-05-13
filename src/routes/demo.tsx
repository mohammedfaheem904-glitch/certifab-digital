import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CheckCircle2, Calendar, Users, Workflow } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Request a demo — Weld Yard DWMS" },
      { name: "description", content: "Book a 30-minute personalized demo of Weld Yard. We'll walk through WPS control, weld traceability and NCR closeout on a project that looks like yours." },
      { property: "og:title", content: "Request a demo — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/demo" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/demo" }],
  }),
  component: DemoPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  company: z.string().trim().min(1, "Company required").max(150),
  role: z.string().trim().max(100).optional(),
  industry: z.string().min(1, "Pick an industry"),
  team_size: z.string().min(1, "Pick a team size"),
  message: z.string().trim().max(1000).optional(),
});

function DemoPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    // In a live deployment this posts to a server function / CRM webhook.
    setSubmitted(true);
    toast.success("Thanks — we'll be in touch within one business day.");
  };

  return (
    <MarketingShell>
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28 grid lg:grid-cols-2 gap-12">
          <div>
            <Eyebrow>Request a demo</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              See Weld Yard on a project that looks like yours.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              30 minutes, screen-share, no slides. We'll preload sample data that mirrors your fabrication scope and walk through the workflows your team will actually use.
            </p>
            <div className="mt-10 space-y-5">
              {[
                { icon: Calendar, n: "30-minute live walkthrough", d: "Booked within one business day." },
                { icon: Users, n: "Bring your QA/QC team", d: "Engineers, inspectors and welders welcome." },
                { icon: Workflow, n: "End with a workspace", d: "We hand you a populated tenant to keep exploring." },
              ].map((b) => (
                <div key={b.n} className="flex items-start gap-3">
                  <div className="size-9 rounded-md grid place-items-center bg-primary/10 text-primary shrink-0"><b.icon className="size-4" /></div>
                  <div>
                    <div className="font-medium">{b.n}</div>
                    <div className="text-sm text-muted-foreground">{b.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-sm text-muted-foreground">
              Prefer to explore on your own? <Link to="/app" className="text-foreground underline underline-offset-4">Open the live demo workspace</Link>.
            </div>
          </div>

          <div className="marketing-light rounded-2xl border border-border bg-card p-7 md:p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="size-12 text-primary mx-auto" />
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">Got it — talk soon.</h2>
                <p className="mt-2 text-sm text-muted-foreground">We'll reply from system@weldyard.com within one business day.</p>
                <Link to="/app" className="inline-block mt-6"><Button variant="outline">Open the demo workspace</Button></Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" placeholder="Ahmad Al-Saud" maxLength={100} required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Work email</Label>
                    <Input id="email" name="email" type="email" placeholder="ahmad@company.com" maxLength={255} required className="mt-1.5" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" maxLength={150} required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role (optional)</Label>
                    <Input id="role" name="role" placeholder="QA/QC Manager" maxLength={100} className="mt-1.5" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select name="industry" required>
                      <SelectTrigger id="industry" className="mt-1.5"><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil_gas">Oil & Gas</SelectItem>
                        <SelectItem value="epc">EPC Contractor</SelectItem>
                        <SelectItem value="fabrication">Fabrication shop</SelectItem>
                        <SelectItem value="power">Power & Utilities</SelectItem>
                        <SelectItem value="marine">Shipbuilding / Marine</SelectItem>
                        <SelectItem value="structural">Heavy Structural</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="team_size">Team size</Label>
                    <Select name="team_size" required>
                      <SelectTrigger id="team_size" className="mt-1.5"><SelectValue placeholder="Welders + inspectors" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1_25">1 – 25</SelectItem>
                        <SelectItem value="26_100">26 – 100</SelectItem>
                        <SelectItem value="101_500">101 – 500</SelectItem>
                        <SelectItem value="500_plus">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">What would you like to see? (optional)</Label>
                  <Textarea id="message" name="message" rows={4} maxLength={1000} placeholder="Specific workflows, integrations, standards, etc." className="mt-1.5" />
                </div>
                <Button type="submit" size="lg" className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground">
                  Request demo
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By submitting you agree we may contact you about Weld Yard. We never share your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
