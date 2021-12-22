import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset } from "src/app/core/asset/asset.types";

@Component({
  selector: "app-asset-short-detail",
  templateUrl: "./asset-short-detail.component.html",
  styleUrls: ["./asset-short-detail.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssetShortDetailComponent implements OnInit {
  asset?: IAsset;
  //Fetch Latest detail of Asset
  constructor(private _assetService: AssetService, @Inject(MAT_DIALOG_DATA) public data: IAsset) {}

  ngOnInit(): void {
    //Get data From Server with ID
    this._assetService.getAssetById(this.data._id).subscribe((_) => {
      this.asset = _;
      console.log(_);
    });
  }
}
