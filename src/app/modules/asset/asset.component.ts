import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";

@Component({
  selector: "app-asset",
  templateUrl: "./asset.component.html",
  styleUrls: ["./asset.component.scss"],
})
export class AssetComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  assets$: Observable<IAsset[]>;
  types: string[];
  pagination: IPagination;
  selectedAsset: IAsset | null = null;

  selectedAssetForm: FormGroup;
  isLoading: boolean = false;
  searchCtrl: FormControl = new FormControl("");

  constructor(
    private _dialog: MatDialog,
    private _assetService: AssetService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Create Asset Form
    // Create the selected product form
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
   * Toggle product details
   *
   * @param assetId
   */
  toggleDetails(assetId: string): void {
    // If the product is already selected...
    if (this.selectedAsset && this.selectedAsset._id === assetId) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the product by id
    this._assetService.getAssetById(assetId).subscribe((asset) => {
      // Set the selected product
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
   * Delete the selected product using the form data
   */
  deleteSelectedProduct(): void {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete product",
      message: "Are you sure you want to remove this product? This action cannot be undone!",
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
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

        // Delete the product on the server
        this._inventoryService.deleteProduct(product.id).subscribe(() => {
          // Close the details
          this.closeDetails();
        });
      }
    });
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
