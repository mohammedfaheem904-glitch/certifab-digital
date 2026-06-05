# Full pWPS → WPS inheritance on PQR promotion

## Goal
When a passed PQR is promoted, the resulting WPS (in `procedures`) must inherit the complete pWPS dataset so engineers don't re-enter anything. Today only ~15 scalar fields are copied; everything else (extra scalars + every relational detail section) is left blank.

## Gaps today
`buildWpsPayload` (`src/lib/pqr-promotion.ts`) skips pWPS scalar fields that have direct equivalents on `procedures`:
- `joint_type`, `groove_type` (already copied), but missing `pipe_or_plate`, `welding_progression`, `electrode_type` derivation
- pWPS `polarity`, `backing`, `p_number`, `group_number`, `filler_classification`, `code_family`, `title`, `notes`, `diameter_min/max_mm`, `thickness_min/max_mm` (only stringified into `thickness_range`), `project_id`, `qualified_at`

And **none** of the WPS relational detail tables are seeded:
- `wps_base_metals`, `wps_filler_metals`, `wps_positions`, `wps_preheat_entries`, `wps_shielding_gases`, `wps_pwht`, `wps_electrical_characteristics`, `wps_techniques`, `wps_notes`

Because pWPS is a flat record (no child tables of its own), inheritance has to translate each pWPS scalar group into a single seed row in the matching WPS child table.

## Changes

### 1. `src/lib/pqr-promotion.ts` — expand scalar copy
Extend `buildWpsPayload` to additionally map (using PQR `qualified_ranges` overrides where they exist):
- `welding_progression` ← pwps progression (from `position` modifier if present, otherwise null)
- `back_gouging` ← pwps `backing` when it implies back gouging, else copy verbatim into a new `notes` line
- `electrode_type` ← pwps `filler_classification`
- `notes` ← merge auto-generated provenance line with `pwps.notes`
- Keep existing thickness_range string but also pass through min/max for child-table seeding

### 2. `src/lib/pqr-promotion-runtime.ts` — seed WPS child tables
After inserting the `procedures` row, insert one seed row per detail table from the pWPS scalars + PQR qualified ranges. All inserts run in `Promise.all` after the procedure id is known and are best-effort (log + continue on individual failure so the WPS still exists).

Seed mapping:
| Child table | Source fields |
|---|---|
| `wps_base_metals` | `base_material`, `p_number`, `group_number`, `thickness_min/max_mm` (PQR overrides), `diameter_min/max_mm` |
| `wps_filler_metals` | `process`, `filler_material`, `filler_classification` (→ aws_classification) |
| `wps_positions` | `position`, `position` as `qualified_range`, progression from pwps |
| `wps_preheat_entries` | `preheat_min_c`, `interpass_max_c` |
| `wps_shielding_gases` | `process`, `shielding_gas` (→ gas_type) |
| `wps_pwht` | `pwht` (→ applicability/notes; numeric temp left null) |
| `wps_electrical_characteristics` | `process`, `polarity`, `current_min/max`, `voltage_min/max`, `travel_speed_min/max`, `heat_input_min/max` (PQR overrides) |
| `wps_techniques` | `process`, `technique_notes`, back_gouging from pwps backing |
| `wps_notes` | one row with `category: 'engineering'`, body = pwps.notes (only if present) |

Each insert includes `company_id` and `procedure_id` so existing RLS passes for editors.

### 3. Idempotency
Already-promoted PQRs (with `resulting_wps_id`) continue to short-circuit — no re-seeding, no duplicate child rows.

### 4. No schema migration
All target tables and columns already exist. No DB changes required.

## Out of scope
- Editing the new WPS detail rows on screen still happens through the existing `RelationalTable` UIs — no UI changes here.
- pWPS does not have its own relational sub-tables; if/when it gains them, this code can be extended to copy rows instead of synthesizing them.
