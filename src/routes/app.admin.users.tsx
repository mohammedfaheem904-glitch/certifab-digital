import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole, type ApprovalStatus } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldAlert, Check, X, UserCheck, Clock, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/app/admin/users")({
  component: UserManagementPage,
});

const ROLES: AppRole[] = [
  "super_admin", "qa_qc_manager", "welding_engineer", "inspector", "welder", "client_viewer",
];
const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super Admin",
  qa_qc_manager: "QA/QC Manager",
  welding_engineer: "Welding Engineer",
  inspector: "Inspector",
  welder: "Welder",
  client_viewer: "Client Viewer",
};

type UserRow = {
  id: string;
  display_name: string | null;
  job_title: string | null;
  avatar_url: string | null;
  approval_status: ApprovalStatus;
  pending_role: AppRole | null;
  rejection_reason: string | null;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
};

function UserManagementPage() {
  const { profile, roles, user } = useAuth();
  const cid = profile?.company_id;
  const isAdmin = roles.includes("super_admin");
  const qc = useQueryClient();

  const { data: users, isLoading } = useQuery<UserRow[]>({
    queryKey: ["admin-users", cid],
    enabled: !!cid && isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, job_title, avatar_url, approval_status, pending_role, rejection_reason, created_at, approved_at, rejected_at")
        .eq("company_id", cid as string)
        .order("created_at", { ascending: false });
      return (data as UserRow[]) ?? [];
    },
  });

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <ShieldAlert className="size-8 mx-auto text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold">Restricted area</h2>
        <p className="text-sm text-muted-foreground mt-1">
          User management is available to workspace administrators only.
        </p>
      </div>
    );
  }

  const pending = (users ?? []).filter((u) => u.approval_status === "pending");
  const approved = (users ?? []).filter((u) => u.approval_status === "approved");
  const rejected = (users ?? []).filter((u) => u.approval_status === "rejected");

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users", cid] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review new signups and manage workspace access.
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="size-3.5" /> Pending
            {pending.length > 0 && (
              <Badge variant="secondary" className="ms-1">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <UserCheck className="size-3.5" /> Approved
            <Badge variant="secondary" className="ms-1">{approved.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <Ban className="size-3.5" /> Rejected
            <Badge variant="secondary" className="ms-1">{rejected.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <UserList
            users={pending}
            loading={isLoading}
            emptyText="No pending requests. New signups will appear here."
            renderActions={(u) => (
              <div className="flex items-center gap-2">
                <ApproveDialog user={u} onDone={refresh} />
                <RejectDialog user={u} onDone={refresh} />
              </div>
            )}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <UserList
            users={approved}
            loading={isLoading}
            emptyText="No approved users yet."
            renderActions={(u) => (
              u.id === user?.id ? (
                <Badge variant="outline">You</Badge>
              ) : (
                <RejectDialog user={u} onDone={refresh} label="Revoke access" />
              )
            )}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <UserList
            users={rejected}
            loading={isLoading}
            emptyText="No rejected users."
            renderActions={(u) => <ApproveDialog user={u} onDone={refresh} label="Re-approve" />}
            showReason
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserList({
  users, loading, emptyText, renderActions, showReason,
}: {
  users: UserRow[];
  loading: boolean;
  emptyText: string;
  renderActions: (u: UserRow) => React.ReactNode;
  showReason?: boolean;
}) {
  if (loading) {
    return <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (users.length === 0) {
    return <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">{emptyText}</div>;
  }
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
      {users.map((u) => {
        const initials = (u.display_name ?? "?").slice(0, 2).toUpperCase();
        return (
          <li key={u.id} className="px-5 py-3 flex items-center gap-4">
            <Avatar className="size-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{u.display_name ?? "Unnamed user"}</div>
              <div className="text-xs text-muted-foreground truncate">
                {u.job_title ?? "—"} · Signed up {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
                {u.pending_role && u.approval_status === "pending" && (
                  <> · Requested role <span className="text-foreground">{ROLE_LABEL[u.pending_role]}</span></>
                )}
              </div>
              {showReason && u.rejection_reason && (
                <div className="text-xs text-muted-foreground mt-1 italic">
                  Reason: {u.rejection_reason}
                </div>
              )}
            </div>
            <div className="shrink-0">{renderActions(u)}</div>
          </li>
        );
      })}
    </ul>
  );
}

function ApproveDialog({ user, onDone, label }: { user: UserRow; onDone: () => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<AppRole>(user.pending_role ?? "client_viewer");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("approve_user", { _user_id: user.id, _role: role });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${user.display_name ?? "User"} approved as ${ROLE_LABEL[role]}`);
    setOpen(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Check className="size-3.5" /> {label ?? "Approve"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve {user.display_name ?? "user"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Assign role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ user, onDone, label }: { user: UserRow; onDone: () => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("reject_user", { _user_id: user.id, _reason: reason || null as any });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${user.display_name ?? "User"} rejected`);
    setOpen(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <X className="size-3.5" /> {label ?? "Reject"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label ?? "Reject"} {user.display_name ?? "user"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Reason (optional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Shown to the user on their next sign-in"
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : (label ?? "Reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
