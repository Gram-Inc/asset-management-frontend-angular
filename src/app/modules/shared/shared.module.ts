import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TitleCardComponent } from "./title-card/title-card.component";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { FullscreenComponent } from "./fullscreen/fullscreen.component";
import { UserComponent } from "./user/user.component";
import { ConfirmationModule } from "src/app/custom/confirmation/confirmation.module";
import { IconsModule } from "src/app/core/icons/icons.module";
import { ThemeTogglerComponent } from "./theme-toggler/theme-toggler.component";

var sharedComp = [TitleCardComponent, FullscreenComponent, UserComponent, ThemeTogglerComponent];
@NgModule({
  declarations: [...sharedComp],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModule,
    ConfirmationModule,
    IconsModule,
  ],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmationModule, IconsModule, ...sharedComp],
})
export class SharedModule {}
