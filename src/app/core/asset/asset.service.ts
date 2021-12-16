import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, ReplaySubject, throwError } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IAsset, IPagination } from "./asset.types";

@Injectable({
  providedIn: "root",
})
export class AssetService {
  private _baseUrl = environment.baseUrl;

  private _assets: BehaviorSubject<IAsset[] | null> = new BehaviorSubject<IAsset[] | null>(null);
  private _asset: BehaviorSubject<IAsset | null> = new BehaviorSubject<IAsset | null>(null);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
  Getter For Assets
  */
  get assets$(): Observable<IAsset[]> {
    return this._assets.asObservable();
  }

  /**
  Getter For Pagination
  */
  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }

  /**
  Getter For Asset
  */
  get asset$(): Observable<IAsset> {
    return this._asset.asObservable();
  }

  clrAst() {
    this._asset.next(null);
  }

  // /**
  //  * @param page
  //  * @param size
  //  * @param search
  //  * @param order
  //  * @param sort
  //  */
  // getAssets(
  //   page: number = 0,
  //   size: number = 10,
  //   search: string = "",
  //   order: "asc" | "desc" | "" = "desc",
  //   sort: string = "name"
  // ): Observable<{ assets: Asset[]; pagination: AssetPagination }> {
  //   return this._httpClient
  //     .get<{ assets: Asset[]; pagination: AssetPagination }>(`${this._baseUrl}/assets`, {
  //       params: {
  //         page: "" + page,
  //         size: "" + size,
  //         search: search,
  //         order: order,
  //         sort: sort,
  //       },
  //     })
  //     .pipe(
  //       tap((response) => {
  //         this._assets.next(response.assets);
  //         this._pagination.next(response.pagination);
  //       })
  //     );
  // }

  createAsset(asset: IAsset): Observable<IAsset> {
    return this.assets$.pipe(
      take(1),
      switchMap((asts) =>
        this._httpClient.post(`${this._baseUrl}/asset`, asset).pipe(
          map((newAsset: IDTO) => {
            this._assets.next([...asts, newAsset.data]);
            return newAsset.data;
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
  getAssets(
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    type: string = "",
    allocationStatus: string = ""
    // order: "asc" | "desc" | "" = "desc"
    // sort: string = "name"
  ): Observable<IDTO> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/asset/paginate`, {
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
          this._assets.next(response.data);
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

  getAssetById(id: string): Observable<IAsset> {
    return this._assets.pipe(
      take(1),
      map((assets) => {
        const ast = assets.find((ast) => ast._id == id || null);

        this._asset.next(ast);

        return ast;
      }),
      switchMap((ast) => {
        if (!ast) {
          return throwError("Could not found task with id of " + id + "!");
        }

        return of(ast);
      })
    );
  }
}
