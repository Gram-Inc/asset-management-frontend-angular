import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./sign-in.component";
import { RouterModule } from "@angular/router";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: SignInComponent,
      },
    ]),
  ],
})
export class SignInModule {}
