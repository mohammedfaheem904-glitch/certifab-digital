import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link, B as Button } from "./router-DGN8uIPq.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { X } from "./x-CQcD6R0Y.js";
import { M as Menu } from "./menu-BUBmdIcU.js";
const NAV = [
  { to: "/features", label: "Features" },
  { to: "/modules", label: "Modules" },
  { to: "/industries", label: "Industries" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];
function MarketingShell({ children }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto h-16 px-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: "Weld Yard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "DWMS" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-1", children: NAV.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: n.to,
            className: "px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            activeProps: { className: "px-3 py-2 text-sm text-foreground" },
            children: n.label
          },
          n.to
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Sign in" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/demo", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]", children: [
            "Request demo ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ms-1" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "lg:hidden ms-1 size-9 grid place-items-center rounded-md border border-border",
              onClick: () => setOpen((v) => !v),
              "aria-label": "Toggle menu",
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-4" })
            }
          )
        ] })
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden border-t border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-3 flex flex-col", children: [
        NAV.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: n.to,
            onClick: () => setOpen(false),
            className: "py-2 text-sm text-muted-foreground hover:text-foreground",
            children: n.label
          },
          n.to
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setOpen(false), className: "py-2 text-sm", children: "Sign in" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Weld Yard" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "The operating system for industrial welding QA/QC." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Product", links: [
          { to: "/features", label: "Features" },
          { to: "/modules", label: "Modules" },
          { to: "/pricing", label: "Pricing" },
          { to: "/demo", label: "Request a demo" }
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Industries", links: [
          { to: "/industries", label: "Oil & Gas" },
          { to: "/industries", label: "EPC Contractors" },
          { to: "/industries", label: "Fabrication Shops" },
          { to: "/industries", label: "Power & Utilities" }
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Company", links: [
          { to: "/about", label: "About" },
          { to: "/contact", label: "Contact" },
          { to: "/login", label: "Sign in" }
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Weld Yard. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ASME IX" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "EN ISO 15614" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AWS D1.1" })
        ] })
      ] }) })
    ] })
  ] });
}
function FooterCol({ title, links }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-widest text-foreground mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: links.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: l.to, className: "text-muted-foreground hover:text-foreground transition-colors", children: l.label }) }, i)) })
  ] });
}
function Section({
  tone = "dark",
  className = "",
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: `${tone === "light" ? "marketing-light" : ""} ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 py-16 md:py-24", children }) });
}
function Eyebrow({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-card/60 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-primary animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase tracking-widest text-muted-foreground", children })
  ] });
}
export {
  Eyebrow as E,
  MarketingShell as M,
  Section as S
};
