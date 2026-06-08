## Problem

On `/app/ncrs`, the Eye icon button in the Actions column calls `useNavigate()` programmatically:

```tsx
<Button size="icon" variant="ghost" onClick={() => nav({ to: "/app/ncrs/$ncrId", params: { ncrId: r.id } })} ...>
  <Eye className="size-4" />
</Button>
```

This doesn't navigate reliably — likely because the click handler resolves before the typed route map is ready in some cases, and it produces no real `<a href>` (no middle-click, no right-click "open in new tab", no keyboard nav).

The NCR-number cell uses a working `<Link to="/app/ncrs/$ncrId" params={{ ncrId: r.id }}>`, which confirms the route itself is fine.

## Fix

Replace the Eye `<Button onClick={nav(...)}>` with a `<Link>` wrapping a ghost button — same pattern used elsewhere in the app and consistent with the working NCR No. link in the same row.

```tsx
<Link to="/app/ncrs/$ncrId" params={{ ncrId: r.id }} aria-label="Open NCR details">
  <Button size="icon" variant="ghost" className="h-8 w-8">
    <Eye className="size-4" />
  </Button>
</Link>
```

This:
- Renders a real anchor (proper a11y, middle-click, keyboard).
- Removes dependency on the imperative `nav()` call.
- Leaves the Trash icon button untouched.

## Files

- `src/routes/app.ncrs.tsx` — swap the Eye button for a `Link`-wrapped ghost button in the Actions cell. Remove the now-unused `useNavigate` import if no other code path uses it.

## Verification

- Click the eye icon on a row → navigates to `/app/ncrs/<id>`.
- Middle-click opens the detail page in a new tab.
- Trash icon still moves the row to trash.
