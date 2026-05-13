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

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "focus",
      "visibilitychange",
    ];

    reset();
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (warnRef.current) window.clearTimeout(warnRef.current);
      if (outRef.current) window.clearTimeout(outRef.current);
    };
  }, [enabled, warnAfterMs, timeoutAfterMs, onWarn, onTimeout]);

  return { lastActivity };
}
