import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  FileText, ShieldCheck, User, Layers, ClipboardCheck, AlertOctagon, Wrench, Stamp,
  ArrowRight, ExternalLink,
} from "lucide-react";

interface Props { weld: any }

/**
 * Engineering-style traceability workspace.
 * Renders the connected records around a weld as clickable cards organised
 * into a left-to-right operational flow:
 *   Weld → WPS → WPQ → Welder → Materials → Inspections → NCRs → Calibration → Approvals
 */
export function TraceabilityGraph({ weld }: Props) {
  const wps = useQuery({
    queryKey: ["trace-wps", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await supabase.from("procedures").select("*").eq("id", weld.procedure_id).maybeSingle();
      return data as any;
    },
  });

  const wpq = useQuery({
    queryKey: ["trace-wpq", weld.welder_name],
    enabled: !!weld.welder_name,
    queryFn: async () => {
      const { data } = await supabase.from("qualifications").select("*")
        .ilike("welder_name", `%${weld.welder_name}%`)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data as any;
    },
  });

  const inspections = useQuery<any[]>({
    queryKey: ["trace-insp", weld.id],
    queryFn: async () => {
      const { data } = await supabase.from("inspections").select("*").eq("weld_id", weld.id).order("inspected_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const ncrs = useQuery<any[]>({
    queryKey: ["trace-ncr", weld.id],
    queryFn: async () => {
      const { data } = await (supabase.from("ncrs" as any) as any).select("*").eq("weld_id", weld.id);
      return (data ?? []) as any[];
    },
  });

  const approvals = useQuery<any[]>({
    queryKey: ["trace-appr", weld.procedure_id],
    enabled: !!weld.procedure_id,
    queryFn: async () => {
      const { data } = await (supabase.from("procedure_approvals" as any) as any)
        .select("*").eq("procedure_id", weld.procedure_id).order("signed_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const instruments = useQuery<any[]>({
    queryKey: ["trace-instr"],
    queryFn: async () => {
      const { data } = await supabase.from("instruments").select("*").order("calibration_due").limit(4);
      return (data ?? []) as any[];
    },
  });

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        End-to-end traceability for this weld. Click any card to open the underlying engineering record.
      </div>

      {/* Flow row 1 — Procedure side */}
      <FlowRow>
        <Node
          icon={Layers} tone="primary" label="Production Weld" title={weld.weld_no}
          subtitle={`${weld.weld_date} · ${weld.welder_name ?? "—"}`}
          rows={[
            ["Line", weld.line_no ?? "—"],
            ["Spool", weld.spool_no ?? "—"],
            ["Drawing", weld.drawing_ref ?? "—"],
          ]}
        />
        <Arrow />
        <Node
          icon={FileText} tone="info" label="WPS"
          title={wps.data?.code ?? wps.data?.wps_no ?? "Not linked"}
          subtitle={wps.data ? `${wps.data.process} · ${wps.data.standard}` : "Link a procedure"}
          to={wps.data ? "/app/procedures/$procedureId" : undefined}
          params={wps.data ? { procedureId: wps.data.id } : undefined}
          rows={wps.data ? [
            ["Status", wps.data.status],
            ["Revision", wps.data.revision],
            ["Position", wps.data.position_qualified ?? "—"],
          ] : []}
          missing={!wps.data}
        />
        <Arrow />
        <Node
          icon={ShieldCheck} tone="success" label="WPQ"
          title={wpq.data?.wpq_number ?? "Not linked"}
          subtitle={wpq.data ? `${wpq.data.process} · ${wpq.data.position_qualified ?? "—"}` : "No matching qualification"}
          to={wpq.data ? "/app/qualifications/$qualId" : undefined}
          params={wpq.data ? { qualId: wpq.data.id } : undefined}
          rows={wpq.data ? [
            ["Status", wpq.data.status],
            ["Expires", wpq.data.expiry_date ?? "—"],
            ["Continuity", wpq.data.last_continuity_date ?? "—"],
          ] : []}
          missing={!wpq.data}
        />
        <Arrow />
        <Node
          icon={User} tone="neutral" label="Welder"
          title={weld.welder_name ?? "—"}
          subtitle={wpq.data?.employee_id ?? "No employee ID"}
          rows={[
            ["Stamp", wpq.data?.stamp_number ?? "—"],
          ]}
        />
      </FlowRow>

      {/* Flow row 2 — Materials & Inspections */}
      <FlowRow>
        <Node
          icon={Layers} tone="neutral" label="Base Material" title={weld.base_material ?? "—"}
          subtitle={`Heat ${weld.heat_number ?? "—"}`}
          rows={[["Filler", weld.filler_metal ?? "—"]]}
        />
        <Arrow />
        <GroupNode
          icon={ClipboardCheck} tone="info" label="Inspections" count={inspections.data?.length ?? 0}
          items={(inspections.data ?? []).slice(0, 4).map((i) => ({
            id: i.id, title: i.inspection_type, sub: `${(i.severity ?? "—")} · ${new Date(i.inspected_at).toLocaleDateString()}`,
          }))}
          emptyLabel="No inspections logged"
        />
        <Arrow />
        <GroupNode
          icon={AlertOctagon} tone={(ncrs.data ?? []).some((n) => !["Closed","Verified"].includes(n.status)) ? "destructive" : "success"}
          label="NCRs" count={ncrs.data?.length ?? 0}
          items={(ncrs.data ?? []).slice(0, 4).map((n) => ({
            id: n.id, title: n.ncr_no, sub: `${n.status} · ${n.severity ?? "—"}`,
            to: "/app/ncrs/$ncrId", params: { ncrId: n.id },
          }))}
          emptyLabel="No NCRs raised"
        />
        <Arrow />
        <GroupNode
          icon={Wrench} tone="neutral" label="Calibration" count={instruments.data?.length ?? 0}
          items={(instruments.data ?? []).slice(0, 4).map((i) => ({
            id: i.id, title: i.asset_id, sub: `Due ${i.calibration_due ?? "—"}`,
            to: "/app/instruments/$instrumentId", params: { instrumentId: i.id },
          }))}
          emptyLabel="No instruments linked"
        />
        <Arrow />
        <GroupNode
          icon={Stamp} tone="success" label="Approvals" count={approvals.data?.length ?? 0}
          items={(approvals.data ?? []).slice(0, 4).map((a) => ({
            id: a.id, title: a.actor_name ?? a.actor_role ?? "Signatory",
            sub: `${a.action} · ${new Date(a.signed_at).toLocaleDateString()}`,
          }))}
          emptyLabel="No approvals on linked WPS"
        />
      </FlowRow>
    </div>
  );
}

/* ------------------- primitives ------------------- */

function FlowRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-stretch gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center text-muted-foreground/60 shrink-0">
      <ArrowRight className="size-4" />
    </div>
  );
}

type Tone = "primary" | "info" | "success" | "destructive" | "warning" | "neutral";
const toneCls = (t: Tone) =>
  t === "primary"     ? "border-primary/40 bg-primary/5" :
  t === "info"        ? "border-accent/40 bg-accent/5" :
  t === "success"     ? "border-success/40 bg-success/5" :
  t === "destructive" ? "border-destructive/40 bg-destructive/5" :
  t === "warning"     ? "border-warning/40 bg-warning/5" :
                        "border-border bg-card";
const toneText = (t: Tone) =>
  t === "primary" ? "text-primary" :
  t === "info" ? "text-accent" :
  t === "success" ? "text-success" :
  t === "destructive" ? "text-destructive" :
  t === "warning" ? "text-warning" :
                    "text-muted-foreground";

interface NodeProps {
  icon: typeof FileText;
  tone: Tone;
  label: string;
  title: string;
  subtitle?: string;
  rows?: Array<[string, string]>;
  to?: any;
  params?: any;
  missing?: boolean;
}
function Node({ icon: Icon, tone, label, title, subtitle, rows = [], to, params, missing }: NodeProps) {
  const inner = (
    <Card className={`min-w-[200px] w-[200px] p-3 border ${toneCls(missing ? "warning" : tone)} ${to ? "transition hover:shadow-md hover:-translate-y-px cursor-pointer" : ""} h-full`}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <Icon className={`size-3.5 ${toneText(missing ? "warning" : tone)}`} />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        {to && <ExternalLink className="size-3 text-muted-foreground" />}
      </div>
      <div className="mt-1.5 text-sm font-semibold leading-tight truncate">{title}</div>
      {subtitle && <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>}
      {rows.length > 0 && (
        <div className="mt-2 space-y-0.5 border-t border-border/60 pt-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 text-[11px]">
              <span className="text-muted-foreground">{k}</span>
              <span className="truncate text-right">{v ?? "—"}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
  if (to) return <Link to={to} params={params}>{inner}</Link>;
  return inner;
}

function GroupNode({
  icon: Icon, tone, label, count, items, emptyLabel,
}: {
  icon: typeof FileText; tone: Tone; label: string; count: number;
  items: Array<{ id: string; title: string; sub?: string; to?: any; params?: any }>;
  emptyLabel: string;
}) {
  return (
    <Card className={`min-w-[220px] w-[220px] p-3 border ${toneCls(tone)} h-full`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={`size-3.5 ${toneText(tone)}`} />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <span className={`text-xs font-semibold ${toneText(tone)}`}>{count}</span>
      </div>
      <div className="mt-2 space-y-1">
        {items.length === 0 && (
          <div className="text-[11px] text-muted-foreground italic">{emptyLabel}</div>
        )}
        {items.map((it) => {
          const row = (
            <div className="rounded border border-border/60 bg-background/40 px-2 py-1.5 text-xs hover:bg-background transition">
              <div className="font-medium truncate">{it.title}</div>
              {it.sub && <div className="text-[10px] text-muted-foreground truncate">{it.sub}</div>}
            </div>
          );
          return it.to ? (
            <Link key={it.id} to={it.to} params={it.params} className="block">{row}</Link>
          ) : <div key={it.id}>{row}</div>;
        })}
      </div>
    </Card>
  );
}
