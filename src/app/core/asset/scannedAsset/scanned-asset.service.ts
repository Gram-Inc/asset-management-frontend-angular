import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../../dto/dto.types";
import { IAsset, IPagination } from "../asset.types";

@Injectable({
  providedIn: "root",
})
export class ScannedAssetService {
  private _baseUrl = environment.baseUrl;
  private _scannedAssets: BehaviorSubject<IAsset[]> = new BehaviorSubject<IAsset[]>([]);
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
      .get<IDTO>(`${this._baseUrl}/asset/paginate`, {
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

  moveAssetTo(assetId: string, type: "Remove" | "Pool") {
    return this._scannedAssets.pipe(
      take(1),
      switchMap((scannedAssets) => {
        return this._httpClient.put<IDTO>(`${this._baseUrl}`, {}).pipe(
          map((response) => {
            //Find from the Scanned Asset List
            const index = scannedAssets.findIndex((ast) => ast._id == assetId);

            //Update the Asset
            scannedAssets[index] = response.data;

            //Update the Assets Subject
            this._scannedAssets.next(scannedAssets);

            //Return the Udpated Asset
            return response.data;
          })
        );
      })
    );
  }
}
