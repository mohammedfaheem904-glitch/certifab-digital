// Default inspection-builder templates for the 12 supported inspection types.
// Seeded into a company the first time any user opens the templates admin or
// the dynamic form has no template for that type.

export type TemplateFieldType =
  | "pass_fail"
  | "text"
  | "number"
  | "measurement"
  | "checkbox"
  | "attachment";

export interface SeedField {
  section?: string;
  label: string;
  field_type: TemplateFieldType;
  required?: boolean;
  unit?: string;
  tolerance_min?: number;
  tolerance_max?: number;
  code_reference?: string;
  helper_text?: string;
}

export interface SeedTemplate {
  name: string;
  inspection_type: string;
  discipline?: string;
  code_reference?: string;
  description?: string;
  fields: SeedField[];
}

export const DEFAULT_INSPECTION_TEMPLATES: SeedTemplate[] = [
  {
    name: "VT — Visual Inspection (AWS D1.1)",
    inspection_type: "VT",
    discipline: "Welding",
    code_reference: "AWS D1.1 / ASME B31.3",
    description: "Standard visual examination of completed welds.",
    fields: [
      { section: "Checklist", label: "Joint cleanliness acceptable", field_type: "pass_fail", required: true, code_reference: "AWS D1.1 §6.9" },
      { section: "Checklist", label: "Weld profile within acceptance", field_type: "pass_fail", required: true },
      { section: "Checklist", label: "No cracks or surface defects", field_type: "pass_fail", required: true },
      { section: "Checklist", label: "Arc strikes outside weld zone absent", field_type: "pass_fail" },
      { section: "Measurements", label: "Reinforcement", field_type: "measurement", unit: "mm", tolerance_min: 0, tolerance_max: 3 },
      { section: "Measurements", label: "Undercut depth", field_type: "measurement", unit: "mm", tolerance_min: 0, tolerance_max: 0.8 },
      { section: "Measurements", label: "Mismatch / hi-lo", field_type: "measurement", unit: "mm", tolerance_min: 0, tolerance_max: 1.5 },
      { section: "Records", label: "Inspector remarks", field_type: "text" },
      { section: "Records", label: "Photo / attachment", field_type: "attachment" },
    ],
  },
  {
    name: "Fit-Up Inspection",
    inspection_type: "Fit-Up",
    discipline: "Welding",
    code_reference: "ASME B31.3",
    fields: [
      { section: "Joint", label: "Bevel angle", field_type: "measurement", unit: "°", tolerance_min: 30, tolerance_max: 37.5 },
      { section: "Joint", label: "Root opening", field_type: "measurement", unit: "mm", tolerance_min: 1.5, tolerance_max: 3 },
      { section: "Joint", label: "Root face", field_type: "measurement", unit: "mm", tolerance_min: 1, tolerance_max: 2.5 },
      { section: "Joint", label: "Alignment / hi-lo", field_type: "measurement", unit: "mm", tolerance_min: 0, tolerance_max: 1.5 },
      { section: "Checklist", label: "Joint cleanliness OK", field_type: "pass_fail", required: true },
      { section: "Checklist", label: "Preheat applied where required", field_type: "pass_fail" },
      { section: "Checklist", label: "Tack welds acceptable", field_type: "pass_fail" },
      { section: "Records", label: "Remarks", field_type: "text" },
    ],
  },
  {
    name: "Dimensional Inspection",
    inspection_type: "Dimensional",
    discipline: "Mechanical",
    fields: [
      { section: "Dimensions", label: "Overall length", field_type: "measurement", unit: "mm" },
      { section: "Dimensions", label: "Outer diameter", field_type: "measurement", unit: "mm" },
      { section: "Dimensions", label: "Wall thickness", field_type: "measurement", unit: "mm" },
      { section: "Dimensions", label: "Ovality", field_type: "measurement", unit: "mm" },
      { section: "Checklist", label: "Conforms to drawing tolerances", field_type: "pass_fail", required: true },
      { section: "Records", label: "Drawing revision", field_type: "text" },
      { section: "Records", label: "Photo / attachment", field_type: "attachment" },
    ],
  },
  {
    name: "Welding Surveillance",
    inspection_type: "Welding Surveillance",
    discipline: "Welding",
    fields: [
      { section: "Process", label: "WPS being followed", field_type: "pass_fail", required: true },
      { section: "Process", label: "Welder qualified for joint", field_type: "pass_fail", required: true },
      { section: "Process", label: "Filler material as per WPS", field_type: "pass_fail" },
      { section: "Parameters", label: "Voltage", field_type: "measurement", unit: "V" },
      { section: "Parameters", label: "Current", field_type: "measurement", unit: "A" },
      { section: "Parameters", label: "Travel speed", field_type: "measurement", unit: "mm/min" },
      { section: "Parameters", label: "Preheat", field_type: "measurement", unit: "°C" },
      { section: "Parameters", label: "Interpass temperature", field_type: "measurement", unit: "°C" },
      { section: "Records", label: "Observations", field_type: "text" },
    ],
  },
  {
    name: "RT — Radiographic Testing",
    inspection_type: "RT",
    discipline: "NDT",
    code_reference: "ASME V Article 2",
    fields: [
      { section: "Setup", label: "Technique sheet reference", field_type: "text", required: true },
      { section: "Setup", label: "Source / energy", field_type: "text" },
      { section: "Setup", label: "Film / detector type", field_type: "text" },
      { section: "Setup", label: "IQI sensitivity", field_type: "text" },
      { section: "Results", label: "Film density within range", field_type: "pass_fail" },
      { section: "Results", label: "Indications observed", field_type: "text" },
      { section: "Acceptance", label: "Accept / reject", field_type: "pass_fail", required: true, code_reference: "ASME B31.3 §341.3.2" },
      { section: "Records", label: "Report number", field_type: "text", required: true },
      { section: "Records", label: "Film / report attachment", field_type: "attachment" },
    ],
  },
  {
    name: "UT — Ultrasonic Testing",
    inspection_type: "UT",
    discipline: "NDT",
    code_reference: "ASME V Article 4",
    fields: [
      { section: "Setup", label: "Procedure reference", field_type: "text", required: true },
      { section: "Setup", label: "Equipment / probe", field_type: "text" },
      { section: "Setup", label: "Calibration block", field_type: "text" },
      { section: "Setup", label: "Couplant", field_type: "text" },
      { section: "Results", label: "Indications observed", field_type: "text" },
      { section: "Results", label: "Max amplitude (%)", field_type: "number" },
      { section: "Acceptance", label: "Accept / reject", field_type: "pass_fail", required: true },
      { section: "Records", label: "Report number", field_type: "text", required: true },
    ],
  },
  {
    name: "PT — Liquid Penetrant Testing",
    inspection_type: "PT",
    discipline: "NDT",
    code_reference: "ASME V Article 6",
    fields: [
      { section: "Setup", label: "Penetrant type / brand", field_type: "text" },
      { section: "Setup", label: "Dwell time", field_type: "measurement", unit: "min", tolerance_min: 10, tolerance_max: 60 },
      { section: "Setup", label: "Surface temperature", field_type: "measurement", unit: "°C", tolerance_min: 10, tolerance_max: 52 },
      { section: "Results", label: "Linear indications", field_type: "text" },
      { section: "Results", label: "Rounded indications", field_type: "text" },
      { section: "Acceptance", label: "Accept / reject", field_type: "pass_fail", required: true },
      { section: "Records", label: "Report number", field_type: "text", required: true },
    ],
  },
  {
    name: "MT — Magnetic Particle Testing",
    inspection_type: "MT",
    discipline: "NDT",
    code_reference: "ASME V Article 7",
    fields: [
      { section: "Setup", label: "Technique (wet/dry)", field_type: "text" },
      { section: "Setup", label: "Yoke spacing", field_type: "measurement", unit: "mm", tolerance_min: 50, tolerance_max: 200 },
      { section: "Setup", label: "Lift test verified", field_type: "pass_fail" },
      { section: "Results", label: "Indications observed", field_type: "text" },
      { section: "Acceptance", label: "Accept / reject", field_type: "pass_fail", required: true },
      { section: "Records", label: "Report number", field_type: "text", required: true },
    ],
  },
  {
    name: "PMI — Positive Material Identification",
    inspection_type: "PMI",
    discipline: "Materials",
    fields: [
      { section: "Equipment", label: "Analyzer model / serial", field_type: "text", required: true },
      { section: "Equipment", label: "Calibration verified", field_type: "pass_fail", required: true },
      { section: "Sample", label: "Expected material grade", field_type: "text", required: true },
      { section: "Sample", label: "Heat / lot number", field_type: "text" },
      { section: "Results", label: "Cr (%)", field_type: "number" },
      { section: "Results", label: "Ni (%)", field_type: "number" },
      { section: "Results", label: "Mo (%)", field_type: "number" },
      { section: "Acceptance", label: "Conforms to spec", field_type: "pass_fail", required: true },
      { section: "Records", label: "Report attachment", field_type: "attachment" },
    ],
  },
  {
    name: "Hardness Testing",
    inspection_type: "Hardness",
    discipline: "Mechanical",
    fields: [
      { section: "Setup", label: "Method (Brinell / Rockwell / Vickers)", field_type: "text", required: true },
      { section: "Setup", label: "Instrument serial", field_type: "text" },
      { section: "Readings", label: "Base metal (HV/HB)", field_type: "number" },
      { section: "Readings", label: "Weld (HV/HB)", field_type: "number" },
      { section: "Readings", label: "HAZ (HV/HB)", field_type: "number" },
      { section: "Acceptance", label: "Within specification", field_type: "pass_fail", required: true },
      { section: "Records", label: "Remarks", field_type: "text" },
    ],
  },
  {
    name: "Hydrotest Witness",
    inspection_type: "Hydrotest Witness",
    discipline: "Piping",
    fields: [
      { section: "Test", label: "Design pressure", field_type: "measurement", unit: "bar" },
      { section: "Test", label: "Test pressure", field_type: "measurement", unit: "bar" },
      { section: "Test", label: "Hold duration", field_type: "measurement", unit: "min", tolerance_min: 10 },
      { section: "Checklist", label: "Calibrated gauge installed", field_type: "pass_fail", required: true },
      { section: "Checklist", label: "Vents / drains verified", field_type: "pass_fail", required: true },
      { section: "Checklist", label: "No leakage observed", field_type: "pass_fail", required: true },
      { section: "Records", label: "Witness sign-off", field_type: "text" },
    ],
  },
  {
    name: "Final Inspection",
    inspection_type: "Final",
    discipline: "Welding",
    fields: [
      { section: "Documentation", label: "All NDT reports attached", field_type: "pass_fail", required: true },
      { section: "Documentation", label: "PWHT records complete", field_type: "pass_fail" },
      { section: "Documentation", label: "Hydrotest record complete", field_type: "pass_fail" },
      { section: "Documentation", label: "Material traceability complete", field_type: "pass_fail" },
      { section: "Visual", label: "Final visual acceptable", field_type: "pass_fail", required: true },
      { section: "Visual", label: "Punch-list items closed", field_type: "pass_fail" },
      { section: "Records", label: "Final remarks", field_type: "text" },
    ],
  },
];
