import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { VendorService } from "./vendor.service";

@Injectable({
  providedIn: "root",
})
export class VendorResolver implements Resolve<any> {
  constructor(private _vendorService: VendorService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._vendorService.getVendors();
  }
}

@Injectable({
  providedIn: "root",
})
export class EditVendorResolver implements Resolve<any> {
  constructor(private _vendorService: VendorService, private _router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._vendorService.clrVendor();
    return forkJoin([
      this._vendorService.getVendorById(route.paramMap.get("id")).pipe(
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
