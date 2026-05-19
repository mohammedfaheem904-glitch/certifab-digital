import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertTriangle, CheckCircle2, ChevronDown, Info, Wand2,
  CircleSlash, CircleAlert, CircleCheck, CircleDot,
} from "lucide-react";
import type { WeldLike } from "@/lib/weld-matching";
import { evaluateReleaseReadiness, type ReadinessTile } from "@/lib/weld-readiness";
import type { ComplianceFinding } from "@/lib/qualification-validation";
import { ReleaseReadinessGauge } from "./ReleaseReadinessGauge";

interface Props { weld: any }

/**
 * Compliance Center — unified release-readiness workspace for a production weld.
 *  - Big readiness gauge with verdict & blocker count
 *  - Operational tile strip (WPS / WPQ / Inspections / NCRs / Calibration / Approval)
 *  - Production parameter inputs (thickness / OD / position / backing / P-Number / WPQ pick)
 *  - Findings grouped by Critical / Warning / Informational with expandable detail
 */
export function ComplianceCenter({ weld }: Props) {
  const [wpqId, setWpqId] = useState<string | "">("");
  const [params, setParams] = useState<Partial<WeldLike>>({});

  const wps = useQuery({
    queryKey: ["wps-for-weld", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data as any;
    },
  });

  const wpqs = useQuery<any[]>({
    queryKey: ["wpq-options", weld.welder_name],
    queryFn: async () => {
      const q = supabase.from("qualifications").select("*");
      const { data } = weld.welder_name
        ? await q.ilike("welder_name", `%${weld.welder_name}%`).order("created_at", { ascending: false })
        : await q.order("created_at", { ascending: false }).limit(25);
      return (data ?? []) as any[];
    },
  });

  const inspections = useQuery<any[]>({
    queryKey: ["inspections-cc", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weld.id);
      return (data ?? []) as any[];
    },
  });

  const ncrs = useQuery<any[]>({
    queryKey: ["ncrs-cc", weld.id],
    queryFn: async () => {
      const { data } = await (supabase.from("ncrs" as any) as any).select("*").eq("weld_id", weld.id);
      return (data ?? []) as any[];
    },
  });

  const instruments = useQuery<any[]>({
    queryKey: ["instr-cc", weld.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("instruments").select("*").order("calibration_due", { ascending: true }).limit(6);
      return (data ?? []) as any[];
    },
  });

  const autoWpqId = wpqs.data?.[0]?.id ?? "";
  const effectiveId = wpqId || autoWpqId;
  const wpq = wpqs.data?.find((q) => q.id === effectiveId) ?? null;

  const readiness = useMemo(() => evaluateReleaseReadiness({
    weld: { ...weld, ...params },
    wps: wps.data ?? null,
    wpq,
    inspections: inspections.data ?? [],
    ncrs: ncrs.data ?? [],
    instruments: instruments.data ?? [],
  }), [weld, params, wps.data, wpq, inspections.data, ncrs.data, instruments.data]);

  return (
    <div className="space-y-4">
      <ReleaseReadinessGauge readiness={readiness} />

      {/* Tile strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {readiness.tiles.map((t) => <Tile key={t.key} tile={t} />)}
      </div>

      {/* Production parameters */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Wand2 className="size-4 text-primary" /> Production parameters
          </h3>
          <Button variant="outline" size="sm" onClick={() => { setParams({}); setWpqId(""); }}>Reset</Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <PF label="Welder qualification (WPQ)">
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={effectiveId} onChange={(e) => setWpqId(e.target.value)}>
              <option value="">— Select WPQ —</option>
              {(wpqs.data ?? []).map((q) => (
                <option key={q.id} value={q.id}>
                  {q.welder_name} · {q.wpq_number ?? q.employee_id} · {q.process}
                </option>
              ))}
            </select>
          </PF>
          <PF label="Thickness (mm)">
            <Input type="number" value={params.thicknessMm ?? ""} onChange={(e) => setParams((s) => ({ ...s, thicknessMm: Number(e.target.value) || undefined }))} />
          </PF>
          <PF label="Pipe OD (mm)">
            <Input type="number" value={params.diameterMm ?? ""} onChange={(e) => setParams((s) => ({ ...s, diameterMm: Number(e.target.value) || undefined, isPipe: !!Number(e.target.value) }))} />
          </PF>
          <PF label="Position">
            <Input value={params.position ?? ""} onChange={(e) => setParams((s) => ({ ...s, position: e.target.value.toUpperCase() }))} placeholder="6G" />
          </PF>
          <PF label="P-Number">
            <Input type="number" value={params.pNumber ?? ""} onChange={(e) => setParams((s) => ({ ...s, pNumber: Number(e.target.value) || undefined }))} />
          </PF>
          <PF label="Backing">
            <select className="h-9 w-full rounded-md border bg-transparent px-2 text-sm"
              value={params.withBacking == null ? "" : params.withBacking ? "yes" : "no"}
              onChange={(e) => setParams((s) => ({ ...s, withBacking: e.target.value === "" ? undefined : e.target.value === "yes" }))}>
              <option value="">—</option><option value="yes">With backing</option><option value="no">Without backing</option>
            </select>
          </PF>
        </div>
      </Card>

      {/* Findings grouped by severity */}
      <FindingsGroup
        title="Release Blockers"
        tone="destructive"
        items={readiness.blockers}
        emptyLabel="No release blockers detected"
      />
      <FindingsGroup
        title="Warnings — Engineering Review"
        tone="warning"
        items={readiness.warnings}
        emptyLabel="No warnings"
      />
      <FindingsGroup
        title="Informational & Advisory Notes"
        tone="info"
        items={readiness.informational}
        emptyLabel="No advisory items"
        defaultClosed
      />
    </div>
  );
}

