import { Routes } from "@angular/router";
import { DepartmentResolver } from "src/app/core/department/department.resolver";
import { CreateUserResolver, UserResolver } from "src/app/core/user/user.resolver";
import { DetailsComponent } from "./details/details.component";
import { UserComponent } from "./user.component";

export const userRoutes: Routes = [
  {
    path: "",
    component: UserComponent,
    resolve: [UserResolver],
  },
  {
    path: "create",
    component: DetailsComponent,
    resolve: [CreateUserResolver, DepartmentResolver],
  },
  {
    path: "full/:id",
    loadChildren: () =>
      import("./user-full-detail/user-full-detail.module").then((x) => x.UserFullDetailModule),
  },
];
