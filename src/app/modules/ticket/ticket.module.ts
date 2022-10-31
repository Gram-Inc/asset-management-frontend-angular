import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TicketComponent } from "./ticket.component";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { TicketListComponent } from "./ticket-list/ticket-list.component";
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { EditTicketResolver, TicketResolver } from "src/app/core/ticket/ticket.resolver";
import { TicketAssignComponent } from './ticket-assign/ticket-assign.component';

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
   {
      path: ":id",
      resolve: [EditTicketResolver],
      loadChildren: () => import("./ticket-detail/ticket-detail.module").then((x) => x.TicketDetailModule),
   },
];

@NgModule({
   declarations: [TicketComponent, TicketListComponent, CreateTicketComponent, TicketAssignComponent],
   imports: [CommonModule, RouterModule.forChild(ticketRoutes), CustomMaterialModule, SharedModule],
})
export class TicketModule { }
