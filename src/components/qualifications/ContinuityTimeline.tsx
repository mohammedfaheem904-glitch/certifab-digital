import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { fmtEngDate } from "@/lib/doc-number";
import { continuityBroken, continuityWarning } from "@/lib/qualification-status";

export function ContinuityTimeline({
  qualificationId,
  rows,
  onChange,
}: {
  qualificationId: string;
  rows: any[];
  onChange: () => void;
}) {
  const { profile, user } = useAuth();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [process, setProcess] = useState("");
  const [notes, setNotes] = useState("");

  const last = rows[0]?.activity_date ?? null;
  const broken = continuityBroken(last);
  const warning = continuityWarning(last);

  const add = async () => {
    if (!profile?.company_id) return;
    const { error } = await (supabase.from("qualification_continuity" as any) as any).insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      activity_date: date,
      process: process || null,
      notes: notes || null,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setProcess("");
    setNotes("");
    onChange();
    toast.success("Continuity entry added.");
  };

  return (
    <div className="space-y-4">
      {/* Health banner */}
      <div className={`rounded-md border p-3 flex items-center gap-3 text-sm
        ${broken ? "border-destructive/40 bg-destructive/10 text-destructive"
          : warning ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
        {broken ? <AlertTriangle className="size-4" />
          : warning ? <Clock className="size-4" />
          : <CheckCircle2 className="size-4" />}
        <div>
          {broken && <>Continuity broken — last activity over 6 months ago. Welder must re-qualify per ASME IX QW-322.</>}
          {!broken && warning && <>Continuity at risk — log activity within 30 days to maintain qualification.</>}
          {!broken && !warning && last && <>Continuity OK — last activity {fmtEngDate(last)}.</>}
          {!last && <>No continuity activity logged yet.</>}
        </div>
      </div>

      {/* Quick add */}
      <div className="rounded-md border border-border p-4 grid sm:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Activity date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Process</Label>
          <Input value={process} onChange={(e) => setProcess(e.target.value)} placeholder="GTAW" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Notes</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Project / weld evidence" />
        </div>
        <div className="sm:col-span-4">
          <Button size="sm" onClick={add}><Plus className="size-4 me-1" /> Log activity</Button>
        </div>
      </div>

      {/* Timeline */}
      <ol className="relative border-s border-border ms-2 space-y-4">
        {rows.length === 0 && (
          <div className="text-sm text-muted-foreground ms-4">No continuity entries yet.</div>
        )}
        {rows.map((r) => (
          <li key={r.id} className="ms-4 relative">
            <div className="absolute -start-[22px] mt-1.5 size-3 rounded-full bg-primary/70" />
            <div className="text-sm font-medium">{fmtEngDate(r.activity_date)}</div>
            <div className="text-xs text-muted-foreground">
              {r.process ?? "—"}{r.notes ? ` · ${r.notes}` : ""}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
