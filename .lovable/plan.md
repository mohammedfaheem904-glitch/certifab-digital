## Problem

In `src/routes/app.ncrs.tsx` the Eye action renders:

```tsx
<Link ...>
  <Button size="icon" variant="ghost">
    <Eye />
  </Button>
</Link>
```

This produces `<a><button>...</button></a>`, which is invalid HTML. Browsers (Chromium especially) often treat the inner `<button>` as the click target and do not trigger the anchor's navigation — so clicking the Eye icon does nothing.

## Fix

Use shadcn's `asChild` prop so `Button` renders as the `Link`'s anchor instead of nesting them. One element, anchor semantics, button styling.

```tsx
<Button asChild size="icon" variant="ghost" className="h-8 w-8">
  <Link to="/app/ncrs/$ncrId" params={{ ncrId: r.id }} aria-label="Open NCR details">
    <Eye className="size-4" />
  </Link>
</Button>
```

## Scope

- File: `src/routes/app.ncrs.tsx` — only the Eye action cell in the table row.
- No other changes (Trash button, route, RPCs untouched).

## Verification

- Click Eye → navigates to `/app/ncrs/:id`.
- Middle-click / Cmd-click opens in new tab.
- Keyboard Tab + Enter navigates.
