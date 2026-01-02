import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset } from "src/app/core/asset/asset.types";
import { IBranch } from "src/app/core/branch/branch.types";
import { isValid, isFuture, formatDistanceToNow } from "date-fns";
import { Router } from "@angular/router";
import { BasicService } from "src/app/core/basic/basic.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
import { Observable, of, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { PermissionService } from "src/app/core/auth/permission.service";

@Component({
   selector: "app-asset-short-detail",
   templateUrl: "./asset-short-detail.component.html",
   styleUrls: ["./asset-short-detail.component.scss"],
   encapsulation: ViewEncapsulation.None,
})
export class AssetShortDetailComponent implements OnInit, OnDestroy
{
   asset?: IAsset;
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   //Fetch Latest detail of Asset
   constructor(
      private _assetService: AssetService,
      @Inject(MAT_DIALOG_DATA) public data: IAsset,
      private matDialogRef: MatDialogRef<AssetShortDetailComponent>,
      private router: Router,
      private _basicService: BasicService,
      private _snackBar: MatSnackBar,
      private _confirmationService: RikielConfirmationService,
      private _permissionService: PermissionService
   ) { }

   ngOnInit(): void
   {
      //Get data From Server with ID
      this._assetService.getAssetById(this.data._id).pipe(takeUntil(this._unsubscribeAll)).subscribe((_) =>
      {
         this.asset = _;
      });
   }
   ngOnDestroy(): void
   {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }
   close()
   {
      this.matDialogRef.close();
   }

   getBranchName(branch: string | Partial<IBranch>): string
   {
      if (branch) return typeof branch === "object" ? branch.name : "-";
      return "NULL";
   }

   getAssetType(asset: IAsset)
   {
      // if(Object.k )
   }

   isDateFuture(dt: string)
   {
      return isValid(new Date(dt)) && isFuture(new Date(dt));
   }
   getBranchShortCode(branch: string | Partial<IBranch>): string
   {
      if (branch) return typeof branch === "object" ? branch.branchCode : "-";
      return "NULL";
   }
   deleteAsset()
   {
      const confirmation = this._confirmationService.open({
         title: "Delete Asset",
         message: "Are you sure you want to delete this asset? This action cannot be undone!",
         actions: {
            confirm: {
               label: "Delete",
            },
         },
      });

      confirmation.afterClosed().subscribe((res) =>
      {
         if (res == "confirmed")
            this._assetService.deleteAsset(this.asset._id).pipe(takeUntil(this._unsubscribeAll)).subscribe((_) =>
            {
               this.matDialogRef.close();
               this.openSnackBar("Success", "Asset Deleted!");
            });
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

   getPrevUser(asset: IAsset)
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
      this.canOpenUserDetails().pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         if (!val) return;
         if (asset.allocationToUserId && typeof asset.allocationToUserId == "object")
         {
            this.matDialogRef.close();
            this.router.navigate([`/user/${asset.allocationToUserId._id}`]);
         }
      })
   }

   getLogo(): string
   {
      return this._basicService.getAppropriateBrandLogo(this.asset.laptop?.system?.model ?? this.asset.type);
   }
   getProcessorLogo(): string
   {
      return this._basicService.getAppropriateCPULogo(this.asset.laptop.cpu.brand);
   }

   openSnackBar(type: "Error" | "Info" | "Success", msg: string)
   {
      this._snackBar.open(msg, "Close", {
         duration: 3000,
         verticalPosition: "top",
         horizontalPosition: "center",
         panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
      });
   }
   /**
    *
    * Font View Manipulators ------Permissions
    */
   canDelete(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset).pipe(
         switchMap(value =>
         {
            //User should be able to Delete only if He has full access
            if (value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canViewFullDetails(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Read ,Readwrite or full access
            if (value == AccessType.Read || value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
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

   openFullDetails()
   {
      if (this.asset && this.asset._id)
      {
         this.matDialogRef.close();
         this.router.navigate([`/asset/${this.asset._id}`]);
      }
   }
}
