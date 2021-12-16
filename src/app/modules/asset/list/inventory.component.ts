import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";

@Component({
  selector: "inventory-list",
  templateUrl: "./inventory.component.html",
  styles: [
    /* language=SCSS */
    `
      .inventory-grid {
        grid-template-columns: auto 40px;

        @screen sm {
          grid-template-columns: auto 112px 72px;
        }

        @screen md {
          grid-template-columns: auto 112px 72px;
        }

        @screen lg {
          grid-template-columns: auto 112px 96px 96px 72px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AssetListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  assets$: Observable<IAsset[]>;
  types: string[];
  pagination: IPagination;
  selectedAsset: IAsset | null = null;
  flashMessage: "success" | "error" | null = null;

  selectedAssetForm: FormGroup;
  isLoading: boolean = false;
  searchCtrl: FormControl = new FormControl("");

  constructor(
    private _dialog: MatDialog,
    private _assetService: AssetService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _rikielConfirmationService: RikielConfirmationService
  ) {}

  ngOnInit(): void {
    // Create Asset Form
    // Create the selected asset form
    this.selectedAssetForm = this._formBuilder.group({
      _id: [""],
      name: ["", [Validators.required]],
      assetCode: [""],
      location: [""],
      venderId: [""],
      sr_no: [""],
      life: [""],
      purchaseDate: [""],
      poNumber: [""],
    });

    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._assetService.getAssets(1, 10, query);
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

    // Get the Assets
    this.assets$ = this._assetService.assets$;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Toggle asset details
   *
   * @param assetId
   */
  toggleDetails(assetId: string): void {
    // If the asset is already selected...
    if (this.selectedAsset && this.selectedAsset._id === assetId) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the asset by id
    this._assetService.getAssetById(assetId).subscribe((asset) => {
      // Set the selected asset
      this.selectedAsset = asset;

      // Fill the form
      this.selectedAssetForm.patchValue(asset);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedAsset = null;
  }

  /**
   * Create Asset
   */
  createAsset(): void {
    // Get the asset object
    const asset = this.selectedAssetForm.getRawValue();
    // Create the product
    this._assetService.createAsset(asset).subscribe((newAsset) => {
      // Go to new product
      this.selectedAsset = newAsset;

      // Fill the form
      this.selectedAssetForm.patchValue(newAsset);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Update the selected asset using the form data
   */
  updateSelectedasset(): void {
    // Get the asset object
    const asset = this.selectedAssetForm.getRawValue();

    // Update the asset on the server
    this._assetService.updateAsset(asset.id, asset).subscribe(() => {
      // Show a success message
      this.showFlashMessage("success");
    });
  }

  /**
   * Delete the selected asset using the form data
   */
  deleteSelectedAsset(): void {
    // Open the confirmation dialog
    const confirmation = this._rikielConfirmationService.open({
      title: "Delete asset",
      message: "Are you sure you want to remove this asset? This action cannot be undone!",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Get the asset object
        const asset = this.selectedAssetForm.getRawValue();

        // Delete the asset on the server
        this._assetService.deleteAsset(asset._id).subscribe(() => {
          // Close the details
          this.closeDetails();
        });
      }
    });
  }

  /**
   * Show flash message
   */
  showFlashMessage(type: "success" | "error"): void {
    // Show the message
    this.flashMessage = type;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Hide it after 3 seconds
    setTimeout(() => {
      this.flashMessage = null;

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item._id || index;
  }
}
