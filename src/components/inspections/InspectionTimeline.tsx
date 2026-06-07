export function InspectionTimeline({ events }: { events: any[] }) {
  if (!events.length) {
    return <div className="text-sm text-muted-foreground">No workflow events yet.</div>;
  }
  return (
    <ol className="relative border-s border-border ms-2 space-y-4">
      {events.map((e) => (
        <li key={e.id} className="ms-4">
          <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full bg-primary/70" />
          <div className="text-sm font-medium capitalize">{String(e.kind).replace(/_/g, " ")}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(e.created_at).toLocaleString()}
            {e.actor_name ? ` · ${e.actor_name}` : ""}
          </div>
          {e.comment && <div className="text-xs mt-1 whitespace-pre-wrap">{e.comment}</div>}
        </li>
      ))}
    </ol>
  );
}
