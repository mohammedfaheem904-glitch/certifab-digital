import logoAsset from "@/assets/weld-yard-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /**
   * Render on a light chip so the dark wordmark stays legible on dark
   * surfaces. Defaults to true.
   */
  chip?: boolean;
};

const HEIGHTS = {
  sm: "h-10",
  md: "h-14",
  lg: "h-20",
  xl: "h-28",
} as const;

const CHIP_PAD = {
  sm: "px-2.5 py-1",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
  xl: "px-5 py-2.5",
} as const;

export function Logo({ size = "sm", className, chip = true }: LogoProps) {
  const img = (
    <img
      src={logoAsset.url}
      alt="Weld Yard"
      draggable={false}
      className={cn(HEIGHTS[size], "w-auto select-none object-contain")}
    />
  );
  if (!chip) return <span className={className}>{img}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-white shadow-[var(--shadow-elegant,0_4px_14px_-4px_hsl(0_0%_0%/0.25))] ring-1 ring-primary/30",
        CHIP_PAD[size],
        className,
      )}
    >
      {img}
    </span>
  );
}
