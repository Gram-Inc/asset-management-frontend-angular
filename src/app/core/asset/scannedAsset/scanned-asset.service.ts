import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../../dto/dto.types";
import { IAsset, IPagination } from "../asset.types";
import { IScannedAsset } from "./scanned-asset.types";

@Injectable({
  providedIn: "root",
})
export class ScannedAssetService {
  private _baseUrl = environment.baseUrl;
  private _scannedAssets: BehaviorSubject<IScannedAsset[]> = new BehaviorSubject<IScannedAsset[]>([]);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
   * Getter For Scanned Assets
   */
  get ScannedAssets$() {
    return this._scannedAssets.asObservable();
  }

  /**
  Getter For Pagination
  */
  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }

  getScannedAssets(
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    type: string = "",
    order: "asc" | "desc" = "desc",
    sort: string = "name"
  ): Observable<IDTO> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/exe-agent/paginate`, {
        params: {
          page: "" + page,
          limit: "" + limit,
          type: type,
          searchText: searchText,
        },
      })
      .pipe(
        tap((response) => {
          this._scannedAssets.next(response.data);

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

  moveAssetToPool(assetId: string, assetType: "laptop" | "server" | "pc"): Observable<IDTO> {
    return this._scannedAssets.pipe(
      take(1),
      switchMap((scannedAssets) => {
        return this._httpClient
          .put<IDTO>(`${this._baseUrl}/exe-agent/move-to-in-pull`, {
            type: assetType,
            id: assetId,
          })
          .pipe(
            map((response) => {
              //Find from the Scanned Asset List
              const index = scannedAssets.findIndex((ast) => ast._id == assetId);

              //Remove Asset From list
              scannedAssets.splice(index, 1);

              //Update the Assets Subject
              this._scannedAssets.next(scannedAssets);

              //Return the Udpated Asset
              return response;
            })
          );
      })
    );
  }

  removeAssetFromScanned(assetId: string): Observable<IDTO> {
    return this._scannedAssets.pipe(
      take(1),
      switchMap((scannedAssets) => {
        return this._httpClient.delete<IDTO>(`${this._baseUrl}/exe-agent/${assetId}`).pipe(
          map((response) => {
            //Find from the Scanned Asset List
            const index = scannedAssets.findIndex((ast) => ast._id == assetId);
            //Remove Asset From list
            scannedAssets.splice(index, 1);

            //Update the Assets Subject
            this._scannedAssets.next(scannedAssets);

            //Return the Udpated Asset
            return response;
          })
        );
      })
    );
  }
}
