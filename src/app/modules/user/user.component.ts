import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
@Component({
   selector: "app-user",
   templateUrl: "./user.component.html",
   styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit, OnDestroy
{
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   users$: Observable<IUser[]>;
   types: string[];
   pagination: IPagination;
   flashMessage: "success" | "error" | null = null;

   isLoading: boolean = false;
   searchCtrl: UntypedFormControl = new UntypedFormControl("");

   constructor(private _userService: UserService, private _permissionService: PermissionService) { }

   ngOnInit(): void
   {
      this.searchCtrl.valueChanges
         .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               this.isLoading = true;
               return this._userService.getUsers(1, 10, query);
            }),
            map(() =>
            {
               this.isLoading = false;
            })
         )
         .subscribe();

      // Get the Assets
      this.users$ = this._userService.users$;
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
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.User).pipe(
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
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.User).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
