import { M as useRouter, r as reactExports, U as jsxRuntimeExports, a0 as Outlet } from "./server-BEiNT1sm.js";
import { d as createLucideIcon, b as useAuth, g as useQueryClient, s as supabase, B as Button, T as TriangleAlert, L as Link, h as createSlot, i as composeRefs, j as cn, a as useNavigate, u as useI18n, t as toast, N as Navigate } from "./router-DGN8uIPq.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle, d as SheetDescription, e as SheetFooter, f as SheetTrigger } from "./sheet-KIz9GboM.js";
import { u as usePlan, P as PlanBadge, a as PlanProvider } from "./use-plan-zVTHo2UT.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem } from "./dropdown-menu-BGS54mDP.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { f as formatDistanceToNow } from "./format-gAjFLL1B.js";
import { B as Bell } from "./bell-DxOSu_LY.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { I as Info } from "./info-Dh0_vR51.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-BQF7sbtW.js";
import { R as Root, P as Portal, O as Overlay, C as Content } from "./index-BlRkZP9l.js";
import { u as useId } from "./Combination-DU9AdJ2b.js";
import { D as Dialog, a as DialogContent } from "./dialog-Bm3dO2Bl.js";
import { S as Search } from "./search-DlrNhFVp.js";
import { F as FEATURES, m as markFeatureSeen, g as getSeenFeatures, a as markAllFeaturesSeen, s as surfaceHasUnseen, u as unseenCount } from "./discovery-D5siu6b6.js";
import { L as LayoutDashboard } from "./layout-dashboard-BSHvpClX.js";
import { F as FileText } from "./file-text-DkQuVY_E.js";
import { F as Flame } from "./flame-jSrc4RPg.js";
import { C as ClipboardCheck } from "./clipboard-check-uPHKjRWU.js";
import { S as ScrollText } from "./scroll-text-CftZHGq2.js";
import { W as Wrench } from "./wrench-CmqB68Gm.js";
import { G as Gauge } from "./gauge-BpPoZNdd.js";
import { F as FolderKanban } from "./folder-kanban-BIlSTZgZ.js";
import { C as ChartColumn } from "./chart-column-CdgQTHSX.js";
import { U as Users } from "./users-DR7u7JAp.js";
import { S as Sparkles } from "./sparkles-ksLz2psn.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as Check } from "./check-DS8b9zeL.js";
import { A as ArrowRight } from "./arrow-right-CrScv-zw.js";
import { B as Building2 } from "./building-2-CNolPY5a.js";
import { M as Menu } from "./menu-BUBmdIcU.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Bwb2_y48.js";
import { C as Clock } from "./clock-C2tLeT-V.js";
import { C as CircleX } from "./circle-x-CEG87Cnk.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-CQcD6R0Y.js";
import "./index-Df5iUNGq.js";
import "./index-Bgd6c4Q0.js";
import "./index-QEgYe57T.js";
import "./index-BuCuGgC7.js";
import "./index-DH7MMPOO.js";
import "./chevron-right-DA67_Mf_.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$3 = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = createLucideIcon("badge-check", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
];
const Languages = createLucideIcon("languages", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
function useNotifications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(30);
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (!user?.id) return;
    const ch = supabase.channel(`notif-${user.id}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
      () => qc.invalidateQueries({ queryKey: ["notifications", user.id] })
    ).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user?.id, qc]);
  const markAllRead = async () => {
    await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).is("read_at", null);
    qc.invalidateQueries({ queryKey: ["notifications", user?.id] });
  };
  const unread = (q.data ?? []).filter((n) => !n.read_at).length;
  return { ...q, unread, markAllRead };
}
function NotificationsBell() {
  const { data, unread, markAllRead } = useNotifications();
  const items = data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
      unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 end-1 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground grid place-items-center", children: unread > 9 ? "9+" : unread })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-96 p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            unread,
            " unread"
          ] })
        ] }),
        unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: markAllRead, children: "Mark all read" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[420px] overflow-y-auto", children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-10 text-center text-sm text-muted-foreground", children: "You're all caught up." }),
        items.map((n) => {
          const Icon = n.severity === "critical" || n.severity === "error" ? TriangleAlert : n.severity === "success" ? CircleCheck : Info;
          const tone = n.severity === "critical" || n.severity === "error" ? "text-destructive" : n.severity === "warning" ? "text-warning" : n.severity === "success" ? "text-success" : "text-info";
          const Body = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-3 p-3 border-b border-border/60 hover:bg-muted/30 ${!n.read_at ? "bg-muted/20" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-4 mt-0.5 ${tone}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: n.title }),
              n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground line-clamp-2 mt-0.5", children: n.body }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground/70 mt-1", children: formatDistanceToNow(n.created_at) })
            ] })
          ] });
          return n.link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: n.link, children: Body }, n.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: Body }, n.id);
        })
      ] })
    ] })
  ] });
}
const today = () => /* @__PURE__ */ new Date();
const dStr = (offsetDays) => new Date(today().getTime() + offsetDays * 864e5).toISOString().slice(0, 10);
async function seedDemoData(companyId) {
  const { count } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("company_id", companyId);
  if ((count ?? 0) > 0) return { skipped: true };
  const projects = [
    { code: "GOSP-7", name: "Aramco GOSP-7", client: "Saudi Aramco", location: "Khurais, KSA", status: "Active", start_date: dStr(-180), end_date: dStr(180) },
    { code: "PL-22B", name: "ADNOC Pipeline 22B", client: "ADNOC", location: "Ruwais, UAE", status: "Active", start_date: dStr(-120), end_date: dStr(220) },
    { code: "REF-01", name: "Sabic Refinery Expansion", client: "SABIC", location: "Jubail, KSA", status: "Active", start_date: dStr(-90), end_date: dStr(280) },
    { code: "LNG-T4", name: "Qatar LNG Train 4", client: "QatarEnergy", location: "Ras Laffan, QA", status: "Planning", start_date: dStr(30), end_date: dStr(420) }
  ].map((p2) => ({ ...p2, company_id: companyId }));
  const { data: ins } = await supabase.from("projects").insert(projects).select("id, code");
  const byCode = Object.fromEntries((ins ?? []).map((p2) => [p2.code, p2.id]));
  const procs = [
    { code: "WPS-SAW-014", standard: "ASME IX", process: "SAW", thickness_range: "8–40 mm", revision: "Rev 3", status: "Approved", base_material: "ASTM A106 Gr B", filler_material: "F7A2-EM12K", joint_type: "Butt", position: "1G", heat_input_min: 1, heat_input_max: 2.5 },
    { code: "WPS-GTAW-008", standard: "EN ISO 15614-1", process: "GTAW", thickness_range: "1.5–12 mm", revision: "Rev 2", status: "Approved", base_material: "ASTM A312 TP316L", filler_material: "ER316L", joint_type: "Butt", position: "6G", heat_input_min: 0.6, heat_input_max: 1.8 },
    { code: "WPS-SMAW-021", standard: "AWS D1.1", process: "SMAW", thickness_range: "3–25 mm", revision: "Rev 1", status: "Review", base_material: "ASTM A36", filler_material: "E7018", joint_type: "Fillet", position: "3F", heat_input_min: 0.8, heat_input_max: 2.2 },
    { code: "WPS-FCAW-017", standard: "ASME IX", process: "FCAW", thickness_range: "5–30 mm", revision: "Rev 4", status: "Approved", base_material: "ASTM A516 Gr 70", filler_material: "E71T-1", joint_type: "Butt", position: "2G", heat_input_min: 0.9, heat_input_max: 2.4 },
    { code: "pWPS-GMAW-031", standard: "EN ISO 15609", process: "GMAW", thickness_range: "2–10 mm", revision: "Rev 0", status: "Draft", base_material: "S355J2", filler_material: "ER70S-6", joint_type: "Butt", position: "1G", heat_input_min: 0.7, heat_input_max: 2 }
  ].map((p2) => ({ ...p2, company_id: companyId }));
  const { data: insertedProcs } = await supabase.from("procedures").insert(procs).select("id, code");
  const procByCode = Object.fromEntries((insertedProcs ?? []).map((p2) => [p2.code, p2.id]));
  const quals = [
    { welder_name: "Mohammed Al-Harbi", employee_id: "EMP-1042", process: "SAW / GTAW", standard: "ASME IX", expiry_date: dStr(120), status: "Active" },
    { welder_name: "Ravi Kumar", employee_id: "EMP-1187", process: "GTAW", standard: "EN ISO 9606-1", expiry_date: dStr(22), status: "Expiring Soon" },
    { welder_name: "Joao Silva", employee_id: "EMP-1233", process: "SMAW", standard: "AWS D1.1", expiry_date: dStr(-15), status: "Expired" },
    { welder_name: "Khanh Nguyen", employee_id: "EMP-1301", process: "FCAW", standard: "ASME IX", expiry_date: dStr(260), status: "Active" },
    { welder_name: "Ahmed Ibrahim", employee_id: "EMP-1355", process: "GTAW", standard: "EN ISO 9606-1", expiry_date: dStr(18), status: "Expiring Soon" },
    { welder_name: "Pedro Costa", employee_id: "EMP-1402", process: "SMAW / FCAW", standard: "AWS D1.1", expiry_date: dStr(190), status: "Active" },
    { welder_name: "Hassan Saeed", employee_id: "EMP-1455", process: "SAW", standard: "ASME IX", expiry_date: dStr(310), status: "Active" },
    { welder_name: "Bilal Yusuf", employee_id: "EMP-1488", process: "GTAW / SMAW", standard: "EN ISO 9606-1", expiry_date: dStr(-45), status: "Expired" }
  ].map((q) => ({ ...q, company_id: companyId }));
  await supabase.from("qualifications").insert(quals);
  const welders = ["M. Al-Harbi", "R. Kumar", "J. Silva", "K. Nguyen", "A. Ibrahim", "P. Costa", "H. Saeed", "B. Yusuf"];
  const projectCodes = Object.keys(byCode);
  const procCodes = Object.keys(procByCode);
  const statuses = [
    "Accepted",
    "Accepted",
    "Accepted",
    "Accepted",
    "Accepted",
    "Accepted",
    "Accepted",
    "Repair",
    "Pending",
    "Rejected"
  ];
  const baseMats = ["ASTM A106 Gr B", "ASTM A312 TP316L", "ASTM A516 Gr 70", "S355J2"];
  const fillers = ["ER70S-6", "E7018", "ER316L", "E71T-1"];
  const jointTypes = ["Butt", "Fillet", "Socket", "Branch"];
  const drawings = ["DWG-PIP-001", "DWG-PIP-002", "DWG-STR-014", "DWG-VES-007"];
  const lines = ["L-101-A1", "L-101-A2", "L-204-B1", "L-308-C2", "L-412-D3"];
  const spools = ["SP-014", "SP-022", "SP-031", "SP-045", "SP-061"];
  const welds = [];
  for (let i = 0; i < 80; i++) {
    const project = projectCodes[i % projectCodes.length];
    const proc = procCodes[i % procCodes.length];
    const dayOffset = -Math.floor(i / 6);
    welds.push({
      company_id: companyId,
      weld_no: `WL-2410-${(500 + i).toString().padStart(4, "0")}`,
      welder_name: welders[i % welders.length],
      project_id: byCode[project],
      procedure_id: procByCode[proc],
      heat_input: `${(0.9 + i % 12 * 0.08).toFixed(2)} kJ/mm`,
      status: statuses[i % statuses.length],
      weld_date: dStr(dayOffset),
      joint_no: `J-${(i % 30 + 1).toString().padStart(2, "0")}`,
      spool_no: spools[i % spools.length],
      drawing_ref: drawings[i % drawings.length],
      line_no: lines[i % lines.length],
      base_material: baseMats[i % baseMats.length],
      heat_number: `H-${23e3 + i * 7 % 999}`,
      filler_metal: fillers[i % fillers.length],
      joint_type: jointTypes[i % jointTypes.length],
      inspection_status: i % 5 === 0 ? "Pending" : "Cleared"
    });
  }
  const { data: insertedWelds } = await supabase.from("welds").insert(welds).select("id, weld_no, status, project_id");
  Object.fromEntries((insertedWelds ?? []).map((w) => [w.weld_no, w.id]));
  const ndtTypes = ["VT", "PT", "MT", "RT", "UT"];
  const defects = ["Porosity cluster", "Lack of fusion", "Undercut > 0.5mm", "Crack indication", "Slag inclusion", null, null, null];
  const severities = ["Low", "Medium", "High", "Critical"];
  const inspections = [];
  (insertedWelds ?? []).slice(0, 30).forEach((w, i) => {
    const defect = defects[i % defects.length];
    inspections.push({
      company_id: companyId,
      weld_id: w.id,
      project_id: w.project_id,
      inspection_type: ndtTypes[i % ndtTypes.length],
      defect_type: defect,
      severity: defect ? severities[i % severities.length] : null,
      status: defect ? "Open" : "Cleared",
      inspector_name: ["I. Khalid", "S. Ahmed", "T. Reyes"][i % 3],
      inspected_at: new Date(today().getTime() - i * 864e5).toISOString()
    });
  });
  await supabase.from("inspections").insert(inspections);
  const rejectedWelds = (insertedWelds ?? []).filter((w) => w.status === "Rejected" || w.status === "Repair");
  const ncrs = rejectedWelds.slice(0, 8).map((w, i) => ({
    company_id: companyId,
    ncr_no: `NCR-${(230 + i).toString().padStart(4, "0")}`,
    title: ["Porosity cluster exceeding code", "Lack of fusion at root", "Crack indication on cap", "Excessive undercut", "Incomplete penetration", "Slag inclusion below surface", "Misalignment exceeds tolerance", "PWHT not performed"][i],
    description: "Detected during NDT inspection. Requires evaluation per project quality plan.",
    severity: ["High", "Medium", "Critical", "Low", "High", "Medium", "Low", "High"][i],
    status: ["Open", "Root Cause", "CA Pending", "Open", "In Review", "Closed", "Open", "Root Cause"][i],
    weld_id: w.id,
    project_id: w.project_id,
    raised_by_name: ["I. Khalid", "S. Ahmed", "T. Reyes"][i % 3],
    assigned_to_name: ["QA Manager", "Welding Engineer", "Site Inspector"][i % 3],
    due_date: dStr(7 + i * 3)
  }));
  if (ncrs.length) await supabase.from("ncrs").insert(ncrs);
  const equipment = [
    { asset_id: "MIG-204", model: "Lincoln PowerWave S500", status: "Operational", calibration_due: dStr(120) },
    { asset_id: "TIG-117", model: "Miller Dynasty 400", status: "Operational", calibration_due: dStr(40) },
    { asset_id: "STK-088", model: "ESAB Warrior 500i", status: "Maintenance", calibration_due: dStr(15) },
    { asset_id: "SAW-012", model: "Lincoln Idealarc DC-1000", status: "Operational", calibration_due: dStr(95) },
    { asset_id: "TIG-145", model: "Fronius MagicWave 4000", status: "Calibration Due", calibration_due: dStr(-5) }
  ].map((e) => ({ ...e, company_id: companyId }));
  await supabase.from("equipment").insert(equipment);
  const instruments = [
    { asset_id: "UT-014", name: "Olympus EPOCH 650", category: "UT", model: "EPOCH 650", serial_number: "E650-22841", manufacturer: "Olympus", calibration_due: dStr(75), status: "Active" },
    { asset_id: "UT-021", name: "GE Phasor XS", category: "UT", model: "Phasor XS", serial_number: "PXS-9912", manufacturer: "GE", calibration_due: dStr(20), status: "Active" },
    { asset_id: "RT-008", name: "Yxlon SMART EVO", category: "RT", model: "SMART EVO 200", serial_number: "YX-44218", manufacturer: "Yxlon", calibration_due: dStr(150), status: "Active" },
    { asset_id: "WG-101", name: "Cambridge Welding Gauge", category: "Welding Gauge", model: "WG-2", serial_number: "CWG-1101", manufacturer: "GAL Gage", calibration_due: dStr(45), status: "Active" },
    { asset_id: "WG-102", name: "Bridge Cam Gauge", category: "Welding Gauge", model: "BCG", serial_number: "BCG-2230", manufacturer: "GAL Gage", calibration_due: dStr(-10), status: "Calibration Due" },
    { asset_id: "PG-204", name: "Wika Pressure Gauge", category: "Pressure Gauge", model: "232.50.100", serial_number: "WK-77231", manufacturer: "WIKA", calibration_due: dStr(180), status: "Active" },
    { asset_id: "TM-118", name: "Fluke Surface Thermometer", category: "Temperature", model: "62 MAX+", serial_number: "FL-66312", manufacturer: "Fluke", calibration_due: dStr(25), status: "Active" },
    { asset_id: "CT-031", name: "Elcometer 456 Coating", category: "Coating", model: "456C-FNF", serial_number: "EL-88121", manufacturer: "Elcometer", calibration_due: dStr(110), status: "Active" },
    { asset_id: "HT-044", name: "Equotip Hardness Tester", category: "Hardness", model: "Bambino 2", serial_number: "EQ-55401", manufacturer: "Proceq", calibration_due: dStr(8), status: "Active" }
  ].map((i) => ({ ...i, company_id: companyId }));
  const { data: insertedInsts } = await supabase.from("instruments").insert(instruments).select("id, asset_id");
  const cals = [];
  (insertedInsts ?? []).forEach((inst, idx) => {
    for (let k2 = 1; k2 <= 3; k2++) {
      cals.push({
        company_id: companyId,
        instrument_id: inst.id,
        calibrated_on: dStr(-365 * k2 + idx * 5),
        next_due: dStr(-365 * (k2 - 1) + idx * 5),
        performed_by: ["Intertek", "SGS", "TÜV Rheinland", "Bureau Veritas"][k2 % 4],
        notes: k2 === 1 ? "Latest periodic calibration. All readings within tolerance." : "Prior cycle."
      });
    }
  });
  if (cals.length) await supabase.from("instrument_calibrations").insert(cals);
  return { skipped: false };
}
var U = 1, Y$1 = 0.9, H = 0.8, J = 0.17, p = 0.1, u = 0.999, $ = 0.9999;
var k$1 = 0.99, m = /[\\\/_+.#"@\[\(\{&]/, B$1 = /[\\\/_+.#"@\[\(\{&]/g, K$1 = /[\s-]/, X = /[\s-]/g;
function G(_, C, h, P2, A, f, O) {
  if (f === C.length) return A === _.length ? U : k$1;
  var T2 = `${A},${f}`;
  if (O[T2] !== void 0) return O[T2];
  for (var L2 = P2.charAt(f), c = h.indexOf(L2, A), S = 0, E, N2, R, M; c >= 0; ) E = G(_, C, h, P2, c + 1, f + 1, O), E > S && (c === A ? E *= U : m.test(_.charAt(c - 1)) ? (E *= H, R = _.slice(A, c - 1).match(B$1), R && A > 0 && (E *= Math.pow(u, R.length))) : K$1.test(_.charAt(c - 1)) ? (E *= Y$1, M = _.slice(A, c - 1).match(X), M && A > 0 && (E *= Math.pow(u, M.length))) : (E *= J, A > 0 && (E *= Math.pow(u, c - A))), _.charAt(c) !== C.charAt(f) && (E *= $)), (E < p && h.charAt(c - 1) === P2.charAt(f + 1) || P2.charAt(f + 1) === P2.charAt(f) && h.charAt(c - 1) !== P2.charAt(f)) && (N2 = G(_, C, h, P2, c + 1, f + 2, O), N2 * p > E && (E = N2 * p)), E > S && (S = E), c = h.indexOf(L2, c + 1);
  return O[T2] = S, S;
}
function D(_) {
  return _.toLowerCase().replace(X, " ");
}
function W(_, C, h) {
  return _ = h && h.length > 0 ? `${_ + " " + h.join(" ")}` : _, G(_, C, D(_), D(C), 0, 0, {});
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var N = '[cmdk-group=""]', Y = '[cmdk-group-items=""]', be = '[cmdk-group-heading=""]', le = '[cmdk-item=""]', ce = `${le}:not([aria-disabled="true"])`, Z = "cmdk-item-select", T = "data-value", Re = (r, o, n) => W(r, o, n), ue = reactExports.createContext(void 0), K = () => reactExports.useContext(ue), de = reactExports.createContext(void 0), ee = () => reactExports.useContext(de), fe = reactExports.createContext(void 0), me = reactExports.forwardRef((r, o) => {
  let n = L(() => {
    var e, a;
    return { search: "", value: (a = (e = r.value) != null ? e : r.defaultValue) != null ? a : "", selectedItemId: void 0, filtered: { count: 0, items: /* @__PURE__ */ new Map(), groups: /* @__PURE__ */ new Set() } };
  }), u2 = L(() => /* @__PURE__ */ new Set()), c = L(() => /* @__PURE__ */ new Map()), d = L(() => /* @__PURE__ */ new Map()), f = L(() => /* @__PURE__ */ new Set()), p2 = pe(r), { label: b, children: m2, value: R, onValueChange: x, filter: C, shouldFilter: S, loop: A, disablePointerSelection: ge = false, vimBindings: j = true, ...O } = r, $2 = useId(), q = useId(), _ = useId(), I = reactExports.useRef(null), v = ke();
  k(() => {
    if (R !== void 0) {
      let e = R.trim();
      n.current.value = e, E.emit();
    }
  }, [R]), k(() => {
    v(6, ne);
  }, []);
  let E = reactExports.useMemo(() => ({ subscribe: (e) => (f.current.add(e), () => f.current.delete(e)), snapshot: () => n.current, setState: (e, a, s) => {
    var i, l, g, y;
    if (!Object.is(n.current[e], a)) {
      if (n.current[e] = a, e === "search") J2(), z(), v(1, W2);
      else if (e === "value") {
        if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
          let h = document.getElementById(_);
          h ? h.focus() : (i = document.getElementById($2)) == null || i.focus();
        }
        if (v(7, () => {
          var h;
          n.current.selectedItemId = (h = M()) == null ? void 0 : h.id, E.emit();
        }), s || v(5, ne), ((l = p2.current) == null ? void 0 : l.value) !== void 0) {
          let h = a != null ? a : "";
          (y = (g = p2.current).onValueChange) == null || y.call(g, h);
          return;
        }
      }
      E.emit();
    }
  }, emit: () => {
    f.current.forEach((e) => e());
  } }), []), U2 = reactExports.useMemo(() => ({ value: (e, a, s) => {
    var i;
    a !== ((i = d.current.get(e)) == null ? void 0 : i.value) && (d.current.set(e, { value: a, keywords: s }), n.current.filtered.items.set(e, te(a, s)), v(2, () => {
      z(), E.emit();
    }));
  }, item: (e, a) => (u2.current.add(e), a && (c.current.has(a) ? c.current.get(a).add(e) : c.current.set(a, /* @__PURE__ */ new Set([e]))), v(3, () => {
    J2(), z(), n.current.value || W2(), E.emit();
  }), () => {
    d.current.delete(e), u2.current.delete(e), n.current.filtered.items.delete(e);
    let s = M();
    v(4, () => {
      J2(), (s == null ? void 0 : s.getAttribute("id")) === e && W2(), E.emit();
    });
  }), group: (e) => (c.current.has(e) || c.current.set(e, /* @__PURE__ */ new Set()), () => {
    d.current.delete(e), c.current.delete(e);
  }), filter: () => p2.current.shouldFilter, label: b || r["aria-label"], getDisablePointerSelection: () => p2.current.disablePointerSelection, listId: $2, inputId: _, labelId: q, listInnerRef: I }), []);
  function te(e, a) {
    var i, l;
    let s = (l = (i = p2.current) == null ? void 0 : i.filter) != null ? l : Re;
    return e ? s(e, n.current.search, a) : 0;
  }
  function z() {
    if (!n.current.search || p2.current.shouldFilter === false) return;
    let e = n.current.filtered.items, a = [];
    n.current.filtered.groups.forEach((i) => {
      let l = c.current.get(i), g = 0;
      l.forEach((y) => {
        let h = e.get(y);
        g = Math.max(h, g);
      }), a.push([i, g]);
    });
    let s = I.current;
    V().sort((i, l) => {
      var h, F;
      let g = i.getAttribute("id"), y = l.getAttribute("id");
      return ((h = e.get(y)) != null ? h : 0) - ((F = e.get(g)) != null ? F : 0);
    }).forEach((i) => {
      let l = i.closest(Y);
      l ? l.appendChild(i.parentElement === l ? i : i.closest(`${Y} > *`)) : s.appendChild(i.parentElement === s ? i : i.closest(`${Y} > *`));
    }), a.sort((i, l) => l[1] - i[1]).forEach((i) => {
      var g;
      let l = (g = I.current) == null ? void 0 : g.querySelector(`${N}[${T}="${encodeURIComponent(i[0])}"]`);
      l == null || l.parentElement.appendChild(l);
    });
  }
  function W2() {
    let e = V().find((s) => s.getAttribute("aria-disabled") !== "true"), a = e == null ? void 0 : e.getAttribute(T);
    E.setState("value", a || void 0);
  }
  function J2() {
    var a, s, i, l;
    if (!n.current.search || p2.current.shouldFilter === false) {
      n.current.filtered.count = u2.current.size;
      return;
    }
    n.current.filtered.groups = /* @__PURE__ */ new Set();
    let e = 0;
    for (let g of u2.current) {
      let y = (s = (a = d.current.get(g)) == null ? void 0 : a.value) != null ? s : "", h = (l = (i = d.current.get(g)) == null ? void 0 : i.keywords) != null ? l : [], F = te(y, h);
      n.current.filtered.items.set(g, F), F > 0 && e++;
    }
    for (let [g, y] of c.current) for (let h of y) if (n.current.filtered.items.get(h) > 0) {
      n.current.filtered.groups.add(g);
      break;
    }
    n.current.filtered.count = e;
  }
  function ne() {
    var a, s, i;
    let e = M();
    e && (((a = e.parentElement) == null ? void 0 : a.firstChild) === e && ((i = (s = e.closest(N)) == null ? void 0 : s.querySelector(be)) == null || i.scrollIntoView({ block: "nearest" })), e.scrollIntoView({ block: "nearest" }));
  }
  function M() {
    var e;
    return (e = I.current) == null ? void 0 : e.querySelector(`${le}[aria-selected="true"]`);
  }
  function V() {
    var e;
    return Array.from(((e = I.current) == null ? void 0 : e.querySelectorAll(ce)) || []);
  }
  function X2(e) {
    let s = V()[e];
    s && E.setState("value", s.getAttribute(T));
  }
  function Q(e) {
    var g;
    let a = M(), s = V(), i = s.findIndex((y) => y === a), l = s[i + e];
    (g = p2.current) != null && g.loop && (l = i + e < 0 ? s[s.length - 1] : i + e === s.length ? s[0] : s[i + e]), l && E.setState("value", l.getAttribute(T));
  }
  function re(e) {
    let a = M(), s = a == null ? void 0 : a.closest(N), i;
    for (; s && !i; ) s = e > 0 ? we(s, N) : De(s, N), i = s == null ? void 0 : s.querySelector(ce);
    i ? E.setState("value", i.getAttribute(T)) : Q(e);
  }
  let oe = () => X2(V().length - 1), ie = (e) => {
    e.preventDefault(), e.metaKey ? oe() : e.altKey ? re(1) : Q(1);
  }, se = (e) => {
    e.preventDefault(), e.metaKey ? X2(0) : e.altKey ? re(-1) : Q(-1);
  };
  return reactExports.createElement(Primitive.div, { ref: o, tabIndex: -1, ...O, "cmdk-root": "", onKeyDown: (e) => {
    var s;
    (s = O.onKeyDown) == null || s.call(O, e);
    let a = e.nativeEvent.isComposing || e.keyCode === 229;
    if (!(e.defaultPrevented || a)) switch (e.key) {
      case "n":
      case "j": {
        j && e.ctrlKey && ie(e);
        break;
      }
      case "ArrowDown": {
        ie(e);
        break;
      }
      case "p":
      case "k": {
        j && e.ctrlKey && se(e);
        break;
      }
      case "ArrowUp": {
        se(e);
        break;
      }
      case "Home": {
        e.preventDefault(), X2(0);
        break;
      }
      case "End": {
        e.preventDefault(), oe();
        break;
      }
      case "Enter": {
        e.preventDefault();
        let i = M();
        if (i) {
          let l = new Event(Z);
          i.dispatchEvent(l);
        }
      }
    }
  } }, reactExports.createElement("label", { "cmdk-label": "", htmlFor: U2.inputId, id: U2.labelId, style: Te }, b), B(r, (e) => reactExports.createElement(de.Provider, { value: E }, reactExports.createElement(ue.Provider, { value: U2 }, e))));
}), he = reactExports.forwardRef((r, o) => {
  var _, I;
  let n = useId(), u2 = reactExports.useRef(null), c = reactExports.useContext(fe), d = K(), f = pe(r), p2 = (I = (_ = f.current) == null ? void 0 : _.forceMount) != null ? I : c == null ? void 0 : c.forceMount;
  k(() => {
    if (!p2) return d.item(n, c == null ? void 0 : c.id);
  }, [p2]);
  let b = ve(n, u2, [r.value, r.children, u2], r.keywords), m2 = ee(), R = P((v) => v.value && v.value === b.current), x = P((v) => p2 || d.filter() === false ? true : v.search ? v.filtered.items.get(n) > 0 : true);
  reactExports.useEffect(() => {
    let v = u2.current;
    if (!(!v || r.disabled)) return v.addEventListener(Z, C), () => v.removeEventListener(Z, C);
  }, [x, r.onSelect, r.disabled]);
  function C() {
    var v, E;
    S(), (E = (v = f.current).onSelect) == null || E.call(v, b.current);
  }
  function S() {
    m2.setState("value", b.current, true);
  }
  if (!x) return null;
  let { disabled: A, value: ge, onSelect: j, forceMount: O, keywords: $2, ...q } = r;
  return reactExports.createElement(Primitive.div, { ref: composeRefs(u2, o), ...q, id: n, "cmdk-item": "", role: "option", "aria-disabled": !!A, "aria-selected": !!R, "data-disabled": !!A, "data-selected": !!R, onPointerMove: A || d.getDisablePointerSelection() ? void 0 : S, onClick: A ? void 0 : C }, r.children);
}), Ee = reactExports.forwardRef((r, o) => {
  let { heading: n, children: u2, forceMount: c, ...d } = r, f = useId(), p2 = reactExports.useRef(null), b = reactExports.useRef(null), m2 = useId(), R = K(), x = P((S) => c || R.filter() === false ? true : S.search ? S.filtered.groups.has(f) : true);
  k(() => R.group(f), []), ve(f, p2, [r.value, r.heading, b]);
  let C = reactExports.useMemo(() => ({ id: f, forceMount: c }), [c]);
  return reactExports.createElement(Primitive.div, { ref: composeRefs(p2, o), ...d, "cmdk-group": "", role: "presentation", hidden: x ? void 0 : true }, n && reactExports.createElement("div", { ref: b, "cmdk-group-heading": "", "aria-hidden": true, id: m2 }, n), B(r, (S) => reactExports.createElement("div", { "cmdk-group-items": "", role: "group", "aria-labelledby": n ? m2 : void 0 }, reactExports.createElement(fe.Provider, { value: C }, S))));
}), ye = reactExports.forwardRef((r, o) => {
  let { alwaysRender: n, ...u2 } = r, c = reactExports.useRef(null), d = P((f) => !f.search);
  return !n && !d ? null : reactExports.createElement(Primitive.div, { ref: composeRefs(c, o), ...u2, "cmdk-separator": "", role: "separator" });
}), Se = reactExports.forwardRef((r, o) => {
  let { onValueChange: n, ...u2 } = r, c = r.value != null, d = ee(), f = P((m2) => m2.search), p2 = P((m2) => m2.selectedItemId), b = K();
  return reactExports.useEffect(() => {
    r.value != null && d.setState("search", r.value);
  }, [r.value]), reactExports.createElement(Primitive.input, { ref: o, ...u2, "cmdk-input": "", autoComplete: "off", autoCorrect: "off", spellCheck: false, "aria-autocomplete": "list", role: "combobox", "aria-expanded": true, "aria-controls": b.listId, "aria-labelledby": b.labelId, "aria-activedescendant": p2, id: b.inputId, type: "text", value: c ? r.value : f, onChange: (m2) => {
    c || d.setState("search", m2.target.value), n == null || n(m2.target.value);
  } });
}), Ce = reactExports.forwardRef((r, o) => {
  let { children: n, label: u2 = "Suggestions", ...c } = r, d = reactExports.useRef(null), f = reactExports.useRef(null), p2 = P((m2) => m2.selectedItemId), b = K();
  return reactExports.useEffect(() => {
    if (f.current && d.current) {
      let m2 = f.current, R = d.current, x, C = new ResizeObserver(() => {
        x = requestAnimationFrame(() => {
          let S = m2.offsetHeight;
          R.style.setProperty("--cmdk-list-height", S.toFixed(1) + "px");
        });
      });
      return C.observe(m2), () => {
        cancelAnimationFrame(x), C.unobserve(m2);
      };
    }
  }, []), reactExports.createElement(Primitive.div, { ref: composeRefs(d, o), ...c, "cmdk-list": "", role: "listbox", tabIndex: -1, "aria-activedescendant": p2, "aria-label": u2, id: b.listId }, B(r, (m2) => reactExports.createElement("div", { ref: composeRefs(f, b.listInnerRef), "cmdk-list-sizer": "" }, m2)));
}), xe = reactExports.forwardRef((r, o) => {
  let { open: n, onOpenChange: u2, overlayClassName: c, contentClassName: d, container: f, ...p2 } = r;
  return reactExports.createElement(Root, { open: n, onOpenChange: u2 }, reactExports.createElement(Portal, { container: f }, reactExports.createElement(Overlay, { "cmdk-overlay": "", className: c }), reactExports.createElement(Content, { "aria-label": r.label, "cmdk-dialog": "", className: d }, reactExports.createElement(me, { ref: o, ...p2 }))));
}), Ie = reactExports.forwardRef((r, o) => P((u2) => u2.filtered.count === 0) ? reactExports.createElement(Primitive.div, { ref: o, ...r, "cmdk-empty": "", role: "presentation" }) : null), Pe = reactExports.forwardRef((r, o) => {
  let { progress: n, children: u2, label: c = "Loading...", ...d } = r;
  return reactExports.createElement(Primitive.div, { ref: o, ...d, "cmdk-loading": "", role: "progressbar", "aria-valuenow": n, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": c }, B(r, (f) => reactExports.createElement("div", { "aria-hidden": true }, f)));
}), _e = Object.assign(me, { List: Ce, Item: he, Input: Se, Group: Ee, Separator: ye, Dialog: xe, Empty: Ie, Loading: Pe });
function we(r, o) {
  let n = r.nextElementSibling;
  for (; n; ) {
    if (n.matches(o)) return n;
    n = n.nextElementSibling;
  }
}
function De(r, o) {
  let n = r.previousElementSibling;
  for (; n; ) {
    if (n.matches(o)) return n;
    n = n.previousElementSibling;
  }
}
function pe(r) {
  let o = reactExports.useRef(r);
  return k(() => {
    o.current = r;
  }), o;
}
var k = typeof window == "undefined" ? reactExports.useEffect : reactExports.useLayoutEffect;
function L(r) {
  let o = reactExports.useRef();
  return o.current === void 0 && (o.current = r()), o;
}
function P(r) {
  let o = ee(), n = () => r(o.snapshot());
  return reactExports.useSyncExternalStore(o.subscribe, n, n);
}
function ve(r, o, n, u2 = []) {
  let c = reactExports.useRef(), d = K();
  return k(() => {
    var b;
    let f = (() => {
      var m2;
      for (let R of n) {
        if (typeof R == "string") return R.trim();
        if (typeof R == "object" && "current" in R) return R.current ? (m2 = R.current.textContent) == null ? void 0 : m2.trim() : c.current;
      }
    })(), p2 = u2.map((m2) => m2.trim());
    d.value(r, f, p2), (b = o.current) == null || b.setAttribute(T, f), c.current = f;
  }), c;
}
var ke = () => {
  let [r, o] = reactExports.useState(), n = L(() => /* @__PURE__ */ new Map());
  return k(() => {
    n.current.forEach((u2) => u2()), n.current = /* @__PURE__ */ new Map();
  }, [r]), (u2, c) => {
    n.current.set(u2, c), o({});
  };
};
function Me(r) {
  let o = r.type;
  return typeof o == "function" ? o(r.props) : "render" in o ? o.render(r.props) : r;
}
function B({ asChild: r, children: o }, n) {
  return r && reactExports.isValidElement(o) ? reactExports.cloneElement(Me(o), { ref: o.ref }, n(o.props.children)) : n(o);
}
var Te = { position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" };
const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(_e.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;
const ROUTES = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/procedures", label: "Procedures", icon: FileText },
  { to: "/app/qualifications", label: "Welder Qualifications (WPQ)", icon: BadgeCheck },
  { to: "/app/welds", label: "Welds", icon: Flame },
  { to: "/app/inspections", label: "Inspections", icon: ClipboardCheck },
  { to: "/app/ncrs", label: "NCRs", icon: ScrollText },
  { to: "/app/equipment", label: "Equipment", icon: Wrench },
  { to: "/app/instruments", label: "QA/QC Instruments", icon: Gauge },
  { to: "/app/projects", label: "Projects", icon: FolderKanban },
  { to: "/app/reports", label: "Reports", icon: ChartColumn },
  { to: "/app/team", label: "Team & Roles", icon: Users },
  { to: "/app/audit", label: "Audit Log", icon: ScrollText },
  { to: "/app/billing", label: "Billing & Plan", icon: Sparkles },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/admin", label: "Admin Console", icon: ShieldCheck }
];
function CommandPalette({
  open,
  onOpenChange
}) {
  const nav = useNavigate();
  const go = (to, featureId) => {
    onOpenChange(false);
    if (featureId) markFeatureSeen(featureId);
    nav({ to });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandDialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search routes, features, actions…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No results." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { heading: "Jump to", children: ROUTES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { value: `${r.label} ${r.to}`, onSelect: () => go(r.to), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(r.icon, { className: "size-4 me-2" }),
        r.label,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-auto text-[10px] text-muted-foreground", children: r.to })
      ] }, r.to)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { heading: "New features", children: FEATURES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        CommandItem,
        {
          value: `${f.title} ${f.blurb} ${(f.keywords ?? []).join(" ")}`,
          onSelect: () => go(f.to, f.id),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 me-2 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: f.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: f.blurb })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-2 text-[10px] font-semibold uppercase text-primary", children: "New" })
          ]
        },
        f.id
      )) })
    ] })
  ] });
}
function useCommandPalette() {
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
function WhatsNewSheet({
  open,
  onOpenChange
}) {
  const nav = useNavigate();
  const seen = getSeenFeatures();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-md flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-primary" }),
        "What's new"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Recently shipped operational features across the platform." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-3", children: FEATURES.map((f) => {
      const isSeen = seen.has(f.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-lg border p-3 ${isSeen ? "border-border bg-card" : "border-primary/30 bg-primary/5"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: f.title }),
                !isSeen && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase rounded px-1.5 py-0.5 bg-primary text-primary-foreground", children: "New" }),
                isSeen && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 text-muted-foreground" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: f.blurb })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: isSeen ? "outline" : "default",
                onClick: () => {
                  markFeatureSeen(f.id);
                  onOpenChange(false);
                  nav({ to: f.to });
                },
                children: [
                  "Open",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 ms-1.5" })
                ]
              }
            ) })
          ]
        },
        f.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => markAllFeaturesSeen(), children: "Mark all as seen" }) })
  ] }) });
}
function NewPill({ surface }) {
  const [show, setShow] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const refresh = () => setShow(surfaceHasUnseen(surface));
    refresh();
    window.addEventListener("cf:discovery-changed", refresh);
    return () => window.removeEventListener("cf:discovery-changed", refresh);
  }, [surface]);
  if (!show) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-auto text-[9px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 bg-primary text-primary-foreground", children: "New" });
}
function AppLayout() {
  const { t, lang, toggle } = useI18n();
  const loc = useLocation();
  const nav = useNavigate();
  const { profile, user, companyName, roles, signOut } = useAuth();
  const qc = useQueryClient();
  const [seeding, setSeeding] = reactExports.useState(false);
  const palette = useCommandPalette();
  const [whatsNewOpen, setWhatsNewOpen] = reactExports.useState(false);
  const [unseen, setUnseen] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const refresh = () => setUnseen(unseenCount());
    refresh();
    window.addEventListener("cf:discovery-changed", refresh);
    return () => window.removeEventListener("cf:discovery-changed", refresh);
  }, []);
  const initials = (profile?.display_name || user?.email || "U").split(/[ @.]/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
  const handleSeed = async () => {
    if (!profile?.company_id) return;
    setSeeding(true);
    const r = await seedDemoData(profile.company_id);
    setSeeding(false);
    if (r.skipped) toast.info("Workspace already has data.");
    else {
      toast.success("Demo data loaded.");
      qc.invalidateQueries();
    }
  };
  const isSuperAdmin = roles.includes("super_admin");
  const nav_items = [
    { to: "/app", label: t("dashboard"), icon: LayoutDashboard, exact: true, surface: "dashboard" },
    { to: "/app/pwps", label: "Preliminary WPS", icon: FileText },
    { to: "/app/pqrs", label: "PQR", icon: ShieldCheck },
    { to: "/app/procedures", label: "Procedures (WPS)", icon: FileText, surface: "procedures" },
    { to: "/app/qualifications", label: t("qualifications"), icon: BadgeCheck, surface: "qualifications" },
    { to: "/app/welds", label: t("welds"), icon: Flame, surface: "welds" },
    { to: "/app/inspections", label: t("inspections"), icon: ClipboardCheck },
    { to: "/app/ncrs", label: "NCRs", icon: ScrollText, surface: "ncrs" },
    { to: "/app/equipment", label: t("equipment"), icon: Wrench },
    { to: "/app/instruments", label: "QA/QC Instruments", icon: Gauge },
    { to: "/app/projects", label: t("projects"), icon: FolderKanban },
    { to: "/app/reports", label: t("reports"), icon: ChartColumn },
    { to: "/app/team", label: "Team & Roles", icon: Users },
    { to: "/app/audit", label: "Audit Log", icon: ScrollText },
    { to: "/app/billing", label: "Billing & Plan", icon: Sparkles },
    ...isSuperAdmin ? [
      { to: "/app/admin", label: "Admin Console", icon: ShieldCheck },
      { to: "/app/admin/users", label: "User Approvals", icon: Users },
      { to: "/app/admin/companies", label: "Companies", icon: Building2 }
    ] : []
  ];
  const NavList = ({ onNavigate }) => /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-3 space-y-1 overflow-y-auto", children: nav_items.map((item) => {
    const active = item.exact ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        onClick: onNavigate,
        className: cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground border-s-2 border-primary" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: item.label }),
          item.surface && /* @__PURE__ */ jsxRuntimeExports.jsx(NewPill, { surface: item.surface })
        ]
      },
      item.to
    );
  }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-5 h-16 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: t("appName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: t("tagline") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/app/settings",
          className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4" }),
            t("settings")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center gap-2 md:gap-3 px-3 md:px-6 sticky top-0 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden", "aria-label": "Open menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "left", className: "w-72 p-0 flex flex-col bg-sidebar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "sr-only", children: "Navigation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-5 h-16 border-b border-sidebar-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: t("appName") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: companyName ?? t("tagline") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/settings", className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4" }),
              t("settings")
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => palette.setOpen(true),
            className: "flex-1 max-w-xl relative h-9 rounded-md border border-border bg-background/60 px-3 flex items-center gap-2 text-sm text-muted-foreground hover:bg-background transition-colors",
            "aria-label": "Open command palette",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 text-start truncate", children: [
                t("search"),
                " — routes, features, actions…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono rounded border border-border px-1.5 py-0.5 bg-muted/60", children: "⌘K" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: toggle, className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "size-4" }),
          lang === "en" ? "العربية" : "English"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setWhatsNewOpen(true),
            className: "relative gap-1.5",
            "aria-label": "What's new",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden lg:inline", children: "What's new" }),
              unseen > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center", children: unseen })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsBell, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PlanPill, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleSeed, disabled: seeding, className: "hidden md:inline-flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 me-1" }),
          " ",
          seeding ? "Seeding…" : "Seed demo data"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 ps-2 border-s border-border outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-accent text-accent-foreground text-xs", children: initials || "U" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block text-xs leading-tight text-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: profile?.display_name || user?.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground truncate max-w-[140px]", children: companyName ?? "—" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuLabel, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Signed in as" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: user?.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1", children: roles.join(", ") || "no role" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => nav({ to: "/app/settings" }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4 me-2" }),
              " Settings"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuItem,
              {
                onClick: async () => {
                  await signOut();
                  nav({ to: "/login" });
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 me-2" }),
                  " Sign out"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-6 lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandPalette, { open: palette.open, onOpenChange: palette.setOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsNewSheet, { open: whatsNewOpen, onOpenChange: setWhatsNewOpen })
  ] });
}
function PlanPill() {
  const { plan, isInternal } = usePlan();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/app/billing",
      className: "hidden sm:inline-flex items-center gap-1.5",
      title: isInternal ? "Internal owner workspace" : "Manage plan",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan }),
        isInternal && /* @__PURE__ */ jsxRuntimeExports.jsx(PlanBadge, { plan, internal: true, size: "xs" })
      ]
    }
  );
}
function useIdleTimeout({
  warnAfterMs,
  timeoutAfterMs,
  onWarn,
  onTimeout,
  enabled = true
}) {
  const warnRef = reactExports.useRef(null);
  const outRef = reactExports.useRef(null);
  const [lastActivity, setLastActivity] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    if (!enabled) return;
    const reset = () => {
      setLastActivity(Date.now());
      if (warnRef.current) window.clearTimeout(warnRef.current);
      if (outRef.current) window.clearTimeout(outRef.current);
      warnRef.current = window.setTimeout(onWarn, warnAfterMs);
      outRef.current = window.setTimeout(onTimeout, timeoutAfterMs);
    };
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "focus"
    ];
    reset();
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    document.addEventListener("visibilitychange", reset);
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", reset);
      if (warnRef.current) window.clearTimeout(warnRef.current);
      if (outRef.current) window.clearTimeout(outRef.current);
    };
  }, [enabled, warnAfterMs, timeoutAfterMs, onWarn, onTimeout]);
  return { lastActivity };
}
const WARN_MS = 30 * 60 * 1e3;
const OUT_MS = 60 * 60 * 1e3;
function IdleTimeoutGuard() {
  const { session, signOut } = useAuth();
  const [warnOpen, setWarnOpen] = reactExports.useState(false);
  const onWarn = reactExports.useCallback(() => setWarnOpen(true), []);
  const onTimeout = reactExports.useCallback(async () => {
    setWarnOpen(false);
    await signOut();
  }, [signOut]);
  useIdleTimeout({
    enabled: !!session,
    warnAfterMs: WARN_MS,
    timeoutAfterMs: OUT_MS,
    onWarn,
    onTimeout
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: warnOpen, onOpenChange: setWarnOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "You're still there?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "For security, your session will end in 30 minutes of continued inactivity. Move your mouse or press a key to stay signed in." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { onClick: () => signOut(), children: "Sign out now" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => setWarnOpen(false), children: "Stay signed in" })
    ] })
  ] }) });
}
function PendingApprovalScreen() {
  const { signOut, user } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-6 text-primary" }), title: "Awaiting administrator approval", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Your account ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: user?.email }),
      " has been created and is awaiting approval by a workspace administrator. You'll be notified once you're approved."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", onClick: () => signOut(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 me-2" }),
      " Sign out"
    ] })
  ] });
}
function RejectedScreen() {
  const { signOut, profile } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-6 text-destructive" }), title: "Account request not approved", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your account request was reviewed and not approved by a workspace administrator." }),
    profile?.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/30 p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground mb-1", children: "Reason" }),
      profile.rejection_reason
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", onClick: () => signOut(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 me-2" }),
      " Sign out"
    ] })
  ] });
}
function Shell({ icon, title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center p-6 bg-[image:var(--gradient-surface)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)] space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-md grid place-items-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tracking-tight", children: "Weld Yard" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold tracking-tight pt-0.5", children: title })
    ] }),
    children
  ] }) });
}
function AppGate() {
  const {
    loading,
    session,
    profile
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center text-sm text-muted-foreground", children: "Loading workspace…" });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (profile?.approval_status === "pending") return /* @__PURE__ */ jsxRuntimeExports.jsx(PendingApprovalScreen, {});
  if (profile?.approval_status === "rejected") return /* @__PURE__ */ jsxRuntimeExports.jsx(RejectedScreen, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PlanProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IdleTimeoutGuard, {})
  ] });
}
export {
  AppGate as component
};
