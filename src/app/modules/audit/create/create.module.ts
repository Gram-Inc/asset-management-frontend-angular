import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { CreateAuditComponent } from "./create.component";
import { ReactiveFormsModule } from "@angular/forms";

const createAuditRoutes: Routes = [
  {
    path: "",
    component: CreateAuditComponent,
  },
];

@NgModule({
  declarations: [CreateAuditComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(createAuditRoutes),
  ],
})
export class CreateAuditModule {}
