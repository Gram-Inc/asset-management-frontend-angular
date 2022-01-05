import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "./list.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, CustomMaterialModule],
  exports: [ListComponent],
})
export class ListModule {}
