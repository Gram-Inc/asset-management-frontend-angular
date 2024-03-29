import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthService } from "../auth.service";

@Injectable({
   providedIn: "root",
})
export class SettingGuard implements CanActivate
{
   constructor(private _authService: AuthService, private _router: Router) { }
   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
   {
      return this._check();
   }


   private _check(): Observable<boolean>
   {
      return this._authService.checkReport().pipe(switchMap(auth =>
      {
         if (auth) return of(true);
         this._router.navigate(["/unauthorized"]);
         return of(false);
      }));;
   }
}
