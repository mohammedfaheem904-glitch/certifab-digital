The user wants to rename the button label on the Procedures (/app/procedures) page from `New P WPS` to `New WPS`.

Location: `src/routes/app.procedures.index.tsx`, line 123, inside the `<NewRecordDialog>` component as the `trigger` prop value.

Change:
- `trigger="New P WPS"` → `trigger="New WPS"`

No other code changes are needed.