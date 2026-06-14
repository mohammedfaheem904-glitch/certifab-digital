## Objective
In the "New PQR" dialog (PQR module), the "Code Family" field should be derived exclusively from the linked pWPS, not entered manually.

## Changes

### `src/routes/app.pqrs.index.tsx`
1. **Extend the pWPS options query** (`pwps-options`) to also select `code_family` so we know each pWPS's code family:
   - `select("id,pwps_no,code_family")`
   - Update `PwpsOpt` type to include `code_family: string | null`.

2. **Auto-populate on pWPS selection** in the New PQR dialog:
   - In the `<select>` `onChange` for "Linked pWPS", after `set("pwps_id", ...)`, look up the selected pWPS and call `set("code_family", selected.code_family ?? "")`.
   - When the selection is cleared, clear the code family too.

3. **Make the Code family field read-only and derived**:
   - Replace the editable `<Input>` for "Code family" with a read-only input that shows `values.code_family` (or a muted placeholder like "Select a pWPS to set code family").
   - Remove the default `code_family: "ASME IX"` from `NewRecordDialog` `defaults`, since it must come from the pWPS.
   - Add a helper text under the field: "Inherited from the linked pWPS."

4. **Validation**: keep "Linked pWPS" effectively required for creating a PQR — if `pwps_id` is empty, the code family will be empty and the user should pick one. (No schema change required; the field already exists as a nullable FK.)

## Out of scope
- The PQR detail page (`app.pqrs.$pqrId.tsx`) remains editable as today; only the creation dialog enforces inheritance.
- No database migration, no RLS changes.

## Files
| File | Change |
|---|---|
| `src/routes/app.pqrs.index.tsx` | Query `code_family` from pwps; auto-fill + lock Code family field in New PQR dialog |
