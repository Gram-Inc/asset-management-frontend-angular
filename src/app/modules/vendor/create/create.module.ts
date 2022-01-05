import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "./create.component";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { RouterModule, Route } from "@angular/router";

const createVendor: Route[] = [
  {
    path: "",
    component: CreateComponent,
  },
];
@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule, RouterModule.forChild(createVendor)],
})
export class CreateModule {}
