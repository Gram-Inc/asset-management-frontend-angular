import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";

@Component({
   selector: "app-department",
   templateUrl: "./department.component.html",
   styleUrls: ["./department.component.scss"],
})
export class DepartmentComponent implements OnInit {
   departments$: Observable<IDepartment[]> = new Observable<IDepartment[]>();
   constructor(
      private _departmentService: DepartmentService,
      private _permissionService: PermissionService,
      private _snackBar: MatSnackBar
   ) { }

   ngOnInit(): void {
      this.departments$ = this._departmentService.departments$;
   }
   /**
  * Font View Manipulators ------Permissions
  */
   canExport(): Observable<boolean> {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Department).pipe(
         switchMap(value => {
            //User should be able to Export only if He has full access
            if (value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canCreate(): Observable<boolean> {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Department).pipe(
         switchMap(value => {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canEdit(): Observable<boolean> {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Department).pipe(
         switchMap(value => {
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   canDelete(): Observable<boolean> {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Department).pipe(
         switchMap(value => {
            if (value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }

   deleteDepartment(department: IDepartment) {
      if (confirm("Are you sure you want to delete this department?")) {
         this._departmentService.deleteDepartment(department._id).subscribe(
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

