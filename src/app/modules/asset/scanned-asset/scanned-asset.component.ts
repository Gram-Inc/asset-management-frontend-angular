import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";
import { ScannedAssetService } from "src/app/core/asset/scannedAsset/scanned-asset.service";

@Component({
  selector: "app-scanned-asset",
  templateUrl: "./scanned-asset.component.html",
  styleUrls: ["./scanned-asset.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class ScannedAssetComponent implements OnInit {
  scannedAssets$: Observable<IAsset[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  pagination: IPagination;
  isLoading = false;
  columnsToDisplay = ["model", "serial", "hostname", "date"];
  expandedElement: IAsset | null;

  constructor(private _scannedAssetService: ScannedAssetService) {}

  ngOnInit(): void {
    //Get the Scanned Assets List
    this.scannedAssets$ = this._scannedAssetService.ScannedAssets$;

    this._scannedAssetService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((paginationResponse: IPagination) => (this.pagination = paginationResponse));
  }

  addToPool(assetId: string) {
    //Move Asset to Pool
  }
  remove(assetId: string) {
    //Remove Asset from Scanned
  }
}
