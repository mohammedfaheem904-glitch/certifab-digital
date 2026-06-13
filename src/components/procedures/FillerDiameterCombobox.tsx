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

const FILLER_DIAMETERS = [
  "0.8 mm",
  "1.0 mm",
  "1.2 mm",
  "1.6 mm",
  "2.0 mm",
  "2.4 mm",
  "2.5 mm",
  "3.2 mm",
  "4.0 mm",
  "5.0 mm",
  "6.0 mm",
];

export interface FillerDiameterComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function FillerDiameterCombobox({
  value,
  onChange,
  disabled,
  className,
}: FillerDiameterComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const matches = React.useMemo(
    () => FILLER_DIAMETERS.some((d) => d.toLowerCase() === value.toLowerCase()),
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
          disabled={disabled}
          className={cn("h-9 w-full justify-between font-normal", className)}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || "Select or type diameter…"}
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
              {FILLER_DIAMETERS.map((d) => (
                <CommandItem
                  key={d}
                  value={d}
                  onSelect={() => {
                    onChange(d);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn("me-2 size-4", value === d ? "opacity-100" : "opacity-0")}
                  />
                  <span className="text-sm">{d}</span>
                </CommandItem>
              ))}
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
