type Matrix = {
  [arch: string]: MatrixCore[];
};

type MatrixCore = {
  core: string;
  socs: MatrixSoC[];
};

type MatrixSoC = {
  soc: string;
  n_cores?: number | undefined;
  deprecated?: boolean | undefined;
  boot?: string | undefined;
  devices: MatrixDevice[];
  kernels?: string[] | undefined;
  gpu?: string | undefined;
  extra?: string | undefined;
};

type MatrixDevice = {
  device: string;
  standalone?: boolean | undefined;
};

export type { Matrix };
