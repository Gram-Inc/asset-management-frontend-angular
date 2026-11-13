import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { SharedModule } from "../shared/shared.module";
import { ReportComponent } from "./report.component";

const reportRoutes: Routes = [
   {
      path: "",
      component: ReportComponent,
   },
];

@NgModule({
   declarations: [ReportComponent],
   imports: [SharedModule, CustomMaterialModule, RouterModule.forChild(reportRoutes)],
})
export class ReportModule { }
