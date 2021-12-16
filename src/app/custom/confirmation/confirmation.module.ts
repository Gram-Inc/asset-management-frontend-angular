import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RikielConfirmationDialogComponent } from "./dialog/dialog.component";
import { CustomMaterialModule } from "src/app/modules/custom-material/custom-material.module";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { RikielConfirmationService } from "./confirmation.service";

@NgModule({
  declarations: [RikielConfirmationDialogComponent],
  imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
  providers: [RikielConfirmationService],
})
export class ConfirmationModule {
  /**
   * Constructor
   */
  constructor(private _rikielConfirmationService: RikielConfirmationService) {}
}
