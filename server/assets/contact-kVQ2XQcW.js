import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { M as MarketingShell, E as Eyebrow, S as Section } from "./MarketingShell-BOWNVxAp.js";
import { d as createLucideIcon, B as Button, t as toast, o as objectType, f as stringType } from "./router-DGN8uIPq.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { M as Mail } from "./mail-Dc31eyoT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.93 4.93 4.24 4.24", key: "1ymg45" }],
  ["path", { d: "m14.83 9.17 4.24-4.24", key: "1cb5xl" }],
  ["path", { d: "m14.83 14.83 4.24 4.24", key: "q42g0n" }],
  ["path", { d: "m9.17 14.83-4.24 4.24", key: "bqpfvv" }],
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }]
];
const LifeBuoy = createLucideIcon("life-buoy", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
const schema = objectType({
  name: stringType().trim().min(1).max(100),
  email: stringType().trim().email().max(255),
  topic: stringType().trim().max(100).optional(),
  message: stringType().trim().min(1).max(2e3)
});
function ContactPage() {
  const [sent, setSent] = reactExports.useState(false);
  const onSubmit = (e) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MarketingShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl", children: "Talk to a human. Same day, every day." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground max-w-2xl", children: "Sales, support, partnerships, or just feedback — pick a channel below or send us a note." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { tone: "light", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: [{
        icon: Mail,
        n: "Email",
        v: "system@weldyard.com",
        d: "All sales and support inquiries."
      }, {
        icon: LifeBuoy,
        n: "Customer support",
        v: "support@weldyard.com",
        d: "Existing customers — response within 4 business hours."
      }, {
        icon: MessageSquare,
        n: "Partnerships",
        v: "partners@weldyard.com",
        d: "Resellers, integrators, training providers."
      }, {
        icon: MapPin,
        n: "Headquarters",
        v: "Riyadh, Saudi Arabia",
        d: "Serving the GCC, MENA and global EPC supply chain."
      }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md grid place-items-center bg-primary/10 text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: c.n }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-0.5 truncate", children: c.v }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: c.d })
        ] })
      ] }, c.n)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card p-7 md:p-8", children: sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Thanks — message received." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "We'll reply from system@weldyard.com shortly." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", maxLength: 100, required: true, className: "mt-1.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email", maxLength: 255, required: true, className: "mt-1.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "topic", children: "Topic (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "topic", name: "topic", placeholder: "Sales, support, partnership…", maxLength: 100, className: "mt-1.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", name: "message", rows: 6, maxLength: 2e3, required: true, className: "mt-1.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", className: "w-full bg-[image:var(--gradient-primary)] text-primary-foreground", children: "Send message" })
      ] }) })
    ] }) })
  ] });
}
export {
  ContactPage as component
};
