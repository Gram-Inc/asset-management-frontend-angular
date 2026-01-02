import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { AuditReportComponent } from "./report.component";

const reportRoutes: Routes = [
  {
    path: "",
    component: AuditReportComponent,
  },
];

@NgModule({
  declarations: [AuditReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    RouterModule.forChild(reportRoutes),
  ],
})
export class AuditReportModule {}
