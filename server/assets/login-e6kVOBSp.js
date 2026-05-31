import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { s as supabase, u as useI18n, a as useNavigate, e as Route, b as useAuth, c as useTenantBranding, L as Link, B as Button, t as toast } from "./router-DGN8uIPq.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var package_default = {
  version: "1.1.2"
};
var EXPECTED_MESSAGE_TYPE = "authorization_response";
var DEFAULT_OAUTH_BROKER_URL = "/~oauth/initiate";
var DEFAULT_SUPPORTED_OAUTH_ORIGINS = ["https://oauth.lovable.app", "https://lovable.dev"];
var DEFAULT_MOBILE_DEEP_LINK_REDIRECT_URI = "lovable://oauth-callback";
var DEFAULT_DESKTOP_LOCALHOST_REDIRECT_URI = "http://127.0.0.1/iframe-oauth/callback";
var POPUP_CHECK_INTERVAL_MS = 500;
var IFRAME_FALLBACK_TIMEOUT_MS = 12e4;
function startWebMessageListener(supportedOrigins) {
  let resolvePromise;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });
  const callback = (e) => {
    const isValidOrigin = supportedOrigins.some((origin) => e.origin === origin);
    if (!isValidOrigin) {
      return;
    }
    const data = e.data;
    if (!data || typeof data !== "object") {
      return;
    }
    if (data.type !== EXPECTED_MESSAGE_TYPE) {
      return;
    }
    resolvePromise(data.response);
  };
  const cleanup = () => {
    window.removeEventListener("message", callback);
  };
  window.addEventListener("message", callback);
  return {
    cleanup,
    messagePromise: promise
  };
}
function getPopupDimensions(isInIframe) {
  const hasBrowserPosition = window.screenX !== 0 || window.screenY !== 0 || !isInIframe;
  const width = hasBrowserPosition ? window.outerWidth * 0.5 : window.screen.width * 0.5;
  const height = hasBrowserPosition ? window.outerHeight * 0.5 : window.screen.height * 0.5;
  const left = hasBrowserPosition ? window.screenX + (window.outerWidth - width) / 2 : (window.screen.width - width) / 2;
  const top = hasBrowserPosition ? window.screenY + (window.outerHeight - height) / 2 : (window.screen.height - height) / 2;
  return { width, height, left, top };
}
function processOAuthResponse(data, expectedState) {
  if (data.state !== expectedState) {
    return { error: new Error("State is invalid") };
  }
  if (data.error) {
    if (data.error === "legacy_flow") {
      return {
        error: new Error("This flow is not supported in Preview mode. Please open the app in a new tab to sign in.")
      };
    }
    return { error: new Error(data.error_description ?? "Sign in failed") };
  }
  if (!data.access_token || !data.refresh_token) {
    return { error: new Error("No tokens received") };
  }
  return {
    tokens: { access_token: data.access_token, refresh_token: data.refresh_token },
    error: null
  };
}
function isDevice() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua))
    return true;
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
    return true;
  return false;
}
function generateState() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
function createAuth(config = {}) {
  const oauthBrokerUrl = config.oauthBrokerUrl ?? DEFAULT_OAUTH_BROKER_URL;
  const supportedOAuthOrigins = config.supportedOAuthOrigins ?? DEFAULT_SUPPORTED_OAUTH_ORIGINS;
  async function signInWithOAuth(provider, opts = {}) {
    let isInIframe = false;
    try {
      isInIframe = window.self !== window.top;
    } catch {
      isInIframe = true;
    }
    const ua = navigator.userAgent;
    const isMobileApp = /LovableApp\//.test(ua);
    const isDesktopApp = !isMobileApp && /lovable/i.test(ua);
    const state = generateState();
    let redirectUri = opts.redirect_uri ?? window.location.origin;
    if (isMobileApp && isInIframe) {
      redirectUri = DEFAULT_MOBILE_DEEP_LINK_REDIRECT_URI;
    } else if (isDesktopApp && isInIframe) {
      redirectUri = DEFAULT_DESKTOP_LOCALHOST_REDIRECT_URI;
    }
    const params = new URLSearchParams({
      ...opts.extraParams,
      provider,
      redirect_uri: redirectUri,
      state
    });
    if (!isInIframe) {
      window.location.href = `${oauthBrokerUrl}?${params.toString()}`;
      return { error: null, redirected: true };
    }
    if (!isMobileApp && !isDesktopApp) {
      params.set("response_mode", "web_message");
    }
    const url = `${oauthBrokerUrl}?${params.toString()}`;
    const effectiveOrigins = isDesktopApp ? [...supportedOAuthOrigins, window.location.origin] : supportedOAuthOrigins;
    const { messagePromise, cleanup } = startWebMessageListener(effectiveOrigins);
    let popup;
    if (isDevice()) {
      popup = window.open(url, "_blank");
    } else {
      const { width, height, left, top } = getPopupDimensions(isInIframe);
      popup = window.open(url, "oauth", `width=${width},height=${height},left=${left},top=${top}`);
    }
    if (!popup && (isMobileApp || isDesktopApp)) {
      let webViewTimeoutId;
      const webViewTimeoutPromise = new Promise((_, reject) => {
        webViewTimeoutId = setTimeout(() => {
          reject(new Error("OAuth timed out waiting for response"));
        }, IFRAME_FALLBACK_TIMEOUT_MS);
      });
      try {
        const data = await Promise.race([messagePromise, webViewTimeoutPromise]);
        return processOAuthResponse(data, state);
      } catch (error) {
        return { error: error instanceof Error ? error : new Error(String(error)) };
      } finally {
        if (webViewTimeoutId)
          clearTimeout(webViewTimeoutId);
        cleanup();
      }
    }
    if (!popup) {
      cleanup();
      return { error: new Error("Popup was blocked") };
    }
    let popupCheckInterval;
    const popupClosedPromise = new Promise((_, reject) => {
      popupCheckInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheckInterval);
          reject(new Error("Sign in was cancelled"));
        }
      }, POPUP_CHECK_INTERVAL_MS);
    });
    try {
      const data = await Promise.race([messagePromise, popupClosedPromise]);
      return processOAuthResponse(data, state);
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error(String(error))
      };
    } finally {
      clearInterval(popupCheckInterval);
      cleanup();
      popup?.close();
    }
  }
  return {
    signInWithOAuth
  };
}
if (typeof window !== "undefined") {
  window.__lovable_cloud_auth_js_version = package_default.version;
}
function createLovableAuth(config = {}) {
  return createAuth(config);
}
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function Login() {
  const {
    t
  } = useI18n();
  useNavigate();
  const {
    next
  } = Route.useSearch();
  const dest = next && next.startsWith("/") ? next : "/app";
  const {
    session,
    loading
  } = useAuth();
  const {
    branding
  } = useTenantBranding();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && session) window.location.assign(dest);
  }, [loading, session, dest]);
  const handleEmail = async (e) => {
    e.preventDefault();
    setBusy(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    window.location.assign(dest);
  };
  const handleGoogle = async () => {
    setBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + dest
    });
    if (r.error) {
      toast.error(r.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (!r.redirected) window.location.assign(dest);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-10 bg-[image:var(--gradient-surface)] border-e border-border relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -end-32 size-96 rounded-full bg-primary/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-32 -start-32 size-96 rounded-full bg-accent/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 relative", children: [
        branding?.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: branding.logo_url, alt: branding.name, className: "size-9 rounded-md object-cover bg-card border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: branding?.name ?? t("appName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: branding ? "Welding QA/QC workspace" : t("tagline") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold tracking-tight max-w-md", children: branding ? `Sign in to ${branding.name}.` : "One control room for every welder, weld and project." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-md", children: branding ? "Your team's secure welding management portal." : "Trusted by EPC contractors, fabrication workshops and oil & gas operators." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground relative", children: "ISO 9001 · ASME IX · EN ISO 3834" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "w-full max-w-sm space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: t("signIn") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("loginSubtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "w-full", onClick: handleGoogle, disabled: busy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "size-4 me-2", viewBox: "0 0 24 24", "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 11v3.2h5.4c-.2 1.4-1.6 4-5.4 4-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.7 14.6 3 12 3 6.9 3 3 6.9 3 12s3.9 9 9 9c5.2 0 8.7-3.7 8.7-8.8 0-.6-.1-1-.1-1.2H12z" }) }),
        "Continue with Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border flex-1" }),
        " or ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border flex-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: t("email") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: t("password") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        t("signIn"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ms-1" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
        "New to Weld Yard?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-primary hover:underline", children: "Create a workspace" })
      ] })
    ] }) })
  ] });
}
export {
  Login as component
};
