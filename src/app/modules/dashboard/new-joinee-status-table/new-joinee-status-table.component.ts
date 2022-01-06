import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { INewJoineeDashboard, IUserDashboard } from "src/app/core/dashboard/dashboard.types";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "new-joinee-status-table",
  templateUrl: "./new-joinee-status-table.component.html",
  styleUrls: ["./new-joinee-status-table.component.scss"],
})
export class NewJoineeStatusTableComponent implements OnInit {
  @Input() data: IUserDashboard = {
    thisWeekNewJoinees: [
      {
        _id: "61c1496ffc32960c81b7df4a",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: true,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-02T03:26:39.773Z",
      },
      {
        _id: "61d46ce9ab224d842d975864",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: false,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-04T15:51:05.430Z",
      },
      {
        _id: "61d46d158142822a73b22fa0",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: false,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-04T15:51:49.764Z",
      },
      {
        _id: "61d46d3b42d1719864316f54",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: false,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-04T15:52:27.722Z",
      },
      {
        _id: "61d46d3b42d1719864316f54",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: false,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-04T15:52:27.722Z",
      },
      {
        _id: "61d46d3b42d1719864316f54",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: false,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-04T15:52:27.722Z",
      },
      {
        _id: "61d46d3b42d1719864316f54",
        firstName: "Govind",
        lastName: "Solanki",
        isAssetAllocated: false,
        totalAssetsAllocated: 0,
        createdAt: "2022-01-04T15:52:27.722Z",
      },
    ],
  };
  @ViewChild("recentTransactionsTable", { read: MatSort }) recentTransactionsTableMatSort: MatSort;
  recentTransactionsDataSource: MatTableDataSource<INewJoineeDashboard> = new MatTableDataSource();
  recentTransactionsTableColumns: string[] = ["date", "name", "status"];
  constructor() {}

  ngOnInit(): void {
    this.recentTransactionsDataSource.data = this.data.thisWeekNewJoinees;
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
