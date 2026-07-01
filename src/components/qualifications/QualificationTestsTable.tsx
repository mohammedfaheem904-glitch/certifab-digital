import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const NDT = ["VT", "MT", "PT", "RT", "UT"];
const DT = ["Macro", "Root Bend", "Face Bend", "Side Bend", "Fillet Break", "Tensile", "Nick Break", "Hardness"];
const RESULTS = ["Acceptable", "Not Acceptable", "N/A"];

export function QualificationTestsTable({
  qualificationId,
  rows,
  onChange,
}: {
  qualificationId: string;
  rows: any[];
  onChange: () => void;
}) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<"ndt" | "destructive">("ndt");

  const ndt = rows.filter((r) => r.category === "ndt");
  const dt = rows.filter((r) => r.category === "destructive");

  const add = async (category: "ndt" | "destructive", test_type: string) => {
    if (!profile?.company_id) return;
    const { error } = await (supabase.from("qualification_tests" as any) as any).insert({
      company_id: profile.company_id,
      qualification_id: qualificationId,
      category,
      test_type,
      result: "N/A",
    });
    if (error) toast.error(error.message);
    else onChange();
  };

  const update = async (id: string, patch: Record<string, any>) => {
    const { error } = await (supabase.from("qualification_tests" as any) as any)
      .update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };

  const remove = async (id: string) => {
    const { error } = await (supabase.from("qualification_tests" as any) as any)
      .delete().eq("id", id);
    if (error) toast.error(error.message);
    else onChange();
  };

  const renderTable = (data: any[], options: string[], category: "ndt" | "destructive") => (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground bg-muted/40">
            <tr>
              <th className="text-start font-medium px-3 py-2">Test</th>
              <th className="text-start font-medium px-3 py-2">Result</th>
              <th className="text-start font-medium px-3 py-2">Report #</th>
              <th className="text-start font-medium px-3 py-2">Inspector</th>
              <th className="text-start font-medium px-3 py-2">Date</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground text-sm">
                  No {category === "ndt" ? "NDT" : "destructive"} tests recorded.
                </td>
              </tr>
            )}
            {data.map((r) => (
              <tr key={r.id} className="border-t border-border/60">
                <td className="px-3 py-2 font-medium">{r.test_type}</td>
                <td className="px-3 py-2">
                  <select
                    defaultValue={r.result ?? "N/A"}
                    onChange={(e) => update(r.id, { result: e.target.value })}
                    className="h-8 rounded-md border bg-transparent px-2 text-xs"
                  >
                    {RESULTS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <Input className="h-8 text-sm" defaultValue={r.report_number ?? ""}
                    onBlur={(e) => update(r.id, { report_number: e.target.value })} />
                </td>
                <td className="px-3 py-2">
                  <Input className="h-8 text-sm" defaultValue={r.inspector_name ?? ""}
                    onBlur={(e) => update(r.id, { inspector_name: e.target.value })} />
                </td>
                <td className="px-3 py-2">
                  <Input type="date" className="h-8 text-sm" defaultValue={r.test_date ?? ""}
                    onBlur={(e) => update(r.id, { test_date: e.target.value || null })} />
                </td>
                <td className="px-2 py-2">
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((t) => (
          <Button key={t} size="sm" variant="outline" onClick={() => add(category, t)}>
            <Plus className="size-3 me-1" /> {t}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
      <TabsList>
        <TabsTrigger value="ndt">NDT ({ndt.length})</TabsTrigger>
        <TabsTrigger value="destructive">Destructive ({dt.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="ndt">{renderTable(ndt, NDT, "ndt")}</TabsContent>
      <TabsContent value="destructive">{renderTable(dt, DT, "destructive")}</TabsContent>
    </Tabs>
  );
}
