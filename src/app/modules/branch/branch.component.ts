import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";

@Component({
   selector: "app-branch",
   templateUrl: "./branch.component.html",
   styleUrls: ["./branch.component.scss"],
})
export class BranchComponent implements OnInit
{
   branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();
   constructor(private _branchService: BranchService, private _permissionService: PermissionService) { }

   ngOnInit(): void
   {
      this.branchs$ = this._branchService.branchs$;
   }
   /**
  *
  * Font View Manipulators ------Permissions
  */
   canExport(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Ticket).pipe(
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
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Ticket).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
