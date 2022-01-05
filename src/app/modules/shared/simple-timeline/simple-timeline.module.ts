import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimpleTimelineComponent } from "./simple-timeline.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [SimpleTimelineComponent],
  imports: [CommonModule, CustomMaterialModule],
  exports: [SimpleTimelineComponent],
})
export class SimpleTimelineModule {}
