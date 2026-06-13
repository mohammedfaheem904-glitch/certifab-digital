## Objective
Add a new "Filler Metal Diameter" field to the pWPS detail form in the "Filler & gas" section, placed directly under "Filler classification". The field should be a searchable dropdown with a free-text fallback for custom values.

## Proposed Changes

### 1. Database Migration
- Add a new nullable `text` column `filler_diameter_mm` to the `public.pwps` table.
- No RLS changes needed (existing table policies already cover the table).

### 2. Frontend Type Update
- Add `filler_diameter_mm: string | null` to the local `Pwps` type in `src/routes/app.pwps.$pwpsId.tsx`.
- The Supabase types file will be auto-regenerated after the migration is applied.

### 3. Reusable Combobox Component
Create `src/components/procedures/FillerDiameterCombobox.tsx` that mirrors the existing `BaseMaterialCombobox` pattern:
- Uses `Command` + `Popover` for a searchable dropdown.
- Pre-populated options: `0.8 mm`, `1.0 mm`, `1.2 mm`, `1.6 mm`, `2.0 mm`, `2.4 mm`, `2.5 mm`, `3.2 mm`, `4.0 mm`, `5.0 mm`, `6.0 mm`.
- Free-text fallback: if the user types a value not in the list, they can click "Use custom: …" to set the value manually.
- Keeps the input editable so custom diameters (e.g. `1.8 mm`) are always allowed.

### 4. Form Integration
In `src/routes/app.pwps.$pwpsId.tsx`, inside the "Filler & gas" `<Section>`:
- Insert a new `<Field label="Filler Metal Diameter (mm)">` directly below the "Filler classification" field.
- Render the new `FillerDiameterCombobox` with `value={merged.filler_diameter_mm ?? ""}` and `onChange={(v) => set("filler_diameter_mm", v)}`.
- Respect the `isEditor` read-only state.

## Files to Modify
| File | Action |
|---|---|
| `supabase/migrations/` | New migration adding `filler_diameter_mm` column to `pwps` |
| `src/routes/app.pwps.$pwpsId.tsx` | Add type field, render combobox in form |
| `src/components/procedures/FillerDiameterCombobox.tsx` | New reusable component |

No other tables, RLS policies, or workflows are affected.
