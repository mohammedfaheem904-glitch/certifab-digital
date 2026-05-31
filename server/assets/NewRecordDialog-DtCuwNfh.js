import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { b as useAuth, g as useQueryClient, B as Button, t as toast, s as supabase } from "./router-DGN8uIPq.js";
import { D as Dialog, b as DialogTrigger, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { u as usePlan } from "./use-plan-zVTHo2UT.js";
import { U as UpgradeButton } from "./UpgradePrompt-DXJce8Hm.js";
import { L as Lock } from "./lock-D0LQ0o4o.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
function NewRecordDialog({
  table,
  title,
  trigger,
  defaults = {},
  quota,
  children
}) {
  const { profile } = useAuth();
  const { isOverQuota, reasonForQuota } = usePlan();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [values, setValues] = reactExports.useState(defaults);
  const [busy, setBusy] = reactExports.useState(false);
  const blocked = quota ? isOverQuota(quota) : false;
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.company_id) {
      toast.error("No workspace.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from(table).insert({ ...values, company_id: profile.company_id });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Created.");
    qc.invalidateQueries({ queryKey: [table] });
    setOpen(false);
    setValues(defaults);
  };
  if (blocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        variant: "outline",
        title: quota ? reasonForQuota(quota) : void 0,
        onClick: () => toast.message("Plan limit reached", {
          description: quota ? reasonForQuota(quota) : "Upgrade to add more."
        }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-4 me-1" }),
          " ",
          trigger ?? "New"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 me-1" }),
      " ",
      trigger ?? "New"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-4", children: children({ values, set }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-wrap gap-2", children: [
        quota && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground me-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeHint, { quota }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : "Save" })
      ] })
    ] }) })
  ] });
}
function UpgradeHint({ quota }) {
  const { plan, usage, percentUsed } = usePlan();
  if (!isFinite(plan.limits[quota])) return null;
  const pct = percentUsed(quota);
  if (pct < 70) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      usage[quota],
      " / ",
      plan.limits[quota],
      " on the ",
      plan.name,
      " plan"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeButton, { size: "sm", children: "Upgrade" })
  ] });
}
export {
  NewRecordDialog as N
};
