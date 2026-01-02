import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { AuditDetailsComponent } from "./details.component";

const detailsRoutes: Routes = [
  {
    path: "",
    component: AuditDetailsComponent,
  },
];

@NgModule({
  declarations: [AuditDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    RouterModule.forChild(detailsRoutes),
  ],
})
export class AuditDetailsModule {}
