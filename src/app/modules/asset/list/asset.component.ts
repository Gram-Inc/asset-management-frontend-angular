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
import { IBranch } from "src/app/core/branch/branch.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
import { AssetShortDetailComponent } from "../../shared/asset-short-detail/asset-short-detail.component";
import { DetailsComponent } from "../details/details.component";

@Component({
  selector: "asset-list",
  templateUrl: "./asset.component.html",
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
export class AssetListComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private _assetService: AssetService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _rikielConfirmationService: RikielConfirmationService,
    private _matDialog: MatDialog
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
    // If Search value changes
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

    this._assetService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((paginationResponse: IPagination) => (this.pagination = paginationResponse));
  }

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      /* this._sort.sort({
        id: "name",
        start: "asc",
        disableClear: true,
      }); */

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // If the user changes the sort order...
      this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        // Reset back to the first page
        this._paginator.pageIndex = 0;
      });

      // Get products if sort or page changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.isLoading = true;
            return this._assetService.getAssets(
              this._paginator.pageIndex,
              this._paginator.pageSize
              /* "",
              "",
              "",
              this._sort.direction,
              this._sort.active */
            );
          }),
          map(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
    }
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
   * Create Asset
   */
  createAsset(): void {
    this._matDialog.open(DetailsComponent, {
      panelClass: "fuse-confirmation-dialog-panel",
    });
    /* this._rikielConfirmationService.open({
      title: "Delete asset",
      message: "Are you sure you want to remove this asset? This action cannot be undone!",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    }); */
    /* // Get the asset object
    const asset = this.selectedAssetForm.getRawValue();
    // Create the product
    this._assetService.createAsset(asset).subscribe((newAsset) => {
      // Go to new product
      this.selectedAsset = newAsset;

      // Fill the form
      this.selectedAssetForm.patchValue(newAsset);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }); */
  }
  openDetail(ast: IAsset) {
    //OPen Detail dialog
    this._matDialog.open(AssetShortDetailComponent, { data: ast });
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

  // Check For Branch Code
  getBranchShortCode(obj: any) {
    return typeof obj === "object" ? obj.branchCode : "-";
  }

  //Get Current User
  getCurrentUser(ast: IAsset) {
    return "-";
  }
  getPrevUser(ast: IAsset) {
    return "-";
  }
}
