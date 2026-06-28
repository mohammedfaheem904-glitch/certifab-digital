# WPS Variables — Automatic Qualified Range Engine (ASME IX)

Mirror the WPQ Qualification Range Engine into the WPS Variables matrix so that, for every variable row, the "Actual / Range" column auto-derives from the "Qualified Value" using the same ASME Section IX rules already encoded in `src/lib/qualification-intelligence.ts`.

## Scope

Applies to all 12 WPS variable groups (Welding Process, Joint Design, Base Metal, Filler Metal, Electrical, Position, Preheat/Interpass, PWHT, Shielding Gas, Backing, Technique, Material Compatibility) and all three categories (Essential, Supplementary Essential, Non-Essential). Read-only output, instant recalc, QW reference badge per row.

## Changes

### 1. `src/components/procedures/WpsVariablesMatrix.tsx` (only file touched)

Replace the free-text inputs for "Qualified Value" and "Actual / Range" with structured behavior driven by `variable_key`:

- **Qualified Value cell** — render the appropriate control per preset key (reusing the WPQ pattern):
  - `bm_pno` → P-Number number input
  - `bm_group` → Group number input
  - `bm_thickness`, `fm_deposit_thk`, `pwht_thickness` → thickness number input (mm) + "Tested with backing" checkbox where relevant
  - `bm_diameter` → diameter input (mm)
  - `fm_fno`, `fm_ano` → number input
  - `fm_diameter` → electrode diameter input (mm)
  - `pos_qualified` → position select (1G/2G/3G/4G/5G/6G/1F…)
  - `pos_progression` → Uphill / Downhill select
  - `joint_backing`, `back_type`, `gas_backing` → With backing / Without backing select
  - `el_current` → Current/Polarity select (AC, DCEN, DCEP, Pulsed)
  - `el_heat_input`, `el_amperage`, `el_voltage`, `el_travel_speed` → numeric input
  - `pre_min_temp`, `pre_interpass`, `pwht_temp_time` → numeric inputs (°C / min)
  - `process` → process select (SMAW/GTAW/GMAW/FCAW/SAW/PAW)
  - All other keys → free-text fallback (current behavior)
- **Actual / Range cell** — always read-only. Computed live from the Qualified Value via a new `deriveWpsRange(variable_key, qualified_value, context)` dispatcher that delegates to the existing derivers in `qualification-intelligence.ts` (P-No, F-No, thickness, diameter, position, progression, backing, current, etc.). Heat input, preheat, interpass, PWHT temp/time, amperage, voltage, travel speed use the ASME IX ± rules (e.g., preheat ≥ qualified − 55 °C per QW-406.1; heat input ≤ qualified per QW-409.1; interpass ≤ qualified + 55 °C per QW-406.2; PWHT temp within −15 °C / +15 °C and time per QW-407.2).
- **Code Ref cell** — auto-stamped from the deriver output (overrides manual entry on derived rows) and shown as a small QW badge.
- **Warnings** — inline message under the Actual/Range cell when the input combination is invalid (mirrors WPQ matrix UX).
- **Persistence** — on Qualified Value blur/change, persist both `qualified_value` and the derived `actual_range` + `code_reference` in one update so the DB stays in sync. No schema changes.
- **Custom rows** (variable_key not in preset list) keep free-text behavior for both columns.

### 2. `src/lib/qualification-intelligence.ts`

Add small dispatcher `deriveWpsRange(key, value, ctx)` that routes WPS preset keys to the existing WPQ derivers, plus light additions for WPS-only rules not yet covered:
- Heat input max (QW-409.1) — range "≤ {value} kJ/mm".
- Preheat min (QW-406.1) — "≥ {value − 55} °C".
- Interpass max (QW-406.2) — "≤ {value + 55} °C".
- PWHT temp/time (QW-407.2) — "{T−15} to {T+15} °C, ≥ {t} min".
- Amperage/voltage/travel speed (QW-409.8 / QW-410.5) — informational ±10% display per common practice (flagged as non-essential).
- Current/polarity (QW-409.4) — qualified-as-listed, range = "As qualified ({value})".
- Process (QW-401.1) — "As qualified ({value}) — change requires requalification".

All new helpers reuse the same return shape `{ range, codeRef, warnings? }` already used by the WPQ engine.

## Out of scope

- No DB migration.
- No changes to other modules (WPQ matrix already has its own engine).
- No changes to the seed preset list itself.

## Acceptance

- Entering `8` in P-No qualified value auto-fills "P-No 8 (and P-Nos qualified per QW-423.1)" with `QW-403.11`.
- Entering `10` mm in base metal thickness with backing auto-fills the QW-451 range and shows `QW-403.6 / QW-451.1`.
- Changing Position to `6G` auto-fills "All positions" with `QW-405.1`.
- Actual/Range field is visibly read-only and updates instantly on every Qualified Value change.
- Custom (non-preset) rows still accept free-text in both columns.
