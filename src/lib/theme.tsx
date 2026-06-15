import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme-preference";

type Ctx = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
};

const ThemeCtx = createContext<Ctx>({
  preference: "system",
  resolved: "dark",
  setPreference: () => {},
});

function readSystem(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readStored(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStored());
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => readSystem());
  const { user } = useAuth();

  const resolved: ResolvedTheme = preference === "system" ? systemTheme : preference;

  // Track system changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "light" : "dark");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Apply to <html>
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // Load from profile on login
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("theme_preference")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const v = (data as { theme_preference?: string }).theme_preference;
        if (v === "light" || v === "dark" || v === "system") {
          setPreferenceState(v);
          window.localStorage.setItem(STORAGE_KEY, v);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const setPreference = useCallback(
    (p: ThemePreference) => {
      setPreferenceState(p);
      try {
        window.localStorage.setItem(STORAGE_KEY, p);
      } catch {}
      if (user) {
        void supabase
          .from("profiles")
          .update({ theme_preference: p })
          .eq("id", user.id);
      }
    },
    [user?.id],
  );

  const value = useMemo(() => ({ preference, resolved, setPreference }), [preference, resolved, setPreference]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

// Initialize ASAP before React mounts to avoid flash.
export function initThemeEarly() {
  if (typeof document === "undefined") return;
  const pref = readStored();
  const resolved: ResolvedTheme = pref === "system" ? readSystem() : pref;
  applyTheme(resolved);
}
