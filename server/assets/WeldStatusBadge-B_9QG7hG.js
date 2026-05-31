import { U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, j as cn } from "./router-DGN8uIPq.js";
import { S as ShieldAlert } from "./shield-alert-Dr9D1Rqa.js";
import { C as CircleX } from "./circle-x-CEG87Cnk.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { O as OctagonAlert } from "./octagon-alert-CjvTeUly.js";
import { S as Search } from "./search-DlrNhFVp.js";
const __iconNode$2 = [
  ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0", key: "5ilxe3" }],
  ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0", key: "11zvb9" }],
  ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7", key: "1iw5b2" }],
  ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8", key: "c0bmvh" }],
  ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69", key: "1ruxm7" }],
  ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8", key: "qkgqxc" }],
  ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69", key: "1mcia2" }],
  ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7", key: "1fvljs" }]
];
const CircleDashed = createLucideIcon("circle-dashed", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M5 22h14", key: "ehvnwv" }],
  ["path", { d: "M5 2h14", key: "pdyrp9" }],
  [
    "path",
    {
      d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",
      key: "1d314k"
    }
  ],
  [
    "path",
    { d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2", key: "1vvvr6" }
  ]
];
const Hourglass = createLucideIcon("hourglass", __iconNode$1);
const __iconNode = [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackageCheck = createLucideIcon("package-check", __iconNode);
const WORKFLOW_STAGES = [
  "Draft",
  "Pending Validation",
  "Awaiting Inspection",
  "Ready for Release",
  "Approved",
  "Released"
];
const BRANCH_STATES = ["NCR Open", "Rejected", "Blocked"];
function allowedTransitions(s) {
  switch (s) {
    case "Draft":
      return [
        { to: "Pending Validation", label: "Submit for validation" },
        { to: "Blocked", label: "Block", variant: "destructive", needsReason: true }
      ];
    case "Pending Validation":
      return [
        { to: "Awaiting Inspection", label: "Approve compatibility", requires: "WPS ↔ WPQ check" },
        { to: "Blocked", label: "Block", variant: "destructive", needsReason: true },
        { to: "Draft", label: "Return to draft", variant: "outline" }
      ];
    case "Awaiting Inspection":
      return [
        { to: "Ready for Release", label: "Mark inspected & ready" },
        { to: "NCR Open", label: "Raise NCR", variant: "destructive" }
      ];
    case "NCR Open":
      return [
        { to: "Awaiting Inspection", label: "Re-inspect", variant: "outline" },
        { to: "Rejected", label: "Reject weld", variant: "destructive", needsReason: true }
      ];
    case "Ready for Release":
      return [
        { to: "Approved", label: "Approve" },
        { to: "Rejected", label: "Reject", variant: "destructive", needsReason: true }
      ];
    case "Approved":
      return [
        { to: "Released", label: "Release weld" },
        { to: "Awaiting Inspection", label: "Reopen", variant: "outline" }
      ];
    case "Released":
      return [{ to: "Awaiting Inspection", label: "Reopen", variant: "outline" }];
    case "Rejected":
    case "Blocked":
      return [{ to: "Draft", label: "Reopen", variant: "outline" }];
  }
}
function stageIndex(s) {
  const i = WORKFLOW_STAGES.indexOf(s);
  return i === -1 ? 0 : i;
}
const STATUS_TONE = {
  Draft: "bg-muted text-muted-foreground border-border",
  "Pending Validation": "bg-info/15 text-info border-info/30",
  "Awaiting Inspection": "bg-warning/15 text-warning border-warning/30",
  "NCR Open": "bg-destructive/15 text-destructive border-destructive/30",
  "Ready for Release": "bg-primary/15 text-primary border-primary/30",
  Approved: "bg-success/15 text-success border-success/30",
  Released: "bg-success/20 text-success border-success/40",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Blocked: "bg-destructive/15 text-destructive border-destructive/30"
};
const ICON = {
  Draft: CircleDashed,
  "Pending Validation": Hourglass,
  "Awaiting Inspection": Search,
  "NCR Open": OctagonAlert,
  "Ready for Release": ShieldCheck,
  Approved: CircleCheck,
  Released: PackageCheck,
  Rejected: CircleX,
  Blocked: ShieldAlert
};
function WeldStatusBadge({
  status,
  size = "sm",
  className
}) {
  const s = status in STATUS_TONE ? status : "Draft";
  const Icon = ICON[s];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        STATUS_TONE[s],
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: size === "sm" ? "size-3" : "size-3.5" }),
        status
      ]
    }
  );
}
export {
  BRANCH_STATES as B,
  WeldStatusBadge as W,
  WORKFLOW_STAGES as a,
  allowedTransitions as b,
  stageIndex as s
};
