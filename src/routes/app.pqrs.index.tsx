import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ModulePage } from "@/components/ModulePage";
import { NewRecordDialog } from "@/components/NewRecordDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type PqrRow = {
  id: string;
  pqr_no: string;
  pwps_id: string | null;
  revision: string;
  status: string;
  code_family: string;
  standard: string | null;
  overall_result: string;
  qualification_date: string | null;
  expiry_date: string | null;
  resulting_wps_id: string | null;
  created_at: string;
};

type PwpsOpt = { id: string; pwps_no: string };

export const Route = createFileRoute("/app/pqrs/")({
  component: PqrsIndexPage,
});

const RESULT_TONE: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground border-border",
  Passed: "bg-success/15 text-success border-success/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  Inconclusive: "bg-warning/15 text-warning border-warning/30",
};

function PqrsIndexPage() {
  const { profile } = useAuth();
  const cid = profile?.company_id;
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery<PqrRow[]>({
    queryKey: ["pqrs", cid],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pqrs" as any) as any)
        .select("*")
        .eq("company_id", cid!)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PqrRow[];
    },
  });

  const { data: pwpsOpts } = useQuery<PwpsOpt[]>({
    queryKey: ["pwps-options", cid],
    enabled: !!cid,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pwps" as any) as any)
        .select("id,pwps_no")
        .eq("company_id", cid!)
        .is("deleted_at", null)
        .order("pwps_no");
      if (error) throw error;
      return (data ?? []) as PwpsOpt[];
    },
  });

  const filtered = (data ?? []).filter((p) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [p.pqr_no, p.standard, p.code_family, p.status, p.overall_result]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(s));
  });

  return (
    <ModulePage
      title="PQR (Procedure Qualification Records)"
      subtitle="Qualification tests that validate a pWPS. A Passed and signed PQR auto-creates a Draft WPS in the Procedures module."
      action={
        <NewRecordDialog
          table="pqrs"
          title="New PQR"
          trigger="New PQR"
          defaults={{ revision: "Rev 0", status: "Draft", code_family: "ASME IX", overall_result: "Pending", qualified_ranges: {} }}
        >
          {({ values, set }) => (
            <div className="grid grid-cols-2 gap-3">
              <F label="PQR number">
                <Input required value={values.pqr_no ?? ""} onChange={(e) => set("pqr_no", e.target.value)} placeholder="PQR-001" />
              </F>
              <F label="Linked pWPS">
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm w-full"
                  value={values.pwps_id ?? ""}
                  onChange={(e) => set("pwps_id", e.target.value || null)}
                >
                  <option value="">— Select pWPS —</option>
                  {(pwpsOpts ?? []).map((o) => (
                    <option key={o.id} value={o.id}>{o.pwps_no}</option>
                  ))}
                </select>
              </F>
              <F label="Code family">
                <Input value={values.code_family ?? "ASME IX"} onChange={(e) => set("code_family", e.target.value)} />
              </F>
              <F label="Standard">
                <Input value={values.standard ?? ""} onChange={(e) => set("standard", e.target.value)} placeholder="ASME IX 2023" />
              </F>
              <F label="Test date">
                <Input type="date" value={values.test_date ?? ""} onChange={(e) => set("test_date", e.target.value || null)} />
              </F>
              <F label="Revision">
                <Input value={values.revision ?? "Rev 0"} onChange={(e) => set("revision", e.target.value)} />
              </F>
            </div>
          )}
        </NewRecordDialog>
      }
    >
      <div className="p-3 border-b border-border">
        <Input
          placeholder="Search by number, standard, status…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm bg-background/60"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <Th>PQR No.</Th>
              <Th>Code</Th>
              <Th>Standard</Th>
              <Th>Status</Th>
              <Th>Result</Th>
              <Th>Qualified</Th>
              <Th>Resulting WPS</Th>
              <th className="text-end font-medium px-5 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Empty colSpan={8}><Loader2 className="size-4 animate-spin inline" /> Loading…</Empty>}
            {!isLoading && filtered.length === 0 && <Empty colSpan={8}>No PQRs yet — create one from a Pending Validation pWPS.</Empty>}
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => nav({ to: "/app/pqrs/$pqrId", params: { pqrId: p.id } })}
                className="border-t border-border/60 hover:bg-muted/20 cursor-pointer"
              >
                <td className="px-5 py-3 font-medium">{p.pqr_no}</td>
                <td className="px-5 py-3">{p.code_family}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.standard ?? "—"}</td>
                <td className="px-5 py-3">{p.status}</td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={RESULT_TONE[p.overall_result] ?? ""}>{p.overall_result}</Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {p.qualification_date ? new Date(p.qualification_date).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-3">
                  {p.resulting_wps_id ? <Badge variant="outline" className="bg-success/10 text-success border-success/30">Created</Badge> : "—"}
                </td>
                <td className="px-5 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); nav({ to: "/app/pqrs/$pqrId", params: { pqrId: p.id } }); }}
                      aria-label="Open PQR"
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
    <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</td></tr>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>
  );
}
