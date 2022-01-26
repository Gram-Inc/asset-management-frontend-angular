import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";
import { ScannedAssetService } from "src/app/core/asset/scannedAsset/scanned-asset.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
import { IScannedAsset } from "src/app/core/asset/scannedAsset/scanned-asset.types";
import { MatDialog } from "@angular/material/dialog";
import { MoveConfirmationComponent } from "./move-confirmation/move-confirmation.component";

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
export class ScannedAssetComponent implements OnInit, OnDestroy {
  scannedAssets$: Observable<IScannedAsset[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  pagination: IPagination;
  isLoading = false;
  columnsToDisplay = ["model", "serial", "hostname", "date"];
  expandedElement: IAsset | null;

  constructor(
    private _scannedAssetService: ScannedAssetService,
    private _snackBar: MatSnackBar,
    private _rikConfirmationService: RikielConfirmationService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //Get the Scanned Assets List
    this.scannedAssets$ = this._scannedAssetService.ScannedAssets$;

    this._scannedAssetService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((paginationResponse: IPagination) => (this.pagination = paginationResponse));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  addToPool(assetId: string) {
    //Show Dialog for type
    this._dialog
      .open(MoveConfirmationComponent)
      .afterClosed()
      .subscribe((result) => {
        //Move Asset to Pool
        if (result)
          this._scannedAssetService.moveAssetToPool(assetId, result).subscribe(
            (_) => this.openSnackBar("Success", "Asset moved to pool"),
            (err) => this.openSnackBar("Error", err)
          );
      });
  }
  remove(assetId: string) {
    this._rikConfirmationService
      .open({
        dismissible: true,
        title: "Alert !",
        message: "The Asset Scanned will be removed permanently !",
        icon: {
          name: "feather:trash",
          show: true,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result)
          //Remove Asset from Scanned
          this._scannedAssetService.removeAssetFromScanned(assetId).subscribe(
            (_) => {
              this.openSnackBar("Success", "Asset Removed !");
            },
            (err) => {
              this.openSnackBar("Error", err);
            }
          );
      });
  }

  refreshList() {
    //Fetch Fresh / Refresh the Scanned Asset List
    this._scannedAssetService.getScannedAssets().subscribe(
      (_) => {
        this.openSnackBar("Success", "Refresh Complete");
      },
      (err) => {
        this.openSnackBar("Error", "Error Occured");
      }
    );
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
