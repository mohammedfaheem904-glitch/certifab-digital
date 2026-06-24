/**
 * Shared filler-metal diameter options for WPS relational tables.
 * Values are stored as plain numbers (mm) in the database; labels include the unit.
 */

export type DiameterOption = {
  value: string;
  label: string;
  keywords: string;
};

export const FILLER_DIAMETER_OPTIONS: DiameterOption[] = [
  "0.8", "1.0", "1.2", "1.6", "2.0", "2.4", "2.5", "3.2", "4.0", "5.0", "6.0",
].map((v) => ({ value: v, label: `${v} mm`, keywords: "diameter mm" }));
