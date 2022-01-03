import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
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

@Injectable({
  providedIn: "root",
})
export class EditBranchResolver implements Resolve<any> {
  constructor(private _branchService: BranchService, private _router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._branchService.clrBranch();
    return forkJoin([
      this._branchService.getBranchById(route.paramMap.get("id")).pipe(
        catchError(
          //   ID not found
          (error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split("/").slice(0, -1).join("/");

            // Navigate to there
            this._router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
          }
        )
      ),
    ]);
  }
}
