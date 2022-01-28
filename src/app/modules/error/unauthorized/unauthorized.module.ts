import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UnauthorizedComponent } from "./unauthorized.component";
import { RouterModule, Routes } from "@angular/router";

const unauthorizedRoutes: Routes = [
  {
    path: "",
    component: UnauthorizedComponent,
  },
];

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [CommonModule, RouterModule.forChild(unauthorizedRoutes)],
})
export class UnauthorizedModule {}
