import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import { CreateTicketComponent } from "./create-ticket.component";

const createTicketRoute: Routes = [
  {
    path: "",
    component: CreateTicketComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(createTicketRoute)],
})
export class CreateTicketModule {}
