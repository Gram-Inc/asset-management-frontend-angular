import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CreateAssetComponent } from "./create-asset.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { SharedModule } from "../../shared/shared.module";

const createAssetRoute: Routes = [
  {
    path: "",
    component: CreateAssetComponent,
  },
];

@NgModule({
  declarations: [CreateAssetComponent],
  imports: [CommonModule, RouterModule.forChild(createAssetRoute), CustomMaterialModule, SharedModule],
})
export class CreateAssetModule {}
