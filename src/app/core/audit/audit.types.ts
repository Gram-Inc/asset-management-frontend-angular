import { IBranch } from "../branch/branch.types";
import { IDepartment } from "../department/department.types";
import { IUser } from "../user/user.types";
import { IAsset } from "../asset/asset.types";

export enum AuditStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

export interface IAudit {
  _id?: string;
  name?: string;
  branchId?: string | Partial<IBranch>;
  departmentIds?: string[] | Partial<IDepartment>[];
  status?: AuditStatus | string;
  createdBy?: string | Partial<IUser>;
  assignedToUserId?: string | Partial<IUser>;
  startedAt?: string | Date;
  completedAt?: string | Date;
  closedAt?: string | Date;
  totalAssets?: number;
  scannedAssets?: number;
  missingAssets?: number;
  isClosed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuditAsset {
  _id?: string;
  auditId?: string | Partial<IAudit>;
  assetId?: string | Partial<IAsset>;
  isScanned?: boolean;
  scannedAt?: string | Date;
  scannedBy?: string | Partial<IUser>;
  isMissing?: boolean;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuditProgress {
  total: number;
  scanned: number;
  missing: number;
  progressPercentage: number;
}

export interface IAuditStatistics {
  totalAudits: number;
  completedAudits: number;
  inProgressAudits: number;
  openAudits: number;
  missingAssetsCount: number;
}

export interface IDepartmentAuditHistory {
  departmentId: string;
  departmentName: string;
  lastAuditDate: Date | string | null;
  totalAudits: number;
  lastAuditStatus: string | null;
  neverAudited: boolean;
}

export interface ICreateAuditDto {
  name: string;
  branchId: string;
  departmentIds: string[];
  assignedToUserId?: string;
  assetIds?: string[];
}

export interface ICompleteAuditDto {
  forceComplete?: boolean;
}

export interface IPagination {
  limit?: number;
  page?: number;
  totalPage?: number;
  totalData?: number;
}
