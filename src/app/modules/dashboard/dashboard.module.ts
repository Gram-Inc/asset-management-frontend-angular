import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule, Routes } from "@angular/router";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { SharedModule } from "../shared/shared.module";

const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [RouterModule.forChild(dashboardRoutes), CommonModule, CustomMaterialModule, SharedModule],
})
export class DashboardModule {}
