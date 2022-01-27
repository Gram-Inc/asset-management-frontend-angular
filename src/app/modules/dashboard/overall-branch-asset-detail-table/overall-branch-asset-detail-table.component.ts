import { Component, Input, OnInit } from "@angular/core";
import { IAssetDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
  selector: "overall-branch-asset-detail-table",
  templateUrl: "./overall-branch-asset-detail-table.component.html",
})
export class OverallBranchAssetDetailTableComponent implements OnInit {
  @Input() data: IAssetDashboard;

  displayedColumns: string[] = ["branchCode", "ASSIGNED", "IN_POOL", "DOWN", "SCRAP", "remainingPercentage"];
  constructor() {}

  ngOnInit(): void {
    // console.log(this.data);
  }

  getPercentage(branch) {
    let total = branch.ASSIGNED + branch.IN_POOL + branch.SCRAP + branch.DOWN;

    return Math.round(((branch.IN_POOL + branch.ASSIGNED) / total) * 100);
  }
}
