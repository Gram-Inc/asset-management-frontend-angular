import { Route } from "@angular/router";
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
    component: LayoutComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
          import("./modules/auth/auth.module").then((x) => x.AuthPageModule),
      },
    ],
  },
  // Landing routes
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./modules/dashboard/dashboard.module").then(
            (x) => x.DashboardModule
          ),
      },
    ],
  },
];
