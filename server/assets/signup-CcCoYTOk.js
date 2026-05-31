import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { u as useI18n, a as useNavigate, R as Route, b as useAuth, c as useTenantBranding, L as Link, B as Button, s as supabase, t as toast } from "./router-DGN8uIPq.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Signup() {
  const {
    t
  } = useI18n();
  const nav = useNavigate();
  const {
    invite,
    email: invitedEmail
  } = Route.useSearch();
  const isInvite = !!invite;
  const {
    session,
    loading
  } = useAuth();
  const {
    branding
  } = useTenantBranding();
  const [companyName, setCompanyName] = reactExports.useState("");
  const [displayName, setDisplayName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState(invitedEmail ?? "");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && session) nav({
      to: "/app"
    });
  }, [loading, session, nav]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: {
          display_name: displayName,
          ...isInvite ? {
            invitation_token: invite
          } : {
            company_name: companyName
          }
        }
      }
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(isInvite ? "Account created. Check your inbox to confirm." : "Workspace created. Check your inbox to confirm.");
    nav({
      to: "/login"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-10 bg-[image:var(--gradient-surface)] border-e border-border relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -end-32 size-96 rounded-full bg-primary/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 relative", children: [
        branding?.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: branding.logo_url, alt: branding.name, className: "size-9 rounded-md object-cover bg-card border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: branding?.name ?? t("appName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: branding ? "Welding QA/QC workspace" : t("tagline") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight max-w-md", children: branding && !isInvite ? `Join ${branding.name}.` : isInvite ? "You've been invited to a Weld Yard workspace." : "Spin up a workspace for your fabrication yard." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-md", children: branding && !isInvite ? "Sign up with your work email to be added to the team automatically." : isInvite ? "Create your account to join the team." : "Multi-tenant by default — your data stays isolated to your company." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground relative", children: "14-day trial · no credit card" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "w-full max-w-sm space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: isInvite ? "Create your account" : branding ? `Join ${branding.name}` : "Create your workspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: isInvite ? "You'll join your inviter's workspace automatically." : branding ? "Sign up with your work email — you'll be added to the workspace automatically." : "You'll be the workspace owner." })
      ] }),
      !isInvite && !branding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Company name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: companyName, onChange: (e) => setCompanyName(e.target.value), placeholder: "Acme Welding LLC", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Your name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "Jane Doe", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, readOnly: !!invitedEmail })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("password") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), minLength: 8, required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        isInvite ? "Create account" : "Create workspace",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ms-1" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", search: invite ? {
          next: `/accept-invite?token=${invite}`
        } : void 0, className: "text-primary hover:underline", children: "Sign in" })
      ] })
    ] }) })
  ] });
}
export {
  Signup as component
};
