export type BaseMaterial = {
  spec: string;
  grade: string;
  p_no: string;
  group_no: string;
  uns: string;
  family: string;
  description: string;
};

export const BASE_MATERIALS: BaseMaterial[] = [
  { spec: "SA-106", grade: "Gr.B", p_no: "1", group_no: "1", uns: "K03006", family: "Carbon Steel", description: "Seamless Carbon Steel Pipe" },
  { spec: "SA-106", grade: "Gr.C", p_no: "1", group_no: "1", uns: "K03504", family: "Carbon Steel", description: "High Strength Carbon Steel Pipe" },
  { spec: "SA-53", grade: "Gr.B", p_no: "1", group_no: "1", uns: "K03006", family: "Carbon Steel", description: "Welded and Seamless Pipe" },
  { spec: "SA-105", grade: "Forging", p_no: "1", group_no: "1", uns: "K03504", family: "Carbon Steel", description: "Carbon Steel Forging" },
  { spec: "SA-234", grade: "WPB", p_no: "1", group_no: "1", uns: "K03006", family: "Carbon Steel", description: "Butt Welding Fittings" },
  { spec: "SA-516", grade: "Gr.70", p_no: "1", group_no: "2", uns: "K02700", family: "Carbon Steel", description: "Pressure Vessel Plate" },
  { spec: "SA-333", grade: "Gr.6", p_no: "1", group_no: "1", uns: "K03006", family: "Carbon Steel", description: "Low Temperature Pipe" },
  { spec: "SA-350", grade: "LF2", p_no: "1", group_no: "1", uns: "K03011", family: "Carbon Steel", description: "Low Temperature Forging" },
  { spec: "SA-387", grade: "Gr.11", p_no: "4", group_no: "1", uns: "K11789", family: "Cr-Mo Alloy Steel", description: "Pressure Vessel Plate" },
  { spec: "SA-387", grade: "Gr.22", p_no: "5A", group_no: "1", uns: "K21590", family: "Cr-Mo Alloy Steel", description: "Pressure Vessel Plate" },
  { spec: "SA-335", grade: "P11", p_no: "4", group_no: "1", uns: "K11597", family: "Cr-Mo Alloy Steel", description: "Alloy Steel Pipe" },
  { spec: "SA-335", grade: "P22", p_no: "5A", group_no: "1", uns: "K21590", family: "Cr-Mo Alloy Steel", description: "Alloy Steel Pipe" },
  { spec: "SA-335", grade: "P91", p_no: "5C", group_no: "2", uns: "K90901", family: "Cr-Mo Alloy Steel", description: "High Temperature Alloy Pipe" },
  { spec: "SA-182", grade: "F11", p_no: "4", group_no: "1", uns: "K11597", family: "Cr-Mo Alloy Steel", description: "Alloy Steel Forging" },
  { spec: "SA-182", grade: "F22", p_no: "5A", group_no: "1", uns: "K21590", family: "Cr-Mo Alloy Steel", description: "Alloy Steel Forging" },
  { spec: "SA-182", grade: "F91", p_no: "5C", group_no: "2", uns: "K90901", family: "Cr-Mo Alloy Steel", description: "Alloy Steel Forging" },
  { spec: "SA-240", grade: "Type 304", p_no: "8", group_no: "", uns: "S30400", family: "Austenitic Stainless Steel", description: "Stainless Steel Plate" },
  { spec: "SA-240", grade: "Type 304L", p_no: "8", group_no: "", uns: "S30403", family: "Austenitic Stainless Steel", description: "Low Carbon Stainless Steel" },
  { spec: "SA-240", grade: "Type 316", p_no: "8", group_no: "", uns: "S31600", family: "Austenitic Stainless Steel", description: "Molybdenum Stainless Steel" },
  { spec: "SA-240", grade: "Type 316L", p_no: "8", group_no: "", uns: "S31603", family: "Austenitic Stainless Steel", description: "Low Carbon Stainless Steel" },
  { spec: "SA-240", grade: "Type 321", p_no: "8", group_no: "", uns: "S32100", family: "Austenitic Stainless Steel", description: "Titanium Stabilized Stainless Steel" },
  { spec: "SA-240", grade: "Type 347", p_no: "8", group_no: "", uns: "S34700", family: "Austenitic Stainless Steel", description: "Niobium Stabilized Stainless Steel" },
  { spec: "SA-790", grade: "S31803", p_no: "10H", group_no: "", uns: "S31803", family: "Duplex Stainless Steel", description: "Duplex Stainless Steel Pipe" },
  { spec: "SA-790", grade: "S32205", p_no: "10H", group_no: "", uns: "S32205", family: "Duplex Stainless Steel", description: "Duplex Stainless Steel Pipe" },
  { spec: "SA-790", grade: "S32750", p_no: "10I", group_no: "", uns: "S32750", family: "Super Duplex Stainless Steel", description: "Super Duplex Pipe" },
  { spec: "SB-168", grade: "N06625", p_no: "43", group_no: "", uns: "N06625", family: "Nickel Alloy", description: "Inconel 625" },
  { spec: "SB-163", grade: "N06600", p_no: "42", group_no: "", uns: "N06600", family: "Nickel Alloy", description: "Inconel 600" },
  { spec: "SB-575", grade: "N10276", p_no: "44", group_no: "", uns: "N10276", family: "Nickel Alloy", description: "Hastelloy C276" },
  { spec: "SB-111", grade: "C70600", p_no: "34", group_no: "", uns: "C70600", family: "Copper Nickel", description: "90-10 CuNi" },
  { spec: "SB-111", grade: "C71500", p_no: "34", group_no: "", uns: "C71500", family: "Copper Nickel", description: "70-30 CuNi" },
  { spec: "SB-265", grade: "Grade 2", p_no: "51", group_no: "", uns: "R50400", family: "Titanium", description: "Commercially Pure Titanium" },
  { spec: "SB-265", grade: "Grade 7", p_no: "51", group_no: "", uns: "R52400", family: "Titanium", description: "Titanium Grade 7" },
  { spec: "SB-209", grade: "5052", p_no: "23", group_no: "", uns: "A95052", family: "Aluminum Alloy", description: "Aluminum Plate" },
  { spec: "SB-209", grade: "5083", p_no: "23", group_no: "", uns: "A95083", family: "Aluminum Alloy", description: "Marine Grade Aluminum" },
  { spec: "SB-209", grade: "6061", p_no: "23", group_no: "", uns: "A96061", family: "Aluminum Alloy", description: "Structural Aluminum" },
];

export function formatBaseMaterial(m: BaseMaterial): string {
  return `${m.spec} ${m.grade}`.trim();
}
