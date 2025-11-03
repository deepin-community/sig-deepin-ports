type Matrix = {
  [arch: string]: MatrixCore[];
};

type MatrixCore = {
  core: string;
  socs: MatrixSoC[];
};

type MatrixSoC = {
  soc: string;
  n_cores?: number;
  deprecated?: boolean;
  boot?: string;
  devices: MatrixDevice[];
  kernels?: string[];
  gpu?: string;
  extra?: string;
};

type MatrixDevice = {
  device: string;
  standalone?: boolean;
};

export type { Matrix };
