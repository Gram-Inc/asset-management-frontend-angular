export interface IDashboard {
  assets?: IAssetDashboard;
  ticket?: ITicketDashboard;
  users?: IUserDashboard;
  itUserSpecificDetails?: IITUserSpecificDetailDashboard;
}
interface IAssetDashboard {
  assetStatusCount?: {
    IN_POOL?: number;
    ASSIGNED?: number;
    SCRAP?: number;
    DOWN?: number;
  };
  assetsCountWithUpcommingExpireingInDays?: {
    WARRANTY?: number;
    AMC?: number;
  };
  registeredAssets?: number;
  lastTenCreatedAssetsDetails?: {
    _id?: string;
    serialNo?: string;
    hostName?: string;
    type?: string;
    createdAt?: string;
  }[];
  branchWiseOverallAssets?: { _id?: string; count?: number; branchCode?: string; name?: string }[];
}
interface ITicketDashboard {
  ticketStatusCount?: {
    Assigned?: number;
    Closed?: number;
    Hold?: number;
    "In Progress"?: number;
    Open?: number;
    "Vendor Dependency"?: number;
  };
}
interface IITUserSpecificDetailDashboard {
  assignedTickets?: number;
  todaysCompletedTickets?: number;
  ongoingTickets?: number;
}
interface IUserDashboard {
  totalUsers?: number;
  thisWeekNewJoinees?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    isAssetAllocated?: boolean;
    totalAssetsAllocated?: number;
    createdAt?: string;
  }[];
  branchWiseUsers?: {
    _id?: string;
    count?: number;
    branchCode?: string;
    name?: string;
  }[];
}
