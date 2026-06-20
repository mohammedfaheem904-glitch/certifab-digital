import logoAsset from "@/assets/weld-yard-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const HEIGHTS = {
  sm: "h-12",
  md: "h-16",
  lg: "h-24",
  xl: "h-32",
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
