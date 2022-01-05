import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VendorComponent } from "./vendor.component";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";

const vendorRoutes: Route[] = [
  {
    path: "",
    component: VendorComponent,
  },
];

@NgModule({
  declarations: [VendorComponent],
  imports: [CommonModule, RouterModule.forChild(vendorRoutes), CustomMaterialModule, SharedModule],
})
export class VendorModule {}
