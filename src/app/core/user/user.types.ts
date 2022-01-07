import { IAsset } from "../asset/asset.types";
import { IBranch } from "../branch/branch.types";
import { IDepartment } from "../department/department.types";

export interface IUser {
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
  permission?: string[];
  createdAt?: string;
  allocatedAssets?: string | Partial<IAsset[]>;
}
