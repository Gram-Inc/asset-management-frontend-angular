import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, of, BehaviorSubject, throwError } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { ITicket } from "./ticket.types";

@Injectable({
  providedIn: "root",
})
export class TicketService {
  private _baseUrl = environment.baseUrl;

  private _ticket: ReplaySubject<ITicket> = new ReplaySubject<ITicket>(1);

  private _tickets: BehaviorSubject<ITicket[] | null> = new BehaviorSubject<ITicket[]>([]);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
   *   @param value
   **/
  set ticket(value: ITicket) {
    this._ticket.next(value);
  }

  get ticket$(): Observable<ITicket> {
    return this._ticket.asObservable();
  }

  get tickets$(): Observable<ITicket[]> {
    return this._tickets.asObservable();
  }

  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }

  clrTicket() {
    this._ticket.next(null);
  }

  getTickets(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/ticketing/paginate`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._tickets.next(response.data);

          let _pg: IPagination = {
            limit: response.limit,
            page: response.page - 1, //@badalkhatri
            totalPage: response.totalPage,
            totalData: response.totaldata,
          };
          this._pagination.next(_pg);
        })
      );
  }

  /**
   * Create ticket
   *
   * @param ticket
   */
  createTicket(ticket: ITicket): Observable<ITicket> {
    delete ticket._id;
    return this.tickets$.pipe(
      take(1),
      switchMap((tickets) =>
        this._httpClient.post<IDTO>(`${this._baseUrl}/ticketing`, ticket).pipe(
          map((response) => {
            // Update the ticket with the new tag
            this._tickets.next([...tickets, response.data]);
            // Return new ticket from observable
            return response.data;
          })
        )
      )
    );
  }

  /**
   * Update ticket
   *
   * @param _id
   * @param tik
   */
  updateTicket(_id: string, tik: ITicket): Observable<ITicket> {
    delete tik._id;
    return this.tickets$.pipe(
      take(1),
      switchMap((tickets) =>
        this._httpClient.put<ITicket>(`${this._baseUrl}/ticketing/${_id}`, tik).pipe(
          map((updatedTicket) => {
            // Find the index of the updated ticket
            const index = tickets.findIndex((item) => item._id === _id);

            // Update the ticket
            tickets[index] = updatedTicket;

            // Update the tickets
            this._tickets.next(tickets);

            // Return the updated ticket
            return updatedTicket;
          }),
          switchMap((updatedTicket) =>
            this.ticket$.pipe(
              take(1),
              filter((tic) => tic && tic._id === _id),
              tap(() => {
                // Update the ticket if it's selected
                this._ticket.next(updatedTicket);

                // Return the updated ticket
                return updatedTicket;
              })
            )
          )
        )
      )
    );
  }

  getTicketById(id: string): Observable<ITicket> {
    return this._tickets.pipe(
      take(1),
      map((tickets) => {
        const tik = tickets.find((usr) => usr._id == id || null);

        this._ticket.next(tik); // Change this

        return tik;
      }),
      switchMap((tik) => {
        if (!tik) {
          return throwError("Could not found ticket with id of " + id + "!");
        }

        return of(tik);
      })
    );
  }

  /**
   * Delete the Ticket
   *
   * @param _id
   */
  deleteTicket(_id: string): Observable<boolean> {
    return this.tickets$.pipe(
      take(1),
      switchMap((tickets) =>
        this._httpClient.delete(`${this._baseUrl}/ticketing/${_id}`).pipe(
          map((isDeleted: boolean) => {
            // Find the index of the deleted ticket
            const index = tickets.findIndex((item) => item._id === _id);

            // Delete the ticket
            tickets.splice(index, 1);

            // Update the tickets
            this._tickets.next(tickets);

            // Return the deleted status
            return isDeleted;
          })
        )
      )
    );
  }
}
