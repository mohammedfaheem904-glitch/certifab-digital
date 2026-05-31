import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { L as Link, B as Button, t as toast, o as objectType, f as stringType } from "./router-DGN8uIPq.js";
import { M as MarketingShell, E as Eyebrow } from "./MarketingShell-BOWNVxAp.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DJNyf6eW.js";
import { C as Calendar } from "./calendar-D4TonfkD.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { W as Workflow } from "./workflow-BeD2b-lN.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./flame-jSrc4RPg.js";
import "./arrow-right-CrScv-zw.js";
import "./x-CQcD6R0Y.js";
import "./menu-BUBmdIcU.js";
import "./Combination-DU9AdJ2b.js";
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-UZjKeKWi.js";
import "./index-MDeoBVHG.js";
import "./chevron-down-s9OCIUw0.js";
import "./check-DS8b9zeL.js";
const schema = objectType({
  name: stringType().trim().min(1, "Name required").max(100),
  email: stringType().trim().email("Valid email required").max(255),
  company: stringType().trim().min(1, "Company required").max(150),
  role: stringType().trim().max(100).optional(),
  industry: stringType().min(1, "Pick an industry"),
  team_size: stringType().min(1, "Pick a team size"),
  message: stringType().trim().max(1e3).optional()
});
function DemoPage() {
  const [submitted, setSubmitted] = reactExports.useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitted(true);
    toast.success("Thanks — we'll be in touch within one business day.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MarketingShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 pt-20 pb-12 md:pt-28 grid lg:grid-cols-2 gap-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Request a demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight", children: "See Weld Yard on a project that looks like yours." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground", children: "30 minutes, screen-share, no slides. We'll preload sample data that mirrors your fabrication scope and walk through the workflows your team will actually use." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 space-y-5", children: [{
        icon: Calendar,
        n: "30-minute live walkthrough",
        d: "Booked within one business day."
      }, {
        icon: Users,
        n: "Bring your QA/QC team",
        d: "Engineers, inspectors and welders welcome."
      }, {
        icon: Workflow,
        n: "End with a workspace",
        d: "We hand you a populated tenant to keep exploring."
      }].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-primary/10 text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(b.icon, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: b.n }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: b.d })
        ] })
      ] }, b.n)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 text-sm text-muted-foreground", children: [
        "Prefer to explore on your own? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app", className: "text-foreground underline underline-offset-4", children: "Open the live demo workspace" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marketing-light rounded-2xl border border-border bg-card p-7 md:p-8", children: submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-12 text-primary mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-2xl font-semibold tracking-tight", children: "Got it — talk soon." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "We'll reply from system@weldyard.com within one business day." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app", className: "inline-block mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Open the demo workspace" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", name: "name", placeholder: "Ahmad Al-Saud", maxLength: 100, required: true, className: "mt-1.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Work email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email", placeholder: "ahmad@company.com", maxLength: 255, required: true, className: "mt-1.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "company", children: "Company" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "company", name: "company", maxLength: 150, required: true, className: "mt-1.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "role", children: "Role (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "role", name: "role", placeholder: "QA/QC Manager", maxLength: 100, className: "mt-1.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "industry", children: "Industry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "industry", required: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "industry", className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select industry" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "oil_gas", children: "Oil & Gas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "epc", children: "EPC Contractor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fabrication", children: "Fabrication shop" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "power", children: "Power & Utilities" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "marine", children: "Shipbuilding / Marine" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "structural", children: "Heavy Structural" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "team_size", children: "Team size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "team_size", required: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "team_size", className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Welders + inspectors" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1_25", children: "1 – 25" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "26_100", children: "26 – 100" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "101_500", children: "101 – 500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "500_plus", children: "500+" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "What would you like to see? (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", name: "message", rows: 4, maxLength: 1e3, placeholder: "Specific workflows, integrations, standards, etc.", className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", className: "w-full bg-[image:var(--gradient-primary)] text-primary-foreground", children: "Request demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "By submitting you agree we may contact you about Weld Yard. We never share your data." })
    ] }) })
  ] }) }) });
}
export {
  DemoPage as component
};
