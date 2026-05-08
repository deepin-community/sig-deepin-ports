import type { SchemaLayout } from "~/wasm-imager/pkg/wasm_imager";

type ImagePreset = {
  title: string,
  devices: string[],
  data: SchemaLayout
};

type ImagePresets = Record<string, ImagePreset>;

export type { ImagePreset, ImagePresets };
