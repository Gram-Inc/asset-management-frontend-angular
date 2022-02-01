import { IAsset } from "../asset/asset.types";
import { IBranch } from "../branch/branch.types";
import { IDepartment } from "../department/department.types";

export interface IUser
{
   _id: string;
   firstName: string;
   lastName: string;
   email?: string;
   isActive?: string;
   role?: "level1" | "level2" | "level3";
   departmentId?: string | Partial<IDepartment>;
   mobileNumber?: string;
   branch?: string | Partial<IBranch>;
   manager?: string | Partial<IUser>;
   permissions?: IPermissions[];
   createdAt?: string;
   allocatedAssets?: string | Partial<IAsset[]>;
}

export enum IPermissions
{
   UAMNoCreate = "UAMNoCreate",
   UAMCreate = "UAMCreate",
   UAMView = "UAMView",
   UAMUpdate = "UAMUpdate",
   UAMDelete = "UAMDelete",
   TicketCreate = "TicketCreate",
   TicketView = "TicketView",
   TicketUpdate = "TicketUpdate",
   TicketDelete = "TicketDelete",
   DepartmentCreate = "DepartmentCreate",
   DepartmentView = "DepartmentView",
   DepartmentUpdate = "DepartmentUpdate",
   DepartmentDelete = "DepartmentDelete",
   BranchCreate = "BranchCreate",
   BranchView = "BranchView",
   BranchUpdate = "BranchUpdate",
   BranchDelete = "BranchDelete",
   AssetCreate = "AssetCreate",
   AssetView = "AssetView",
   AssetUpdate = "AssetUpdate",
   AssetDelete = "AssetDelete",
   VendorCreate = "VendorCreate",
   VendorView = "VendorView",
   VendorUpdate = "VendorUpdate",
   VendorDelete = "VendorDelete",
}
