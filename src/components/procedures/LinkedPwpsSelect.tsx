import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type PwpsOpt = {
  id: string;
  pwps_no: string;
  title: string | null;
  status: string | null;
  revision: string | null;
};

export function LinkedPwpsSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["pwps", "linked-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pwps")
        .select("id, pwps_no, title, status, revision")
        .is("deleted_at", null)
        .order("pwps_no", { ascending: true });
      if (error) throw error;
      // Only approved/qualified/saved pWPS are eligible to link to a WPS
      return ((data ?? []) as PwpsOpt[]).filter((p) => {
        const s = (p.status ?? "").toLowerCase();
        return s !== "rejected" && s !== "converted";
      });
    },
  });

  const byId = useMemo(() => {
    const m = new Map<string, PwpsOpt>();
    (data ?? []).forEach((p) => m.set(p.id, p));
    return m;
  }, [data]);

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between h-9 font-normal"
          >
            <span className="text-muted-foreground text-sm">
              {value.length === 0
                ? "Search and select linked pWPS…"
                : `${value.length} pWPS selected`}
            </span>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search pWPS number…" />
            <CommandList>
              {isLoading ? (
                <div className="py-6 flex justify-center">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>No pWPS found.</CommandEmpty>
                  <CommandGroup>
                    {(data ?? []).map((p) => {
                      const selected = value.includes(p.id);
                      return (
                        <CommandItem
                          key={p.id}
                          value={`${p.pwps_no} ${p.title ?? ""} ${p.status ?? ""}`}
                          onSelect={() => toggle(p.id)}
                        >
                          <Check className={cn("me-2 size-4", selected ? "opacity-100" : "opacity-0")} />
                          <span className="flex-1">{p.pwps_no}</span>
                          <span className="text-[11px] text-muted-foreground ms-2">
                            {p.status ?? ""}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((id) => {
            const p = byId.get(id);
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                {p?.pwps_no ?? id.slice(0, 8)}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="ms-1 rounded-sm hover:bg-muted-foreground/20"
                  aria-label="Remove"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
