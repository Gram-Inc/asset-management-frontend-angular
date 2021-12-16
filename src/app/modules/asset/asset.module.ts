import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetComponent } from "./asset.component";
import { RouterModule } from "@angular/router";
import { assetRoutes } from "./asset.routing";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { AssetListComponent } from "./list/inventory.component";

@NgModule({
  declarations: [AssetComponent, AssetListComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule, RouterModule.forChild(assetRoutes)],
})
export class AssetModule {}
