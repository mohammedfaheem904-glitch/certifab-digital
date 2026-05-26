## Goal

Turn the current PQR shell into a real **Qualification Engine**: structured NDT + Mechanical test builders, a rule-driven Pass/Fail evaluation, automatic findings, and a guided workflow from Draft → Tests Logged → Evaluated → Passed/Failed → (auto) Promote to WPS.

Today `app.pqrs.$pqrId.tsx` only has Overview, a JSON editor for `qualified_ranges`, and a placeholder "Tests" tab. The DB is already in place: `ndt_tests`, `mechanical_tests`, `pqr_findings`, `qualification_signatures`-style pattern. We wire the UI + evaluation logic on top.

---

## 1. PQR detail — new workflow stepper

Top of `app.pqrs.$pqrId.tsx`:

```
[1 Setup] → [2 Coupons] → [3 NDT] → [4 Mechanical] → [5 Evaluation] → [6 Sign & Promote]
```

Each step has a clear "complete" rule (all required tests logged, no Pending results, etc.). The stepper is read-only navigation; tabs below do the actual work.

Tabs become: **Overview · Coupons · NDT Tests · Mechanical Tests · Findings · Qualified Ranges · Evaluation · Signatures**.

The header "Mark Passed & Promote to WPS" button moves into the **Evaluation** tab and is disabled until the evaluation engine says all gates are green.

## 2. NDT Test Builder (`NdtTestsTable.tsx`)

Inline editable table backed by `ndt_tests` (filtered by `pqr_id`).

