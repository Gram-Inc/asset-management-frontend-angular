import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserService } from "../user/user.service";
import { UamService } from "./uam.service";

@Injectable({
  providedIn: "root",
})
export class UamResolver implements Resolve<any> {
  constructor(private _uamService: UamService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._uamService.getUAMS();
  }
}

@Injectable({
  providedIn: "root",
})
export class CreateUAMResolver implements Resolve<any> {
  constructor(private _userService: UserService, private _uamService: UamService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._userService.getUsers()]);
  }
}

@Injectable({
  providedIn: "root",
})
export class EditUAMResolver implements Resolve<any> {
  constructor(private _uamService: UamService, private _router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._uamService.getUAMById(route.paramMap.get("id")).pipe(
        catchError(
          // Asset with ID not found
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
