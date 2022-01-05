import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OverallBranchAssetDetailTableComponent } from "./overall-branch-asset-detail-table.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [OverallBranchAssetDetailTableComponent],
  imports: [CommonModule, CustomMaterialModule],
  exports: [OverallBranchAssetDetailTableComponent],
})
export class OverallBranchAssetDetailTableModule {}
