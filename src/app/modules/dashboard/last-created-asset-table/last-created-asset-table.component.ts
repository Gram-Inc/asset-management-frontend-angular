import { Component, Input, OnInit } from "@angular/core";
import { IAssetDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
  selector: "last-created-asset-table",
  templateUrl: "./last-created-asset-table.component.html",
  styles: [
    `
      .icon-size-4 {
        width: 1rem !important;
        height: 1rem !important;
        min-width: 1rem !important;
        min-height: 1rem !important;
        font-size: 1rem !important;
        line-height: 1rem !important;
      }
    `,
  ],
})
export class LastCreatedAssetTableComponent implements OnInit {
  @Input() data: IAssetDashboard = {
    lastTenCreatedAssetsDetails: [
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK013",
        serialNo: "SR349SDK3",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK014",
        serialNo: "SR349SDGD",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK013",
        serialNo: "SR349SDK3",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK014",
        serialNo: "SR349SDGD",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK013",
        serialNo: "SR349SDK3",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK014",
        serialNo: "SR349SDGD",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK013",
        serialNo: "SR349SDK3",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK014",
        serialNo: "SR349SDGD",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK013",
        serialNo: "SR349SDK3",
        type: "Laptop",
      },
      {
        _id: "123",
        createdAt: new Date(Date.now()).toISOString(),
        hostName: "RIK014",
        serialNo: "SR349SDGD",
        type: "Laptop",
      },
    ],
  };
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
