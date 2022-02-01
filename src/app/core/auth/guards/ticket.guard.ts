import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable({
   providedIn: "root",
})
export class TicketGuard implements CanActivate, CanLoad
{
   constructor(private _authService: AuthService) { }
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
      // let x = this._authService.checkTicket();
      // console.log(x)
      // return x
      return this._check();

   }
   private _check(): Observable<boolean>
   {

      this._authService.checkTicket().subscribe((x) =>
      {
         console.log(x)
      })
      return of(false)
   }
}
