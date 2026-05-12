/** Heat input in kJ/mm. travel_speed in mm/min. */
export function calcHeatInput(voltage: number, current: number, travelSpeedMmMin: number): number {
  if (!voltage || !current || !travelSpeedMmMin) return 0;
  return (voltage * current * 60) / (travelSpeedMmMin * 1000);
}

export type WpsLimits = {
  voltage_min?: number | null; voltage_max?: number | null;
  current_min?: number | null; current_max?: number | null;
  travel_speed_min?: number | null; travel_speed_max?: number | null;
  heat_input_min?: number | null; heat_input_max?: number | null;
};

export type ComplianceCheck = { ok: boolean; issues: string[] };

export function checkCompliance(
  v: number, i: number, ts: number, hi: number, l: WpsLimits,
): ComplianceCheck {
  const issues: string[] = [];
  const out = (val: number, min?: number | null, max?: number | null, label = "value") => {
    if (min != null && val < min) issues.push(`${label} ${val} below WPS min ${min}`);
    if (max != null && val > max) issues.push(`${label} ${val} above WPS max ${max}`);
  };
  out(v, l.voltage_min, l.voltage_max, "Voltage");
  out(i, l.current_min, l.current_max, "Current");
  out(ts, l.travel_speed_min, l.travel_speed_max, "Travel speed");
  out(hi, l.heat_input_min, l.heat_input_max, "Heat input");
  return { ok: issues.length === 0, issues };
}
