
## Goal
In the WPQ → Variables tab, make **Qualified For (Range)** auto-calculated from **Qualified With**, using ASME Section IX rules (QW-403, 404, 405, 408, 409, 410, 423, 433, 452, 461). Read-only output, instant recalculation, code references visible, validation messages when input combinations are invalid.

## Approach
Reuse the existing engine `src/lib/qualification-intelligence.ts` (`deriveQualificationRanges`, POSITION_RULES, PNUM_TRANSFERABILITY, ISO_MATERIAL_GROUPS, thickness/diameter rules) instead of duplicating ASME logic. Extend it with small per-variable helpers for F-Number, Progression, Backing, Current/Polarity that aren't yet exposed standalone.

## Changes

### 1. `src/lib/qualification-intelligence.ts` — add per-variable derivers
Add pure helpers returning `{ qualifiedFor: string; codeRef: string; warning?: string }`:
- `derivePNumberRange(pNo)` → uses `PNUM_TRANSFERABILITY` → "P-1 (also covers …)" + QW-423.1
- `deriveFNumberRange(fNo)` → F-No qualifies same F-No only (with notes for F-6 covering lower F-Nos per QW-433) + QW-433
- `deriveCouponThicknessRange(t, withBacking)` → wraps `asmeBaseThickness` + `asmeDepositThickness`, formatted string + QW-452.1(b)
- `derivePipeDiameterRange(d)` → wraps `asmeDiameter` + QW-452.3 / QW-403.16
- `derivePositionRange(posKey, isPipe)` → uses `POSITION_RULES` + QW-461.9
- `deriveProgressionRange(progression)` → uphill qualifies uphill+downhill is FALSE — uphill qualifies uphill only; downhill qualifies downhill only (QW-405.3)
- `deriveBackingRange(withBacking)` → QW-402.4 / QW-350: with backing does NOT qualify without; without backing qualifies both
- `deriveCurrentPolarityRange(value)` → QW-409.4: change in current/polarity is essential — qualifies only the tested type

Each returns the formatted text plus the canonical code reference, so the matrix can render both the value and the QW paragraph.

### 2. `src/components/qualifications/QualificationVariablesMatrix.tsx` — wire engine into the table

Add a registry keyed by `variable_key`:

```
qualified_with input kind  →  deriver  →  formatted "Qualified For" + code ref
```

For each known preset row (`p_no`, `f_no`, `thickness`, `diameter`, `position`, `progression`, `backing`, `current`):
- Replace the free-text **Qualified With** input with the right control:
  - `p_no`, `f_no`: numeric input
  - `thickness`, `diameter`: numeric input (mm) + (for thickness) a "with backing" checkbox
  - `position`: select populated from `POSITION_RULES` keys
  - `progression`: select (Uphill / Downhill / N/A)
  - `backing`: select (With backing / Without backing)
  - `current`: select (AC / DCEN / DCEP / Pulsed)
- Render **Qualified For (Range)** as a read-only field, recomputed live from `qualified_with` via the deriver. Display the QW code ref as a small badge under the cell when it differs from the row's `code_reference`.
- Show inline validation warning (red helper text) when the deriver returns a `warning` (e.g. missing thickness, unsupported position key).
- For unknown/custom rows (no preset key) keep the current free-text behavior — no auto-derivation, so users can still capture non-coded variables.
- Persist both `qualified_with` (raw input) and `qualified_for` (computed string) to the DB on blur/change, so PDF certificate output stays unchanged.

### 3. Certificate / compliance reuse
No schema change required (`qualification_variables.qualified_with` / `qualified_for` already exist as text). The PDF (`QualificationComplianceReport.tsx`) keeps reading the stored `qualified_for` string.

### 4. WPS/PQR reuse
Expose the same derivers from `qualification-intelligence.ts` so the WPS Variables Matrix (`WpsVariablesMatrix.tsx`) and PQR `QualifiedRangesForm.tsx` can adopt them in a follow-up — out of scope for this change, but the engine is shared.

## Out of scope
- Multi-process combination tests (QW-306) — engine already handles via `deriveQualificationRanges`; not surfaced per-row in this iteration.
- Editing the ASME rule tables through the UI.
- ISO 9606-1 toggle inside the WPQ matrix (engine supports it; UI stays ASME IX for this change since the matrix's code refs are QW-*).
