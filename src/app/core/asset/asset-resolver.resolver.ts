import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { BranchService } from "../branch/branch.service";
import { IDTO } from "../dto/dto.types";
import { VendorService } from "../vendor/vendor.service";
import { AssetService } from "./asset.service";
import { IAsset } from "./asset.types";

@Injectable({
   providedIn: "root",
})
export class AssetResolver implements Resolve<any> {
   constructor(private _assetService: AssetService) { }
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDTO>
   {
      this._assetService.clrAst();
      return this._assetService.getAssets();
   }
}

@Injectable({
   providedIn: "root",
})
export class CreateAssetResolver implements Resolve<any> {
   constructor(
      private _assetService: AssetService,
      private _vendorService: VendorService,
      private _branchService: BranchService
   ) { }
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
   {
      return forkJoin([
         this._vendorService.getVendors(),
         this._branchService.getBranchs(),
         this._assetService.getAssetTyes(),
      ]);
   }

} @Injectable({
   providedIn: "root",
})
export class ClrSelectedAsset implements Resolve<any> {
   constructor(
      private _assetService: AssetService,
   ) { }
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
   {
      this._assetService.clrAst()
      return of(true)
   }
}

@Injectable({
   providedIn: "root",
})
export class EditAssetResolver implements Resolve<any> {
   constructor(
      private _assetService: AssetService,
      private _router: Router,
      private _vendorService: VendorService
   ) { }
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
   {
      return forkJoin([
         this._vendorService.getVendors(),
         this._assetService.getAssetTyes(),
         this._assetService.getAssets(),
         this._assetService.getAssetById(route.paramMap.get("id")).pipe(
            catchError(
               // Asset with ID not found
               (error) =>
               {
                  // Log the error
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
