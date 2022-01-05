import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { SharedModule } from "../shared/shared.module";
import { OverallBranchAssetDetailTableModule } from "./overall-branch-asset-detail-table/overall-branch-asset-detail-table.module";

const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    RouterModule.forChild(dashboardRoutes),
    CommonModule,
    CustomMaterialModule,
    SharedModule,
    OverallBranchAssetDetailTableModule,
  ],
})
export class DashboardModule {}
