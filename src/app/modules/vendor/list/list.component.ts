import
{
   AfterViewInit,
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   OnDestroy,
   OnInit,
   ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { merge, Observable, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { VendorService } from "src/app/core/vendor/vendor.service";
import { IVendor } from "src/app/core/vendor/vendor.types";

@Component({
   selector: "vendor-list",
   templateUrl: "./list.component.html",
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy
{
   @ViewChild(MatPaginator) private _paginator: MatPaginator;
   @ViewChild(MatSort) private _sort: MatSort;

   private _unsubscribeAll: Subject<any> = new Subject<any>();
   vendors$: Observable<IVendor[]>;
   types: string[];
   pagination: IPagination;
   isLoading: boolean = false;

   constructor(
      private _formBuilder: FormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _matDialog: MatDialog,
      private router: Router,
      private _vendorService: VendorService,
      private _permissionService: PermissionService
   ) { }

   ngOnInit(): void
   {
      // Get the Assets
      this.vendors$ = this._vendorService.vendors$;

      this._vendorService.pagination$
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((paginationResponse: IPagination) => (this.pagination = paginationResponse));
   }

   ngAfterViewInit(): void
   {
      if (this._sort && this._paginator)
      {
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
                  return this._vendorService.getVendors(
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
   createAsset(): void { }
   openDetail(vendor: IVendor)
   {
      //OPen Detail Page
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

   canEdit()
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Vendor).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
