import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "ar";

const dict = {
  en: {
    appName: "Weld Yard",
    tagline: "Digital Welding Management System",
    dashboard: "Dashboard",
    procedures: "Procedures",
    qualifications: "WPQ (Welder Performance Qualification)",
    welds: "Weld Log",
    inspections: "Inspections",
    equipment: "Equipment",
    projects: "Projects",
    reports: "Reports",
    settings: "Settings",
    search: "Search welds, WPS, welders...",
    overview: "Operations Overview",
    welcome: "Welcome back",
    totalWelds: "Total Welds",
    acceptanceRate: "Acceptance Rate",
    activeWelders: "Active Welders",
    expiringCerts: "Expiring Certs",
    weldActivity: "Weld Activity (last 14 days)",
    inspectionResults: "Inspection Results",
    recentNCRs: "Recent Non-Conformances",
    qualificationAlerts: "Qualification Alerts",
    accepted: "Accepted",
    rejected: "Rejected",
    repair: "Repair",
    pending: "Pending",
    active: "Active",
    expired: "Expired",
    expiringSoon: "Expiring Soon",
    new: "New",
    export: "Export",
    addWeld: "Add Weld",
    signIn: "Sign in",
    signOut: "Sign out",
    email: "Email",
    password: "Password",
    loginSubtitle: "Sign in to your industrial workspace",
    welder: "Welder",
    weldNo: "Weld No.",
    project: "Project",
    wps: "WPS",
    status: "Status",
    date: "Date",
    heatInput: "Heat Input",
    process: "Process",
    standard: "Standard",
    expiry: "Expiry",
    machine: "Machine",
    calibration: "Calibration",
  },
  ar: {
    appName: "ويلد يارد",
    tagline: "نظام إدارة اللحام الرقمي",
    dashboard: "لوحة التحكم",
    procedures: "إجراءات اللحام",
    qualifications: "المؤهلات",
    welds: "سجل اللحامات",
    inspections: "التفتيش",
    equipment: "المعدات",
    projects: "المشاريع",
    reports: "التقارير",
    settings: "الإعدادات",
    search: "ابحث عن لحامات، إجراءات، لحامين...",
    overview: "نظرة عامة على العمليات",
    welcome: "مرحبًا بعودتك",
    totalWelds: "إجمالي اللحامات",
    acceptanceRate: "نسبة القبول",
    activeWelders: "اللحامون النشطون",
    expiringCerts: "شهادات تنتهي قريبًا",
    weldActivity: "نشاط اللحام (آخر ١٤ يوم)",
    inspectionResults: "نتائج التفتيش",
    recentNCRs: "حالات عدم المطابقة الأخيرة",
    qualificationAlerts: "تنبيهات المؤهلات",
    accepted: "مقبول",
    rejected: "مرفوض",
    repair: "إصلاح",
    pending: "قيد الانتظار",
    active: "ساري",
    expired: "منتهي",
    expiringSoon: "ينتهي قريبًا",
    new: "جديد",
    export: "تصدير",
    addWeld: "إضافة لحام",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    loginSubtitle: "سجّل الدخول إلى مساحة عملك الصناعية",
    welder: "اللحام",
    weldNo: "رقم اللحام",
    project: "المشروع",
    wps: "إجراء اللحام",
    status: "الحالة",
    date: "التاريخ",
    heatInput: "إدخال الحرارة",
    process: "العملية",
    standard: "المعيار",
    expiry: "تاريخ الانتهاء",
    machine: "الآلة",
    calibration: "المعايرة",
  },
} as const;

type Key = keyof typeof dict["en"];

const Ctx = createContext<{ lang: Lang; t: (k: Key) => string; toggle: () => void }>({
  lang: "en",
  t: (k) => k,
  toggle: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);
  return (
    <Ctx.Provider
      value={{
        lang,
        t: (k) => dict[lang][k] ?? k,
        toggle: () => setLang((l) => (l === "en" ? "ar" : "en")),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useI18n = () => useContext(Ctx);
