import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, Section, Eyebrow } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, MessageSquare, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Weld Yard" },
      { name: "description", content: "Get in touch with Weld Yard. Sales, support, partnerships, or just feedback — we read every message." },
      { property: "og:title", content: "Contact — Weld Yard" },
      { property: "og:url", content: "https://weldyard.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://weldyard.com/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  topic: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1).max(2000),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSent(true);
    toast.success("Message sent — we'll reply shortly.");
  };

  return (
    <MarketingShell>
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl">
            Talk to a human. Same day, every day.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Sales, support, partnerships, or just feedback — pick a channel below or send us a note.
          </p>
        </div>
      </section>

      <Section tone="light">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              { icon: Mail, n: "Email", v: "system@weldyard.com", d: "All sales and support inquiries." },
              { icon: LifeBuoy, n: "Customer support", v: "support@weldyard.com", d: "Existing customers — response within 4 business hours." },
              { icon: MessageSquare, n: "Partnerships", v: "partners@weldyard.com", d: "Resellers, integrators, training providers." },
              { icon: MapPin, n: "Headquarters", v: "Riyadh, Saudi Arabia", d: "Serving the GCC, MENA and global EPC supply chain." },
            ].map((c) => (
              <div key={c.n} className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
                <div className="size-10 rounded-md grid place-items-center bg-primary/10 text-primary shrink-0"><c.icon className="size-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.n}</div>
                  <div className="font-medium mt-0.5 truncate">{c.v}</div>
                  <div className="text-sm text-muted-foreground mt-1">{c.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 md:p-8">
            {sent ? (
              <div className="text-center py-10">
                <h2 className="text-2xl font-semibold tracking-tight">Thanks — message received.</h2>
                <p className="mt-2 text-sm text-muted-foreground">We'll reply from system@weldyard.com shortly.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" maxLength={100} required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" maxLength={255} required className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="topic">Topic (optional)</Label>
                  <Input id="topic" name="topic" placeholder="Sales, support, partnership…" maxLength={100} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={6} maxLength={2000} required className="mt-1.5" />
                </div>
                <Button type="submit" size="lg" className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </MarketingShell>
  );
}
