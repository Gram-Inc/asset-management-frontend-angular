import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotFoundComponent } from "./not-found.component";
import { RouterModule, Routes } from "@angular/router";

const notFoundRoutes: Routes = [
  {
    path: "",
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, RouterModule.forChild(notFoundRoutes)],
})
export class NotFoundModule {}
