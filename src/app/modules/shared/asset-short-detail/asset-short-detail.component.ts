import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset } from "src/app/core/asset/asset.types";
import { IBranch } from "src/app/core/branch/branch.types";
import { isValid, isFuture, formatDistanceToNow } from "date-fns";

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
    private matDialogRef: MatDialogRef<AssetShortDetailComponent>
  ) {}

  ngOnInit(): void {
    //Get data From Server with ID
    this._assetService.getAssetById(this.data._id).subscribe((_) => {
      this.asset = _;
      console.log(_);
    });
  }
  close() {
    this.matDialogRef.close();
  }

  getBranchName(branch: string | IBranch): string {
    return typeof branch === "object" ? branch.name : "-";
  }

  getAssetType(asset: IAsset) {
    // if(Object.k )
  }

  isDateFuture(date) {
    if (isValid(date)) return isFuture(date);
    return false;
  }
  getBranchShortCode(branch: string | IBranch): string {
    return typeof branch === "object" ? branch.name : "-";
  }
}
