## Objective
Wire the existing `calcHeatInput` utility into the pWPS detail form so that **Heat Input Min** and **Heat Input Max** are computed automatically from the related voltage, current, and travel-speed fields.

## Changes

### 1. Import `calcHeatInput` in `src/routes/app.pwps.$pwpsId.tsx`

### 2. Replace direct `set(...)` calls for the 6 driving fields with a helper that:
- writes the changed field into draft as before
- whenever `voltage_min`, `current_min`, or `travel_speed_min` change, recalculates `heat_input_min = calcHeatInput(v_min, i_min, ts_min)` and writes it to draft
- whenever `voltage_max`, `current_max`, or `travel_speed_max` change, recalculates `heat_input_max = calcHeatInput(v_max, i_max, ts_max)` and writes it to draft
- rounds the result to 3 decimal places for clean display
- skips the calculation if any of the three required values is missing or zero

### 3. Keep the Heat Input inputs editable
Users can still override the calculated value manually. The auto-calculation only fires when one of the 6 parent fields is edited.

## Formula
```
Heat Input Min = (Voltage Min × Current Min × 60) / (Travel Speed Min × 1000)
Heat Input Max = (Voltage Max × Current Max × 60) / (Travel Speed Max × 1000)
```

## Files to change
- `src/routes/app.pwps.$pwpsId.tsx`