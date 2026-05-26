import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ModulePage } from "@/components/ModulePage";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PWPS_STATUS_TONE, type PwpsStatus } from "@/lib/pwps-workflow";

type Row = {
  id: string;
  pwps_no: string;
  title: string | null;
  revision: string;
  status: PwpsStatus;
  code_family: string;
  standard: string | null;
  process: string | null;
  position: string | null;
  base_material: string | null;
  created_at: string;
};

export const Route = createFileRoute("/app/pwps/")({
  component: PwpsIndexPage,
});

function PwpsIndexPage() {
  const { profile } = useAuth();
  const cid = profile?.company_id;
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery<Row[]>({
    queryKey: ["pwps", cid],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pwps" as any) as any)
        .select("*")
        .eq("company_id", cid!)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const filtered = (data ?? []).filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.pwps_no, p.title, p.standard, p.process, p.status, p.code_family]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(s));
  });

  return (
    <ModulePage
      title="Preliminary WPS (pWPS)"
      subtitle="Candidate welding procedures undergoing qualification. A pWPS becomes a production WPS only after a PQR passes."
      action={
        <NewRecordDialog
          table="pwps"
          title="New Preliminary WPS"
          trigger="New pWPS"
          defaults={{ revision: "Rev 0", status: "Draft", code_family: "ASME IX" }}
        >
          {({ values, set }) => (
            <div className="grid grid-cols-2 gap-3">
              <F label="pWPS number">
                <Input required value={values.pwps_no ?? ""} onChange={(e) => set("pwps_no", e.target.value)} placeholder="pWPS-GTAW-001" />
              </F>
              <F label="Title">
                <Input value={values.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="GTAW root + SMAW fill, P-1 to P-1" />
              </F>
              <F label="Code family">
                <Input value={values.code_family ?? "ASME IX"} onChange={(e) => set("code_family", e.target.value)} />
              </F>
              <F label="Standard">
                <Input value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX 2023" />
              </F>
              <F label="Process">
                <Input value={values.process ?? ""} onChange={(e) => set("process", e.target.value)} placeholder="GTAW" />
              </F>
              <F label="Joint type">
                <Input value={values.joint_type ?? ""} onChange={(e) => set("joint_type", e.target.value)} placeholder="Butt" />
              </F>
              <F label="Groove type">
                <Input value={values.groove_type ?? ""} onChange={(e) => set("groove_type", e.target.value)} placeholder="V" />
              </F>
              <F label="Position">
                <Input value={values.position ?? ""} onChange={(e) => set("position", e.target.value)} placeholder="6G" />
              </F>
              <F label="Base material">
                <Input value={values.base_material ?? ""} onChange={(e) => set("base_material", e.target.value)} placeholder="SA-106 Gr B" />
              </F>
              <F label="P-Number">
                <Input value={values.p_number ?? ""} onChange={(e) => set("p_number", e.target.value)} placeholder="P-1" />
              </F>
              <F label="Group No.">
                <Input value={values.group_number ?? ""} onChange={(e) => set("group_number", e.target.value)} placeholder="1" />
              </F>
              <F label="Filler classification">
                <Input value={values.filler_classification ?? ""} onChange={(e) => set("filler_classification", e.target.value)} placeholder="ER70S-2" />
              </F>
              <F label="Thickness min (mm)">
                <Input type="number" step="0.1" value={values.thickness_min_mm ?? ""} onChange={(e) => set("thickness_min_mm", parseFloat(e.target.value) || null)} />
              </F>
              <F label="Thickness max (mm)">
                <Input type="number" step="0.1" value={values.thickness_max_mm ?? ""} onChange={(e) => set("thickness_max_mm", parseFloat(e.target.value) || null)} />
              </F>
            </div>
          )}
        </NewRecordDialog>
      }
    >
      <div className="p-3 border-b border-border">
        <Input
          placeholder="Search by number, title, process, status…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm bg-background/60"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>pWPS No.</Th>
              <Th>Title</Th>
              <Th>Code</Th>
              <Th>Process</Th>
              <Th>Position</Th>
              <Th>Revision</Th>
              <Th>Status</Th>
              <th className="text-end font-medium px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <Empty colSpan={8}>
                <Loader2 className="size-4 animate-spin inline" /> Loading…
              </Empty>
            )}
            {!isLoading && filtered.length === 0 && (
              <Empty colSpan={8}>No preliminary WPS yet — start one to begin qualification.</Empty>
            )}
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => nav({ to: "/app/pwps/$pwpsId", params: { pwpsId: p.id } })}
                className="border-t border-border/60 hover:bg-muted/20 cursor-pointer"
              >
                <td className="px-5 py-3 font-medium">{p.pwps_no}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.title ?? "—"}</td>
                <td className="px-5 py-3">{p.code_family}</td>
                <td className="px-5 py-3">{p.process ?? "—"}</td>
                <td className="px-5 py-3">{p.position ?? "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.revision}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                      PWPS_STATUS_TONE[p.status] ?? "",
                    )}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        nav({ to: "/app/pwps/$pwpsId", params: { pwpsId: p.id } });
                      }}
                      aria-label="Open pWPS"
                    >
                      <Eye className="size-4" />
                    </Button>
                    <ChevronRight className="size-4 ms-1 text-muted-foreground" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModulePage>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-medium px-5 py-2.5">{children}</th>;
}
function Empty({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

