import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset } from "src/app/core/asset/asset.types";
import { IBranch } from "src/app/core/branch/branch.types";
import { isValid, isFuture, formatDistanceToNow } from "date-fns";
import { Router } from "@angular/router";

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
    private router: Router
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
  deleteAsset() {}

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
}
