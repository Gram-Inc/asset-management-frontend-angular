import { Routes } from "@angular/router";
import { DetailsComponent } from "./details/details.component";
import { UserComponent } from "./user.component";

export const userRoutes: Routes = [
  {
    path: "",
    component: UserComponent,
  },
  {
    path: "create",
    component: DetailsComponent,
  },
];
