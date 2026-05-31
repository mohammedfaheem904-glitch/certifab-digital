import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { Z as Route, a as useNavigate, g as useQueryClient, b as useAuth, B as Button, j as cn, t as toast, s as supabase } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-QRh3nxuz.js";
import { a as allowedPwpsTransitions, p as pwpsStageIndex, P as PWPS_STATUS_TONE, b as PWPS_STAGES } from "./pwps-workflow-DrDpx5k6.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import { S as Save } from "./save-Br-gy0vX.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function PwpsDetailPage() {
  const {
    pwpsId
  } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const {
    roles
  } = useAuth();
  const isEditor = roles.some((r) => ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r));
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["pwps", pwpsId],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pwps").select("*").eq("id", pwpsId).maybeSingle();
      if (error) throw error;
      return data2;
    }
  });
  const [draft, setDraft] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const [transitioning, setTransitioning] = reactExports.useState(false);
  const merged = reactExports.useMemo(() => ({
    ...data ?? {},
    ...draft
  }), [data, draft]);
  const set = (k, v) => setDraft((d) => ({
    ...d,
    [k]: v
  }));
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[60vh] grid place-items-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin me-2 inline" }),
      " Loading pWPS…"
    ] });
  }
  if (!data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "pWPS not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4", onClick: () => nav({
        to: "/app/pwps"
      }), children: "Back to list" })
    ] });
  }
  const transitions = allowedPwpsTransitions(merged.status);
  const stageIdx = pwpsStageIndex(merged.status);
  const handleSave = async () => {
    if (!Object.keys(draft).length) {
      toast.info("Nothing to save.");
      return;
    }
    setSaving(true);
    const {
      error
    } = await supabase.from("pwps").update(draft).eq("id", pwpsId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("pWPS saved.");
    setDraft({});
    qc.invalidateQueries({
      queryKey: ["pwps", pwpsId]
    });
    qc.invalidateQueries({
      queryKey: ["pwps"]
    });
  };
  const handleTransition = async (to, _label) => {
    setTransitioning(true);
    if (to === "Converted") {
      const {
        data: pqrRow,
        error: pqrErr
      } = await supabase.from("pqrs").select("id").eq("pwps_id", pwpsId).eq("overall_result", "Passed").order("qualification_date", {
        ascending: false
      }).limit(1).maybeSingle();
      if (pqrErr) {
        setTransitioning(false);
        return toast.error(pqrErr.message);
      }
      if (!pqrRow) {
        setTransitioning(false);
        return toast.error("No Passed PQR linked to this pWPS. Pass a PQR first.");
      }
      try {
        const {
          promotePqrToWps
        } = await import("./pqr-promotion-runtime-BLihlWUx.js");
        const {
          procedureId
        } = await promotePqrToWps(pqrRow.id);
        toast.success("Promoted — opening new WPS draft");
        qc.invalidateQueries({
          queryKey: ["pwps", pwpsId]
        });
        qc.invalidateQueries({
          queryKey: ["company-rows", "procedures"]
        });
        nav({
          to: "/app/procedures/$procedureId",
          params: {
            procedureId
          }
        });
      } catch (e) {
        toast.error(e.message);
      } finally {
        setTransitioning(false);
      }
      return;
    }
    const payload = {
      status: to
    };
    if (to === "Qualified") payload.qualified_at = (/* @__PURE__ */ new Date()).toISOString();
    if (to === "Rejected") payload.rejected_at = (/* @__PURE__ */ new Date()).toISOString();
    const {
      error
    } = await supabase.from("pwps").update(payload).eq("id", pwpsId);
    setTransitioning(false);
    if (error) return toast.error(error.message);
    toast.success(`Status → ${to}`);
    qc.invalidateQueries({
      queryKey: ["pwps", pwpsId]
    });
    qc.invalidateQueries({
      queryKey: ["pwps"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => nav({
          to: "/app/pwps"
        }), className: "mb-2 -ms-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 me-1" }),
          " Back to pWPS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: data.pwps_no }),
        data.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: data.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs", PWPS_STATUS_TONE[merged.status]), children: merged.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: data.revision }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "· ",
            data.code_family
          ] })
        ] })
      ] }),
      isEditor && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, disabled: saving || !Object.keys(draft).length, children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin me-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 me-1" }),
        "Save changes"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
        " Qualification workflow"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex flex-wrap items-center gap-2 text-xs", children: PWPS_STAGES.map((stage, i) => {
          const done = i < stageIdx;
          const current = i === stageIdx;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center justify-center w-6 h-6 rounded-full border text-[10px] font-medium", done && "bg-success/20 border-success/40 text-success", current && "bg-primary/20 border-primary/40 text-primary", !done && !current && "bg-muted text-muted-foreground border-border"), children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(current ? "font-medium" : "text-muted-foreground"), children: stage }),
            i < PWPS_STAGES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "→" })
          ] }, stage);
        }) }),
        isEditor && transitions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-2 border-t border-border", children: transitions.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: t.variant ?? "default", disabled: transitioning, onClick: () => handleTransition(t.to, t.label), title: t.requires, children: t.label }, t.to)) }),
        merged.status === "Converted" && data.converted_to_procedure_id && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => nav({
          to: "/app/procedures/$procedureId",
          params: {
            procedureId: data.converted_to_procedure_id
          }
        }), children: "Open resulting WPS →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Identification", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.title ?? "", onChange: (e) => set("title", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Code family", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.code_family ?? "", onChange: (e) => set("code_family", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Standard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.standard ?? "", onChange: (e) => set("standard", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Revision", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.revision ?? "", onChange: (e) => set("revision", e.target.value), disabled: !isEditor }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Process & joint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Process", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.process ?? "", onChange: (e) => set("process", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Joint type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.joint_type ?? "", onChange: (e) => set("joint_type", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Groove type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.groove_type ?? "", onChange: (e) => set("groove_type", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Position", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.position ?? "", onChange: (e) => set("position", e.target.value), disabled: !isEditor }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Base material", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Base material", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.base_material ?? "", onChange: (e) => set("base_material", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "P-Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.p_number ?? "", onChange: (e) => set("p_number", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Group No.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.group_number ?? "", onChange: (e) => set("group_number", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Thickness min (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: merged.thickness_min_mm ?? "", onChange: (e) => set("thickness_min_mm", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Thickness max (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: merged.thickness_max_mm ?? "", onChange: (e) => set("thickness_max_mm", parseFloat(e.target.value) || null), disabled: !isEditor }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Diameter min (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: merged.diameter_min_mm ?? "", onChange: (e) => set("diameter_min_mm", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Diameter max (mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", value: merged.diameter_max_mm ?? "", onChange: (e) => set("diameter_max_mm", parseFloat(e.target.value) || null), disabled: !isEditor }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Filler & gas", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Filler material", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.filler_material ?? "", onChange: (e) => set("filler_material", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Filler classification", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.filler_classification ?? "", onChange: (e) => set("filler_classification", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Shielding gas", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.shielding_gas ?? "", onChange: (e) => set("shielding_gas", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Backing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.backing ?? "", onChange: (e) => set("backing", e.target.value), disabled: !isEditor }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Electrical & thermal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Voltage min", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.voltage_min ?? "", onChange: (e) => set("voltage_min", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Voltage max", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.voltage_max ?? "", onChange: (e) => set("voltage_max", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Current min", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.current_min ?? "", onChange: (e) => set("current_min", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Current max", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.current_max ?? "", onChange: (e) => set("current_max", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Travel min", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.travel_speed_min ?? "", onChange: (e) => set("travel_speed_min", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Travel max", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.travel_speed_max ?? "", onChange: (e) => set("travel_speed_max", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Heat input min (kJ/mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: merged.heat_input_min ?? "", onChange: (e) => set("heat_input_min", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Heat input max (kJ/mm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: merged.heat_input_max ?? "", onChange: (e) => set("heat_input_max", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Polarity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.polarity ?? "", onChange: (e) => set("polarity", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Preheat min (°C)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.preheat_min_c ?? "", onChange: (e) => set("preheat_min_c", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Interpass max (°C)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: merged.interpass_max_c ?? "", onChange: (e) => set("interpass_max_c", parseFloat(e.target.value) || null), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "PWHT", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.pwht ?? "", onChange: (e) => set("pwht", e.target.value), disabled: !isEditor }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Technique & notes", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Technique notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: merged.technique_notes ?? "", onChange: (e) => set("technique_notes", e.target.value), disabled: !isEditor }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "General notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: merged.notes ?? "", onChange: (e) => set("notes", e.target.value), disabled: !isEditor }) })
      ] })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  PwpsDetailPage as component
};
