import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LastCreatedUserTableComponent } from "./last-created-user-table.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [LastCreatedUserTableComponent],
  imports: [CommonModule, CustomMaterialModule],
  exports: [LastCreatedUserTableComponent],
})
export class LastCreatedUserTableModule {}
