import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssetBottomSheetComponent } from "./asset-bottom-sheet.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [AssetBottomSheetComponent],
  imports: [CommonModule, CustomMaterialModule, SharedModule],
})
export class AssetBottomSheetModule {}
