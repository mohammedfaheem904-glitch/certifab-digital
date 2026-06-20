import logoAsset from "@/assets/weld-yard-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const HEIGHTS = {
  sm: "h-14",
  md: "h-20",
  lg: "h-28",
  xl: "h-36",
} as const;

export function Logo({ size = "sm", className }: LogoProps) {
  return (
    <img
      src={logoAsset.url}
      alt="Weld Yard"
      draggable={false}
      className={cn(HEIGHTS[size], "w-auto select-none object-contain", className)}
    />
  );
}
