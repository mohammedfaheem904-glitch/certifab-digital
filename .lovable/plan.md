## Goal

When a user picks a value in **Filler Classification**, automatically fill the **F-No** and **A-No** fields using the standard ASME IX mapping. Apply this in both modules where the field exists: pWPS and WPS.

## Where the field lives today

1. **pWPS detail page** — `src/routes/app.pwps.$pwpsId.tsx`, "Filler & gas" section: Filler classification is a free-text `Input`; F-No / A-No are separate text inputs.
2. **pWPS "New" dialog** — `src/routes/app.pwps.index.tsx`: Filler classification is a `<select>` grouped by family; no F-No / A-No fields in the dialog.
3. **WPS Filler metals table** — `src/components/procedures/FillerMetalsTable.tsx` (`wps_filler_metals` rows on the procedure detail). Column `aws_classification` is a plain text input; `f_no` and `a_no` are plain text inputs in the same row. `RelationalTable` already supports a `combobox` column kind with `onOptionSelected` returning a multi-field patch — no new infrastructure needed.

## Changes

### 1. Shared mapping module — `src/lib/filler-classifications.ts` (new)

Single source of truth used by all three places.

```ts
export type FillerClassificationEntry = {
  code: string;            // e.g. "E7018"
  f_no: string;            // e.g. "4"
  a_no: string | null;     // null when "N/A"
  group: string;           // for optgroup labels
};

export const FILLER_CLASSIFICATIONS: FillerClassificationEntry[] = [ /* full list from spec */ ];

export const FILLER_CLASSIFICATION_MAP: Record<string, { f_no: string; a_no: string | null }> = /* derived */;

export function lookupFillerClassification(code: string | null | undefined):
  { f_no: string; a_no: string | null } | null;
```

Full mapping (from the user's spec):

```text
Carbon Steel SMAW      E6010→F-3/A-1, E6011→F-3/A-1, E6013→F-4/A-1,
                       E7016→F-4/A-1, E7018→F-4/A-1, E7024→F-4/A-1
Carbon Steel GMAW/GTAW ER70S-2→F-6/A-1, ER70S-3→F-6/A-1, ER70S-6→F-6/A-1
Carbon Steel FCAW      E71T-1→F-6/A-1, E71T-9→F-6/A-1, E71T-11→F-6/A-1
Stainless SMAW         E308L-16→F-5/A-8, E309L-16→F-5/A-8, E316L-16→F-5/A-8
Stainless GMAW/GTAW    ER308L→F-6/A-8, ER308LSi→F-6/A-8, ER309L→F-6/A-8,
                       ER316L→F-6/A-8, ER316LSi→F-6/A-8
Stainless FCAW         E308LT1-1→F-6/A-8, E316LT1-1→F-6/A-8
Aluminum               ER4043→F-23/N/A, ER5356→F-23/N/A, ER4047→F-23/N/A
Nickel-alloy           ERNiCr-3→F-43/N/A, ERNiCrMo-3→F-43/N/A, ERNi-1→F-41/N/A
Low-alloy Cr-Mo        ER80S-B2→F-6/A-3, ER90S-B3→F-6/A-4,
                       E8018-B2→F-4/A-3, E8018-B3→F-4/A-4
SAW wires & flux       EM12K→F-6/A-1, EH14→F-6/A-1,
                       F7A2-EM12K→F-6/A-1, F8A2-EH14→F-6/A-1
Oxy-fuel rods          RG45→F-6/A-1, RG60→F-6/A-1
```

`a_no = null` means the field is cleared and displayed as blank (interpreted as "N/A").

### 2. pWPS detail — `src/routes/app.pwps.$pwpsId.tsx`

Convert the Filler classification `Input` into a `<select>` using the same grouped options the New-pWPS dialog already uses. In its `onChange`, in addition to `set("filler_classification", v)`, look the code up in the map and call `set("f_no", entry.f_no)` and `set("a_no", entry.a_no ?? "")`. F-No and A-No remain editable so engineers can override.

### 3. pWPS New dialog — `src/routes/app.pwps.index.tsx`

Reuse the same options from the shared module (replace the inline arrays) and, in the existing `onChange`, also set `f_no` and `a_no` on the form state via `set(...)`. No new visible fields are added to the dialog — the values are stored on the record and shown in the detail page.

### 4. WPS Filler metals table — `src/components/procedures/FillerMetalsTable.tsx`

Change the `aws_classification` column from a plain text input to:

```ts
{
  key: "aws_classification",
  label: "AWS class",
  kind: "combobox",
  options: FILLER_CLASSIFICATIONS.map(c => ({
    value: c.code, label: c.code, description: `F-No ${c.f_no} · A-No ${c.a_no ?? "N/A"}`,
    keywords: c.group,
  })),
  onOptionSelected: (opt) => {
    const entry = lookupFillerClassification(opt.value);
    return entry ? { f_no: entry.f_no, a_no: entry.a_no } : {};
  },
}
```

`RelationalTable`'s existing `updatePatch` writes `aws_classification`, `f_no`, and `a_no` in one round-trip. Free-text entry remains supported (the combobox already allows a "Use …" custom value), and F-No / A-No columns stay editable.

## Out of scope

- No database schema changes — `pwps.f_no`, `pwps.a_no`, `wps_filler_metals.f_no`, and `wps_filler_metals.a_no` already exist.
- Read-only displays (e.g. WPS document, qualified ranges form) are not changed.
- No back-fill of existing records.
