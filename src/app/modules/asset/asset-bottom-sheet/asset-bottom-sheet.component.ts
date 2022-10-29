import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { isFuture, isValid } from "date-fns";
import { Observable, Subject } from "rxjs";
import { AssetService } from "src/app/core/asset/asset.service";
import { AllocationStatus, IAsset } from "src/app/core/asset/asset.types";
import { IBranch } from "src/app/core/branch/branch.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";
import { debounceTime, map, startWith, switchMap, takeUntil } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
   selector: "app-asset-bottom-sheet",
   templateUrl: "./asset-bottom-sheet.component.html",
   styleUrls: ["./asset-bottom-sheet.component.scss"],
})
export class AssetBottomSheetComponent implements OnInit, OnDestroy
{
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   AllocationStatus = AllocationStatus;
   users$: Observable<IUser[]> = new Observable<IUser[]>();
   asset: IAsset;
   searchCtrl: FormControl = new FormControl("", [Validators.required]);
   filteredUsers: Observable<IUser[]>;
   selectedUser: IUser = null;
   constructor(
      private _assetService: AssetService,
      private _userService: UserService,
      private _bottomSheetRef: MatBottomSheetRef<AssetBottomSheetComponent>,
      @Inject(MAT_BOTTOM_SHEET_DATA) public data: IAsset,
      private _snackBar: MatSnackBar,
      private router: Router
   ) { }

   ngOnInit(): void
   {
      this.users$ = this._userService.users$.pipe(takeUntil(this._unsubscribeAll));

      this.asset = { ...this.data };

      //
      this.searchCtrl.valueChanges
         .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               return this._userService.getUsers(1, 10, query);
            }),
            map(() => { })
         )
         .subscribe();

      this.asset.allocationStatus == AllocationStatus.ASSIGNED
         ? this.searchCtrl.enable()
         : this.searchCtrl.disable();
   }
   ngOnDestroy(): void
   {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }

   isDateFuture(date)
   {
      if (isValid(date)) return isFuture(date);
      return false;
   }
   getBranchShortCode(branch: string | Partial<IBranch>): string
   {
      if (branch) return typeof branch === "object" ? branch.name : "-";
      return "NULL";
   }
   getBranchName(branch: string | Partial<IBranch>): string
   {
      if (branch) return typeof branch === "object" ? branch.name : "-";
      return "NULL";
   }
   updateAllocation()
   {
      //Check validation only if status Assigned is selected
      if (this.asset.allocationStatus == AllocationStatus.ASSIGNED)
      {
         this.searchCtrl.markAllAsTouched();
         //Validate User Control
         if (this.searchCtrl.valid && typeof this.searchCtrl.value == "object")
         {
            //Update the Asset

            this._assetService.assignAssetToUser(this.asset._id, this.searchCtrl.value["_id"]).subscribe(
               (_) =>
               {
                  this.openSnackBar("Success", "Action completed !");
                  this._bottomSheetRef.dismiss();
               },
               (err) =>
               {
                  this.openSnackBar("Error", err.message);
               }
            );
         } else
         {
            this.searchCtrl.setErrors({ isValid: false });
         }
      }
      //else other option
      else
      {
         //Remove allocationtoUserID section
         delete this.asset.allocationToUserId;
         this._assetService.changeAllocationStatus(this.asset._id, this.asset.allocationStatus).subscribe(
            (_) =>
            {
               this.openSnackBar("Success", "Action completed !");
               this._bottomSheetRef.dismiss();
            },
            (err) =>
            {
               this.openSnackBar("Error", err.message);
            }
         );
      }
   }

   isAssetEdited(): boolean
   {
      return (
         JSON.stringify(this.asset) != JSON.stringify(this.data) ||
         this.asset.allocationStatus == AllocationStatus.ASSIGNED
      );
   }

   displayFn(user: IUser): string
   {
      return user && user.firstName ? user.firstName + " " + user.lastName : "";
   }
   // Filter for Autocomplete Model Name Feature

   openSnackBar(type: "Error" | "Info" | "Success", msg: string)
   {
      this._snackBar.open(msg, "Close", {
         duration: 3000,
         verticalPosition: "top",
         horizontalPosition: "center",
         panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
      });
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

   openCurrentUser(asset: IAsset)
   {
      if (asset.allocationToUserId && typeof asset.allocationToUserId == "object")
         this.router.navigate([`/user/${asset.allocationToUserId._id}`]);
   }
}
