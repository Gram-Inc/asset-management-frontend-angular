import { Route } from "@angular/router";
import { AuthGuard } from "src/app/core/auth/guards/auth.guard";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignOutComponent } from "./sign-out/sign-out.component";

export const authRoutes: Route[] = [
  // { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  {
    path: "sign-in",
    component: SignInComponent,
  },
];
