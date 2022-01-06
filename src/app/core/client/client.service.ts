import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { IClient } from "./client.types";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private _baseUrl = environment.baseUrl;

  private _client: BehaviorSubject<IClient | null> = new BehaviorSubject<IClient | null>(null);
  private _clients: BehaviorSubject<IClient[] | null> = new BehaviorSubject<IClient[]>([]);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
  Getter For Clients
  */
  get clients$(): Observable<IClient[]> {
    return this._clients.asObservable();
  }

  /**
  Getter For Client
  */
  get client$(): Observable<IClient> {
    return this._client.asObservable();
  }

  /**
  Getter For Pagination
  */
  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }

  createClient(client: IClient): Observable<IClient> {
    delete client._id;
    return this.clients$.pipe(
      take(1),
      switchMap((clients) =>
        this._httpClient.post(`${this._baseUrl}/client`, client).pipe(
          map((newAsset: IDTO) => {
            this._clients.next([...clients, newAsset.data]);
            return newAsset.data;
          })
        )
      )
    );
  }
  /**
   * Update client
   *
   * @param _id
   * @param cli
   */
  updateClient(_id: string, cli: IClient): Observable<IClient> {
    delete cli._id;
    return this.clients$.pipe(
      take(1),
      switchMap((clients) =>
        this._httpClient.put<IClient>(`${this._baseUrl}/client/${_id}`, cli).pipe(
          map((updatedClient) => {
            // Find the index of the updated client
            const index = clients.findIndex((item) => item._id === _id);

            // Update the client
            clients[index] = updatedClient;

            // Update the clients
            this._clients.next(clients);

            // Return the updated client
            return updatedClient;
          }),
          switchMap((updatedClient) =>
            this.client$.pipe(
              take(1),
              filter((asmnt) => asmnt && asmnt._id === _id),
              tap(() => {
                // Update the client if it's selected
                this._client.next(updatedClient);

                // Return the updated client
                return updatedClient;
              })
            )
          )
        )
      )
    );
  }

  /**
   * @param page
   * @param limit
   * @param searchText
   * @param type
   * @param allocationStatus
   */
  getClients(
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    type: string = "",
    allocationStatus: string = ""
    // order: "asc" | "desc" | "" = "desc"
    // sort: string = "name"
  ): Observable<IDTO> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/client/paginate`, {
        params: {
          page: "" + page,
          limit: "" + limit,
          type: type,
          searchText: searchText,
          allocationStatus: allocationStatus,
          // order: order,
          // sort: sort,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._clients.next(response.data);
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

  getClientById(id: string): Observable<IClient> {
    return this._httpClient.get<IClient>(`${this._baseUrl}/client/${id}`).pipe(
      tap((response) => {
        this._client.next(response);
      })
    );
  }
}
