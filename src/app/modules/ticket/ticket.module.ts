import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TicketComponent } from "./ticket.component";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { TicketResolver } from "src/app/core/ticket/ticket.resolver";

const ticketRoutes: Route[] = [
   {
      path: "",
      resolve: [TicketResolver],
      component: TicketComponent,
   },
   {
      path: "create",
      loadChildren: () => import("./create-ticket/create-ticket.module").then((x) => x.CreateTicketModule),
   },
];

@NgModule({
   declarations: [TicketComponent, TicketListComponent, CreateTicketComponent],
   imports: [CommonModule, RouterModule.forChild(ticketRoutes), CustomMaterialModule, SharedModule],
})
export class TicketModule { }
