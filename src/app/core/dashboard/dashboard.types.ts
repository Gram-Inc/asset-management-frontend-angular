export interface IDashboard {
  assets?: IAssetDashboard;
  ticket?: ITicketDashboard;
  users?: IUserDashboard;
  itUserSpecificDetails?: IITUserSpecificDetailDashboard;
}
export interface IAssetDashboard {
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
  assetsCountExpired?: {
    WARRANTY?: number;
    AMC?: number;
  };
  warrantyCoverageItems?: IWarrantyCoverageItem[];
  registeredAssets?: number;
  lastTenCreatedAssetsDetails?: {
    _id?: string;
    serialNo?: string;
    hostName?: string;
    type?: string;
    createdAt?: string;
  }[];
  branchWiseOverallAssets?: {
    _id?: string;
    count?: number;
    branchCode?: string;
    name?: string;
    IN_POOL?: number;
    ASSIGNED?: number;
    SCRAP?: number;
    DOWN?: number;
  }[];
  branchWiseAssetAllocationAssets?: [
    {
      _id?: string;
      branchCode?: string;
      name?: string;
      IN_POOL?: number;
      ASSIGNED?: number;
      SCRAP?: number;
      DOWN?: number;
    }
  ];
}
export interface IWarrantyCoverageItem {
  assetId?: string;
  assetCode?: string;
  name?: string;
  type?: string;
  branchName?: string;
  endAt?: string;
  coverageType?: "WARRANTY" | "AMC";
  status?: "expired" | "soon";
}
export interface ITicketDashboard {
  ticketStatusCount?: {
    Assigned?: number;
    Closed?: number;
    Hold?: number;
    "In Progress"?: number;
    Open?: number;
    "Vendor Dependency"?: number;
  };
}
export interface IITUserSpecificDetailDashboard {
  assignedTickets?: number;
  todaysCompletedTickets?: number;
  ongoingTickets?: number;
}
export interface IUserDashboard {
  totalUsers?: number;
  thisWeekNewJoinees?: INewJoineeDashboard[];
  branchWiseUsers?: {
    _id?: string;
    count?: number;
    branchCode?: string;
    name?: string;
  }[];
}

export interface INewJoineeDashboard {
  _id?: string;
  firstName?: string;
  lastName?: string;
  isAssetAllocated?: boolean;
  totalAssetsAllocated?: number;
  createdAt?: string;
}
