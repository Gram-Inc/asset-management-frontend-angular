import { NgModule, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NewJoineeStatusTableComponent } from "./new-joinee-status-table.component";
import { CustomMaterialModule } from "../../custom-material/custom-material.module";

@NgModule({
  declarations: [NewJoineeStatusTableComponent],
  imports: [CommonModule, CustomMaterialModule],
  exports: [NewJoineeStatusTableComponent],
})
export class NewJoineeStatusTableModule {}
