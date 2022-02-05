import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { IUAM } from "./uam.types";

@Injectable({
   providedIn: "root",
})
export class UamService
{
   private _baseUrl = environment.baseUrl;

   private _uams: BehaviorSubject<IUAM[] | null> = new BehaviorSubject<IUAM[]>([]);
   private _uam: BehaviorSubject<IUAM | null> = new BehaviorSubject<IUAM | null>(null);

   private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

   constructor(private _httpClient: HttpClient) { }

   /**
   Getter For UAMS
   */
   get uams$(): Observable<IUAM[]>
   {
      return this._uams.asObservable();
   }

   /**
   Getter For Pagination
   */
   get pagination$(): Observable<IPagination>
   {
      return this._pagination.asObservable();
   }

   /**
   Getter For UAM
   */
   get uam$(): Observable<IUAM>
   {
      return this._uam.asObservable();
   }

   clrUAM()
   {
      this._uam.next(null);
   }

   createUAM(uam: IUAM): Observable<IUAM>
   {
      delete uam._id;
      return this.uams$.pipe(
         take(1),
         switchMap((uams) =>
            this._httpClient.post(`${this._baseUrl}/user-access-management`, uam).pipe(
               map((newUAM: IDTO) =>
               {
                  this._uams.next([...uams, newUAM.data]);
                  return newUAM.data;
               })
            )
         )
      );
   }

   /**
    * @param page
    * @param limit
    * @param searchText
    */
   getUAMS(
      page: number = 1,
      limit: number = 10,
      searchText: string = "",
      type: string = "",
      allocationStatus: string = "",
      order: "asc" | "desc" | "" = "desc",
      sort: string = "name"
   ): Observable<IDTO>
   {
      return this._httpClient
         .get<IDTO>(`${this._baseUrl}/user-access-management/paginate`, {
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
            tap((response: IDTO) =>
            {
               this._uams.next(response.data);
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

   getUAMById(id: string): Observable<IUAM>
   {
      return this._uams.pipe(
         take(1),
         map((uams) =>
         {
            const uam = uams.find((uam) => uam._id == id || null);

            this._uam.next(uam);

            return uam;
         }),
         switchMap((uam) =>
         {
            if (!uam)
            {
               return throwError("Could not found UAM with id of " + id + "!");
            }

            return of(uam);
         })
      );
   }

   /**
    * Update UAM
    *
    * @param _id
    * @param uam
    */
   updateAsset(_id: string, uam: IUAM): Observable<any>
   {
      return this.uams$.pipe(
         take(1),
         switchMap((uams) =>
            this._httpClient.put<IUAM>(`${this._baseUrl}/user-access-management/${_id}`, uam).pipe(
               map((updatedUAM) =>
               {
                  // Find the index of the updated uam
                  const index = uams.findIndex((uam) => uam._id === _id);

                  // Update the uam
                  uams[index] = updatedUAM;

                  // Update the uams
                  this._uams.next(uams);

                  // Return the updated uam
                  return updatedUAM;
               }),
               switchMap((updatedUAM) =>
                  this.uam$.pipe(
                     take(1),
                     filter((uam) => uam && uam._id === _id),
                     tap(() =>
                     {
                        // Update the uam if it's selected
                        this._uam.next(updatedUAM);

                        // Return the updated uam
                        return updatedUAM;
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
   deleteUAM(_id: string): Observable<boolean>
   {
      return this.uams$.pipe(
         take(1),
         switchMap((uams) =>
            this._httpClient.delete(`${this._baseUrl}/uam/${_id}`).pipe(
               map((isDeleted: boolean) =>
               {
                  // Find the index of the deleted uam
                  const index = uams.findIndex((uam) => uam._id === _id);

                  // Delete the product
                  uams.splice(index, 1);

                  // Update the uams
                  this._uams.next(uams);

                  // Return the deleted status
                  return isDeleted;
               })
            )
         )
      );
   }
}
