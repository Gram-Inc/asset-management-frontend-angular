import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DashboardService } from "src/app/core/dashboard/dashboard.service";
import { ReportKind, ReportService } from "src/app/core/report/report.service";

@Component({
   selector: "app-report",
   templateUrl: "./report.component.html",
   styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit
{
   warrantyCount = 0;
   amcCount = 0;

   constructor(
      private _dashboardService: DashboardService,
      private _reportService: ReportService,
      private _snackBar: MatSnackBar,
   ) { }

   ngOnInit(): void
   {
      this._dashboardService.getDashboardData().subscribe((response) =>
      {
         const counts = response?.data?.assets?.assetsCountWithUpcommingExpireingInDays;
         this.warrantyCount = counts?.WARRANTY || 0;
         this.amcCount = counts?.AMC || 0;
      });
   }

   download(kind: ReportKind): void
   {
      this._reportService.download(kind).subscribe({
         error: () => this._snackBar.open(`Could not export ${kind}`, "Close", { duration: 3000 }),
      });
   }
}
