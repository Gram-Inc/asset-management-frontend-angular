import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { IUser } from "../user/user.types";

@Injectable({
  providedIn: "root",
})
export class AutoCompleteService {
  private _baseUrl = environment.baseUrl;

  private _modelNames: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private _processors: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private _os: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private _categories: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private _requesters: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);

  get modelNames() {
    return this._modelNames.asObservable();
  }
  get processors() {
    return this._processors.asObservable();
  }
  get os() {
    return this._os.asObservable();
  }

  get categories() {
    return this._categories.asObservable();
  }

  get requesters() {
    return this._requesters.asObservable();
  }
  constructor(private _httpClient: HttpClient) {}

  getModelNames(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/auto-complete/asset/name`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._modelNames.next(response.data);
        })
      );
  }

  getProcessors(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/auto-complete/asset/processor`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._processors.next(response.data);
        })
      );
  }
  getOSs(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/auto-complete/asset/operatingSystem`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._os.next(response.data);
        })
      );
  }

  //Get Categories for Ticket
  getCategories(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/auto-complete/ticket/category`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._categories.next(response.data);
        })
      );
  }

  //Get Requesters for Ticket
  getRequesters(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/users/paginate`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._requesters.next(response.data);
        })
      );
  }
}
