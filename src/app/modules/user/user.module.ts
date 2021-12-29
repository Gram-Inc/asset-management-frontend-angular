import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { RouterModule } from "@angular/router";
import { userRoutes } from "./user.routing";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(userRoutes)],
})
export class UserModule {}
