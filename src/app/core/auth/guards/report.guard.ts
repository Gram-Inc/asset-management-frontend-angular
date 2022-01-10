import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: "root",
})
export class ReportGuard implements CanActivate {
  constructor(private _authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._check();
  }

  private _check(): Observable<boolean> {
    return this._authService.checkReport();
  }
}
