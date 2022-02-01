import { Component, Input, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { IBranch } from "src/app/core/branch/branch.types";

@Component({
   selector: "app-branch-card",
   templateUrl: "./branch-card.component.html",
   styleUrls: ["./branch-card.component.scss"],
})
export class BranchCardComponent implements OnInit
{
   @Input() branch: IBranch;

   constructor(private _permissionService: PermissionService) { }

   ngOnInit(): void { }

   /**
 *
 * Font View Manipulators ------Permissions
 */

   canEdit(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Branch).pipe(
         switchMap(value =>
         {
            //User should be able to Edit only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