/* ------------------- subcomponents ------------------- */

function Tile({ tile }: { tile: ReadinessTile }) {
  const cfg =
    tile.status === "fail" ? { cls: "border-destructive/40 bg-destructive/5", text: "text-destructive", Icon: CircleSlash } :
    tile.status === "warn" ? { cls: "border-warning/40 bg-warning/5", text: "text-warning", Icon: CircleAlert } :
    tile.status === "ok"   ? { cls: "border-success/40 bg-success/5", text: "text-success", Icon: CircleCheck } :
                              { cls: "border-border bg-muted/20", text: "text-muted-foreground", Icon: CircleDot };
  const Icon = cfg.Icon;
  return (
    <div className={`rounded-lg border ${cfg.cls} p-3`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{tile.label}</div>
        <Icon className={`size-3.5 ${cfg.text}`} />
      </div>
      <div className={`text-base font-semibold mt-1 ${cfg.text}`}>{tile.value}</div>
      {tile.hint && <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight truncate">{tile.hint}</div>}
    </div>
  );
}

function FindingsGroup({
  title, tone, items, emptyLabel, defaultClosed,
}: {
  title: string;
  tone: "destructive" | "warning" | "info";
  items: ComplianceFinding[];
  emptyLabel: string;
  defaultClosed?: boolean;
}) {
  const palette =
    tone === "destructive" ? { border: "border-destructive/40", bg: "bg-destructive/5", text: "text-destructive", Icon: AlertTriangle } :
    tone === "warning"     ? { border: "border-warning/40",     bg: "bg-warning/5",     text: "text-warning",     Icon: AlertTriangle } :
                              { border: "border-border",        bg: "bg-muted/30",      text: "text-muted-foreground", Icon: Info };

  if (items.length === 0) {
    return (
      <Card className="p-4 flex items-center gap-3 text-sm text-muted-foreground">
        <CheckCircle2 className="size-4 text-success" /> {emptyLabel}
      </Card>
    );
  }

  return (
    <Collapsible defaultOpen={!defaultClosed}>
      <Card className={`border ${palette.border} ${palette.bg}`}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <palette.Icon className={`size-4 ${palette.text}`} />
            <span className={`text-sm font-semibold ${palette.text}`}>{title}</span>
            <span className={`text-xs rounded-full border px-2 py-0.5 ${palette.border} ${palette.text}`}>{items.length}</span>
          </div>
          <ChevronDown className="size-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="space-y-2 p-4 pt-0">
            {items.map((f) => <FindingRow key={f.id} f={f} />)}
          </ul>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function FindingRow({ f }: { f: ComplianceFinding }) {
  const [open, setOpen] = useState(false);
  const tone =
    f.severity === "critical" ? "border-destructive/30 bg-background/40" :
    f.severity === "warning"  ? "border-warning/30 bg-background/40" :
    f.severity === "pass"     ? "border-success/30 bg-background/40" :
                                "border-border bg-background/40";
  const dot =
    f.severity === "critical" ? "bg-destructive" :
    f.severity === "warning"  ? "bg-warning" :
    f.severity === "pass"     ? "bg-success" :
                                "bg-muted-foreground";

  return (
    <li className={`rounded-md border ${tone}`}>
      <button onClick={() => setOpen((s) => !s)} className="w-full flex items-start gap-3 p-3 text-start">
        <span className={`mt-1.5 size-2 rounded-full ${dot} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{f.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{f.message}</div>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 mt-1">{f.category}</div>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform shrink-0 mt-1 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0 text-sm space-y-2 border-t border-border/60">
          <p className="text-foreground/85 leading-relaxed pt-3">{f.message}</p>
          {f.codeRef && (
            <div className="text-xs"><span className="font-semibold text-muted-foreground">Code reference: </span><span className="font-mono">{f.codeRef}</span></div>
          )}
          {f.remediation && (
            <div className="text-xs rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
              <span className="font-semibold text-primary">Recommended action: </span>{f.remediation}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function PF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
