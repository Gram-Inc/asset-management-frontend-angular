import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserFullDetailComponent } from "./user-full-detail.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [UserFullDetailComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: "", component: UserFullDetailComponent }])],
})
export class UserFullDetailModule {}
