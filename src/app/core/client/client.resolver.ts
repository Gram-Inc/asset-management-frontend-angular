import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { ClientService } from "./client.service";

@Injectable({
  providedIn: "root",
})
export class ClientResolver implements Resolve<any> {
  constructor(private _clientService: ClientService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._clientService.getClients();
  }
}
