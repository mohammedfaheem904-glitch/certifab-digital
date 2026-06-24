export type WeldLayerOption = {
  value: string;
  label: string;
  description?: string;
  keywords?: string;
};

export const WELD_LAYER_OPTIONS: WeldLayerOption[] = [
  { value: "Root", label: "Root", keywords: "layer pass root" },
  { value: "Hot", label: "Hot", keywords: "layer pass hot" },
  { value: "Fill", label: "Fill", keywords: "layer pass fill" },
  { value: "Cap", label: "Cap", keywords: "layer pass cap" },
  { value: "all Passes", label: "all Passes", keywords: "layer pass all passes" },
];
