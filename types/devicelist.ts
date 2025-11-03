type DeviceInfo = {
  desc: string;
  modified?: boolean;
  replacedby?: string;
};

type DeviceList = Record<string, DeviceInfo>;

type DeviceListFull = Record<string, DeviceList>;

export type { DeviceListFull };
