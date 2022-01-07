import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { RouterModule } from "@angular/router";
import { userRoutes } from "./user.routing";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { UserListComponent } from "./user-list/user-list.component";
import { UserFullDetailModule } from "./user-full-detail/user-full-detail.module";
import { UserTimelineCardComponent } from "./user-timeline-card/user-timeline-card.component";
import { UserTimelineCardModule } from "./user-timeline-card/user-timeline-card.module";

@NgModule({
  declarations: [UserComponent, UserListComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    RouterModule.forChild(userRoutes),
    UserTimelineCardModule,
  ],
})
export class UserModule {}
