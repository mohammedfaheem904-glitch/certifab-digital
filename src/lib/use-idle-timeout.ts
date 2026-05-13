import { useEffect, useRef, useState } from "react";

/**
 * Idle timeout hook — fires `onWarn` after `warnAfterMs` of inactivity,
 * and `onTimeout` after `timeoutAfterMs`. Activity (mouse, key, touch,
 * focus, visibility change) resets the timers.
 */
export function useIdleTimeout({
  warnAfterMs,
  timeoutAfterMs,
  onWarn,
  onTimeout,
  enabled = true,
}: {
  warnAfterMs: number;
  timeoutAfterMs: number;
  onWarn: () => void;
  onTimeout: () => void;
  enabled?: boolean;
}) {
  const warnRef = useRef<number | null>(null);
  const outRef = useRef<number | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      setLastActivity(Date.now());
      if (warnRef.current) window.clearTimeout(warnRef.current);
      if (outRef.current) window.clearTimeout(outRef.current);
      warnRef.current = window.setTimeout(onWarn, warnAfterMs);
      outRef.current = window.setTimeout(onTimeout, timeoutAfterMs);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "focus",
    ] as const;

    reset();
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    document.addEventListener("visibilitychange", reset);

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", reset);
      if (warnRef.current) window.clearTimeout(warnRef.current);
      if (outRef.current) window.clearTimeout(outRef.current);
    };
  }, [enabled, warnAfterMs, timeoutAfterMs, onWarn, onTimeout]);

  return { lastActivity };
}
