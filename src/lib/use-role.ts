import { useAuth, type AppRole } from "@/lib/auth";

export function useHasRole(role: AppRole) {
  const { roles } = useAuth();
  return roles.includes(role);
}

export function useIsSuperAdmin() {
  return useHasRole("super_admin");
}

const EDITOR_ROLES: AppRole[] = [
  "super_admin",
  "qa_qc_manager",
  "welding_engineer",
  "inspector",
];

export function useIsEditor() {
  const { roles } = useAuth();
  return roles.some((r) => EDITOR_ROLES.includes(r));
}
