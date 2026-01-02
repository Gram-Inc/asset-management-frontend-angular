import { Component, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";

@Component({
   selector: "app-department-card",
   templateUrl: "./department-card.component.html",
   styleUrls: ["./department-card.component.scss"],
})
export class DepartmentCardComponent implements OnInit
{
   @Input() department: IDepartment;

   constructor(
      private _permissionService: PermissionService,
      private _departmentService: DepartmentService,
      private _snackBar: MatSnackBar,
      private _router: Router
   ) { }

   ngOnInit(): void { }

   /**
 *
 * Font View Manipulators ------Permissions
 */

   canEdit(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Department).pipe(
         switchMap(value =>
         {
            //User should be able to Edit only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canDelete(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Department).pipe(
         switchMap(value =>
         {
            //User should be able to Delete only if He has full access
            if (value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   deleteDepartment() {
      if (confirm("Are you sure you want to delete this department?")) {
         this._departmentService.deleteDepartment(this.department._id).subscribe(
            (_) => {
               this.openSnackBar("Success", "Department Deleted");
            },
            (err) => {
               this.openSnackBar("Error", err.message);
            }
         );
      }
   }

   openSnackBar(type: "Error" | "Info" | "Success", msg: string) {
      this._snackBar.open(msg, "Close", {
         duration: 3000,
         verticalPosition: "top",
         horizontalPosition: "center",
         panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
      });
   }
}
