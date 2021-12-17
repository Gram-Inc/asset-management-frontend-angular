import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AssetService } from "../asset/asset.service";
import { ClientService } from "../client/client.service";
import { UserService } from "../user/user.service";
import { AssignmentService } from "./assignment.service";

@Injectable({
  providedIn: "root",
})
export class AssignmentResolver implements Resolve<any> {
  constructor(
    private _assignmentService: AssignmentService,
    private _clientService: ClientService,
    private _userService: UserService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._clientService.getClients(),
      this._userService.getUsers(),
      this._assignmentService.getAssignments(),
    ]);
  }
}

@Injectable({
  providedIn: "root",
})
export class EditAssignmentResolver implements Resolve<any> {
  constructor(
    private _clientService: ClientService,
    private _userService: UserService,
    private _router: Router,
    private _assignmentService: AssignmentService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._clientService.getClients(),
      this._userService.getUsers(),
      this._assignmentService.getAssignmentById(route.paramMap.get("id")).pipe(
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
