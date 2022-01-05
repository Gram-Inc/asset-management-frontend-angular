import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, ReplaySubject, throwError } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IAsset, IAssetTypes, IPagination } from "./asset.types";

@Injectable({
  providedIn: "root",
})
export class AssetService {
  private _baseUrl = environment.baseUrl;

  private _assets: BehaviorSubject<IAsset[] | null> = new BehaviorSubject<IAsset[] | null>(null);
  private _asset: BehaviorSubject<IAsset | null> = new BehaviorSubject<IAsset | null>(null);
  private _assetTypes: BehaviorSubject<IAssetTypes | null> = new BehaviorSubject<IAssetTypes | null>(null);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
  Getter For Assets
  */
  get assets$(): Observable<IAsset[]> {
    return this._assets.asObservable();
  }

  /**
  Getter For Assets Types
  */
  get assetTypes$(): Observable<IAssetTypes> {
    return this._assetTypes.asObservable();
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
    allocationStatus: string = "",
    order: "asc" | "desc" | "" = "desc",
    sort: string = "name"
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

  assignAssetToUser(assetId: string, userId: string): Observable<IAsset> {
    return this.assets$.pipe(
      take(1),
      switchMap((assets) =>
        this._httpClient.put<IAsset>(`${this._baseUrl}/asset/${assetId}/user/${userId}`, "").pipe(
          map((updatedAsset) => {
            // Find the index of the updated asset
            const index = assets.findIndex((ast) => ast._id === assetId);

            // Update the asset
            assets[index] = updatedAsset;

            // Update the assets
            this._assets.next(assets);

            // Return the updated asset
            return updatedAsset;
          }),
          switchMap((updatedAsset) =>
            this.asset$.pipe(
              take(1),
              filter((item) => item && item._id === assetId),
              tap(() => {
                // Update the asset if it's selected
                this._asset.next(updatedAsset);

                // Return the updated asset
                return updatedAsset;
              })
            )
          )
        )
      )
    );
  }

  /**
   * Update product
   *
   * @param _id
   * @param asset
   */
  updateAsset(_id: string, asset: IAsset): Observable<any> {
    return this.assets$.pipe(
      take(1),
      switchMap((assets) =>
        this._httpClient.put<IAsset>(`${this._baseUrl}/asset/${_id}`, asset).pipe(
          map((updatedAsset) => {
            // Find the index of the updated asset
            const index = assets.findIndex((ast) => ast._id === _id);

            // Update the asset
            assets[index] = updatedAsset;

            // Update the assets
            this._assets.next(assets);

            // Return the updated asset
            return updatedAsset;
          }),
          switchMap((updatedAsset) =>
            this.asset$.pipe(
              take(1),
              filter((item) => item && item._id === _id),
              tap(() => {
                // Update the asset if it's selected
                this._asset.next(updatedAsset);

                // Return the updated asset
                return updatedAsset;
              })
            )
          )
        )
      )
    );
  }

  /**
   * Delete the product
   *
   * @param _id
   */
  deleteAsset(_id: string): Observable<boolean> {
    return this.assets$.pipe(
      take(1),
      switchMap((assets) =>
        this._httpClient.delete(`${this._baseUrl}/asset/${_id}`).pipe(
          map((isDeleted: boolean) => {
            // Find the index of the deleted asset
            const index = assets.findIndex((item) => item._id === _id);

            // Delete the product
            assets.splice(index, 1);

            // Update the assets
            this._assets.next(assets);

            // Return the deleted status
            return isDeleted;
          })
        )
      )
    );
  }

  //Get All Asset Tpyes field
  getAssetTyes() {
    return this._httpClient.get<IDTO>(`${this._baseUrl}/asset-type/types`).pipe(
      tap((response: IDTO) => {
        this._assetTypes.next(response.data);
      })
    );
  }
}
