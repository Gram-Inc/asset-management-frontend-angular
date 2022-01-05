import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LastCreatedAssetTableComponent } from "./last-created-asset-table.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [LastCreatedAssetTableComponent],
  imports: [CommonModule, CustomMaterialModule, RouterModule],
  exports: [LastCreatedAssetTableComponent],
})
export class LastCreatedAssetTableModule {}
