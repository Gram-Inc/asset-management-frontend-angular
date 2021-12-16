import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RikielConfirmationConfig } from "./confimation.types";
import { RikielConfirmationDialogComponent } from "./dialog/dialog.component";
import { merge } from "lodash-es";

@Injectable({
  providedIn: "root",
})
export class RikielConfirmationService {
  private _defaultConfig: RikielConfirmationConfig = {
    title: "Confirm action",
    message: "Are you sure you want to confirm this action?",
    icon: {
      show: true,
      name: "heroicons_outline:exclamation",
      color: "warn",
    },
    actions: {
      confirm: {
        show: true,
        label: "Confirm",
        color: "warn",
      },
      cancel: {
        show: true,
        label: "Cancel",
      },
    },
    dismissible: false,
  };

  /**
   * Constructor
   */
  constructor(private _matDialog: MatDialog) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  open(config: RikielConfirmationConfig = {}): MatDialogRef<RikielConfirmationDialogComponent> {
    // Merge the user config with the default config
    const userConfig = merge({}, this._defaultConfig, config);

    // Open the dialog
    return this._matDialog.open(RikielConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: "fuse-confirmation-dialog-panel",
    });
  }
}
