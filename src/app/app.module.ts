import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ExtraOptions, PreloadAllModules, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { routes } from "./app.routing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CustomMaterialModule } from "./modules/custom-material/custom-material.module";
import { LayoutModule } from "@angular/cdk/layout";
import { LayoutComponent } from "./layout/layout.component";
import { SharedModule } from "./modules/shared/shared.module";
import { AuthModule } from "./core/auth/auth.module";
import { SignOutModule } from "./modules/auth/sign-out/sign-out.module";
import { SignInModule } from "./modules/auth/sign-in/sign-in.module";
import { AuthInterceptor } from "./core/auth/auth.interceptor";
import { AsideComponent } from "./custom/components/aside/aside.component";

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: "enabled",
};

@NgModule({
  declarations: [AppComponent, LayoutComponent, AsideComponent],
  imports: [
    AuthModule,
    BrowserModule,
    RouterModule.forRoot(routes, routerConfig),
    SharedModule,
    BrowserAnimationsModule,
    CustomMaterialModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
