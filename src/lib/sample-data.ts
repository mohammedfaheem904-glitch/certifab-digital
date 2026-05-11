export const kpis = {
  totalWelds: 4827,
  acceptanceRate: 96.4,
  activeWelders: 142,
  expiringCerts: 9,
};

export const weldActivity = [
  { day: "D-13", welds: 210, rejected: 8 },
  { day: "D-12", welds: 245, rejected: 12 },
  { day: "D-11", welds: 198, rejected: 6 },
  { day: "D-10", welds: 270, rejected: 14 },
  { day: "D-9", welds: 305, rejected: 10 },
  { day: "D-8", welds: 288, rejected: 9 },
  { day: "D-7", welds: 320, rejected: 11 },
  { day: "D-6", welds: 295, rejected: 7 },
  { day: "D-5", welds: 340, rejected: 13 },
  { day: "D-4", welds: 360, rejected: 9 },
  { day: "D-3", welds: 312, rejected: 8 },
  { day: "D-2", welds: 388, rejected: 10 },
  { day: "D-1", welds: 402, rejected: 12 },
  { day: "Today", welds: 158, rejected: 4 },
];

export const inspectionBreakdown = [
  { name: "VT", value: 1820, color: "var(--chart-1)" },
  { name: "PT", value: 640, color: "var(--chart-2)" },
  { name: "MT", value: 410, color: "var(--chart-3)" },
  { name: "RT", value: 980, color: "var(--chart-4)" },
  { name: "UT", value: 720, color: "var(--chart-5)" },
];

export type WeldStatus = "Accepted" | "Rejected" | "Repair" | "Pending";

export const recentWelds: {
  weldNo: string;
  project: string;
  welder: string;
  wps: string;
  heatInput: string;
  status: WeldStatus;
  date: string;
}[] = [
  { weldNo: "WL-2410-0451", project: "Aramco GOSP-7", welder: "M. Al-Harbi", wps: "WPS-SAW-014", heatInput: "1.42 kJ/mm", status: "Accepted", date: "2025-05-11" },
  { weldNo: "WL-2410-0450", project: "ADNOC Pipeline 22B", welder: "R. Kumar", wps: "WPS-GTAW-008", heatInput: "0.98 kJ/mm", status: "Accepted", date: "2025-05-11" },
  { weldNo: "WL-2410-0449", project: "Sabic Refinery", welder: "J. Silva", wps: "WPS-SMAW-021", heatInput: "1.81 kJ/mm", status: "Repair", date: "2025-05-10" },
  { weldNo: "WL-2410-0448", project: "Aramco GOSP-7", welder: "K. Nguyen", wps: "WPS-FCAW-017", heatInput: "1.55 kJ/mm", status: "Rejected", date: "2025-05-10" },
  { weldNo: "WL-2410-0447", project: "Qatar LNG-T4", welder: "A. Ibrahim", wps: "WPS-GTAW-008", heatInput: "1.04 kJ/mm", status: "Accepted", date: "2025-05-10" },
  { weldNo: "WL-2410-0446", project: "Sabic Refinery", welder: "P. Costa", wps: "WPS-SMAW-021", heatInput: "1.69 kJ/mm", status: "Pending", date: "2025-05-10" },
  { weldNo: "WL-2410-0445", project: "ADNOC Pipeline 22B", welder: "M. Al-Harbi", wps: "WPS-SAW-014", heatInput: "1.38 kJ/mm", status: "Accepted", date: "2025-05-09" },
];

export const procedures = [
  { id: "WPS-SAW-014", standard: "ASME IX", process: "SAW", thickness: "8–40 mm", status: "Approved", rev: "Rev 3" },
  { id: "WPS-GTAW-008", standard: "EN ISO 15614-1", process: "GTAW", thickness: "1.5–12 mm", status: "Approved", rev: "Rev 2" },
  { id: "WPS-SMAW-021", standard: "AWS D1.1", process: "SMAW", thickness: "3–25 mm", status: "Review", rev: "Rev 1" },
  { id: "WPS-FCAW-017", standard: "ASME IX", process: "FCAW", thickness: "5–30 mm", status: "Approved", rev: "Rev 4" },
  { id: "pWPS-GMAW-031", standard: "EN ISO 15609", process: "GMAW", thickness: "2–10 mm", status: "Draft", rev: "Rev 0" },
  { id: "WPS-GTAW-040", standard: "AS/NZS 3992", process: "GTAW", thickness: "1–8 mm", status: "Approved", rev: "Rev 1" },
];

export const qualifications = [
  { name: "Mohammed Al-Harbi", id: "EMP-1042", process: "SAW / GTAW", standard: "ASME IX", expiry: "2025-08-12", status: "Active" as const },
  { name: "Ravi Kumar", id: "EMP-1187", process: "GTAW", standard: "EN ISO 9606-1", expiry: "2025-06-02", status: "Expiring Soon" as const },
  { name: "Joao Silva", id: "EMP-1233", process: "SMAW", standard: "AWS D1.1", expiry: "2024-11-20", status: "Expired" as const },
  { name: "Khanh Nguyen", id: "EMP-1301", process: "FCAW", standard: "ASME IX", expiry: "2026-02-14", status: "Active" as const },
  { name: "Ahmed Ibrahim", id: "EMP-1355", process: "GTAW", standard: "EN ISO 9606-1", expiry: "2025-05-29", status: "Expiring Soon" as const },
  { name: "Pedro Costa", id: "EMP-1402", process: "SMAW / FCAW", standard: "AWS D1.1", expiry: "2025-12-01", status: "Active" as const },
];

export const ncrs = [
  { id: "NCR-0231", weld: "WL-2410-0448", type: "Porosity cluster", severity: "High", project: "Aramco GOSP-7" },
  { id: "NCR-0230", weld: "WL-2410-0449", type: "Lack of fusion", severity: "Medium", project: "Sabic Refinery" },
  { id: "NCR-0229", weld: "WL-2410-0431", type: "Undercut > 0.5mm", severity: "Low", project: "Qatar LNG-T4" },
  { id: "NCR-0228", weld: "WL-2410-0420", type: "Crack indication", severity: "Critical", project: "ADNOC Pipeline 22B" },
];

export const equipment = [
  { id: "MIG-204", model: "Lincoln PowerWave S500", status: "Operational", calibration: "2025-09-12" },
  { id: "TIG-117", model: "Miller Dynasty 400", status: "Operational", calibration: "2025-06-03" },
  { id: "STK-088", model: "ESAB Warrior 500i", status: "Maintenance", calibration: "2025-05-20" },
  { id: "SAW-012", model: "Lincoln Idealarc DC-1000", status: "Operational", calibration: "2025-07-30" },
  { id: "TIG-145", model: "Fronius MagicWave 4000", status: "Calibration Due", calibration: "2025-05-08" },
];
