import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IProduct } from "./basic.types";

@Injectable({
  providedIn: "root",
})
export class BasicService {
  private baseUrl = environment.baseUrl;
  private _category: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _products: BehaviorSubject<IProduct[] | null> = new BehaviorSubject<IProduct[] | null>(null);
  private _warranties: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _amc: BehaviorSubject<any[] | null> = new BehaviorSubject<any | null>(null);
  private _brand: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);

  constructor(private _httpClient: HttpClient) {}

  get products$(): Observable<IProduct[]> {
    return this._products.asObservable();
  }
  get warranties$(): Observable<any[]> {
    return this._warranties.asObservable();
  }
  get _amcs$(): Observable<any[]> {
    return this._amc.asObservable();
  }
  get brands$(): Observable<any[]> {
    return this._brand.asObservable();
  }

  /**
   * @param search
   */
  getProducts(search: string = ""): Observable<IDTO> {
    return this._httpClient
      .get<IDTO>(`${this.baseUrl}/product`, {
        params: { search: search },
      })
      .pipe(tap((response: IDTO) => this._products.next(response.data)));
  }
  /**
   * @param search
   */
  getWarranties(search: string = "") {
    return this._httpClient
      .get(`${this.baseUrl}/warranty`, { params: { search: search } })
      .pipe(tap((response: IDTO) => this._warranties.next(response.data)));
  }

  /**
   * @param search
   */
  getAMCs(search: string = "") {
    return this._httpClient
      .get(`${this.baseUrl}/amc`, { params: { search: search } })
      .pipe(tap((response: IDTO) => this._amc.next(response.data)));
  }

  /**
   * @param search
   */
  getBrands(search: string = "") {
    return this._httpClient
      .get(`${this.baseUrl}/brands`, { params: { search: search } })
      .pipe(tap((response: IDTO) => this._brand.next(response.data)));
  }
}
