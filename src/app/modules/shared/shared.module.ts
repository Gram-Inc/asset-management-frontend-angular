import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TitleCardComponent } from "./title-card/title-card.component";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { FullscreenComponent } from "./fullscreen/fullscreen.component";
import { UserComponent } from "./user/user.component";
import { ConfirmationModule } from "src/app/custom/confirmation/confirmation.module";

var sharedComp = [TitleCardComponent, FullscreenComponent, UserComponent];
@NgModule({
  declarations: [...sharedComp],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomMaterialModule, ConfirmationModule],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmationModule, ...sharedComp],
})
export class SharedModule {}
