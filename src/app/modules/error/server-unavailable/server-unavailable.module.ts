import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServerUnavailableComponent } from "./server-unavailable.component";
import { RouterModule, Routes } from "@angular/router";

const serverUnavailableRoutes: Routes = [
  {
    path: "",
    component: ServerUnavailableComponent,
  },
];

@NgModule({
  declarations: [ServerUnavailableComponent],
  imports: [CommonModule, RouterModule.forChild(serverUnavailableRoutes)],
})
export class ServerUnavailableModule {}
