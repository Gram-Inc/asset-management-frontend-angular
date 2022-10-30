import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../user/user.service';

@Injectable({
   providedIn: 'root'
})
export class ElseAdminGuard implements CanActivate
{
   constructor(private _router: Router, private _userService: UserService) { }
   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot)
   {
      //   Check if Role1 else navigate to Home
      console.log("here")
      return this._userService.user$.pipe(switchMap((x) =>
      {
         if (x.role != 'level1')
         {
            return of(true);
         } else
         {
            this._router.navigate(["dashboard"]);
            return of(false)
         }
      }));


   }
}
