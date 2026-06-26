## Goal
Auto-link **AWS Class ↔ SFA No.** in the WPS Filler Metals table so selecting one populates/filters the other, using an ASME II-C mapping.

## Changes

### 1. Extend the classification catalog — `src/lib/filler-classifications.ts`
Add an `sfa_no: string` field to every entry in `FILLER_CLASSIFICATIONS` using the standard ASME Section II-C mapping, e.g.:
- E60xx / E70xx SMAW C-steel → `SFA-5.1`
- ER70S-x / E7xT-x C-steel wires → `SFA-5.18` / `SFA-5.20`
- E3xxL-xx SS SMAW → `SFA-5.4`; ER3xxL SS wires → `SFA-5.9`; E3xxLT1-1 → `SFA-5.22`
- ER40xx / ER50xx Al wires → `SFA-5.10`
- ERNiCr-3 / ERNiCrMo-3 / ERNi-1 → `SFA-5.14`
- ER80S-B2 / ER90S-B3 → `SFA-5.28`; E80xx-B2/B3 → `SFA-5.5`
- EM12K / EH14 SAW wires → `SFA-5.17`; F7A2/F8A2 flux-wire combos → `SFA-5.17`
- RG45 / RG60 → `SFA-5.2`

Add helpers:
- `lookupSfaForAwsClass(code)` → `string | string[] | null`
- `lookupAwsClassesForSfa(sfa)` → `string[]`
- `SFA_NO_OPTIONS` derived list for SFA dropdowns

Update `lookupFillerClassification` return type to include `sfa_no`.

### 2. Auto-populate SFA from AWS class — `src/components/procedures/FillerMetalsTable.tsx`
In the existing `aws_classification` combobox `onOptionSelected` handler, return `sfa_no` alongside `f_no`/`a_no`. If the lookup yields a single SFA → set the value directly. (Catalog is 1:1 today, so single-value path covers all current rows.)

### 3. Make SFA a combobox with reverse filtering — `src/components/procedures/FillerMetalsTable.tsx`
Convert the `sfa_no` column from plain text to `kind: "combobox"`:
- Options: full `SFA_NO_OPTIONS`.
- When the row already has an `aws_classification`, the options for SFA are restricted to the SFA(s) valid for that AWS class.
- Selecting an SFA with only one AWS class auto-fills `aws_classification` (+ `f_no`, `a_no`) via `onOptionSelected`.
- Free-text entry still allowed (combobox supports custom value) so non-catalog SFA/AWS pairs aren't blocked but trigger a soft validation warning.

### 4. Cross-field validation
In `FillerMetalsTable`, add a lightweight inline validator: when both `aws_classification` and `sfa_no` are set and don't match the catalog, render a small "Invalid AWS/SFA combination per ASME II-C" hint under the row (no hard block, consistent with the rest of the WPS builder's advisory style).

### 5. Reuse in pWPS dialog
`src/routes/app.pwps.$pwpsId.tsx` and the New pWPS dialog already use `lookupFillerClassification`; extend their handlers to also set `sfa_no` when populated from AWS class (mirrors the WPS behavior so pWPS → WPS autofill stays consistent).

## Out of scope
- No DB migration needed — `wps_filler_metals.sfa_no` already exists.
- No changes to Electrical Characteristics table (no SFA column there).
- No bulk backfill of existing rows.

## Technical notes
- `RelationalTable`'s `combobox` column kind and `onOptionSelected` callback are already used elsewhere (Base Material, AWS class), so no new infrastructure.
- Dynamic option filtering per-row will use a new `getOptions(row)` hook on the combobox column; if `RelationalTable` doesn't yet support per-row options, add a small extension (`options` may be a function of the row).
