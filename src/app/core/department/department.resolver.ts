import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
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
