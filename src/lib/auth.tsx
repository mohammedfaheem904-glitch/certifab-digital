import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "super_admin"
  | "qa_qc_manager"
  | "welding_engineer"
  | "inspector"
  | "welder"
  | "client_viewer";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  company_id: string | null;
  display_name: string | null;
  job_title: string | null;
  avatar_url: string | null;
  approval_status: ApprovalStatus;
  rejection_reason: string | null;
};


type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  companyName: string | null;
  companyLogo: string | null;
  reportFooter: string | null;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  loading: true,
  session: null,
  user: null,
  profile: null,
  roles: [],
  companyName: null,
  companyLogo: null,
  reportFooter: null,
  signOut: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [reportFooter, setReportFooter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { data: p } = await supabase
      .from("profiles")
      .select("id, company_id, display_name, job_title, avatar_url, approval_status, rejection_reason")
      .eq("id", uid)
      .maybeSingle();
    setProfile((p as Profile | null) ?? null);


    const { data: rs } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    setRoles((rs ?? []).map((r) => r.role as AppRole));

    if (p?.company_id) {
      const { data: c } = await supabase
        .from("companies")
        .select("name, logo_url, report_footer")
        .eq("id", p.company_id)
        .maybeSingle();
      setCompanyName(c?.name ?? null);
      setCompanyLogo(c?.logo_url ?? null);
      setReportFooter(c?.report_footer ?? null);
    } else {
      setCompanyName(null);
      setCompanyLogo(null);
      setReportFooter(null);
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => loadProfile(s.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
        setCompanyName(null);
        setCompanyLogo(null);
        setReportFooter(null);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider
      value={{
        loading,
        session,
        user,
        profile,
        roles,
        companyName,
        companyLogo,
        reportFooter,
        signOut: async () => {
          await supabase.auth.signOut();
        },
        refresh: async () => {
          if (user) await loadProfile(user.id);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
