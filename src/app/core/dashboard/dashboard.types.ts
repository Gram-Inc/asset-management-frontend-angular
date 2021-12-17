export interface IDashboard {
  assetStatusCount: {
    IN_POOL: number;
    ASSIGNED: number;
    SCRAP: number;
    DOWN: number;
  };
  ticketStatusCount: {
    Assigned: number;
    Closed: number;
    Hold: number;
    "In Progress": number;
    Open: number;
    "Vendor Dependency": number;
  };
  assetsCountWithUpcommingExpireingInDays: {
    WARRANTY: number;
    AMC: number;
  };
  registeredAssets: number;
}
