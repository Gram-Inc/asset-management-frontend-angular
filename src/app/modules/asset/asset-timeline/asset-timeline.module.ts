import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetTimelineComponent } from "./asset-timeline.component";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [AssetTimelineComponent],
  imports: [CommonModule, MatIconModule, RouterModule],
  exports: [AssetTimelineComponent],
})
export class AssetTimelineModule {}
