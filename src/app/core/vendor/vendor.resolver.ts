import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
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
