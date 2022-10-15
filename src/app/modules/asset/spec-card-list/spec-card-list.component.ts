import { Component, Input, OnInit } from "@angular/core";
import { IAsset } from "src/app/core/asset/asset.types";
import { IScannedAsset } from "src/app/core/asset/scannedAsset/scanned-asset.types";

@Component({
   selector: "app-spec-card-list",
   templateUrl: "./spec-card-list.component.html",
})
export class SpecCardListComponent implements OnInit
{
   @Input() asset: IScannedAsset;

   constructor() { }

   ngOnInit(): void
   {
      //check the type of asset
   }

   getProcessorShortName(value: string)
   {
      if (value.includes("i3")) return "i3";
      else if (value.includes("i5")) return "i5";
      else if (value.includes("i7")) return "i7";
      else if (value.includes("i9")) return "i9";
      else return "N/A";
   }
}
