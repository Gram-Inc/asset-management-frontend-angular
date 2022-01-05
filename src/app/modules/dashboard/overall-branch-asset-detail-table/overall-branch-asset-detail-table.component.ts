import { Component, Input, OnInit } from "@angular/core";
import { IAssetDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
  selector: "overall-branch-asset-detail-table",
  templateUrl: "./overall-branch-asset-detail-table.component.html",
})
export class OverallBranchAssetDetailTableComponent implements OnInit {
  @Input() data: IAssetDashboard = {
    branchWiseOverallAssets: [
      {
        _id: "Test",
        branchCode: "CODE",
        ASSIGNED: 12,
        IN_POOL: 18,
        SCRAP: 1,
        DOWN: 3,
      },
      {
        _id: "Test",
        branchCode: "Ahmedabad",
        ASSIGNED: 768,
        IN_POOL: 28,
        SCRAP: 168,
        DOWN: 233,
      },
    ],
  };

  displayedColumns: string[] = ["branchCode", "ASSIGNED", "IN_POOL", "DOWN", "SCRAP", "remainingPercentage"];
  constructor() {}

  ngOnInit(): void {}

  getPercentage(branch) {
    let total = branch.ASSIGNED + branch.IN_POOL + branch.SCRAP + branch.DOWN;

    return Math.round(((branch.IN_POOL + branch.ASSIGNED) / total) * 100);
  }
}
