import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { SharedModule } from "../shared/shared.module";
import { OverallBranchAssetDetailTableModule } from "./overall-branch-asset-detail-table/overall-branch-asset-detail-table.module";
import { LastCreatedUserTableModule } from "./last-created-user-table/last-created-user-table.module";
import { LastCreatedAssetTableModule } from "./last-created-asset-table/last-created-asset-table.module";
import { TotalUserCardModule } from "./total-user-card/total-user-card.module";

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
    LastCreatedUserTableModule,
    LastCreatedAssetTableModule,
    TotalUserCardModule,
  ],
})
export class DashboardModule {}
