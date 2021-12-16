import { IVendor } from "../vendor/vendor.types";

export interface IAsset {
  _id: string;
  assetCode: string;
  name: string;
  type: string;
  location?: string;
  venderId?: string;
  comment?: string;
  laptop?: ILaptop;
  battery?: IBattery[];
  sr_no: string;
  warranty?: IWarranty[];
  amc?: IWarranty[];
  client?: IVendor;
  ups?: IUPS;
}

export interface IUPS {
  brand: string;
  make: string;
  kw: string;
  battery: IUPSBattery[];
  category: string;
  productCode: string;
}

export interface IUPSBattery {
  brand: string;
  sr_no: string;
  life: string;
  warranty: IWarranty[];
}
export interface IWarranty {
  name: string;
  description: string;
  type: string;
  warrantySiteType: string;
  startAt: string;
  endAt: string;
}
export interface IBattery {
  assetCode: string;
  name: string;
  type: string;
  location: string;
  vendorId: string;
  comment: string;
  brand: string;
  sr_no: string;
  life: string;
}

export interface ILaptop {
  hostName: string;
  operatingSystem: string;
  ram: string;
  processor: string;
  storageType: string;
  storageSize: string;
}

export interface IPagination {
  limit?: number;
  page?: number;
  totalPage?: number;
  totalData?: number;
}
