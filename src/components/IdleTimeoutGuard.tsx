import { useCallback, useState } from "react";
import { useIdleTimeout } from "@/lib/use-idle-timeout";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WARN_MS = 30 * 60 * 1000; // 30 min idle → warning
const OUT_MS = 60 * 60 * 1000; // 60 min idle → auto sign-out

/**
 * Mounted inside the authenticated app shell. Warns the user at 30 min
 * of inactivity and signs them out at 60 min for compliance/security.
 */
export function IdleTimeoutGuard() {
  const { session, signOut } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [warnOpen, setWarnOpen] = useState(false);

  const fullSignOut = useCallback(async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOut();
    nav({ to: "/login", replace: true });
  }, [qc, signOut, nav]);

  const onWarn = useCallback(() => setWarnOpen(true), []);
  const onTimeout = useCallback(async () => {
    setWarnOpen(false);
    await fullSignOut();
  }, [fullSignOut]);

  useIdleTimeout({
    enabled: !!session,
    warnAfterMs: WARN_MS,
    timeoutAfterMs: OUT_MS,
    onWarn,
    onTimeout,
  });

  return (
    <AlertDialog open={warnOpen} onOpenChange={setWarnOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You're still there?</AlertDialogTitle>
          <AlertDialogDescription>
            For security, your session will end in 30 minutes of continued
            inactivity. Move your mouse or press a key to stay signed in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => fullSignOut()}>
            Sign out now
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => setWarnOpen(false)}>
            Stay signed in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
