import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { DepartmentService } from "./department.service";

@Injectable({
  providedIn: "root",
})
export class DepartmentResolver implements Resolve<any> {
  constructor(private _departmentService: DepartmentService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._departmentService.getDepartments();
  }
}

@Injectable({
  providedIn: "root",
})
export class EditDepartmentResolver implements Resolve<any> {
  constructor(private _departmentService: DepartmentService, private _router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._departmentService.clrDepartment();
    return forkJoin([
      this._departmentService.getDepartmentById(route.paramMap.get("id")).pipe(
        catchError(
          (error) => {
            console.error(error);
            const parentUrl = state.url.split("/").slice(0, -1).join("/");
            this._router.navigateByUrl(parentUrl);
            return throwError(error);
          }
        )
      ),
    ]);
  }
}
