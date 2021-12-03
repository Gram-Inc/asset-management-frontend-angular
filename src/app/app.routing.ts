import { Route } from "@angular/router";
import { InitialDataResolver } from "./app.resolvers";
import { AuthGuard } from "./core/auth/guards/auth.guard";
import { NoAuthGuard } from "./core/auth/guards/noAuth.guard";
import { LayoutComponent } from "./layout/layout.component";

export const routes: Route[] = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },

  {
    path: "signed-in-redirect",
    pathMatch: "full",
    redirectTo: "dashboard",
  },

  //No Auth Guard
  {
    path: "",
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    data: {
      layout: "",
    },
    component: LayoutComponent,
    children: [
      {
        path: "sign-in",
        loadChildren: () =>
          import("./modules/auth/sign-in/sign-in.module").then(
            (x) => x.SignInModule
          ),
      },
    ],
  },
  // Admin routes
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {
      initialData: InitialDataResolver,
    },

    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then(
            (x) => x.DashboardModule
          ),
      },
      {
        path: "sign-out",
        loadChildren: () =>
          import("./modules/auth/sign-out/sign-out.module").then(
            (x) => x.SignOutModule
          ),
      },
    ],
  },
];
