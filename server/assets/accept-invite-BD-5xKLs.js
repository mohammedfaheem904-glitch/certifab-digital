import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { k as Route, b as useAuth, a as useNavigate, s as supabase, L as Link, T as TriangleAlert, B as Button, t as toast } from "./router-DGN8uIPq.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AcceptInvite() {
  const {
    token
  } = Route.useSearch();
  const {
    session,
    loading,
    refresh
  } = useAuth();
  const nav = useNavigate();
  const [invite, setInvite] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [checking, setChecking] = reactExports.useState(true);
  const [accepting, setAccepting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!token) {
      setError("Missing invitation token.");
      setChecking(false);
      return;
    }
    (async () => {
      const {
        data,
        error: error2
      } = await supabase.rpc("get_invitation", {
        _token: token
      });
      const row = data?.[0] ?? null;
      if (error2 || !row) {
        setError("This invitation link is invalid.");
      } else if (row.accepted_at) {
        setError("This invitation has already been used.");
      } else if (new Date(row.expires_at) < /* @__PURE__ */ new Date()) {
        setError("This invitation has expired. Ask your admin to send a new one.");
      } else {
        setInvite(row);
      }
      setChecking(false);
    })();
  }, [token]);
  const accept = async () => {
    if (!token) return;
    setAccepting(true);
    const {
      error: error2
    } = await supabase.rpc("accept_invitation", {
      _token: token
    });
    setAccepting(false);
    if (error2) return toast.error(error2.message);
    toast.success(`Joined ${invite?.company_name}`);
    await refresh();
    nav({
      to: "/app"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center p-6 bg-[image:var(--gradient-surface)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Weld Yard" })
    ] }),
    checking || loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
      " Verifying invitation…"
    ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-5 text-destructive shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold", children: "Invitation unavailable" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: error })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Back to sign in" }) })
    ] }) : invite ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-6 text-primary mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-semibold tracking-tight", children: [
          "Join ",
          invite.company_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          invite.invited_by_name ? `${invite.invited_by_name} invited` : "You were invited",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: invite.email }),
          " as",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: invite.role.replace(/_/g, " ") }),
          "."
        ] })
      ] }),
      session ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        session.user.email?.toLowerCase() !== invite.email.toLowerCase() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-400", children: [
          "You're signed in as ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: session.user.email }),
          ". Accepting will move this account into",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: invite.company_name }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-[image:var(--gradient-primary)] text-primary-foreground", onClick: accept, disabled: accepting, children: accepting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : `Join ${invite.company_name}` })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full bg-[image:var(--gradient-primary)] text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", search: {
          invite: token,
          email: invite.email
        }, children: "Create account & join" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", search: {
          next: `/accept-invite?token=${token}`
        }, children: "I already have an account" }) })
      ] })
    ] }) : null
  ] }) });
}
export {
  AcceptInvite as component
};
