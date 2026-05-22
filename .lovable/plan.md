## Problem

On `/app/procedures`, the eye icon in the Actions column does nothing on click — URL doesn't change. Clicking other parts of the row navigates fine.

## Root cause

In `src/routes/app.procedures.tsx` (lines 141–155), the eye button is built as:

```text
<div onClick={stopPropagation}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Link to="..." onClick={stopPropagation}>
        <Eye />
      </Link>
    </TooltipTrigger>
  </Tooltip>
</div>
```

Two things combine to swallow the click:

1. `TooltipTrigger asChild` wraps the child in Radix's `Slot`, which merges its own pointer/click handlers into the `Link`. The composition with TanStack Router's `Link` (which has its own internal `onClick` that calls `preventDefault` and then triggers `router.navigate`) does not fire reliably — the Link's navigation handler often never runs.
2. The extra `onClick={e.stopPropagation()}` on the `Link` is only needed to stop the row's `onClick` from firing, not to navigate, but the combo with Slot leaves the navigation path inert.

Result: tooltip works on hover, but click does nothing.

## Fix

Replace the `Link` inside `TooltipTrigger asChild` with a plain `Button` that calls `nav({ to: "/app/procedures/$procedureId", params: { procedureId: p.id } })` in its `onClick` (matching the `useNavigate` pattern already used for the whole row). This is the same shape the Delete button next to it uses, which works.

```text
<Tooltip>
  <TooltipTrigger asChild>
    <Button
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      onClick={(e) => {
        e.stopPropagation();
        nav({ to: "/app/procedures/$procedureId", params: { procedureId: p.id } });
      }}
      aria-label="Open WPS"
    >
      <Eye className="size-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Open WPS</TooltipContent>
</Tooltip>
```

Only this one block changes. The row-level click navigation, delete button, and tooltip provider stay as-is.

## Files

- `src/routes/app.procedures.tsx` — swap the `Link`-in-tooltip eye icon for a `Button` with an `onClick` that calls `nav(...)`.

## Verification

1. Open `/app/procedures`.
2. Click the eye icon on any row → navigates to `/app/procedures/<id>` and the WPS document renders.
3. Hovering the icon still shows the "Open WPS" tooltip.
4. Clicking the row body (outside actions) still navigates.
5. Clicking the delete icon still opens the Trash confirmation without navigating.