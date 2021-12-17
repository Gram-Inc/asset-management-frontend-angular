import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IDashboard } from "./dashboard.types";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private _baseUrl = environment.baseUrl;

  private _dashboard: BehaviorSubject<IDashboard | null> = new BehaviorSubject<IDashboard | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
  Getter For Asset
  */
  get dashboard$(): Observable<IDashboard> {
    return this._dashboard.asObservable();
  }

  getDashboardData(): Observable<any> {
    return this._httpClient.get<IDTO>(`${this._baseUrl}/dashboard`).pipe(
      tap((response: IDTO) => {
        this._dashboard.next(response.data);
      })
    );
  }
}
