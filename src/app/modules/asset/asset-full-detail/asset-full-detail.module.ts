import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetFullDetailComponent } from "./asset-full-detail.component";
import { AssetTimelineModule } from "../asset-timeline/asset-timeline.module";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { SpecCardListModule } from "../spec-card-list/spec-card-list.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [AssetFullDetailComponent],
  imports: [
    CommonModule,
    AssetTimelineModule,
    SharedModule,
    SpecCardListModule,
    CustomMaterialModule,
    RouterModule.forChild([{ path: "", component: AssetFullDetailComponent }]),
  ],
})
export class AssetFullDetailModule {}
