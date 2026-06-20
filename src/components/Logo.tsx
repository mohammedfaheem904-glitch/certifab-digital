import logoAsset from "@/assets/weld-yard-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  /**
   * Renders the logo on a light chip so the dark wordmark stays legible
   * on dark surfaces (sidebar, marketing hero, etc.). Defaults to true.
   */
  chip?: boolean;
};

const HEIGHTS = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
} as const;

export function Logo({ size = "sm", className, chip = true }: LogoProps) {
  const img = (
    <img
      src={logoAsset.url}
      alt="Weld Yard"
      className={cn(HEIGHTS[size], "w-auto select-none")}
      draggable={false}
    />
  );
  if (!chip) return <span className={className}>{img}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-white px-2 py-1 border border-border/60",
        className,
      )}
    >
      {img}
    </span>
  );
}
