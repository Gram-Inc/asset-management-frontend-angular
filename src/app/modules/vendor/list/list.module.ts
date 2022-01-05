import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "./list.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, CustomMaterialModule, RouterModule],
  exports: [ListComponent],
})
export class ListModule {}
