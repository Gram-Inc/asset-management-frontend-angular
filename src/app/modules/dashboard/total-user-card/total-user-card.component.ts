import { Component, Input, OnInit } from "@angular/core";
import { ApexOptions } from "ng-apexcharts";
import { IUserDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
  selector: "total-user-card",
  templateUrl: "./total-user-card.component.html",
})
export class TotalUserCardComponent implements OnInit {
  @Input() data: IUserDashboard = {
    totalUsers: 24,
    branchWiseUsers: [
      {
        _id: "61ceec31e4b7f48faf4ea432",
        count: 12,
        branchCode: "DEL",
        name: "Delhi HQ",
      },
      {
        _id: "61ceeefff7cf7798bdbf2501",
        count: 4,
        branchCode: "UK",
        name: "UK HQ",
      },
      {
        _id: "61c1452200abe3f6e11582c7",
        count: 8,
        branchCode: "ADI",
        name: "Ahemedabad",
      },
    ],
  };
  chartUserDistribution: ApexOptions = {};

  constructor() {}

  ngOnInit(): void {
    this._prepareChartData();
  }

  /**
   * Prepare the chart data from the data
   *
   * @private
   */
  private _prepareChartData(): void {
    this.chartUserDistribution = {
      chart: {
        fontFamily: "inherit",
        foreColor: "inherit",
        height: "100%",
        type: "polarArea",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      labels: this.data.branchWiseUsers.map((x) => {
        return x.branchCode;
      }),
      legend: {
        position: "bottom",
      },
      plotOptions: {
        polarArea: {
          spokes: {
            connectorColors: "#e2e8f0",
          },
          rings: {
            strokeColor: "#e2e8f0",
          },
        },
      },
      series: this.data.branchWiseUsers.map((x) => {
        return x.count;
      }),
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 0.75,
          },
        },
      },
      stroke: {
        width: 2,
      },
      theme: {
        palette: "palette1",
      },
      tooltip: {
        followCursor: true,
        theme: "dark",
      },
      yaxis: {
        labels: {
          style: {
            colors: "#334155",
          },
        },
      },
    };
  }
}
