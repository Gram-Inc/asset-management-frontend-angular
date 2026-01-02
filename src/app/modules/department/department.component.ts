import { Component, OnInit } from "@angular/core";
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
   constructor(private _departmentService: DepartmentService, private _permissionService: PermissionService) { }

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
}

