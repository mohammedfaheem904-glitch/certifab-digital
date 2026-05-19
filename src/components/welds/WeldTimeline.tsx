import {
  Activity, ArrowRight, CircleDot, FilePlus, ShieldAlert, ShieldCheck,
} from "lucide-react";

type Event = {
  id: string;
  kind: string;
  created_at: string;
  payload?: any;
  actor_name?: string | null;
};

const KIND_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  created: FilePlus,
  status_change: ArrowRight,
  workflow_transition: Activity,
  blocked: ShieldAlert,
  approved: ShieldCheck,
};

function eventLabel(e: Event): { title: string; detail?: string } {
  if (e.kind === "workflow_transition") {
    const from = e.payload?.from, to = e.payload?.to;
    return {
      title: `Workflow → ${to ?? "?"}`,
      detail: from ? `from ${from}` : undefined,
    };
  }
  if (e.kind === "status_change") {
    return {
      title: `Status → ${e.payload?.to ?? "?"}`,
      detail: e.payload?.from ? `from ${e.payload.from}` : undefined,
    };
  }
  if (e.kind === "created") return { title: "Weld created" };
  return { title: e.kind.replace(/_/g, " ") };
}

export function WeldTimeline({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No activity yet — the timeline updates as the weld moves through the workflow.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <ol className="relative border-s border-border ms-2 space-y-5">
        {events.map((e) => {
          const Icon = KIND_ICON[e.kind] ?? CircleDot;
          const { title, detail } = eventLabel(e);
          return (
            <li key={e.id} className="ms-5">
              <span className="absolute -start-3 mt-0.5 size-6 rounded-full bg-card border border-border grid place-items-center">
                <Icon className="size-3 text-primary" />
              </span>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-[11px] text-muted-foreground">
                {new Date(e.created_at).toLocaleString()}
                {detail && <> · <span>{detail}</span></>}
                {e.actor_name && <> · <span>{e.actor_name}</span></>}
              </div>
              {e.payload?.reason && (
                <div className="mt-1 text-xs rounded-md bg-muted/40 px-2 py-1 border border-border/60">
                  {e.payload.reason}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
