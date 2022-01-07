import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { BranchService } from "../branch/branch.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class UserResolver implements Resolve<any> {
  constructor(private _userSerive: UserService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._userSerive.clrAst();
    return this._userSerive.getUsers();
  }
}

@Injectable({
  providedIn: "root",
})
export class CreateUserResolver implements Resolve<any> {
  constructor(private _userService: UserService, private _branchService: BranchService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._branchService.getBranchs()]);
  }
}

@Injectable({
  providedIn: "root",
})
export class EditUserResolver implements Resolve<any> {
  constructor(private _userService: UserService, private _router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._userService.getUserById(route.paramMap.get("id")).pipe(
        catchError(
          // Usr with ID not found
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
