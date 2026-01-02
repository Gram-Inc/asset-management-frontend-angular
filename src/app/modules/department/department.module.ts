import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DepartmentComponent } from "./department.component";
import { RouterModule, Routes } from "@angular/router";
import { DepartmentCreateComponent } from "./department-create/department-create.component";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { DepartmentCardComponent } from "./department-card/department-card.component";
import { DepartmentResolver, EditDepartmentResolver } from "src/app/core/department/department.resolver";

const departmentRoutes: Routes = [
  {
    path: "",
    resolve: [DepartmentResolver],
    component: DepartmentComponent,
  },
  {
    path: "create",
    component: DepartmentCreateComponent,
  },
  {
    path: ":id",
    resolve: [EditDepartmentResolver],
    component: DepartmentCreateComponent,
  },
];

@NgModule({
  declarations: [DepartmentComponent, DepartmentCreateComponent, DepartmentCardComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(departmentRoutes), CustomMaterialModule],
})
export class DepartmentModule {}

