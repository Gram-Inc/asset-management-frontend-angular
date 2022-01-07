import { Routes } from "@angular/router";
import { DepartmentResolver } from "src/app/core/department/department.resolver";
import { CreateUserResolver, EditUserResolver, UserResolver } from "src/app/core/user/user.resolver";
import { DetailsComponent } from "./details/details.component";
import { UserComponent } from "./user.component";

export const userRoutes: Routes = [
  {
    path: "",
    resolve: [UserResolver],
    component: UserComponent,
  },
  {
    path: "create",
    component: DetailsComponent,
    resolve: [CreateUserResolver, DepartmentResolver],
  },
  {
    path: ":id",
    resolve: [EditUserResolver],
    loadChildren: () =>
      import("./user-full-detail/user-full-detail.module").then((x) => x.UserFullDetailModule),
  },
];
