import { Component, Input, OnInit } from "@angular/core";
import { IAssetDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
  selector: "overall-branch-asset-detail-table",
  templateUrl: "./overall-branch-asset-detail-table.component.html",
  styleUrls: ["./overall-branch-asset-detail-table.component.scss"],
})
export class OverallBranchAssetDetailTableComponent implements OnInit {
  @Input() data: IAssetDashboard = {
    branchWiseOverallAssets: [
      {
        _id: "Test",
        branchCode: "CODE",
        ASSIGNED: 12,
        IN_POOL: 6,
        SCRAP: 1,
        DOWN: 3,
      },
    ],
  };

  displayedColumns: string[] = ["Branch", "Assigned", "In Pool", "Down", "Scrap"];
  constructor() {}

  ngOnInit(): void {}
}
