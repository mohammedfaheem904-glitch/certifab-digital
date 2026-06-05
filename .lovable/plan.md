# Shielding Gas Dropdown

Replace the free-text "Shielding gas" inputs with a grouped `<select>` dropdown using standard welding shielding gas options, applied in both forms that expose the field.

## Files to update

1. `src/routes/app.pwps.$pwpsId.tsx` (line 387) — pWPS detail edit form, "Filler & gas" section.
2. `src/routes/app.procedures.index.tsx` (line 240) — New Procedure dialog.

(The pWPS New Record dialog in `src/routes/app.pwps.index.tsx` does not currently include a shielding gas field — leaving as-is.)

## Proposed dropdown options (grouped by welding process)

**Inert gases (GTAW / GMAW non-ferrous)**
- Argon (Ar 100%)
- Helium (He 100%)
- Argon + Helium (Ar/He 75/25)
- Argon + Helium (Ar/He 50/50)

**Active / mixed gases (GMAW / FCAW carbon & low-alloy steel)**
- CO₂ 100%
- Ar + CO₂ (75/25) — C25
- Ar + CO₂ (80/20)
- Ar + CO₂ (90/10)
- Ar + CO₂ (95/5)
- Ar + O₂ (98/2)
- Ar + O₂ (95/5)

**Tri-mix (stainless / spray transfer)**
- Ar + CO₂ + O₂ (tri-mix)
- He + Ar + CO₂ (tri-mix, stainless)

**Purge / backing gases**
- Argon purge
- Nitrogen purge
- N₂ + H₂ (95/5) purge

**Other**
- None (SAW / SMAW)
- Other (specify in notes)

If you want a different list, reply with the exact options and I'll adjust before implementing.

## Implementation notes

- Use the same `<select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm ...">` pattern already used for Filler material / Process dropdowns in these files.
- Use `<optgroup>` for the category headers above.
- Value binds to `merged.shielding_gas` / `values.shielding_gas` unchanged — DB column stays `text`, no migration required.
- No changes to types, RLS, or backend logic.
