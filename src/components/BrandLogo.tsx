import logoAsset from "@/assets/weld-yard-logo.png.asset.json";

/**
 * Weld Yard brand logo. Transparent PNG — no container, badge, ring, or background.
 */
export function BrandLogo({ className = "size-9" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Weld Yard"
      className={`${className} object-contain shrink-0`}
      draggable={false}
    />
  );
}
