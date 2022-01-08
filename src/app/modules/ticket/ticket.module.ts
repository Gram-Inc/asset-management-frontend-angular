import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TicketComponent } from "./ticket.component";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { TicketListComponent } from './ticket-list/ticket-list.component';

const ticketRoutes: Route[] = [
  {
    path: "",
    component: TicketComponent,
  },
];

@NgModule({
  declarations: [TicketComponent, TicketListComponent],
  imports: [CommonModule, RouterModule.forChild(ticketRoutes), CustomMaterialModule, SharedModule],
})
export class TicketModule {}
