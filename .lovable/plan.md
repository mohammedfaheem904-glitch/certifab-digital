# Fix: "_welder_mode column not found" when logging a weld

## Root cause

In `src/routes/app.welds.index.tsx` (Log Weld dialog), the Welder field uses a UI-only flag `values._welder_mode` to switch between "pick from list" and "type a custom name". That key is stored alongside real column values in the shared `NewRecordDialog` state.

`src/components/NewRecordDialog.tsx` then inserts the whole `values` object into the target table verbatim:

```ts
supabase.from(table).insert({ ...values, company_id: profile.company_id })
```

Because `welds` has no `_welder_mode` column, PostgREST returns:
> Could not find the '_welder_mode' column of 'welds' in the schema cache

This blocks saving any new weld.

## Fix

Filter out internal/UI-only keys (any key starting with `_`) before sending the insert. This is a single, surgical change in `NewRecordDialog.tsx` and keeps the convention reusable for any future dialog that needs local UI flags.

### Change

In `src/components/NewRecordDialog.tsx`, inside `onSubmit`, build the payload by stripping keys that start with `_`:

```ts
const payload = Object.fromEntries(
  Object.entries(values).filter(([k]) => !k.startsWith("_"))
);
const { error } = await (supabase.from(table as any) as any)
  .insert({ ...payload, company_id: profile.company_id });
```

No DB migration, no schema change, no other files touched.

## Verification

- Open Welds → Log Weld → pick a welder (or choose "Other" and type a name) → Save. Insert succeeds, no schema-cache error.
- Existing dialogs (pWPS, WPS, etc.) are unaffected since none of them rely on `_`-prefixed keys being persisted.