Columns:
- Method (VT / PT / MT / RT / UT / PAUT) — enum select
- Coupon / specimen id
- Test date
- Technician name
- Equipment (link to `instruments`)
- Acceptance criteria (free text, defaults to PQR's `standard`)
- Findings (textarea in expandable row)
- Result (Pending / Passed / Failed) — enum select
- Report number + attachment (uses existing `pqr-attachments` bucket)
- Row actions: edit / delete

Header actions: **+ Add NDT Test**, **Bulk add standard set** (one row per required method per ASME IX / AWS D1.1 preset), CSV export.

Validation:
- VT is mandatory for every PQR (warn if missing).
- RT or UT required for groove welds > 8 mm (warn).
- PT or MT required for surface inspection if specified by code.

These warnings auto-write rows into `pqr_findings` (severity = `warning`, `affected_variable = 'ndt_coverage'`) and clear when satisfied.

## 3. Mechanical Test Builder (`MechanicalTestsTable.tsx`)

Inline editable table backed by `mechanical_tests`.

Columns:
- Test type (Tensile / Bend-Face / Bend-Root / Bend-Side / Macro / Hardness / Charpy / Fillet-Break) — enum select
- Specimen id
- Dimensions (JSON-lite: width, thickness, gauge length — rendered as compact inputs)
- Results (per-type smart fields, see below)
- Minimum requirement (auto-suggested from code + base metal)
- Result (Pending / Passed / Failed)
- Laboratory, report number, test date, attachment
- Remarks

**Smart per-type result fields** (stored in `results` jsonb):
- Tensile → UTS (MPa), location of failure ("In base metal" / "In weld" / "In HAZ"), elongation %
- Bend → angle, open discontinuity length (mm), pass criterion auto-applied (no open discontinuity > 3 mm per ASME IX QW-163)
- Macro → defects observed (LOF, porosity, crack — multi-select), pass if none
- Hardness → max HV in HAZ, limit (auto-set from NACE MR0175 if sour service flag set on pWPS)
- Charpy → temperature °C, energy J per specimen (3 values), avg, min — auto-pass per code minimum
- Fillet-break → fracture appearance, defects

**Auto-evaluation per row**: as the user types, a small badge shows "Meets criteria ✓" or "Below minimum ✗" with the rule reference. Failing rows auto-insert a `pqr_findings` row (severity = `blocker`).

**Required test matrix** by code family (computed, not stored):
- ASME IX groove: 2 tensile + 4 bend (or 2 side bend if t ≥ 19 mm) + macro
- AWS D1.1 groove: 2 reduced-section tensile + 4 bend + macro + (Charpy if CVN required)
- Fillet PQR: macro + fillet break
- Missing required tests → blocker finding "Required test {x} not logged".

## 4. Findings tab (`PqrFindingsTable.tsx`)

Read/write on `pqr_findings`. Two sources:
- **Auto-generated** by NDT/Mechanical evaluators (read-only title + remediation, user can mark `resolved`)
- **Manual** added by engineer (Add finding dialog)

Severity badges: info / warning / blocker. The **Evaluation** tab blocks Pass if any unresolved `blocker` exists.

## 5. Qualified Ranges — replace JSON editor with structured form (`QualifiedRangesForm.tsx`)

Replaces today's raw JSON textarea. Fields are computed from pWPS + auto-suggested per ASME IX QW-451 / AWS D1.1 Table 4.5:

- Thickness range qualified (min/max mm) — auto: t_min = pWPS.thickness * 0.5, t_max = 2 * pWPS.thickness (capped per code)
- Diameter range (min/max mm) — auto from pipe OD class
- Position envelope (multi-select 1G/2G/3G/4G/5G/6G…) — auto-expanded from tested position
- Heat input range (min/max kJ/mm) — auto: ±10% of tested
- Filler classification range, P/S/A numbers qualified
- PWHT range, preheat range
- Diameter qualified for fillet welds (separate)

"Use code-suggested defaults" button populates everything; user can override. Stored back into `pqrs.qualified_ranges` JSONB (existing column, no schema change).

## 6. Evaluation engine (`src/lib/pqr-evaluation.ts`)

Pure function `evaluatePqr({ pqr, pwps, ndt[], mech[], findings[] }) → EvaluationResult`:

```text
{
  ready: boolean,
  blockers:  Finding[],   // must clear to pass
  warnings:  Finding[],
  checklist: [
    { id: 'ndt_required', label: 'All required NDT logged & passed', status: 'pass'|'fail'|'warn', detail }
    { id: 'mech_required', ... }
    { id: 'no_pending', label: 'No Pending results', ... }
    { id: 'ranges_set', label: 'Qualified ranges set', ... }
    { id: 'no_blockers', ... }
  ],
  recommendedOverallResult: 'Passed'|'Failed'|'Pending',
}
```

**Evaluation tab UI** = the checklist + counts + a big "Pass & Sign" button (disabled unless `ready === true`) and a "Force Fail" button.

This is also called continuously in the header to drive the stepper colors.

## 7. Sign & Promote (existing pattern, tightened)

Reuse `SignaturePad` (already in repo for qualifications) inside a dialog when the user clicks "Pass & Sign":
1. Captures evaluator signature → inserts into a new lightweight `qualification_signatures`-style row scoped to the PQR (we reuse `qualification_signatures` with a synthetic `qualification_id = pqr.id` — or add `pqr_id` column; see step 8).
2. Updates `pqrs` (`overall_result='Passed'`, `status='Passed'`, `evaluator_*`, `qualification_date`).
3. Calls existing `promotePqrToWps(pqrId)` → Draft WPS shows up in Procedures (unchanged behaviour).

"Force Fail" path: dialog for reason → inserts blocker finding + sets `Failed`. Linked pWPS gets a notification "PQR-xxx failed — remediation required".

## 8. Schema additions (single migration)

Minimal — most tables already exist:

- `qualification_signatures.pqr_id uuid NULL` + index, so the existing signature pattern works for PQRs without a fake qualification row. RLS unchanged (company-scoped).
- `pqrs.evaluation_snapshot jsonb` — stores the evaluation result at the moment of Pass/Fail for audit (immutable record of what was true when signed).
- Enum extension: `pqr_status` add `'TestsLogged'`, `'Evaluated'` if not present (used by the stepper; check current enum first and only add what's missing).

No new tables needed.

## 9. Files to add / edit

Add:
- `src/components/pqr/PqrWorkflowStepper.tsx`
- `src/components/pqr/NdtTestsTable.tsx`
- `src/components/pqr/MechanicalTestsTable.tsx`
- `src/components/pqr/PqrFindingsTable.tsx`
- `src/components/pqr/QualifiedRangesForm.tsx`
- `src/components/pqr/PqrEvaluationPanel.tsx`
- `src/components/pqr/PqrSignDialog.tsx`
- `src/lib/pqr-evaluation.ts` (pure rules: required test matrix, per-type pass/fail, range suggestions)
- `src/lib/pqr-rules.ts` (code-family reference data: ASME IX, AWS D1.1, NACE MR0175 thresholds)

Edit:
- `src/routes/app.pqrs.$pqrId.tsx` — stepper header, replace tabs, mount new components, wire evaluation
- `src/routes/app.pqrs.index.tsx` — show evaluation-ready badge on list rows
- `src/lib/pqr-promotion.ts` — only allow promotion when `evaluation_snapshot.ready === true`

## 10. Out of scope (next phase)

- PQR PDF export with full test traceability and signature block
- Cross-PQR variable comparison (which essential variable changed → requires new PQR)
- Auto-attaching scanned lab reports via OCR
- Welder qualification (WPQ) coupled to this PQR

---

Reply **"go"** to implement, or tell me what to adjust (e.g. drop the schema additions, change the required-test matrix, simplify the per-type result fields).