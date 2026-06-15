# Add Qualification Lineage to pWPS and PQR

Extend the existing `QualificationLineageStrip` (today shown only on WPS detail) so the full qualification chain — **pWPS → PQR → WPS** — is visible from any node in the chain.

## What the user will see

On every detail page (pWPS, PQR, WPS) a lineage strip renders the full chain, with the current record highlighted as "this …" and the other nodes as clickable links with status/result badges.

```text
pWPS-SMAW-026  →  PQR-SMAW-026 (Passed, qualified 6/10/2026)  →  WPS-SMAW-026
```

- **pWPS detail page**: shows `this pWPS → linked PQR(s) → resulting WPS(s)`. If no PQR has been raised yet, shows `this pWPS → (Awaiting qualification)`.
- **PQR detail page**: shows `linked pWPS → this PQR → resulting WPS` (resulting WPS only when present).
- **WPS detail page**: unchanged — already shows `pWPS → PQR → this WPS`.

Each node remains a link to its own detail page, so users can traverse the chain in either direction for full traceability.

## Technical changes

1. **`src/components/procedures/QualificationLineageStrip.tsx`**
   - Add a `current: "pwps" | "pqr" | "wps"` prop (default `"wps"` for back-compat).
   - Add optional `wpsId` prop and a query for the resulting WPS (`procedures.id, code/wps_no, status`) so the WPS node can render outside the WPS page.
   - Support multiple PQRs / multiple resulting WPSs as arrays (a pWPS may have several PQR attempts; a PQR may spawn one resulting WPS). Render each as its own chip; arrow separators between chain segments.
   - The node matching `current` renders as bold "this pWPS / this PQR / this WPS" (non-link) instead of a link, keeping today's visual style.
   - When a chain segment is missing, render a muted placeholder ("Awaiting qualification", "No resulting WPS yet") instead of hiding the strip.

2. **`src/routes/app.pwps.$pwpsId.tsx`**
   - Query PQRs where `pwps_id = pwpsId` (id, pqr_no, overall_result, qualification_date, status, resulting_wps_id), and the resulting WPS rows for any non-null `resulting_wps_id`.
   - Render `<QualificationLineageStrip current="pwps" pwpsId={pwpsId} pqrIds={[...]} wpsIds={[...]} />` near the top of the detail body (same placement pattern as the WPS page).

3. **`src/routes/app.pqrs.$pqrId.tsx`**
   - Use the already-loaded `pwps_id` and `resulting_wps_id` from the PQR row.
   - Render `<QualificationLineageStrip current="pqr" pwpsId={data.pwps_id} pqrId={pqrId} wpsId={data.resulting_wps_id} />` near the top of the detail body.

4. **`src/routes/app.procedures.$procedureId.tsx`**
   - Pass `current="wps"` explicitly (no behavior change).

## Out of scope

- No database/schema changes — all linkage fields (`pwps.id`, `pqrs.pwps_id`, `pqrs.resulting_wps_id`) already exist.
- No new "supporting documents" upload feature; existing attachments tabs on each module remain the source of supporting documents and are reachable via the lineage links.
