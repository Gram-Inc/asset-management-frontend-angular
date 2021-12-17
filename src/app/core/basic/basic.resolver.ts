import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of } from "rxjs";
import { BasicService } from "./basic.service";

@Injectable({
  providedIn: "root",
})
export class BasicResolver implements Resolve<any> {
  constructor(private basicService: BasicService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this.basicService.getAMCs(),
      this.basicService.getBrands(),
      this.basicService.getProducts(),
      this.basicService.getWarranties(),
    ]);
  }
}
