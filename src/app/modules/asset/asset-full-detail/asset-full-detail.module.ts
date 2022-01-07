import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetFullDetailComponent } from "./asset-full-detail.component";
import { AssetTimelineModule } from "../asset-timeline/asset-timeline.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [AssetFullDetailComponent],
  imports: [
    CommonModule,
    AssetTimelineModule,
    RouterModule.forChild([{ path: "", component: AssetFullDetailComponent }]),
  ],
})
export class AssetFullDetailModule {}
