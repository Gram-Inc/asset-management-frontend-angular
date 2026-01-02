import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { PermissionService } from "../permission.service";
import { IAuditPermissions } from "../permission.types";

@Injectable({
   providedIn: "root",
})
export class AuditGuard implements CanActivate
{
   constructor(
      private _authService: AuthService,
      private _permissionService: PermissionService,
      private _router: Router
   ) { }

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<boolean> | Promise<boolean> | boolean
   {
      return new Promise((resolve) =>
      {
         this._authService.check().subscribe((isAuthenticated) =>
         {
            if (!isAuthenticated)
            {
               this._router.navigateByUrl("sign-in");
               resolve(false);
               return;
            }

            const permission = route.data["permission"] as IAuditPermissions;
            if (permission)
            {
               const hasPermission = this._permissionService.checkPermission(
                  permission
               );
               if (!hasPermission)
               {
                  this._router.navigateByUrl("unauthorized");
                  resolve(false);
                  return;
               }
            }

            resolve(true);
         });
      });
   }
}
