import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BASE_MATERIALS, formatBaseMaterial, type BaseMaterial } from "@/lib/wps-base-materials";

export interface BaseMaterialComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onSelectMaterial?: (m: BaseMaterial) => void;
  placeholder?: string;
  className?: string;
}

export function BaseMaterialCombobox({
  value,
  onChange,
  onSelectMaterial,
  placeholder = "Select or type base material…",
  className,
}: BaseMaterialComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const matches = React.useMemo(
    () => BASE_MATERIALS.some((m) => formatBaseMaterial(m).toLowerCase() === value.toLowerCase()),
    [value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("h-9 w-full justify-between font-normal", className)}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ms-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={true}>
          <CommandInput
            placeholder="Search or enter custom…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              <button
                type="button"
                className="w-full text-left text-sm px-2 py-1.5 hover:bg-accent rounded"
                onClick={() => {
                  if (search.trim()) {
                    onChange(search.trim());
                    setOpen(false);
                    setSearch("");
                  }
                }}
              >
                {search.trim() ? `Use custom: "${search.trim()}"` : "No matches."}
              </button>
            </CommandEmpty>
            <CommandGroup>
              {BASE_MATERIALS.map((m) => {
                const label = formatBaseMaterial(m);
                return (
                  <CommandItem
                    key={`${m.spec}-${m.grade}-${m.uns}`}
                    value={`${label} ${m.uns} ${m.family} ${m.description} P-${m.p_no}`}
                    onSelect={() => {
                      onChange(label);
                      onSelectMaterial?.(m);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "me-2 size-4",
                        value === label ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm">{label}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        P-{m.p_no}
                        {m.group_no ? `, Group ${m.group_no}` : ""} · {m.family} · {m.description}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {search.trim() && !matches && (
              <div className="border-t p-1">
                <button
                  type="button"
                  className="w-full text-left text-sm px-2 py-1.5 hover:bg-accent rounded"
                  onClick={() => {
                    onChange(search.trim());
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  Use custom: <span className="font-medium">"{search.trim()}"</span>
                </button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
