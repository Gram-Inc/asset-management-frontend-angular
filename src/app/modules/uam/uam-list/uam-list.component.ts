import
   {
      AfterViewInit,
      ChangeDetectorRef,
      Component,
      OnDestroy,
      OnInit,
      ViewChild,
      ViewEncapsulation,
   } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, Observable, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { UamService } from "src/app/core/uam/uam.service";
import { IUAM, IUserInformationUAM } from "src/app/core/uam/uam.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";

@Component({
   selector: "uam-list",
   templateUrl: "./uam-list.component.html",
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
export class UamListComponent implements OnInit, AfterViewInit, OnDestroy
{
   @ViewChild(MatPaginator) private _paginator: MatPaginator;
   @ViewChild(MatSort) private _sort: MatSort;

   private _unsubscribeAll: Subject<any> = new Subject<any>();
   uams$: Observable<IUAM[]>;
   types: string[];
   pagination: IPagination;
   selectedUAM: IUAM | null = null;
   flashMessage: "success" | "error" | null = null;

   selectedAssetForm: FormGroup;
   isLoading: boolean = false;
   searchCtrl: FormControl = new FormControl("");

   constructor(
      private _uamService: UamService,
      private _formBuilder: FormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _rikielConfirmationService: RikielConfirmationService,
      private _matDialog: MatDialog,
      private _permissionService: PermissionService
   ) { }

   ngOnInit(): void
   {
      // If Search value changes
      this.searchCtrl.valueChanges
         .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               this.isLoading = true;
               return this._uamService.getUAMS(1, 10, query);
            }),
            map(() =>
            {
               this.isLoading = false;
            })
         )
         .subscribe();

      // Get the Assets
      this.uams$ = this._uamService.uams$.pipe(takeUntil(this._unsubscribeAll));

      this._uamService.pagination$
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
                  return this._uamService.getUAMS(
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
      return item._id || index;
   }

   // Check For Branch Code
   getBranchShortCode(obj: any)
   {
      if (obj) return typeof obj === "object" ? obj.branchCode : "-";
      return "NULL";
   }

   displayFnCreatedBy(createdBy?: string | IUser)
   {
      if (createdBy && typeof createdBy == "object") return createdBy.firstName + " " + createdBy.lastName;
      return "-";
   }
   displayFnNoOfUser(userInformation: IUserInformationUAM)
   {
      if (!userInformation) return "";
      if (userInformation.users && userInformation.users.length > 1)
         return (
            userInformation.users[0].firstName +
            " " +
            userInformation.users[0].lastName +
            " + " +
            userInformation.users.length.toString()
         );
      return userInformation.users[0].firstName + " " + userInformation.users[0].lastName;
   }

   /**
*
* Font View Manipulators ------Permissions
*/

   canEdit(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.UAM).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
