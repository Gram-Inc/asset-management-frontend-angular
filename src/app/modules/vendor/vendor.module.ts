import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VendorComponent } from "./vendor.component";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { ListModule } from "./list/list.module";

const vendorRoutes: Route[] = [
  {
    path: "",
    component: VendorComponent,
  },
  {
    path: "create",
    loadChildren: () => import("./create/create.module").then((x) => x.CreateModule),
  },
  {
    path: "detail",
    loadChildren: () => import("./detail/detail.module").then((x) => x.DetailModule),
  },
];

@NgModule({
  declarations: [VendorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(vendorRoutes),
    CustomMaterialModule,
    ListModule,
    SharedModule,
  ],
})
export class VendorModule {}
