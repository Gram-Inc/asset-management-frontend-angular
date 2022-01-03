import { IBranch } from "../branch/branch.types";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  isActive?: string;
  role?: "level1" | "level2" | "level3";
  departmentId?: string;
  mobileNumber?: string;
  branch?: string | Partial<IBranch>;
}
