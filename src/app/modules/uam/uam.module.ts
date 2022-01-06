import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UamComponent } from "./uam.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { UamListComponent } from "./uam-list/uam-list.component";
import { UamDetailComponent } from "./uam-detail/uam-detail.component";
import { CreateUAMResolver, EditUAMResolver, UamResolver } from "src/app/core/uam/uam.resolver";
import { CustomMaterialModule } from "../custom-material/custom-material.module";

const uamRoutes: Routes = [
  {
    path: "",
    component: UamComponent,
    resolve: [UamResolver],
  },
  {
    path: "create",
    resolve: [CreateUAMResolver],
    component: UamDetailComponent,
  },
  {
    path: ":id",
    resolve: [EditUAMResolver],
    component: UamDetailComponent,
  },
];

@NgModule({
  declarations: [UamComponent, UamListComponent, UamDetailComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule, RouterModule.forChild(uamRoutes)],
})
export class UamModule {}
