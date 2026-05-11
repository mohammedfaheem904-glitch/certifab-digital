import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function NewRecordDialog({
  table,
  title,
  trigger,
  defaults = {},
  children,
}: {
  table: string;
  title: string;
  trigger?: string;
  defaults?: Record<string, any>;
  children: (opts: {
    values: Record<string, any>;
    set: (k: string, v: any) => void;
  }) => ReactNode;
}) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>(defaults);
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: any) => setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.company_id) {
      toast.error("No workspace.");
      return;
    }
    setBusy(true);
    const { error } = await (supabase.from(table as any) as any).insert({ ...values, company_id: profile.company_id });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Created.");
    qc.invalidateQueries({ queryKey: [table] });
    setOpen(false);
    setValues(defaults);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
          <Plus className="size-4 me-1" /> {trigger ?? "New"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">{children({ values, set })}</div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
