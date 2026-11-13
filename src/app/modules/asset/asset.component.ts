import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, UntypedFormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, combineLatest, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { ReportService } from "src/app/core/report/report.service";
import { UserService } from "src/app/core/user/user.service";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
import { AssetFilterComponent } from "../shared/asset-filter/asset-filter.component";

@Component({
   selector: "app-asset",
   templateUrl: "./asset.component.html",
   styleUrls: ["./asset.component.scss"],
   encapsulation: ViewEncapsulation.None,
})
export class AssetComponent implements OnInit, OnDestroy
{
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   assets$: Observable<IAsset[]>;
   types: string[];

   flashMessage: "success" | "error" | null = null;

   isLoading: boolean = false;
   searchCtrl: UntypedFormControl = new UntypedFormControl("");

   constructor(private _assetService: AssetService,
      private _permissionService: PermissionService,
      private _userService: UserService,
      private _reportService: ReportService,
      private _snackBar: MatSnackBar,) { }

   ngOnInit(): void
   {
      this.searchCtrl.valueChanges
         .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               this.isLoading = true;
               return this._assetService.getAssets(1, 10, query);
            }),
            map(() =>
            {
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
   ngOnDestroy(): void
   {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }

   /**
    *
    * Font View Manipulators ------Permissions
    */
   canExport(): Observable<boolean>
   {
      return combineLatest([
         this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset),
         this._userService.user$,
      ]).pipe(
         map(([value, user]) => this.canDownload(value, user?.role))
      );
   }

   exportCsv(): void
   {
      this._reportService.download("assets", {
         searchText: this.searchCtrl.value || "",
      }).subscribe({
         error: () => this._snackBar.open("Could not export assets", "Close", { duration: 3000 }),
      });
   }

   private canDownload(value: AccessType, role?: string): boolean
   {
      const canView = value == AccessType.Read || value == AccessType.ReadWrite || value == AccessType.FullAccess;
      return canView && (role == "level1" || role == "level2");
   }

   canCreateAsset(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
