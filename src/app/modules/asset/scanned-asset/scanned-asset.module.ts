import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { ScannedAssetComponent } from "./scanned-asset.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { ScannedAssetResolver } from "src/app/core/asset/scannedAsset/scanned-asset.resolver";

const scannedRoutes: Route[] = [
  {
    path: "",
    resolve: [ScannedAssetResolver],
    component: ScannedAssetComponent,
  },
];
@NgModule({
  declarations: [ScannedAssetComponent],
  imports: [CommonModule, RouterModule.forChild(scannedRoutes), CustomMaterialModule],
})
export class ScannedAssetModule {}
