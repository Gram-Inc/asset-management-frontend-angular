import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { ScannedAssetService } from "./scanned-asset.service";

@Injectable({
  providedIn: "root",
})
export class ScannedAssetResolver implements Resolve<any> {
  constructor(private _scannedAssetService: ScannedAssetService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._scannedAssetService.getScannedAssets();
  }
}
