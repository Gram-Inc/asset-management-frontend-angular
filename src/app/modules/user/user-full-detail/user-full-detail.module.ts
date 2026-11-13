import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserFullDetailComponent } from "./user-full-detail.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [UserFullDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    RouterModule.forChild([{ path: "", component: UserFullDetailComponent }]),
  ],
})
export class UserFullDetailModule {}
