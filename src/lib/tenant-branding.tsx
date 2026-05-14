import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TenantBranding = {
  id: string;
  name: string;
  logo_url: string | null;
  report_footer: string | null;
};

type Ctx = {
  loading: boolean;
  /** Resolved when the current host matches a company's `dedicated_domain`. */
  branding: TenantBranding | null;
  host: string | null;
};

const TenantCtx = createContext<Ctx>({ loading: true, branding: null, host: null });

/** Hosts we never bother resolving (Lovable preview/sandbox infra). */
const SKIP_HOST_SUFFIXES = [".lovable.app", ".lovable.dev", "localhost", "127.0.0.1"];

export function TenantBrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    const h = window.location.host.toLowerCase();
    setHost(h);

    const isInfra =
      SKIP_HOST_SUFFIXES.some((s) => h === s || h.endsWith(s)) ||
      /^id-preview--/.test(h) ||
      /^project--/.test(h);
    if (isInfra) {
      setLoading(false);
      return;
    }

    (supabase.rpc as any)("get_company_branding_by_domain", { _host: h })
      .then(({ data }: any) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row) setBranding(row as TenantBranding);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return <TenantCtx.Provider value={{ loading, branding, host }}>{children}</TenantCtx.Provider>;
}

export const useTenantBranding = () => useContext(TenantCtx);
