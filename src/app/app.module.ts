import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ExtraOptions, PreloadAllModules, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { routes } from "./app.routing";
import { AuthPageModule } from "./modules/auth/auth.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CustomMaterialModule } from "./modules/custom-material/custom-material.module";
import { LayoutModule } from "@angular/cdk/layout";
import { LayoutComponent } from "./layout/layout.component";
import { SharedModule } from "./modules/shared/shared.module";
import { AuthModule } from "./core/auth/auth.module";
import { SignOutModule } from "./modules/auth/sign-out/sign-out.module";

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: "enabled",
};

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    AuthModule,
    BrowserModule,
    RouterModule.forRoot(routes, routerConfig),
    SharedModule,
    // AppRoutingModule,
    AuthPageModule,
    BrowserAnimationsModule,
    CustomMaterialModule.forRoot(),
    SignOutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
