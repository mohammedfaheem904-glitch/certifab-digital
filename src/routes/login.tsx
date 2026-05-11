import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Weld Yard" },
      { name: "description", content: "Access your Weld Yard industrial workspace." },
    ],
  }),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-[image:var(--gradient-surface)] border-e border-border relative overflow-hidden">
        <div className="absolute -top-32 -end-32 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -start-32 size-96 rounded-full bg-accent/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">{t("appName")}</div>
            <div className="text-[11px] text-muted-foreground">{t("tagline")}</div>
          </div>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight max-w-md">
            One control room for every welder, weld and project.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md">
            Trusted by EPC contractors, fabrication workshops and oil & gas operators.
          </p>
        </div>
        <div className="text-xs text-muted-foreground relative">
          ISO 9001 · ASME IX · EN ISO 3834
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/app" });
          }}
          className="w-full max-w-sm space-y-5"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("signIn")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("loginSubtitle")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" defaultValue="qaqc@weldyard.io" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" defaultValue="demo1234" required />
          </div>
          <Button
            type="submit"
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]"
          >
            {t("signIn")} <ArrowRight className="size-4 ms-1" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo workspace — any credentials sign you in.
          </p>
        </form>
      </div>
    </div>
  );
}
