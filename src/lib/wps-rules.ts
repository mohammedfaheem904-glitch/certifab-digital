/**
 * Dynamic WPS rules engine.
 *
 * Pure functions that determine which sections / fields should be visible
 * given the selected welding process, code family, and joint configuration.
 *
 * The UI consumes `getApplicableSections(proc)` to render only the relevant
 * relational tables, and `isFieldApplicable(proc, key)` to gate individual
 * fields inside a section.
 */

export type WpsContext = {
  process?: string | null;          // e.g. "GTAW", "SMAW", "FCAW", "GMAW", "SAW"
  processes?: string[] | null;      // multi-process combinations
  standard?: string | null;         // e.g. "ASME IX", "AWS D1.1"
  joint_type?: string | null;
  pipe_or_plate?: string | null;
  automation?: string | null;       // "Manual" | "Semi-automatic" | "Mechanized" | "Automatic"
};

export type WpsSectionKey =
  | "joints"
  | "positions"
  | "basemetals"
  | "fillers"
  | "shielding_gases"
  | "preheat"
  | "pwht"
  | "electrical"
  | "techniques"
  | "variables"
  | "notes"
  | "signatures";

export type WpsSectionMeta = {
  key: WpsSectionKey;
  label: string;
  description: string;
  /** ASME IX QW reference for traceability */
  codeRef?: string;
};

const ALL_SECTIONS: WpsSectionMeta[] = [
  { key: "joints",          label: "Joints",          description: "Groove design, backing and progression.", codeRef: "QW-402" },
  { key: "positions",       label: "Positions",       description: "Qualified welding positions and ranges.",  codeRef: "QW-405" },
  { key: "basemetals",      label: "Base metals",     description: "Material spec, P-No, group, thickness.",   codeRef: "QW-403" },
  { key: "fillers",         label: "Fillers",         description: "Consumables — SFA, AWS class, F/A No.",    codeRef: "QW-404" },
  { key: "shielding_gases", label: "Shielding gases", description: "Gas type, composition, flow, purge.",       codeRef: "QW-408" },
  { key: "preheat",         label: "Preheat",         description: "Preheat / interpass temperature and method.", codeRef: "QW-406" },
  { key: "pwht",            label: "PWHT",            description: "Post weld heat treatment parameters.",      codeRef: "QW-407" },
  { key: "electrical",      label: "Electrical",      description: "Pass-by-pass current, voltage, polarity.",  codeRef: "QW-409" },
  { key: "techniques",      label: "Technique",       description: "String/weave, cleaning, peening, automation.", codeRef: "QW-410" },
  { key: "variables",       label: "Variables",       description: "Essential / supplementary / non-essential.", codeRef: "QW-250" },
  { key: "notes",           label: "Notes",           description: "Engineering, QA, and field notes." },
  { key: "signatures",      label: "Signatures",      description: "Prepared, reviewed and approved sign-off." },
];

const PROCESSES_WITH_GAS = new Set(["GTAW", "GMAW", "FCAW", "FCAW-G", "PAW", "MIG", "MAG"]);
const PROCESSES_WITHOUT_GAS = new Set(["SMAW", "SAW", "FCAW-S"]);

function processList(ctx: WpsContext): string[] {
  if (ctx.processes && ctx.processes.length > 0) return ctx.processes;
  return ctx.process ? [ctx.process] : [];
}

function anyProcess(ctx: WpsContext, set: Set<string>): boolean {
  return processList(ctx).some((p) => set.has(p.toUpperCase()));
}

/** Returns sections that should appear for the given WPS context. */
export function getApplicableSections(ctx: WpsContext): WpsSectionMeta[] {
  return ALL_SECTIONS.filter((s) => {
    if (s.key === "shielding_gases") {
      const procs = processList(ctx);
      if (procs.length === 0) return true; // unknown → show
      return anyProcess(ctx, PROCESSES_WITH_GAS);
    }
    return true;
  });
}

/** Returns true when a specific field should render for the current context. */
export function isFieldApplicable(ctx: WpsContext, fieldKey: string): boolean {
  const procs = processList(ctx);
  const has = (set: Set<string>) => anyProcess(ctx, set);

  // Tungsten-only fields
  if (["tungsten_type", "tungsten_diameter_mm", "purge_gas", "purge_flow_lpm"].includes(fieldKey)) {
    return has(new Set(["GTAW", "PAW"]));
  }
  // Flux-only fields
  if (["flux_brand", "flux_wire_class", "flux_type"].includes(fieldKey)) {
    return has(new Set(["SAW", "FCAW", "FCAW-S"]));
  }
  // Shielding gas fields
  if (["gas_type", "gas_composition", "gas_flow_lpm"].includes(fieldKey)) {
    return has(PROCESSES_WITH_GAS);
  }
  // Consumable insert is GTAW root pass
  if (fieldKey === "consumable_insert") {
    return has(new Set(["GTAW"]));
  }
  // Automation-dependent
  if (["oscillation_frequency", "wire_feed_speed"].includes(fieldKey)) {
    const auto = (ctx.automation ?? "").toLowerCase();
    return auto.includes("auto") || auto.includes("mech");
  }
  return true;
}

/** Convenience: split a (possibly multi-) process string into a list. */
export function parseProcesses(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[\s,+/]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

/** Engineering-friendly warning when a context has an unusual combination. */
export function compatibilityWarnings(ctx: WpsContext): string[] {
  const out: string[] = [];
  const procs = processList(ctx).map((p) => p.toUpperCase());
  if (procs.includes("SAW") && (ctx.pipe_or_plate ?? "").toLowerCase() === "pipe") {
    out.push("SAW on pipe is uncommon — verify the supporting PQR explicitly qualifies pipe.");
  }
  if (procs.includes("GTAW") && (ctx.automation ?? "").toLowerCase().includes("auto") === false && (ctx.pipe_or_plate ?? "").toLowerCase() === "pipe") {
    // benign
  }
  if (procs.length > 1 && !ctx.processes) {
    out.push("Multi-process detected — capture each process group separately in fillers and electrical tables.");
  }
  return out;
}
