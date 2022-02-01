import
{
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
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { merge, Observable, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { BasicService } from "src/app/core/basic/basic.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { QrService } from "src/app/core/qr/qr.service";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
import { AssetShortDetailComponent } from "../../shared/asset-short-detail/asset-short-detail.component";
import { AssetBottomSheetComponent } from "../asset-bottom-sheet/asset-bottom-sheet.component";
import { AssetDetailComponent } from "../details/details.component";

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
export class AssetListComponent implements OnInit, AfterViewInit, OnDestroy
{
   @ViewChild(MatPaginator) private _paginator: MatPaginator;
   @ViewChild(MatSort) private _sort: MatSort;

   // Module type to check for Permssions in LIST
   moduleType = ModuleTypes.Asset;
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   assets$: Observable<IAsset[]>;
   types: string[];
   pagination: IPagination;
   selectedAsset: IAsset | null = null;
   flashMessage: "success" | "error" | null = null;

   isLoading: boolean = false;

   constructor(
      private _assetService: AssetService,
      private _formBuilder: FormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _rikielConfirmationService: RikielConfirmationService,
      private _matDialog: MatDialog,
      private _qrService: QrService,
      private _bottomSheet: MatBottomSheet,
      private router: Router,
      private _basicService: BasicService,
      public _permissionService: PermissionService,
      private _snackBar: MatSnackBar
   ) { }

   ngOnInit(): void
   {
      // Get the Assets
      this.assets$ = this._assetService.assets$;

      this._assetService.pagination$
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((paginationResponse: IPagination) => (this.pagination = paginationResponse));
   }

   ngAfterViewInit(): void
   {
      if (this._sort && this._paginator)
      {
         // Set the initial sort
         /* this._sort.sort({
           id: "name",
           start: "asc",
           disableClear: true,
         }); */

         // Mark for check
         this._changeDetectorRef.markForCheck();

         // If the user changes the sort order...
         this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() =>
         {
            // Reset back to the first page
            this._paginator.pageIndex = 0;
         });

         // Get products if sort or page changes
         merge(this._sort.sortChange, this._paginator.page)
            .pipe(
               switchMap(() =>
               {
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
               map(() =>
               {
                  this.isLoading = false;
               })
            )
            .subscribe();
      }
   }
   /**
    * On destroy
    */
   ngOnDestroy(): void
   {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }

   /**
    * Create Asset
    */
   createAsset(): void
   {
      this._matDialog.open(AssetDetailComponent, {
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
   openDetail(ast: IAsset)
   {
      //OPen Detail dialog
      this._matDialog.open(AssetShortDetailComponent, { data: ast });
   }
   /**
    * Show flash message
    */
   showFlashMessage(type: "success" | "error"): void
   {
      // Show the message
      this.flashMessage = type;

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // Hide it after 3 seconds
      setTimeout(() =>
      {
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
   trackByFn(index: number, item: any): any
   {
      if (item) return item._id || index;
   }

   // Check For Branch Code
   getBranchShortCode(obj: any)
   {
      if (obj) return typeof obj === "object" ? obj.branchCode : "-";
      return "NULL";
   }

   assignToUser(ast)
   {
      this._bottomSheet.open(AssetBottomSheetComponent, { data: { ...ast } });
   }
   edit(ast) { }
   printQR(ast: IAsset)
   {
      this._qrService.printQR(ast._id ?? "");
   }

   getCurrentUser(asset: IAsset)
   {
      if (asset.allocationToUserId && typeof asset.allocationToUserId == "object")
      {
         if (asset.allocationToUserId.firstName.toUpperCase() == asset.allocationToUserId.lastName.toUpperCase())
            return asset.allocationToUserId.firstName;
         return asset.allocationToUserId.firstName + " " + asset.allocationToUserId.lastName;
      }
      return "-";
   }

   getPrevUser(asset: IAsset)
   {
      if (asset.perviousUser && typeof asset.perviousUser == "object")
      {
         if (asset.perviousUser.firstName.toUpperCase() == asset.perviousUser.lastName.toUpperCase())
            return asset.perviousUser.firstName;
         return asset.perviousUser.firstName + " " + asset.perviousUser.lastName;
      }
      return "-";
   }

   openCurrentUser(asset: IAsset)
   {
      this.canOpenUserDetails().pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         if (!val) return;
         if (asset.allocationToUserId && typeof asset.allocationToUserId == "object")
            this.router.navigate([`/user/${asset.allocationToUserId._id}`]);
      })
   }
   openPrevUser(asset: IAsset)
   {
      this.canOpenUserDetails().pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         if (!val) return;
         if (asset.perviousUser && typeof asset.perviousUser == "object")
            this.router.navigate([`/user/${asset.perviousUser._id}`]);
      })
   }
   getLogo(asset): string
   {
      return this._basicService.getAppropriateBrandLogo(asset.name);
   }

   /**
    *
    * Font View Manipulators ------Permissions
    */
   canChangeStatus(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset).pipe(
         switchMap(value =>
         {
            //User should be able to change status only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canEditAsset(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset).pipe(
         switchMap(value =>
         {
            //User should be able to change status only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
   canOpenUserDetails()
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.User).pipe(
         switchMap(value =>
         {
            //Block Navigation if noAccess
            if (value == AccessType.NoAcess)
            {
               this._snackBar.open('You dont have enough permission !')._dismissAfter(4000);
               return of(false);
            }
            return of(true);
         })
      );
   }
}
