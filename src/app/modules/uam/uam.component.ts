import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { UamService } from "src/app/core/uam/uam.service";
import { IUAM } from "src/app/core/uam/uam.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
@Component({
   selector: "app-uam",
   templateUrl: "./uam.component.html",
   styleUrls: ["./uam.component.scss"],
})
export class UamComponent implements OnInit, OnDestroy
{
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   uams$: Observable<IUAM[]>;
   types: string[];
   pagination: IPagination;
   selectedUAM: IUAM | null = null;
   flashMessage: "success" | "error" | null = null;

   isLoading: boolean = false;

   searchCtrl: FormControl = new FormControl("");

   constructor(private _uamService: UamService, private _permissionService: PermissionService) { }

   ngOnInit(): void
   {
      this.searchCtrl.valueChanges
         .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               return this._uamService.getUAMS(1, 10, query);
            }),
            map(() =>
            {
               this.isLoading = false;
            })
         )
         .subscribe();

      // Get the Assets
      this.uams$ = this._uamService.uams$;
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
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.UAM).pipe(
         switchMap(value =>
         {
            //User should be able to Export only if He has full access
            if (value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canCreate(): Observable<boolean>
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
