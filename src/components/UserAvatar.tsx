import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { resolveAvatarUrl } from "@/lib/avatar";

type Props = {
  /** Storage path or absolute URL stored in profiles.avatar_url. */
  src?: string | null;
  /** Used to derive initials when no image is available. */
  name?: string | null;
  email?: string | null;
  className?: string;
  /** Tailwind text class for the fallback initials. */
  fallbackClassName?: string;
};

function initialsFor(name?: string | null, email?: string | null) {
  const base = (name || email || "U").trim();
  return (
    base
      .split(/[ .@_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export function UserAvatar({ src, name, email, className, fallbackClassName }: Props) {
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setResolved(null);
      return;
    }
    resolveAvatarUrl(src).then((u) => {
      if (!cancelled) setResolved(u);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <Avatar className={cn("size-8", className)}>
      {resolved ? <AvatarImage src={resolved} alt={name || email || "User avatar"} /> : null}
      <AvatarFallback className={cn("bg-accent text-accent-foreground text-xs", fallbackClassName)}>
        {initialsFor(name, email)}
      </AvatarFallback>
    </Avatar>
  );
}
