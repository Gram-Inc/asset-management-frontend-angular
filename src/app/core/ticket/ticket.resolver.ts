import { Injectable } from "@angular/core";
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserService } from "../user/user.service";
import { TicketService } from "./ticket.service";

@Injectable({
  providedIn: "root",
})
export class TicketResolver implements Resolve<any> {
  constructor(private _ticketService: TicketService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._ticketService.clrTicket();
    return this._ticketService.getTickets();
  }
}

@Injectable({
  providedIn: "root",
})
export class CreateTicketResolver implements Resolve<any> {
  constructor(private _ticketService: TicketService, private _userService: UserService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._userService.getUsers()]);
  }
}

@Injectable({
  providedIn: "root",
})
export class EditTicketResolver implements Resolve<any> {
  constructor(
    private _ticketService: TicketService,
    private _router: Router,
    private _userService: UserService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._userService.getUsers(),
      this._ticketService.getTicketById(route.paramMap.get("id")).pipe(
        catchError(
          // Ticket with ID not found
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
