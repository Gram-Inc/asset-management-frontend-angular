import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import {
  IAudit,
  IAuditAsset,
  IAuditProgress,
  IAuditStatistics,
  IDepartmentAuditHistory,
  ICreateAuditDto,
  ICompleteAuditDto,
  IPagination,
} from "./audit.types";

@Injectable({
  providedIn: "root",
})
export class AuditService {
  private _baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}

  createAudit(audit: ICreateAuditDto): Observable<IAudit> {
    return this._httpClient
      .post<IDTO>(`${this._baseUrl}/audit`, audit)
      .pipe(map((response: IDTO) => response.data));
  }

  getAudits(query?: any): Observable<IAudit[]> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit`, { params: query || {} })
      .pipe(map((response: IDTO) => response.data));
  }

  getAuditsPaginated(
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    status?: string,
    branchId?: string,
    departmentId?: string
  ): Observable<IDTO> {
    const params: any = {
      page: "" + page,
      limit: "" + limit,
      searchText: searchText,
    };
    if (status) params.status = status;
    if (branchId) params.branchId = branchId;
    if (departmentId) params.departmentId = departmentId;

    return this._httpClient.get<IDTO>(`${this._baseUrl}/audit/paginate`, {
      params,
    });
  }

  getAuditById(id: string): Observable<IAudit> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit/${id}`)
      .pipe(map((response: IDTO) => response.data));
  }

  getAuditProgress(id: string): Observable<IAuditProgress> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit/${id}/progress`)
      .pipe(map((response: IDTO) => response.data));
  }

  getAuditAssets(id: string): Observable<IAuditAsset[]> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit/${id}/assets`)
      .pipe(map((response: IDTO) => response.data));
  }

  assignUser(auditId: string, userId: string): Observable<IAudit> {
    return this._httpClient
      .put<IDTO>(`${this._baseUrl}/audit/${auditId}/assign`, { userId })
      .pipe(map((response: IDTO) => response.data));
  }

  completeAudit(
    auditId: string,
    completeDto: ICompleteAuditDto
  ): Observable<IAudit> {
    return this._httpClient
      .put<IDTO>(`${this._baseUrl}/audit/${auditId}/complete`, completeDto)
      .pipe(map((response: IDTO) => response.data));
  }

  updateAudit(auditId: string, updateDto: { name?: string }): Observable<IAudit> {
    return this._httpClient
      .put<IDTO>(`${this._baseUrl}/audit/${auditId}`, updateDto)
      .pipe(map((response: IDTO) => response.data));
  }

  getAuditStatistics(): Observable<IAuditStatistics> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit/statistics/overview`)
      .pipe(map((response: IDTO) => response.data));
  }

  getDepartmentAuditHistory(): Observable<IDepartmentAuditHistory[]> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit/department-history`)
      .pipe(map((response: IDTO) => response.data));
  }

  getMissingAssets(): Observable<any[]> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/audit/missing-assets`)
      .pipe(map((response: IDTO) => response.data));
  }

  // Mobile API methods
  getAuditsForMobile(): Observable<IAudit[]> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/mobile/audit`)
      .pipe(map((response: IDTO) => response.data));
  }

  getAuditForMobile(id: string): Observable<{ audit: IAudit; assets: IAuditAsset[] }> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/mobile/audit/${id}`)
      .pipe(map((response: IDTO) => response.data));
  }

  getAuditAssetsForMobile(id: string): Observable<IAuditAsset[]> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/mobile/audit/${id}/assets`)
      .pipe(map((response: IDTO) => response.data));
  }

  scanAsset(
    auditId: string,
    assetId: string,
    comment?: string
  ): Observable<IAuditAsset> {
    return this._httpClient
      .post<IDTO>(`${this._baseUrl}/mobile/audit/${auditId}/scan`, {
        assetId,
        comment,
      })
      .pipe(map((response: IDTO) => response.data));
  }

  completeAuditFromMobile(
    auditId: string,
    completeDto: ICompleteAuditDto
  ): Observable<IAudit> {
    return this._httpClient
      .put<IDTO>(`${this._baseUrl}/mobile/audit/${auditId}/complete`, completeDto)
      .pipe(map((response: IDTO) => response.data));
  }
}
