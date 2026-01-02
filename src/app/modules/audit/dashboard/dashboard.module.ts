import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { AuditDashboardComponent } from "./dashboard.component";

const dashboardRoutes: Routes = [
  {
    path: "",
    component: AuditDashboardComponent,
  },
];

@NgModule({
  declarations: [AuditDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    RouterModule.forChild(dashboardRoutes),
  ],
})
export class AuditDashboardModule {}
