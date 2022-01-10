import { Component, Input, OnInit } from "@angular/core";
import { IAssetDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
  selector: "last-created-asset-table",
  templateUrl: "./last-created-asset-table.component.html",
})
export class LastCreatedAssetTableComponent implements OnInit {
  @Input() data: IAssetDashboard;
  constructor() {}

  ngOnInit(): void {}

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
