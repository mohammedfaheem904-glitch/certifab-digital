import { useEffect, useState } from "react";
import { surfaceHasUnseen, type Feature } from "@/lib/discovery";

/** Tiny "NEW" pill shown on sidebar items whose surface has unseen features. */
export function NewPill({ surface }: { surface: Feature["surface"] }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const refresh = () => setShow(surfaceHasUnseen(surface));
    refresh();
    window.addEventListener("cf:discovery-changed", refresh);
    return () => window.removeEventListener("cf:discovery-changed", refresh);
  }, [surface]);
  if (!show) return null;
  return (
    <span className="ms-auto text-[9px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 bg-primary text-primary-foreground">
      New
    </span>
  );
}
