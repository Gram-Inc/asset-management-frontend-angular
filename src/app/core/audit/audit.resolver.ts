import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IDTO } from "../dto/dto.types";
import { AuditService } from "./audit.service";
import { IAudit } from "./audit.types";
import { BranchService } from "../branch/branch.service";
import { DepartmentService } from "../department/department.service";
import { UserService } from "../user/user.service";

@Injectable({
  providedIn: "root",
})
export class AuditResolver implements Resolve<any> {
  constructor(private _auditService: AuditService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IDTO> {
    return this._auditService.getAuditsPaginated();
  }
}

@Injectable({
  providedIn: "root",
})
export class CreateAuditResolver implements Resolve<any> {
  constructor(
    private _auditService: AuditService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _userService: UserService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return forkJoin([
      this._branchService.getBranchs(),
      this._departmentService.getDepartments(),
      this._userService.getUsers(), // For Level 2 user assignment
    ]);
  }
}

@Injectable({
  providedIn: "root",
})
export class EditAuditResolver implements Resolve<any> {
  constructor(
    private _auditService: AuditService,
    private _router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get("id");
    if (!id) {
      const parentUrl = state.url.split("/").slice(0, -1).join("/");
      this._router.navigateByUrl(parentUrl);
      return throwError("Audit ID not provided");
    }

    return forkJoin([
      this._auditService.getAuditById(id),
      this._auditService.getAuditProgress(id),
    ]).pipe(
      catchError((error) => {
        const parentUrl = state.url.split("/").slice(0, -1).join("/");
        this._router.navigateByUrl(parentUrl);
        return throwError(error);
      })
    );
  }
}

@Injectable({
  providedIn: "root",
})
export class AuditDashboardResolver implements Resolve<any> {
  constructor(private _auditService: AuditService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return forkJoin([
      this._auditService.getAuditStatistics(),
      this._auditService.getDepartmentAuditHistory(),
    ]);
  }
}
