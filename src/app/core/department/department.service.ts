import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IDepartment } from "./department.types";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  private baseUrl = environment.baseUrl;

  private _departments: BehaviorSubject<IDepartment[] | null> = new BehaviorSubject<IDepartment[] | null>(
    null
  );
  constructor(private _httpClient: HttpClient) {}

  get departments$(): Observable<IDepartment[]> {
    return this._departments.asObservable();
  }

  getDepartments(search: string = "") {
    return this._httpClient
      .get<IDTO>(`${this.baseUrl}/department`, { params: { search: search } })
      .pipe(tap((response: IDTO) => this._departments.next(response.data)));
  }
}
