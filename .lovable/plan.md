# Base Material Dropdown for WPS

## Goal
Turn the **Material spec** column in the WPS *Base metals* table from a plain text input into a searchable dropdown seeded with the standard ASME materials you provided, while still allowing users to type in any material not on the list.

## What you'll see in the app
- In `app/procedures/:id` → *Base metals* table, the **Material spec** cell becomes a combobox:
  - Click to open a searchable list of ~35 standard materials (SA-106 Gr.B, SA-516 Gr.70, SA-240 Type 316L, Inconel 625, Duplex S31803, etc.).
  - Type to filter by spec, UNS, P-No, or description.
  - Each option shows: `SA-516 Gr.70 — P-No.1 Gr.2 · Carbon Steel · Pressure Vessel Plate`.
  - If no match exists, a "Use *typed value*" entry appears so any custom material can still be entered.
- When a standard material is picked, the adjacent **P-No** and **Group** columns auto-populate from the catalog (user can still override).
- Existing rows keep whatever value is already stored — nothing is migrated or overwritten.

## Files to change / add
1. **`src/lib/wps-base-materials.ts`** (new)
   - Export `BASE_MATERIALS` array typed as:
     ```
     { spec, grade, p_no, group_no, uns, family, description }
     ```
   - Seeded with all 35 entries from your list.
   - Helper `formatBaseMaterial(m)` → `"SA-516 Gr.70"`.

2. **`src/components/procedures/RelationalTable.tsx`**
   - Extend `ColumnDef` with optional `kind?: "combobox"`, `options?: ComboOption[]`, and `onOptionSelected?: (opt, row) => Partial<Row>` so a selection can patch multiple fields in one update.
   - Render a new `<ComboboxCell>` (Popover + Command + Input) when `kind === "combobox"`; otherwise keep the current `<Input>` behavior unchanged. Free-text typing falls through to the same `updateField` path used today.
   - Multi-field patches go through a single `supabase.update({...patch})` call (small addition next to `updateField`).

3. **`src/components/procedures/BaseMetalsTable.tsx`**
   - Mark the `material_spec` column as `kind: "combobox"`, pass options built from `BASE_MATERIALS`, and wire `onOptionSelected` to also fill `p_no` and `group_no` (and clear `to_p_no` / `to_group_no` unless already set).

## Out of scope
- No DB schema changes — `wps_base_metals.material_spec` stays a free-text column.
- No edits to PQR base-metal entry, filler metals, or other WPS sub-tables in this change. The same combobox primitive can be reused for them later if you want.
- No data migration of existing rows.

## Technical notes
- Combobox built from existing shadcn primitives already in the project (`command.tsx`, `popover.tsx`) — no new deps.
- Catalog is a static TS module, loaded with the route chunk; trivial bundle impact (~3 KB).
- Free-text values are preserved verbatim, so legacy data and unusual specs remain valid.
