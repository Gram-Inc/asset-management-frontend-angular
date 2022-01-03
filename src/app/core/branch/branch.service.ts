import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDTO } from "../dto/dto.types";
import { IBranch } from "./branch.types";

@Injectable({
  providedIn: "root",
})
export class BranchService {
  private _baseUrl = environment.baseUrl;

  private _branchs: BehaviorSubject<IBranch[] | null> = new BehaviorSubject<IBranch[] | null>(null);
  private _branch: BehaviorSubject<IBranch | null> = new BehaviorSubject<IBranch | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
  Getter For Assets
  */
  get branchs$(): Observable<IBranch[]> {
    return this._branchs.asObservable();
  }

  /**
  Getter For Asset
  */
  get branch$(): Observable<IBranch> {
    return this._branch.asObservable();
  }

  clrBranch() {
    this._branch.next(null);
  }

  createBranch(branch: IBranch): Observable<IBranch> {
    delete branch._id;
    return this.branchs$.pipe(
      take(1),
      switchMap((brnh) =>
        this._httpClient.post(`${this._baseUrl}/branch`, branch).pipe(
          map((newBranch: IDTO) => {
            this._branchs.next([...brnh, newBranch.data]);
            return newBranch.data;
          })
        )
      )
    );
  }

  getBranchs(): Observable<IDTO> {
    return this._httpClient.get<IDTO>(`${this._baseUrl}/branch/paginate`).pipe(
      tap((response: IDTO) => {
        this._branchs.next(response.data);
      })
    );
  }

  getBranchById(id: string): Observable<IBranch> {
    return this._branchs.pipe(
      take(1),
      map((branchs) => {
        const ast = branchs.find((brn) => brn._id == id || null);
        this._branch.next(ast);
        return ast;
      }),
      switchMap((brn) => {
        if (!brn) {
          return throwError("Could not found Branch with id of " + id + "!");
        }
        return of(brn);
      })
    );
  }

  /**
   * Update branch
   *
   * @param _id
   * @param branch
   */
  updateBranch(_id: string, branch: IBranch): Observable<any> {
    delete branch._id;
    return this.branchs$.pipe(
      take(1),
      switchMap((branchs) =>
        this._httpClient.put<IBranch>(`${this._baseUrl}/branch/${_id}`, branch).pipe(
          map((updatedBranch) => {
            // Find the index of the updated branch
            const index = branchs.findIndex((brn) => brn._id === _id);

            // Update the branch
            branchs[index] = updatedBranch;

            this._branchs.next(branchs);

            // Return the updated
            return updatedBranch;
          }),
          switchMap((updatedBranch) =>
            this.branch$.pipe(
              take(1),
              filter((brn) => brn && brn._id === _id),
              tap(() => {
                // Update the branch if it's selected
                this._branch.next(updatedBranch);

                // Return the updated branch
                return updatedBranch;
              })
            )
          )
        )
      )
    );
  }
}
