import { r as reactExports, U as jsxRuntimeExports } from "./server-BEiNT1sm.js";
import { S as Subscribable, A as shallowEqualObjects, a0 as hashKey, a1 as getDefaultState, M as notifyManager, g as useQueryClient, D as noop, O as shouldThrowError, d as createLucideIcon, j as cn, b as useAuth, B as Button, t as toast, s as supabase, T as TriangleAlert, a as useNavigate, a2 as Route } from "./router-DGN8uIPq.js";
import { u as useQuery } from "./useQuery-tHuwiQPC.js";
import { I as Input } from "./input-DbJItJeC.js";
import { L as Label } from "./label-DgglCfez.js";
import { T as Textarea } from "./textarea-CjRfI2z5.js";
import { B as Badge } from "./badge-CcmgKKIg.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-QRh3nxuz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BSpN8byK.js";
import { P as Plus } from "./plus-qnEZmAjm.js";
import { L as LoaderCircle } from "./loader-circle-wENiHN32.js";
import { T as Trash2 } from "./trash-2-C2HBTfog.js";
import { C as CircleCheck } from "./circle-check-DDw0jk-W.js";
import { C as CircleX } from "./circle-x-CEG87Cnk.js";
import { O as OctagonAlert } from "./octagon-alert-CjvTeUly.js";
import { I as Info } from "./info-Dh0_vR51.js";
import { W as WandSparkles } from "./wand-sparkles-BIB6Kyai.js";
import { S as Save } from "./save-Br-gy0vX.js";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Bm3dO2Bl.js";
import { promotePqrToWps } from "./pqr-promotion-runtime-BLihlWUx.js";
import { S as ShieldCheck } from "./shield-check-BhHQurBT.js";
import { C as Check } from "./check-DS8b9zeL.js";
import { A as ArrowLeft } from "./arrow-left-Dxzf8ThQ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-DU9AdJ2b.js";
import "./index-DH7MMPOO.js";
import "./index-Df5iUNGq.js";
import "./index-BuCuGgC7.js";
import "./index-BlRkZP9l.js";
import "./x-CQcD6R0Y.js";
var MutationObserver = class extends Subscribable {
  #client;
  #currentResult = void 0;
  #currentMutation;
  #mutateOptions;
  constructor(client, options) {
    super();
    this.#client = client;
    this.setOptions(options);
    this.bindMethods();
    this.#updateResult();
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    this.options = this.#client.defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      this.#client.getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: this.#currentMutation,
        observer: this
      });
    }
    if (prevOptions?.mutationKey && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (this.#currentMutation?.state.status === "pending") {
      this.#currentMutation.setOptions(this.options);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#currentMutation?.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    this.#updateResult();
    this.#notify(action);
  }
  getCurrentResult() {
    return this.#currentResult;
  }
  reset() {
    this.#currentMutation?.removeObserver(this);
    this.#currentMutation = void 0;
    this.#updateResult();
    this.#notify();
  }
  mutate(variables, options) {
    this.#mutateOptions = options;
    this.#currentMutation?.removeObserver(this);
    this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
    this.#currentMutation.addObserver(this);
    return this.#currentMutation.execute(variables);
  }
  #updateResult() {
    const state = this.#currentMutation?.state ?? getDefaultState();
    this.#currentResult = {
      ...state,
      isPending: state.status === "pending",
      isSuccess: state.status === "success",
      isError: state.status === "error",
      isIdle: state.status === "idle",
      mutate: this.mutate,
      reset: this.reset
    };
  }
  #notify(action) {
    notifyManager.batch(() => {
      if (this.#mutateOptions && this.hasListeners()) {
        const variables = this.#currentResult.variables;
        const onMutateResult = this.#currentResult.context;
        const context = {
          client: this.#client,
          meta: this.options.meta,
          mutationKey: this.options.mutationKey
        };
        if (action?.type === "success") {
          try {
            this.#mutateOptions.onSuccess?.(
              action.data,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
          try {
            this.#mutateOptions.onSettled?.(
              action.data,
              null,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
        } else if (action?.type === "error") {
          try {
            this.#mutateOptions.onError?.(
              action.error,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
          try {
            this.#mutateOptions.onSettled?.(
              void 0,
              action.error,
              variables,
              onMutateResult,
              context
            );
          } catch (e) {
            void Promise.reject(e);
          }
        }
      }
      this.listeners.forEach((listener) => {
        listener(this.#currentResult);
      });
    });
  }
};
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
const __iconNode = [
  ["path", { d: "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6", key: "y09zxi" }],
  ["path", { d: "m21 3-9 9", key: "mpx6sq" }],
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }]
];
const SquareArrowOutUpRight = createLucideIcon("square-arrow-out-up-right", __iconNode);
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
const METHODS = ["VT", "RT", "UT", "PT", "MT"];
const RESULTS$1 = ["Pending", "Pass", "Fail", "N/A"];
function NdtTestsTable({ pqrId, standard }) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["ndt", pqrId],
    queryFn: async () => {
      const { data, error } = await supabase.from("ndt_tests").select("*").eq("pqr_id", pqrId).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const addRow = useMutation({
    mutationFn: async (method) => {
      const { error } = await supabase.from("ndt_tests").insert({
        company_id: profile?.company_id,
        pqr_id: pqrId,
        method,
        result: "Pending",
        acceptance_criteria: standard ?? null
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ndt", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  const updateRow = useMutation({
    mutationFn: async ({ id, patch }) => {
      const { error } = await supabase.from("ndt_tests").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ndt", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  const deleteRow = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("ndt_tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ndt", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium me-2", children: "Add test:" }),
      METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => addRow.mutate(m), disabled: addRow.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 me-1" }),
        " ",
        m
      ] }, m))
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline me-2" }),
      "Loading…"
    ] }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground border rounded-md p-6 text-center", children: "No NDT tests recorded. VT is mandatory; volumetric NDT (RT/UT) recommended for groove welds." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-md overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Method" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Technician" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Acceptance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Report #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {})
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(NdtRowEditor, { row: r, onPatch: (patch) => updateRow.mutate({ id: r.id, patch }), onDelete: () => deleteRow.mutate(r.id) }, r.id)) })
    ] }) })
  ] });
}
function NdtRowEditor({ row, onPatch, onDelete }) {
  const [local, setLocal] = reactExports.useState(row);
  const set = (k, v) => {
    const next = { ...local, [k]: v };
    setLocal(next);
  };
  const commit = (patch) => onPatch(patch);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-8 rounded-md border bg-transparent px-2 text-sm", value: local.method, onChange: (e) => {
        set("method", e.target.value);
        commit({ method: e.target.value });
      }, children: METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: m }, m)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", type: "date", value: local.test_date ?? "", onChange: (e) => set("test_date", e.target.value || null), onBlur: () => commit({ test_date: local.test_date }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: local.technician_name ?? "", onChange: (e) => set("technician_name", e.target.value), onBlur: () => commit({ technician_name: local.technician_name }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: local.acceptance_criteria ?? "", onChange: (e) => set("acceptance_criteria", e.target.value), onBlur: () => commit({ acceptance_criteria: local.acceptance_criteria }), placeholder: "e.g. ASME V" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: local.report_number ?? "", onChange: (e) => set("report_number", e.target.value), onBlur: () => commit({ report_number: local.report_number }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          className: "h-8 rounded-md border bg-transparent px-2 text-sm",
          value: local.result,
          onChange: (e) => {
            set("result", e.target.value);
            commit({ result: e.target.value });
          },
          children: RESULTS$1.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: r }, r))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "mt-1", children: local.result }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          className: "text-xs",
          rows: 2,
          placeholder: "Findings / observations",
          value: local.findings ?? "",
          onChange: (e) => set("findings", e.target.value),
          onBlur: () => commit({ findings: local.findings })
        }
      )
    ] }) }) })
  ] });
}
function requiredTestMatrix(args) {
  const { codeFamily, joint, thicknessMm, cvnRequired } = args;
  const isASME = (codeFamily || "").toUpperCase().includes("ASME");
  const isAWS = (codeFamily || "").toUpperCase().includes("AWS");
  const t = thicknessMm ?? 0;
  const list = [{ kind: "ndt", method: "VT", min: 1, note: "Visual inspection is mandatory" }];
  if (joint === "Groove") {
    if (isASME) {
      list.push(
        { kind: "ndt", method: t > 8 ? "RT" : "VT", min: 1, note: t > 8 ? "Volumetric NDT recommended for t > 8 mm" : void 0 },
        { kind: "mech", testType: "Tensile", min: 2, note: "QW-150 reduced-section" },
        { kind: "mech", testType: "Bend", min: t >= 19 ? 2 : 4, note: t >= 19 ? "Side bend (t ≥ 19 mm)" : "Face + Root bend" },
        { kind: "mech", testType: "Macro Etch", min: 1 }
      );
    } else if (isAWS) {
      list.push(
        { kind: "ndt", method: "RT", min: 1 },
        { kind: "mech", testType: "Tensile", min: 2, note: "Reduced-section per AWS D1.1 Table 4.5" },
        { kind: "mech", testType: "Bend", min: 4 },
        { kind: "mech", testType: "Macro Etch", min: 1 }
      );
      if (cvnRequired) list.push({ kind: "mech", testType: "Impact", min: 3, note: "CVN per contract" });
    } else {
      list.push(
        { kind: "mech", testType: "Tensile", min: 2 },
        { kind: "mech", testType: "Bend", min: 2 },
        { kind: "mech", testType: "Macro Etch", min: 1 }
      );
    }
  } else if (joint === "Fillet") {
    list.push(
      { kind: "mech", testType: "Macro Etch", min: 1 },
      { kind: "mech", testType: "Fracture", min: 1 }
    );
  } else if (joint === "Overlay") {
    list.push(
      { kind: "mech", testType: "Macro Etch", min: 1 },
      { kind: "mech", testType: "Hardness", min: 1 }
    );
  }
  return list;
}
function evaluateMechRow(row) {
  if (row.result === "Pass") return { pass: true };
  if (row.result === "Fail") return { pass: false, reason: "Marked as Fail by evaluator" };
  if (row.result === "N/A") return { pass: true };
  const r = row.results ?? {};
  switch (row.test_type) {
    case "Tensile": {
      const uts = Number(r.uts_mpa);
      const min = parseFirstNumber(row.minimum_requirement);
      const location = String(r.failure_location ?? "");
      if (location.toLowerCase().includes("weld") && (!isFinite(min) || uts < min)) {
        return { pass: false, reason: "Failure in weld + below min UTS", codeRef: "ASME IX QW-153" };
      }
      if (isFinite(min) && uts && uts < min) {
        return { pass: false, reason: `UTS ${uts} < min ${min} MPa`, codeRef: "ASME IX QW-153" };
      }
      if (uts) return { pass: true };
      return { pass: false, reason: "UTS not recorded" };
    }
    case "Bend": {
      const opening = Number(r.open_discontinuity_mm);
      if (isFinite(opening) && opening > 3) {
        return { pass: false, reason: `Open discontinuity ${opening} mm > 3 mm`, codeRef: "ASME IX QW-163" };
      }
      if (r.open_discontinuity_mm == null) return { pass: false, reason: "Open discontinuity not recorded" };
      return { pass: true };
    }
    case "Macro Etch": {
      const defects = Array.isArray(r.defects) ? r.defects : [];
      if (defects.length > 0) return { pass: false, reason: `Defects observed: ${defects.join(", ")}` };
      if (r.examined !== true) return { pass: false, reason: "Macro examination not confirmed" };
      return { pass: true };
    }
    case "Hardness": {
      const max = Number(r.max_hv_haz);
      const limit = Number(r.limit_hv ?? row.minimum_requirement);
      if (isFinite(max) && isFinite(limit) && max > limit) {
        return { pass: false, reason: `HAZ ${max} HV > limit ${limit} HV`, codeRef: "NACE MR0175" };
      }
      if (!isFinite(max)) return { pass: false, reason: "Max HV not recorded" };
      return { pass: true };
    }
    case "Impact": {
      const avg = Number(r.avg_j);
      const min = Number(r.min_j_required ?? parseFirstNumber(row.minimum_requirement));
      if (isFinite(avg) && isFinite(min) && avg < min) {
        return { pass: false, reason: `Avg ${avg} J < min ${min} J`, codeRef: "ASME IX QW-171" };
      }
      if (!isFinite(avg)) return { pass: false, reason: "Average energy not recorded" };
      return { pass: true };
    }
    case "Fracture": {
      const defects = Array.isArray(r.defects) ? r.defects : [];
      if (defects.length > 0) return { pass: false, reason: `Defects: ${defects.join(", ")}` };
      return { pass: true };
    }
  }
  return { pass: false, reason: "Result Pending" };
}
function parseFirstNumber(s) {
  if (!s) return NaN;
  const m = s.match(/[-+]?\d*\.?\d+/);
  return m ? Number(m[0]) : NaN;
}
function suggestQualifiedRanges(pwps) {
  const t = Number(pwps?.thickness_min_mm) || Number(pwps?.thickness_max_mm);
  const d = Number(pwps?.diameter_min_mm) || Number(pwps?.diameter_max_mm);
  const hi_lo = Number(pwps?.heat_input_min);
  const hi_hi = Number(pwps?.heat_input_max);
  const pos = pwps?.position ?? null;
  return {
    thickness_min_mm: isFinite(t) ? round(t * 0.5, 2) : null,
    thickness_max_mm: isFinite(t) ? round(Math.min(t * 2, 200), 2) : null,
    diameter_min_mm: isFinite(d) ? round(d * 0.5, 2) : null,
    diameter_max_mm: isFinite(d) ? round(d * 2, 2) : null,
    heat_input_min: isFinite(hi_lo) ? round(hi_lo * 0.9, 3) : null,
    heat_input_max: isFinite(hi_hi) ? round(hi_hi * 1.1, 3) : null,
    position: pos,
    p_number: pwps?.p_number ?? null,
    group_number: pwps?.group_number ?? null,
    filler_classification: pwps?.filler_classification ?? null,
    pwht: pwps?.pwht ?? null
  };
}
function round(n, d) {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}
const TYPES = ["Tensile", "Bend", "Impact", "Hardness", "Macro Etch", "Fracture"];
const RESULTS = ["Pending", "Pass", "Fail", "N/A"];
function MechanicalTestsTable({ pqrId }) {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["mech", pqrId],
    queryFn: async () => {
      const { data, error } = await supabase.from("mechanical_tests").select("*").eq("pqr_id", pqrId).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const addRow = useMutation({
    mutationFn: async (test_type) => {
      const { error } = await supabase.from("mechanical_tests").insert({
        company_id: profile?.company_id,
        pqr_id: pqrId,
        test_type,
        result: "Pending",
        results: {}
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mech", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  const updateRow = useMutation({
    mutationFn: async ({ id, patch }) => {
      const { error } = await supabase.from("mechanical_tests").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mech", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  const deleteRow = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("mechanical_tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mech", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium me-2", children: "Add specimen:" }),
      TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => addRow.mutate(t), disabled: addRow.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 me-1" }),
        " ",
        t
      ] }, t))
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline me-2" }),
      "Loading…"
    ] }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground border rounded-md p-6 text-center", children: "No mechanical tests recorded. Required matrix is shown in the Evaluation tab." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-md overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Specimen" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Lab" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Min req." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Evaluator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {})
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(MechRowEditor, { row: r, onPatch: (patch) => updateRow.mutate({ id: r.id, patch }), onDelete: () => deleteRow.mutate(r.id) }, r.id)) })
    ] }) })
  ] });
}
function MechRowEditor({ row, onPatch, onDelete }) {
  const [local, setLocal] = reactExports.useState(row);
  const set = (k, v) => setLocal((s) => ({ ...s, [k]: v }));
  const setRes = (k, v) => setLocal((s) => ({ ...s, results: { ...s.results ?? {}, [k]: v } }));
  const commit = (patch) => onPatch(patch);
  const evalVerdict = reactExports.useMemo(() => evaluateMechRow(local), [local]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-8 rounded-md border bg-transparent px-2 text-sm", value: local.test_type, onChange: (e) => {
        set("test_type", e.target.value);
        commit({ test_type: e.target.value });
      }, children: TYPES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: m }, m)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: local.specimen_id ?? "", onChange: (e) => set("specimen_id", e.target.value), onBlur: () => commit({ specimen_id: local.specimen_id }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: local.laboratory ?? "", onChange: (e) => set("laboratory", e.target.value), onBlur: () => commit({ laboratory: local.laboratory }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", type: "date", value: local.test_date ?? "", onChange: (e) => set("test_date", e.target.value || null), onBlur: () => commit({ test_date: local.test_date }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8 w-32", value: local.minimum_requirement ?? "", onChange: (e) => set("minimum_requirement", e.target.value), onBlur: () => commit({ minimum_requirement: local.minimum_requirement }), placeholder: "485 MPa" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          className: "h-8 rounded-md border bg-transparent px-2 text-sm",
          value: local.result,
          onChange: (e) => {
            set("result", e.target.value);
            commit({ result: e.target.value });
          },
          children: RESULTS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: r }, r))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
        evalVerdict.pass ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-success/10 text-success border-success/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3 me-1" }),
          "OK"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-destructive/10 text-destructive border-destructive/30", title: evalVerdict.reason, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3 me-1" }),
          evalVerdict.reason
        ] }),
        evalVerdict.codeRef && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: evalVerdict.codeRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 8, className: "bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PerTypeFields, { type: local.test_type, results: local.results ?? {}, onChange: (k, v) => setRes(k, v), onCommit: () => commit({ results: local.results }) }) }) })
  ] });
}
function PerTypeFields({ type, results, onChange, onCommit }) {
  const num = (k, label, placeholder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", type: "number", step: "0.01", value: results[k] ?? "", onChange: (e) => onChange(k, e.target.value === "" ? null : Number(e.target.value)), onBlur: onCommit, placeholder })
  ] });
  const text = (k, label, placeholder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-8", value: results[k] ?? "", onChange: (e) => onChange(k, e.target.value), onBlur: onCommit, placeholder })
  ] });
  const checkbox = (k, label) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs mt-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!results[k], onChange: (e) => {
      onChange(k, e.target.checked);
      setTimeout(onCommit, 0);
    } }),
    label
  ] });
  switch (type) {
    case "Tensile":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
        num("uts_mpa", "UTS (MPa)"),
        text("failure_location", "Failure location", "Base / Weld / HAZ"),
        num("elongation_pct", "Elongation %")
      ] });
    case "Bend":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
        num("angle_deg", "Bend angle (°)", "180"),
        num("open_discontinuity_mm", "Open discontinuity (mm)", "max 3"),
        text("orientation", "Orientation", "Face / Root / Side")
      ] });
    case "Impact":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-4 gap-3", children: [
        num("temp_c", "Temp (°C)"),
        num("avg_j", "Avg energy (J)"),
        num("min_j_required", "Min req. (J)"),
        text("specimens", "Per-specimen (J)", "60,55,62")
      ] });
    case "Hardness":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
        num("max_hv_haz", "Max HV in HAZ"),
        num("limit_hv", "Limit (HV)", "248 (NACE)"),
        text("location", "Location", "Cap / Mid / Root")
      ] });
    case "Macro Etch":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
        checkbox("examined", "Examined under magnification"),
        text("defects", "Defects (comma-sep)", "LOF, Porosity"),
        text("etchant", "Etchant", "Nital 5%")
      ] });
    case "Fracture":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
        text("appearance", "Fracture appearance"),
        text("defects", "Defects (comma-sep)")
      ] });
    default:
      return null;
  }
}
const SEVERITIES = ["info", "warning", "error", "critical"];
const SEV_ICON = {
  info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5 me-1" }),
  warning: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5 me-1" }),
  error: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "size-3.5 me-1" }),
  critical: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "size-3.5 me-1" })
};
const SEV_TONE = {
  info: "bg-muted text-foreground",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-destructive/15 text-destructive border-destructive/30",
  critical: "bg-destructive/20 text-destructive border-destructive/40"
};
function PqrFindingsTable({ pqrId }) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const [adding, setAdding] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState({ severity: "warning", title: "" });
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["findings", pqrId],
    queryFn: async () => {
      const { data, error } = await supabase.from("pqr_findings").select("*").eq("pqr_id", pqrId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const create = useMutation({
    mutationFn: async () => {
      if (!draft.title?.trim()) throw new Error("Title required");
      const { error } = await supabase.from("pqr_findings").insert({
        company_id: profile?.company_id,
        pqr_id: pqrId,
        severity: draft.severity ?? "warning",
        title: draft.title,
        message: draft.message ?? null,
        remediation: draft.remediation ?? null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setAdding(false);
      setDraft({ severity: "warning", title: "" });
      qc.invalidateQueries({ queryKey: ["findings", pqrId] });
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleResolved = useMutation({
    mutationFn: async (f) => {
      const { error } = await supabase.from("pqr_findings").update({
        resolved: !f.resolved,
        resolved_at: !f.resolved ? (/* @__PURE__ */ new Date()).toISOString() : null,
        resolved_by: !f.resolved ? user?.id ?? null : null
      }).eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["findings", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("pqr_findings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["findings", pqrId] }),
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        rows.filter((r) => !r.resolved && (r.severity === "critical" || r.severity === "error")).length,
        " unresolved blocker(s) · ",
        rows.length,
        " total"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setAdding((a) => !a), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 me-1" }),
        " Add finding"
      ] })
    ] }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-md p-3 space-y-2 bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-9 rounded-md border bg-transparent px-2 text-sm", value: draft.severity, onChange: (e) => setDraft({ ...draft, severity: e.target.value }), children: SEVERITIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: s }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "sm:col-span-2", placeholder: "Title", value: draft.title ?? "", onChange: (e) => setDraft({ ...draft, title: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, placeholder: "Details", value: draft.message ?? "", onChange: (e) => setDraft({ ...draft, message: e.target.value }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, placeholder: "Remediation", value: draft.remediation ?? "", onChange: (e) => setDraft({ ...draft, remediation: e.target.value }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setAdding(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => create.mutate(), disabled: create.isPending, children: "Save" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin inline me-2" }),
      "Loading…"
    ] }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground border rounded-md p-6 text-center", children: "No findings — add issues here as you evaluate test reports." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rows.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `border rounded-md p-3 ${f.resolved ? "opacity-60" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: SEV_TONE[f.severity], children: [
            SEV_ICON[f.severity],
            f.severity
          ] }),
          f.resolved && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-success/15 text-success border-success/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3 me-1" }),
            "Resolved"
          ] }),
          f.code_reference && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: f.code_reference })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm mt-1", children: f.title }),
        f.message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: f.message }),
        f.remediation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Remediation:" }),
          " ",
          f.remediation
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => toggleResolved.mutate(f), children: f.resolved ? "Reopen" : "Resolve" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => remove.mutate(f.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
      ] })
    ] }) }, f.id)) })
  ] });
}
function QualifiedRangesForm({ pqrId, ranges, pwps, disabled }) {
  const qc = useQueryClient();
  const [draft, setDraft] = reactExports.useState(ranges ?? {});
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setDraft(ranges ?? {});
  }, [ranges]);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const setNum = (k, v) => set(k, v === "" ? null : Number(v));
  const applySuggested = () => {
    if (!pwps) return toast.error("Link a pWPS first to compute suggested ranges.");
    setDraft({ ...draft, ...suggestQualifiedRanges(pwps) });
    toast.success("Code-suggested ranges applied (review before saving).");
  };
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("pqrs").update({ qualified_ranges: draft }).eq("id", pqrId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Qualified ranges saved.");
    qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
  };
  const field = (k, label, type = "text", unit) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
      label,
      unit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        " (",
        unit,
        ")"
      ] }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type,
        step: type === "number" ? "0.01" : void 0,
        value: draft[k] ?? "",
        onChange: (e) => type === "number" ? setNum(k, e.target.value) : set(k, e.target.value),
        disabled
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Define the variables qualified by this PQR. These ranges override the source pWPS when promoting to a WPS." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: applySuggested, disabled: disabled || !pwps, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "size-4 me-1" }),
          "Use code-suggested defaults"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: save, disabled: disabled || saving, children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin me-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 me-1" }),
          "Save"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-md p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: "Geometry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          field("thickness_min_mm", "Thickness min", "number", "mm"),
          field("thickness_max_mm", "Thickness max", "number", "mm"),
          field("diameter_min_mm", "Diameter min", "number", "mm"),
          field("diameter_max_mm", "Diameter max", "number", "mm")
        ] }),
        field("position", "Position envelope", "text", "e.g. 1G, 2G, 6G")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-md p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: "Welding parameters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          field("heat_input_min", "Heat input min", "number", "kJ/mm"),
          field("heat_input_max", "Heat input max", "number", "kJ/mm")
        ] }),
        field("p_number", "P-number qualified"),
        field("group_number", "Group qualified"),
        field("filler_classification", "Filler classification"),
        field("pwht", "PWHT")
      ] })
    ] })
  ] });
}
const ICON = {
  pass: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-success" }),
  fail: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive" }),
  warn: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-warning" })
};
function PqrEvaluationPanel({
  pqrId,
  pqr,
  evaluation,
  canEdit
}) {
  const { profile, user } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [busy, setBusy] = reactExports.useState(false);
  const [failOpen, setFailOpen] = reactExports.useState(false);
  const [failReason, setFailReason] = reactExports.useState("");
  const alreadyPassed = pqr?.overall_result === "Pass";
  const alreadyFailed = pqr?.overall_result === "Fail";
  const markPassed = async () => {
    if (!evaluation.ready) return toast.error("Resolve blockers before passing.");
    setBusy(true);
    const { error } = await supabase.from("pqrs").update({
      overall_result: "Pass",
      status: "Passed",
      qualification_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      evaluator_id: user?.id ?? null,
      evaluator_name: profile?.display_name ?? null,
      evaluation_snapshot: evaluation
    }).eq("id", pqrId);
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    try {
      const { procedureId, created } = await promotePqrToWps(pqrId);
      toast.success(created ? "PQR Passed — Draft WPS created in Procedures." : "PQR Passed — WPS already existed.");
      qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
      qc.invalidateQueries({ queryKey: ["pqrs"] });
      qc.invalidateQueries({ queryKey: ["company-rows", "procedures"] });
      nav({ to: "/app/procedures/$procedureId", params: { procedureId } });
    } catch (e) {
      toast.error(`Saved as Pass, but WPS creation failed: ${e.message}`);
      qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    } finally {
      setBusy(false);
    }
  };
  const markFailed = async () => {
    setBusy(true);
    const { error } = await supabase.from("pqrs").update({
      overall_result: "Fail",
      status: "Failed",
      evaluator_id: user?.id ?? null,
      evaluator_name: profile?.display_name ?? null,
      evaluation_snapshot: evaluation,
      remarks: failReason ? `${pqr.remarks ? pqr.remarks + "\n\n" : ""}Failure reason: ${failReason}` : pqr.remarks
    }).eq("id", pqrId);
    setBusy(false);
    setFailOpen(false);
    if (error) return toast.error(error.message);
    toast.success("PQR marked as Failed.");
    qc.invalidateQueries({ queryKey: ["pqr", pqrId] });
    qc.invalidateQueries({ queryKey: ["pqrs"] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
          " Qualification readiness"
        ] }),
        evaluation.ready ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-success/15 text-success border-success/30", children: "Ready to sign" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-warning/15 text-warning border-warning/30", children: [
          evaluation.blockers.length,
          " blocker(s)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: evaluation.checklist.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm py-1 border-b last:border-b-0", children: [
        ICON[c.status],
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: c.label }),
          c.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.detail })
        ] })
      ] }, c.id)) })
    ] }),
    (evaluation.blockers.length > 0 || evaluation.warnings.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Issues" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm", children: [
        evaluation.blockers.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b })
        ] }, `b${i}`)),
        evaluation.warnings.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-warning mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: w })
        ] }, `w${i}`))
      ] })
    ] }),
    alreadyPassed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border bg-success/5 border-success/30 p-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-success flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
          " PQR already passed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
          "Qualified on ",
          pqr.qualification_date,
          " by ",
          pqr.evaluator_name ?? "evaluator",
          "."
        ] })
      ] }),
      pqr.resulting_wps_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => nav({ to: "/app/procedures/$procedureId", params: { procedureId: pqr.resulting_wps_id } }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquareArrowOutUpRight, { className: "size-4 me-1" }),
        " Open resulting WPS"
      ] })
    ] }) : alreadyFailed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border bg-destructive/5 border-destructive/30 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-destructive flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }),
        " PQR marked Failed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Remediate findings, then create a new revision." })
    ] }) : canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "text-destructive border-destructive/40", onClick: () => setFailOpen(true), disabled: busy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 me-1" }),
        " Force Fail"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: markPassed, disabled: busy || !evaluation.ready, children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin me-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 me-1" }),
        "Pass & Sign · Promote to WPS"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: failOpen, onOpenChange: setFailOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Mark PQR as Failed" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "A failure reason will be added to the remarks and surfaced on the linked pWPS." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, placeholder: "Reason / next steps", value: failReason, onChange: (e) => setFailReason(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setFailOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: markFailed, disabled: busy, children: "Mark Failed" })
      ] })
    ] }) })
  ] });
}
function PqrWorkflowStepper({ steps }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 overflow-x-auto py-2", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "size-7 rounded-full grid place-items-center text-xs font-medium border",
          s.status === "done" && "bg-success text-success-foreground border-success",
          s.status === "active" && "bg-primary text-primary-foreground border-primary",
          s.status === "todo" && "bg-muted text-muted-foreground border-border"
        ),
        children: s.status === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) : i + 1
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xs", s.status === "active" ? "font-semibold" : "text-muted-foreground"), children: s.label }),
    i < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-px bg-border mx-1" })
  ] }, s.id)) });
}
function evaluatePqr(args) {
  const { pqr, pwps, ndt, mech, findings } = args;
  const checklist = [];
  const blockers = [];
  const warnings = [];
  const perRow = [];
  const joint = pwps?.joint_type === "Fillet" ? "Fillet" : pwps?.joint_type === "Overlay" ? "Overlay" : "Groove";
  const required = requiredTestMatrix({
    codeFamily: pqr?.code_family ?? "ASME IX",
    joint,
    thicknessMm: pwps?.thickness_max_mm ?? pwps?.thickness_min_mm ?? null
  });
  const ndtByMethod = /* @__PURE__ */ new Map();
  ndt.forEach((r) => ndtByMethod.set(r.method, (ndtByMethod.get(r.method) ?? 0) + 1));
  const missingNdt = required.filter((r) => r.kind === "ndt").filter((r) => (ndtByMethod.get(r.method) ?? 0) < r.min);
  if (missingNdt.length === 0) {
    checklist.push({ id: "ndt_coverage", label: "Required NDT methods logged", status: "pass" });
  } else {
    const detail = missingNdt.map((r) => `${r.method} (need ${r.min})`).join(", ");
    checklist.push({ id: "ndt_coverage", label: "Required NDT methods logged", status: "fail", detail });
    blockers.push(`Missing required NDT: ${detail}`);
  }
  const ndtPending = ndt.filter((r) => r.result === "Pending").length;
  const ndtFailed = ndt.filter((r) => r.result === "Fail").length;
  if (ndt.length === 0) {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "warn", detail: "No NDT rows" });
    warnings.push("No NDT tests recorded");
  } else if (ndtPending > 0) {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "fail", detail: `${ndtPending} pending` });
    blockers.push(`${ndtPending} NDT test(s) still Pending`);
  } else if (ndtFailed > 0) {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "fail", detail: `${ndtFailed} failed` });
    blockers.push(`${ndtFailed} NDT test(s) Failed`);
  } else {
    checklist.push({ id: "ndt_results", label: "NDT results recorded", status: "pass" });
  }
  const mechByType = /* @__PURE__ */ new Map();
  mech.forEach((r) => mechByType.set(r.test_type, (mechByType.get(r.test_type) ?? 0) + 1));
  const missingMech = required.filter((r) => r.kind === "mech").filter((r) => (mechByType.get(r.testType) ?? 0) < r.min);
  if (missingMech.length === 0) {
    checklist.push({ id: "mech_coverage", label: "Required mechanical tests logged", status: "pass" });
  } else {
    const detail = missingMech.map((r) => `${r.testType} (need ${r.min})`).join(", ");
    checklist.push({ id: "mech_coverage", label: "Required mechanical tests logged", status: "fail", detail });
    blockers.push(`Missing required mechanical tests: ${detail}`);
  }
  let mechFail = 0;
  let mechPending = 0;
  for (const row of mech) {
    const v = evaluateMechRow(row);
    perRow.push({ id: row.id, pass: v.pass, reason: v.reason, codeRef: v.codeRef });
    if (!v.pass) {
      if (row.result === "Pending") mechPending++;
      else mechFail++;
    }
  }
  if (mech.length === 0) {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "warn", detail: "No mechanical rows" });
    warnings.push("No mechanical tests recorded");
  } else if (mechPending > 0) {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "fail", detail: `${mechPending} pending` });
    blockers.push(`${mechPending} mechanical test(s) still Pending`);
  } else if (mechFail > 0) {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "fail", detail: `${mechFail} below criteria` });
    blockers.push(`${mechFail} mechanical test(s) below acceptance criteria`);
  } else {
    checklist.push({ id: "mech_results", label: "Mechanical results evaluated", status: "pass" });
  }
  const ranges = pqr?.qualified_ranges ?? {};
  const hasRanges = ranges && Object.values(ranges).some((v) => v !== null && v !== void 0 && v !== "");
  checklist.push({
    id: "ranges_set",
    label: "Qualified ranges defined",
    status: hasRanges ? "pass" : "warn",
    detail: hasRanges ? void 0 : "Open the Qualified Ranges tab and apply suggested defaults"
  });
  if (!hasRanges) warnings.push("Qualified ranges not yet defined");
  const unresolvedBlockers = findings.filter((f) => !f.resolved && (f.severity === "critical" || f.severity === "error"));
  if (unresolvedBlockers.length === 0) {
    checklist.push({ id: "no_blockers", label: "No unresolved blocker findings", status: "pass" });
  } else {
    checklist.push({
      id: "no_blockers",
      label: "No unresolved blocker findings",
      status: "fail",
      detail: `${unresolvedBlockers.length} unresolved`
    });
    blockers.push(`${unresolvedBlockers.length} unresolved blocker finding(s)`);
  }
  if (!pqr?.pwps_id) {
    checklist.push({ id: "pwps_linked", label: "Linked to source pWPS", status: "fail", detail: "Set pwps_id on PQR" });
    blockers.push("PQR is not linked to a pWPS");
  } else {
    checklist.push({ id: "pwps_linked", label: "Linked to source pWPS", status: "pass" });
  }
  const ready = blockers.length === 0;
  const recommendedOverallResult = blockers.length === 0 ? "Pass" : ndtFailed > 0 || mechFail > 0 || unresolvedBlockers.length > 0 ? "Fail" : "Pending";
  return { ready, checklist, blockers, warnings, recommendedOverallResult, perRow };
}
const RESULT_TONE = {
  Pending: "bg-muted text-muted-foreground border-border",
  Pass: "bg-success/15 text-success border-success/30",
  Passed: "bg-success/15 text-success border-success/30",
  Fail: "bg-destructive/15 text-destructive border-destructive/30",
  Failed: "bg-destructive/15 text-destructive border-destructive/30",
  "N/A": "bg-muted text-muted-foreground border-border"
};
function PqrDetailPage() {
  const {
    pqrId
  } = Route.useParams();
  const nav = useNavigate();
  const {
    roles
  } = useAuth();
  const isEditor = roles.some((r) => ["super_admin", "qa_qc_manager", "welding_engineer", "inspector"].includes(r));
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["pqr", pqrId],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pqrs").select("*").eq("id", pqrId).maybeSingle();
      if (error) throw error;
      return data2;
    }
  });
  const {
    data: pwps
  } = useQuery({
    queryKey: ["pwps-for-pqr", data?.pwps_id],
    queryFn: async () => {
      if (!data?.pwps_id) return null;
      const {
        data: row,
        error
      } = await supabase.from("pwps").select("*").eq("id", data.pwps_id).maybeSingle();
      if (error) throw error;
      return row;
    },
    enabled: !!data?.pwps_id
  });
  const {
    data: ndt = []
  } = useQuery({
    queryKey: ["ndt", pqrId],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("ndt_tests").select("*").eq("pqr_id", pqrId);
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const {
    data: mech = []
  } = useQuery({
    queryKey: ["mech", pqrId],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("mechanical_tests").select("*").eq("pqr_id", pqrId);
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const {
    data: findings = []
  } = useQuery({
    queryKey: ["findings", pqrId],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("pqr_findings").select("*").eq("pqr_id", pqrId);
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const evaluation = reactExports.useMemo(() => evaluatePqr({
    pqr: data ?? {},
    pwps: pwps ?? null,
    ndt,
    mech,
    findings
  }), [data, pwps, ndt, mech, findings]);
  const steps = reactExports.useMemo(() => {
    const overall2 = data?.overall_result;
    const ck = (id) => evaluation.checklist.find((c) => c.id === id);
    const setup = ck("pwps_linked")?.status === "pass" ? "done" : "active";
    const ndtDone = ck("ndt_coverage")?.status === "pass" && ck("ndt_results")?.status === "pass" ? "done" : ndt.length ? "active" : "todo";
    const mechDone = ck("mech_coverage")?.status === "pass" && ck("mech_results")?.status === "pass" ? "done" : mech.length ? "active" : "todo";
    const evalDone = evaluation.ready ? "done" : ndtDone === "done" || mechDone === "done" ? "active" : "todo";
    const signed = overall2 === "Pass" || overall2 === "Passed" ? "done" : overall2 === "Fail" || overall2 === "Failed" ? "active" : evalDone === "done" ? "active" : "todo";
    return [{
      id: "setup",
      label: "Setup",
      status: setup
    }, {
      id: "ndt",
      label: "NDT",
      status: ndtDone
    }, {
      id: "mech",
      label: "Mechanical",
      status: mechDone
    }, {
      id: "eval",
      label: "Evaluation",
      status: evalDone
    }, {
      id: "sign",
      label: "Sign & Promote",
      status: signed
    }];
  }, [data, evaluation, ndt.length, mech.length]);
  const [draft, setDraft] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
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
      " Loading PQR…"
    ] });
  }
  if (!data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "PQR not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4", onClick: () => nav({
        to: "/app/pqrs"
      }), children: "Back to list" })
    ] });
  }
  const handleSave = async () => {
    if (!Object.keys(draft).length) return toast.info("Nothing to save.");
    setSaving(true);
    const {
      error
    } = await supabase.from("pqrs").update(draft).eq("id", pqrId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("PQR saved.");
    setDraft({});
  };
  const overall = data.overall_result;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => nav({
          to: "/app/pqrs"
        }), className: "mb-2 -ms-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 me-1" }),
          " Back to PQRs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: data.pqr_no }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: RESULT_TONE[overall] ?? "", children: overall }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            data.revision,
            " · ",
            data.code_family
          ] }),
          data.qualification_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Qualified ",
            new Date(data.qualification_date).toLocaleDateString()
          ] })
        ] })
      ] }),
      isEditor && Object.keys(draft).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, disabled: saving, variant: "outline", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin me-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4 me-1" }),
        "Save changes"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PqrWorkflowStepper, { steps }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "overview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex-wrap h-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "ndt", children: [
          "NDT (",
          ndt.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "mech", children: [
          "Mechanical (",
          mech.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "findings", children: [
          "Findings (",
          findings.filter((f) => !f.resolved).length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "ranges", children: "Qualified Ranges" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "evaluation", children: "Evaluation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "overview", className: "space-y-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Identification" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "PQR number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.pqr_no ?? "", onChange: (e) => set("pqr_no", e.target.value), disabled: !isEditor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Standard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.standard ?? "", onChange: (e) => set("standard", e.target.value), disabled: !isEditor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Code family", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.code_family ?? "", onChange: (e) => set("code_family", e.target.value), disabled: !isEditor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Revision", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.revision ?? "", onChange: (e) => set("revision", e.target.value), disabled: !isEditor }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Dates & evaluator" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Test date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: merged.test_date ?? "", onChange: (e) => set("test_date", e.target.value || null), disabled: !isEditor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Qualification date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: merged.qualification_date ?? "", onChange: (e) => set("qualification_date", e.target.value || null), disabled: !isEditor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expiry date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: merged.expiry_date ?? "", onChange: (e) => set("expiry_date", e.target.value || null), disabled: !isEditor }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Evaluator", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: merged.evaluator_name ?? "", onChange: (e) => set("evaluator_name", e.target.value), disabled: !isEditor }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Remarks" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: merged.remarks ?? "", onChange: (e) => set("remarks", e.target.value), disabled: !isEditor }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ndt", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NdtTestsTable, { pqrId, standard: data.standard }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "mech", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MechanicalTestsTable, { pqrId }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "findings", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PqrFindingsTable, { pqrId }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "ranges", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QualifiedRangesForm, { pqrId, ranges: data.qualified_ranges, pwps, disabled: !isEditor }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "evaluation", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PqrEvaluationPanel, { pqrId, pqr: data, evaluation, canEdit: isEditor }) })
    ] })
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
  PqrDetailPage as component
};
