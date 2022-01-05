import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { IVendor } from "./vendor.types";

@Injectable({
  providedIn: "root",
})
export class VendorService {
  private _baseUrl = environment.baseUrl;

  private _vendor: BehaviorSubject<IVendor | null> = new BehaviorSubject<IVendor | null>(null);
  private _vendors: BehaviorSubject<IVendor[] | null> = new BehaviorSubject<IVendor[] | null>(null);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
  Getter For Vendors
  */
  get vendors$(): Observable<IVendor[]> {
    return this._vendors.asObservable();
  }

  /**
  Getter For Vendor
  */
  get vendor$(): Observable<IVendor> {
    return this._vendor.asObservable();
  }

  /**
  Getter For Pagination
  */
  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }

  clrVendor() {
    this._vendor.next(null);
  }
  createVendor(vendor: IVendor): Observable<IVendor> {
    return this.vendors$.pipe(
      take(1),
      switchMap((vendors) =>
        this._httpClient.post(`${this._baseUrl}/vendor`, vendor).pipe(
          map((newVendor: IDTO) => {
            this._vendors.next([...vendors, newVendor.data]);
            return newVendor.data;
          })
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
  getVendors(
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    type: string = "",
    allocationStatus: string = ""
    // order: "asc" | "desc" | "" = "desc"
    // sort: string = "name"
  ): Observable<IDTO> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/vendor/paginate`, {
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
          this._vendors.next(response.data);
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

  getVendorById(id: string): Observable<IVendor> {
    return this._httpClient.get<IVendor>(`${this._baseUrl}/vendor/${id}`).pipe(
      tap((response) => {
        this._vendor.next(response);
      })
    );
  }

  /**
   * Update vendor
   *
   * @param _id
   * @param vendor
   */
  updateVendor(_id: string, vendor: IVendor): Observable<any> {
    delete vendor._id;
    return this.vendors$.pipe(
      take(1),
      switchMap((vendors) =>
        this._httpClient.put<IVendor>(`${this._baseUrl}/vendor/${_id}`, vendor).pipe(
          map((updatedVendor) => {
            // Find the index of the updated vendor
            const index = vendors.findIndex((brn) => brn._id === _id);

            // Update the vendor
            vendors[index] = updatedVendor;

            this._vendors.next(vendors);

            // Return the updated
            return updatedVendor;
          }),
          switchMap((updatedVendor) =>
            this.vendor$.pipe(
              take(1),
              filter((brn) => brn && brn._id === _id),
              tap(() => {
                // Update the vendor if it's selected
                this._vendor.next(updatedVendor);

                // Return the updated vendor
                return updatedVendor;
              })
            )
          )
        )
      )
    );
  }
}
