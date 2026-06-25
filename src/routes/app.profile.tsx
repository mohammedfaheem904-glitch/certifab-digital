import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ModulePage } from "@/components/ModulePage";
import { ProfilePictureUploader } from "@/components/ProfilePictureUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, refresh } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [jobTitle, setJobTitle] = useState(profile?.job_title ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setJobTitle(profile?.job_title ?? "");
  }, [profile?.display_name, profile?.job_title]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName || null, job_title: jobTitle || null })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated.");
    refresh();
  };

  return (
    <ModulePage title="My Profile" subtitle="Personal account details and profile picture.">
      <div className="p-5 max-w-2xl space-y-8">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <UserCircle2 className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Profile picture</h3>
          </div>
          <ProfilePictureUploader />
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <h3 className="text-sm font-semibold">Account details</h3>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Job title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. QA/QC Manager" />
          </div>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
        </section>
      </div>
    </ModulePage>
  );
}
