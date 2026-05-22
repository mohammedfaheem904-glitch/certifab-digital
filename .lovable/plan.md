## Goal
Make the eye icon in the `/app/procedures` Actions column reliably open the WPS detail page when clicked.

## Plan
1. Update the eye action in `src/routes/app.procedures.tsx` to use the same programmatic navigation pattern already used by the row click.
2. Remove the current tooltip-wrapped link composition that is swallowing the click event.
3. Keep row navigation, delete behavior, and tooltip text unchanged.
4. Verify that clicking the eye icon changes the URL to `/app/procedures/<id>` and opens the WPS document, while the delete icon still only opens its confirmation dialog.

## Technical details
- Replace the eye icon trigger with a plain `Button` using:
  - `onClick={(e) => { e.stopPropagation(); nav({ to: '/app/procedures/$procedureId', params: { procedureId: p.id } }) }}`
- Preserve `TooltipTrigger asChild`, but attach it to the `Button` instead of a router `Link`.
- Remove any now-unused `Link` import if present.

## Expected result
- Eye icon click navigates immediately.
- Clicking elsewhere on the row still navigates.
- Clicking delete still does not navigate.