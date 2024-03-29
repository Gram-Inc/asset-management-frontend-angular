import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetComponent } from "./asset.component";
import { RouterModule } from "@angular/router";
import { assetRoutes } from "./asset.routing";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { AssetListComponent } from "./list/asset.component";
import { AssetDetailComponent } from "./details/details.component";
import { SpecCardListModule } from "./spec-card-list/spec-card-list.module";
import { AssetBottomSheetComponent } from "./asset-bottom-sheet/asset-bottom-sheet.component";
import { AssetBottomSheetModule } from "./asset-bottom-sheet/asset-bottom-sheet.module";
import { AssetTimelineModule } from "./asset-timeline/asset-timeline.module";
import { BytesToGBPipe } from "src/app/core/pipes/bytes-to-gb.pipe";
import { ScannedAssetComponent } from "./scanned-asset/scanned-asset.component";
import { ScannedAssetModule } from "./scanned-asset/scanned-asset.module";

@NgModule({
  declarations: [AssetComponent, AssetListComponent, AssetDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    SpecCardListModule,
    RouterModule.forChild(assetRoutes),
    AssetBottomSheetModule,
    AssetTimelineModule,
  ],
})
export class AssetModule {}
