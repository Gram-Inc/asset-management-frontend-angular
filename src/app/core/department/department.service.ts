import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IDepartment } from "./department.types";

@Injectable({
   providedIn: "root",
})
export class DepartmentService
{
   private _baseUrl = environment.baseUrl;

   private _departments: BehaviorSubject<IDepartment[] | null> = new BehaviorSubject<IDepartment[]>([]);
   private _department: BehaviorSubject<IDepartment | null> = new BehaviorSubject<IDepartment | null>(null);

   constructor(private _httpClient: HttpClient) { }

   get departments$(): Observable<IDepartment[]>
   {
      return this._departments.asObservable();
   }

   get department$(): Observable<IDepartment> {
      return this._department.asObservable();
   }

   clrDepartment() {
      this._department.next(null);
   }

   createDepartment(department: IDepartment): Observable<IDepartment> {
      delete department._id;
      return this.departments$.pipe(
         take(1),
         switchMap((depts) =>
            this._httpClient.post(`${this._baseUrl}/department`, department).pipe(
               map((newDepartment: IDTO) => {
                  this._departments.next([...depts, newDepartment.data]);
                  return newDepartment.data;
               })
            )
         )
      );
   }

   getDepartments(search: string = ""): Observable<IDTO> {
      return this._httpClient.get<IDTO>(`${this._baseUrl}/department`, { params: { search: search } }).pipe(
         tap((response: IDTO) => {
            this._departments.next(response.data);
         })
      );
   }

   getDepartmentById(id: string): Observable<IDepartment> {
      return this._departments.pipe(
         take(1),
         switchMap((departments) => {
            const dept = departments.find((d) => d._id == id);
            if (dept) {
               this._department.next(dept);
               return of(dept);
            }
            return this._httpClient.get<IDTO>(`${this._baseUrl}/department/${id}`).pipe(
               map((response: IDTO) => {
                  const department = response.data;
                  this._department.next(department);
                  return department;
               })
            );
         })
      );
   }

   updateDepartment(_id: string, department: IDepartment): Observable<any> {
      delete department._id;
      return this.departments$.pipe(
         take(1),
         switchMap((departments) =>
            this._httpClient.put<IDTO>(`${this._baseUrl}/department/${_id}`, department).pipe(
               map((response: IDTO) => {
                  const updatedDepartment = response.data;
                  const index = departments.findIndex((d) => d._id === _id);
                  if (index !== -1) {
                     departments[index] = updatedDepartment;
                  }
                  this._departments.next(departments);
                  return updatedDepartment;
               }),
               switchMap((updatedDepartment) =>
                  this.department$.pipe(
                     take(1),
                     filter((d) => d && d._id === _id),
                     tap(() => {
                        this._department.next(updatedDepartment);
                        return updatedDepartment;
                     })
                  )
               )
            )
         )
      );
   }

   deleteDepartment(_id: string): Observable<boolean> {
      return this.departments$.pipe(
         take(1),
         switchMap((departments) =>
            this._httpClient.delete<IDTO>(`${this._baseUrl}/department/${_id}`).pipe(
               map((response: IDTO) => {
                  const index = departments.findIndex((d) => d._id === _id);
                  if (index !== -1) {
                     departments.splice(index, 1);
                     this._departments.next(departments);
                  }
                  return true;
               })
            )
         )
      );
   }
}
