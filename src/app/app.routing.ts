import { Route } from "@angular/router";
import { of } from "rxjs";
import { InitialDataResolver } from "./app.resolvers";
import { AssetGuard } from "./core/auth/guards/asset.guard";
import { AuthGuard } from "./core/auth/guards/auth.guard";
import { BranchGuard } from "./core/auth/guards/branch.guard";
import { NoAuthGuard } from "./core/auth/guards/noAuth.guard";
import { TicketGuard } from "./core/auth/guards/ticket.guard";
import { UamGuard } from "./core/auth/guards/uam.guard";
import { UserGuard } from "./core/auth/guards/user.guard";
import { VendorGuard } from "./core/auth/guards/vendor.guard";
import { DashboardResolver } from "./core/dashboard/dashboard.resolver";
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
      children: [
         {
            path: "sign-in",
            loadChildren: () => import("./modules/auth/sign-in/sign-in.module").then((x) => x.SignInModule),
         },
      ],
   },
   // Admin routes
   {
      path: "",
      component: LayoutComponent,
      canActivate: [AuthGuard],
      // canActivateChild: [AuthGuard],
      resolve: {
         initialData: InitialDataResolver,
      },

      children: [
         {
            path: "dashboard",
            resolve: [DashboardResolver],
            loadChildren: () => import("./modules/dashboard/dashboard.module").then((x) => x.DashboardModule),
         },
         {
            path: "asset",
            canActivate: [AssetGuard],
            loadChildren: () => import("./modules/asset/asset.module").then((x) => x.AssetModule),
         },
         {
            path: "ticket",
            canLoad: [TicketGuard],
            canActivate: [TicketGuard],
            loadChildren: () => import("./modules/ticket/ticket.module").then((x) => x.TicketModule),
         },
         {
            path: "user",
            canActivate: [UserGuard],
            loadChildren: () => import("./modules/user/user.module").then((x) => x.UserModule),
         },
         {
            path: "branch",
            canActivate: [BranchGuard],
            loadChildren: () => import("./modules/branch/branch.module").then((x) => x.BranchModule),
         },
         {
            path: "uam",
            canActivate: [UamGuard],
            loadChildren: () => import("./modules/uam/uam.module").then((x) => x.UamModule),
         },
         {
            path: "vendor",
            canActivate: [VendorGuard],
            loadChildren: () => import("./modules/vendor/vendor.module").then((x) => x.VendorModule),
         },
      ],
   },
   {
      path: "sign-out",
      canActivate: [AuthGuard],
      loadChildren: () => import("./modules/auth/sign-out/sign-out.module").then((x) => x.SignOutModule),
   },
];
