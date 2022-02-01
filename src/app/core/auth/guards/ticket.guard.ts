import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthService } from "../auth.service";

@Injectable({
   providedIn: "root",
})
export class TicketGuard implements CanActivate, CanLoad
{
   constructor(private _authService: AuthService, private _router: Router) { }
   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
   {
      return this._check();
   }

   canLoad(
      route: Route,
      segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
   {
      return this._check();

   }
   private _check(): Observable<boolean>
   {
      return this._authService.checkTicket().pipe(switchMap(auth =>
      {
         if (auth) return of(true);
         this._router.navigate(["/error/401"]);
         return of(false);
      }));
   }
}
