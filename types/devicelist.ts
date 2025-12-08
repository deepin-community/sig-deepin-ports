type DeviceInfo = {
  desc: string;
  modified?: boolean;
  replacedby?: string;
  hidden?: boolean;
};

type DeviceList = Record<string, DeviceInfo>;

type DeviceListFull = Record<string, DeviceList>;

export type { DeviceListFull };
