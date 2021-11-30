import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./sign-in/sign-in.component";
import { RouterModule } from "@angular/router";
import { authRoutes } from "./auth.routing";
import { AuthService } from "src/app/core/auth/auth.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "src/app/core/auth/auth.interceptor";
import { CustomMaterialModule } from "../custom-material/custom-material.module";

@NgModule({
  declarations: [SignInComponent],
  imports: [
    RouterModule.forChild(authRoutes),
    CommonModule,
    CustomMaterialModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
