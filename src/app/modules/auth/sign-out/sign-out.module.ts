import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignOutComponent } from "./sign-out.component";
import { RouterModule } from "@angular/router";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SignOutComponent],

  imports: [
    CommonModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: "", component: SignOutComponent }]),
  ],
})
export class SignOutModule {}
