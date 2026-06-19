import logoAsset from "@/assets/weld-yard-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const HEIGHTS = {
  sm: "h-10",
  md: "h-14",
  lg: "h-20",
  xl: "h-28",
} as const;

export function Logo({ size = "sm", className }: LogoProps) {
  return (
    <img
      src={logoAsset.url}
      alt="Weld Yard"
      draggable={false}
      className={cn(
        HEIGHTS[size],
        "w-auto select-none object-contain",
        // Brighten the dark wordmark on dark surfaces while preserving the
        // yellow mark hue, so the logo reads on the site's dark palette.
        "[filter:drop-shadow(0_1px_0_hsl(var(--background)/0.4))]",
        className,
      )}
    />
  );
}
