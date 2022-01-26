import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Route, RouterModule } from "@angular/router";
import { ScannedAssetComponent } from "./scanned-asset.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { ScannedAssetResolver } from "src/app/core/asset/scannedAsset/scanned-asset.resolver";
import { SpecCardListModule } from "../spec-card-list/spec-card-list.module";
import { SharedModule } from "../../shared/shared.module";
import { MoveConfirmationComponent } from './move-confirmation/move-confirmation.component';

const scannedRoutes: Route[] = [
  {
    path: "",
    resolve: [ScannedAssetResolver],
    component: ScannedAssetComponent,
  },
];
@NgModule({
  declarations: [ScannedAssetComponent, MoveConfirmationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(scannedRoutes),
    CustomMaterialModule,
    SpecCardListModule,
    SharedModule,
  ],
})
export class ScannedAssetModule {}
