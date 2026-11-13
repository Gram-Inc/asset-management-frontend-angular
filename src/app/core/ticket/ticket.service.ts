import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, of, BehaviorSubject, throwError } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { ITicket, ITicketChat } from "./ticket.types";

@Injectable({
   providedIn: "root",
})
export class TicketService
{
   private _baseUrl = environment.baseUrl;

   private _ticket: ReplaySubject<ITicket> = new ReplaySubject<ITicket>(1);

   private _tickets: BehaviorSubject<ITicket[] | null> = new BehaviorSubject<ITicket[]>([]);
   private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

   constructor(private _httpClient: HttpClient) { }

   /**
    *   @param value
    **/
   set ticket(value: ITicket)
   {
      this._ticket.next(value);
   }

   get ticket$(): Observable<ITicket>
   {
      return this._ticket.asObservable();
   }

   get tickets$(): Observable<ITicket[]>
   {
      return this._tickets.asObservable();
   }

   get pagination$(): Observable<IPagination>
   {
      return this._pagination.asObservable();
   }

   clrTicket()
   {
      this._ticket.next(null);
   }

   getTickets(page: number = 1, limit: number = 10, searchText: string = "")
   {
      return this._httpClient
         .get<IDTO>(`${this._baseUrl}/ticketing/paginate`, {
            params: {
               searchText: searchText,
               limit: limit,
               page: page,
            },
         })
         .pipe(
            tap((response: IDTO) =>
            {
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
   createTicket(ticket: ITicket): Observable<ITicket>
   {
      delete ticket._id;
      return this.tickets$.pipe(
         take(1),
         switchMap((tickets) =>
            this._httpClient.post<IDTO>(`${this._baseUrl}/ticketing`, ticket).pipe(
               map((response) =>
               {
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
   updateTicket(_id: string, tik: ITicket): Observable<ITicket>
   {
      if (!_id)
      {
         return throwError(() => new Error('Ticket ID is missing.'));
      }
      const payload = this.toUpdatePayload(tik);
      return this._httpClient.put<IDTO>(`${this._baseUrl}/ticketing/${_id}`, payload).pipe(
         map((response) =>
         {
            const updatedTicket = (response?.data ?? response) as ITicket;
            if (updatedTicket && !updatedTicket._id)
            {
               updatedTicket._id = _id;
            }
            return updatedTicket;
         }),
         tap((updatedTicket) =>
         {
            const tickets = this._tickets.value || [];
            const index = tickets.findIndex((item) => item._id === _id);
            if (index > -1)
            {
               const next = tickets.slice();
               next[index] = updatedTicket;
               this._tickets.next(next);
            }
            this._ticket.next(updatedTicket);
         })
      );
   }

   /**
    * Fields the update API accepts. The caller’s ticket object is left unchanged,
    * including its _id. Populated user objects are reduced to an id string.
    */
   private toUpdatePayload(tik: ITicket): Partial<ITicket>
   {
      const idOf = (value: unknown): string | undefined =>
      {
         if (!value) return undefined;
         if (typeof value === 'string') return value || undefined;
         if (typeof value === 'object' && '_id' in (value as { _id?: string }))
         {
            const id = (value as { _id?: string })._id;
            return typeof id === 'string' && id ? id : undefined;
         }
         return undefined;
      };
      const payload: Partial<ITicket> = {};
      const assignedToUserId = idOf(tik?.assignedToUserId);
      if (assignedToUserId) payload.assignedToUserId = assignedToUserId;
      const assetId = idOf(tik?.assetId);
      if (assetId) payload.assetId = assetId;
      const fields: (keyof ITicket)[] = [
         'callMedium', 'natureOfCall', 'category', 'subCategory',
         'callStatus', 'priority', 'description', 'subject', 'closingDescription',
      ];
      for (const field of fields)
      {
         const value = tik?.[field];
         if (typeof value === 'string')
         {
            (payload as Record<string, string>)[field] = value;
         }
      }
      return payload;
   }



   getTicketById(id: string): Observable<ITicket>
   {
      if (!id)
      {
         return throwError(() => new Error('Ticket ID is missing.'));
      }
      return this._httpClient.get<IDTO>(`${this._baseUrl}/ticketing/${id}`).pipe(
         map((response) =>
         {
            this._ticket.next(response.data);
            return response.data;
         }), switchMap((ticket) =>
         {
            if (!ticket)
            {
               return throwError(
                  'Could not found Ticket with id of ' + id + '!'
               );
            }

            return of(ticket);
         })
      )
   }


   /**
    * Delete the Ticket
    *
    * @param _id
    */
   deleteTicket(_id: string): Observable<boolean>
   {
      return this.tickets$.pipe(
         take(1),
         switchMap((tickets) =>
            this._httpClient.delete(`${this._baseUrl}/ticketing/${_id}`).pipe(
               map((isDeleted: boolean) =>
               {
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
   getTicketChat(id: string): Observable<ITicketChat[]>
   {
      return this._httpClient.get<IDTO>(`${this._baseUrl}/ticketing-chat`, { params: { 'ticketId': id } }).pipe(map((response) =>
      {
         return response.data;
      }));
   }
   postTicketChatComment(data: { ticket: string, message: string }): Observable<any>
   {
      return this._httpClient.post<any>(`${this._baseUrl}/ticketing-chat/`, data);
   }
}
