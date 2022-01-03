import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { RouterModule } from "@angular/router";
import { userRoutes } from "./user.routing";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [UserComponent, UserListComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule, RouterModule.forChild(userRoutes)],
})
export class UserModule {}
