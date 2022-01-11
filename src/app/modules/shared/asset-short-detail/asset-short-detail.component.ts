import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset } from "src/app/core/asset/asset.types";
import { IBranch } from "src/app/core/branch/branch.types";
import { isValid, isFuture, formatDistanceToNow } from "date-fns";
import { Router } from "@angular/router";
import { BasicService } from "src/app/core/basic/basic.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";

@Component({
  selector: "app-asset-short-detail",
  templateUrl: "./asset-short-detail.component.html",
  styleUrls: ["./asset-short-detail.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssetShortDetailComponent implements OnInit {
  asset?: IAsset;
  //Fetch Latest detail of Asset
  constructor(
    private _assetService: AssetService,
    @Inject(MAT_DIALOG_DATA) public data: IAsset,
    private matDialogRef: MatDialogRef<AssetShortDetailComponent>,
    private router: Router,
    private _basicService: BasicService,
    private _snackBar: MatSnackBar,
    private _confirmationService: RikielConfirmationService
  ) {}

  ngOnInit(): void {
    //Get data From Server with ID
    this._assetService.getAssetById(this.data._id).subscribe((_) => {
      this.asset = _;
    });
  }
  close() {
    this.matDialogRef.close();
  }

  getBranchName(branch: string | Partial<IBranch>): string {
    if (branch) return typeof branch === "object" ? branch.name : "-";
    return "NULL";
  }

  getAssetType(asset: IAsset) {
    // if(Object.k )
  }

  isDateFuture(date) {
    if (isValid(date)) return isFuture(date);
    return false;
  }
  getBranchShortCode(branch: string | Partial<IBranch>): string {
    if (branch) return typeof branch === "object" ? branch.branchCode : "-";
    return "NULL";
  }
  deleteAsset() {
    const confirmation = this._confirmationService.open({
      title: "Delete Asset",
      message: "Are you sure you want to delete this asset? This action cannot be undone!",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    confirmation.afterClosed().subscribe((res) => {
      if (res == "confirmed")
        this._assetService.deleteAsset(this.asset._id).subscribe((_) => {
          this.matDialogRef.close();
          this.openSnackBar("Success", "Asset Deleted!");
        });
    });
  }

  getCurrentUser(asset: IAsset) {
    if (asset.allocationToUserId && typeof asset.allocationToUserId == "object") {
      if (asset.allocationToUserId.firstName.toUpperCase() == asset.allocationToUserId.lastName.toUpperCase())
        return asset.allocationToUserId.firstName;
      return asset.allocationToUserId.firstName + " " + asset.allocationToUserId.lastName;
    }
    return "-";
  }

  getPrevUser(asset: IAsset) {
    if (asset.allocationToUserId && typeof asset.allocationToUserId == "object") {
      if (asset.allocationToUserId.firstName.toUpperCase() == asset.allocationToUserId.lastName.toUpperCase())
        return asset.allocationToUserId.firstName;
      return asset.allocationToUserId.firstName + " " + asset.allocationToUserId.lastName;
    }
    return "-";
  }

  openCurrentUser(asset: IAsset) {
    if (asset.allocationToUserId && typeof asset.allocationToUserId == "object") {
      this.matDialogRef.close();
      this.router.navigate([`/user/${asset.allocationToUserId._id}`]);
    }
  }

  getLogo(): string {
    return this._basicService.getAppropriateBrandLogo(this.asset.laptop.system.model);
  }
  getProcessorLogo(): string {
    return this._basicService.getAppropriateCPULogo(this.asset.laptop.cpu.brand);
  }

  openSnackBar(type: "Error" | "Info" | "Success", msg: string) {
    this._snackBar.open(msg, "Close", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
    });
  }
}
