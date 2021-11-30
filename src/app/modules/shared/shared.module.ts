import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TitleCardComponent } from "./title-card/title-card.component";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { FullscreenComponent } from "./fullscreen/fullscreen.component";

var sharedComp = [TitleCardComponent, FullscreenComponent];
@NgModule({
  declarations: [...sharedComp],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModule,
  ],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, ...sharedComp],
})
export class SharedModule {}
