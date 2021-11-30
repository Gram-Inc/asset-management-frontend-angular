import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./sign-in/sign-in.component";
import { RouterModule } from "@angular/router";
import { authRoutes } from "./auth.routing";
import { AuthService } from "src/app/core/auth/auth.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "src/app/core/auth/auth.interceptor";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthModule } from "src/app/core/auth/auth.module";
import { SignOutComponent } from './sign-out/sign-out.component';

@NgModule({
  declarations: [SignInComponent, SignOutComponent],
  imports: [
    RouterModule.forChild(authRoutes),
    CommonModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
})
export class AuthPageModule {}
