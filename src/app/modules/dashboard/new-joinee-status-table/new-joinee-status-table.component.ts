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
  @Input() data: IUserDashboard;
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
