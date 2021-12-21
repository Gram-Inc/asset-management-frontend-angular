import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { BranchService } from "./branch.service";

@Injectable({
  providedIn: "root",
})
export class BranchResolver implements Resolve<any> {
  constructor(private _branchService: BranchService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._branchService.getBranchs();
  }
}
