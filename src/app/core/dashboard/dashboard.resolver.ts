import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { DashboardService } from "./dashboard.service";

@Injectable({
  providedIn: "root",
})
export class DashboardResolver implements Resolve<any> {
  constructor(private _dashboardService: DashboardService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._dashboardService.getDashboardData();
  }
}
