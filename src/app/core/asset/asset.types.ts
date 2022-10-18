import { IBranch } from "../branch/branch.types";
import { IVendor } from "../vendor/vendor.types";

export interface IAsset
{
   _id?: string;
   assetCode?: string;
   name?: string;
   type?: string;
   poNumber?: string;
   location?: string;
   venderId?: string;
   comment?: string;
   laptop?: Partial<ILaptop>;
   battery?: Partial<IBattery>[];
   sr_no?: string;
   warranty?: Partial<IWarranty>[];
   amc?: Partial<IWarranty>[];
   client?: Partial<IVendor>;
   ups?: Partial<IUPS>;
   allocationStatus?: AllocationStatus;
   branch?: string | Partial<IBranch>;
   allocationToUserId?: string | Partial<{ _id?: string; firstName?: string; lastName?: string }>;
   perviousUser?: string | Partial<{ _id?: string; firstName?: string; lastName?: string }>;
   timeline?: Partial<ITimeline>;
}
export interface ITimeline
{
   x?: AllocationStatus;
   y?: any[];
   _id?: string;
}
export interface IUPS
{
   brand?: string;
   make?: string;
   kw?: string;
   battery?: IUPSBattery[];
   category?: string;
   productCode?: string;
}
export enum AllocationStatus
{
   "IN_POOL" = "IN_POOL",
   "ASSIGNED" = "ASSIGNED",
   "SCRAP" = "SCRAP",
   "DOWN" = "DOWN",
}
export interface IUPSBattery
{
   brand?: string;
   sr_no?: string;
   life?: string;
   warranty?: IWarranty[];
}
export interface IWarranty
{
   name?: string;
   description?: string;
   type?: "AMC" | "WARRANTY";
   warrantySiteType?: "ON_SITE" | "OFF_SITE";
   startAt?: string;
   endAt?: string;
   purchaseDate?: string;
   vendor?: string;
   poNumber?: string;
}

export interface IBattery
{
   assetCode?: string;
   name?: string;
   type?: string;
   location?: string;
   vendorId?: string;
   comment?: string;
   brand?: string;
   sr_no?: string;
   life?: string;
}

export interface ILaptop
{
   system?: Partial<System>;
   os?: Partial<OS>;
   mem?: Partial<Mem>;
   memLayout?: Partial<MemLayout>[];
   battery?: Partial<LaptopBattery>;
   baseboard?: Partial<Baseboard>;
   cpu?: Partial<CPU>;
   diskLayout?: Partial<IDisk[]>;
}

export interface IDisk
{
   device?: string;
   type?: string;
   name?: string;
   vendor?: string;
   size?: number;
   _id?: string;
}
export interface IPagination
{
   limit?: number;
   page?: number;
   totalPage?: number;
   totalData?: number;
}

export interface IAssetTypes
{
   commonAssetFields?: IAssetSubType[];
   assetTypeSpecificFieldTypes?: IAssetSubType[];
}
export interface IAssetSubType
{
   label?: string;
   dataType?: string;
   fieldName?: string;
   values?: any;
   type?: string;
   fields?: [];
}

export interface LaptopBattery
{
   hasBattery?: boolean;
   cycleCount?: number;
   isCharging?: boolean;
   designedCapacity?: number;
   maxCapacity?: number;
   currentCapacity?: number;
   voltage?: number;
   capacityUnit?: string;
   percent?: number;
   timeRemaining?: number;
   acConnected?: boolean;
   type?: string;
   model?: string;
   manufacturer?: string;
   serial?: string;
}

export interface CPU
{
   manufacturer?: string;
   brand?: string;
   cores?: number;
   physicalCores?: number;
   processors?: number;
}
export interface Baseboard
{
   manufacturer?: string;
   model?: string;
   version?: string;
   serial?: string;
   assetTag?: string;
   memMax?: string;
   memSlots?: number;
}
export interface MemLayout
{
   size?: number;
   bank?: string;
   type?: string;
   ecc?: boolean;
   clockSpeed?: number;
   formFactor?: string;
   manufacturer?: string;
   partNum?: string;
   serialNum?: string;
   voltageConfigured?: string;
   voltageMin?: string;
   voltageMax?: string;
}
export interface Mem
{
   total?: number;
   free?: number;
   used?: number;
   active?: number;
   available?: number;
   buffers?: number;
   cached?: number;
   slab?: number;
   buffcache?: number;
   swaptotal?: number;
   swapused?: number;
   swapfree?: number;
}
export interface OS
{
   platform?: string;
   distro?: string;
   release?: string;
   codename?: string;
   kernel?: string;
   arch?: string;
   hostname?: string;
   fqdn?: string;
   codepage?: string;
   logofile?: string;
   serial?: string;
   build?: string;
   servicepack?: string;
   uefi?: boolean;
}
export interface System
{
   manufacturer?: string;
   model?: string;
   version?: string;
   serial?: string;
   uuid?: string;
   sku?: string;
   virtual?: boolean;
}
