import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BranchComponent } from "./branch.component";
import { RouterModule, Routes } from "@angular/router";
import { BranchCreateComponent } from "./branch-create/branch-create.component";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { BranchCardComponent } from "./branch-card/branch-card.component";
import { BranchResolver } from "src/app/core/branch/branch.resolver";

const branchRoutes: Routes = [
  {
    path: "",
    resolve: [BranchResolver],
    component: BranchComponent,
  },
  {
    path: "create",
    component: BranchCreateComponent,
  },
];

@NgModule({
  declarations: [BranchComponent, BranchCreateComponent, BranchCardComponent],
  imports: [CommonModule, RouterModule.forChild(branchRoutes), CustomMaterialModule],
})
export class BranchModule {}
