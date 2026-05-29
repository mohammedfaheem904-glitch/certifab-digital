## Goal
Extend the existing Procedures (WPS) list page (`src/routes/app.procedures.index.tsx`) with a proper filtration system, alongside the current search + tab UI.

## Filters to add
Rendered as a row of compact `Select` dropdowns above/next to the search input:

1. **Status** — Draft, In Review, Approved, Qualified, Rejected, Superseded (derived from distinct `status` values in current rows, with a stable known set as fallback).
2. **Process** — distinct `process` values (GTAW, SMAW, GMAW, FCAW, SAW, …) derived from the loaded rows.
3. **Standard / Code family** — distinct `standard` values (ASME IX, EN ISO 15614, AWS D1.1, AS/NZS, JIS, …).
4. **Source** — `Qualified by PQR` vs `Manual` (mirrors the existing "Source" column: based on whether `pqr_id` is set).
5. **Position** (bonus, "etc.") — distinct `position` values when present.

Each dropdown includes an "All" option and only shows values that actually exist in the dataset (built from `useCompanyRows` result). Selecting a value narrows the list; combined with the existing search box and tab (All / Qualified / Legacy), filters compose with AND logic.

## UX details
- Toolbar layout (in the existing `p-3 border-b` header strip):
  - Row 1: Tab pills + pending-approval chip (unchanged) + Search input (unchanged, moved to wrap).
  - Row 2: Filter dropdowns + "Active filters" chips + "Clear filters" ghost button (only visible when any filter is active).
- Active filter chips show `Status: Draft ×` style and remove that single filter on click.
- "Clear filters" resets all dropdowns (does not clear the search box or tab — those remain independent, matching the existing pattern used in pWPS/PQR).
- Result counter on the right of the toolbar: `Showing X of Y`.
- Bulk Export "visible" option keeps working — it already uses `filtered`, so it automatically respects the new filters.

## Implementation notes (technical)
- Pure frontend change in `src/routes/app.procedures.index.tsx`. No schema or RPC changes.
- Use existing `@/components/ui/select` (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`) — already imported elsewhere in the project.
- State: add `statusFilter`, `processFilter`, `standardFilter`, `sourceFilter`, `positionFilter` (each `string`, default `"all"`).
- Derive option lists via `useMemo` from `data ?? []`, sorted alphabetically, de-duplicated, dropping null/empty.
- Extend the existing `filtered` computation to AND-combine the new filters with the tab scope and the search string.
- For `sourceFilter`: `"qualified"` → `!!p.pqr_id`; `"manual"` → `!p.pqr_id`.
- Keep `Row` type as-is; if Position filter is added, extend `Row` to include `position: string | null` and add it to the optional select (the underlying table already has it — see the NewRecordDialog `position` field).

## Out of scope
- No changes to the pWPS/PQR pages (they already have their own filter system from Phase 8).
- No URL/search-param persistence for filters in this pass (kept as local component state, matching the current search/tab pattern on this page). Can be added later via `validateSearch` if desired.
- No backend filtering — dataset is already loaded client-side via `useCompanyRows`.

## Files changed
- `src/routes/app.procedures.index.tsx` — add filter state, dropdowns, active-chip row, extend `filtered` logic.
