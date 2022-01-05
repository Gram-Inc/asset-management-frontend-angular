import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TotalUserCardComponent } from "./total-user-card.component";
import { SharedModule } from "../../shared/shared.module";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [TotalUserCardComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule],
  exports: [TotalUserCardComponent],
})
export class TotalUserCardModule {}
