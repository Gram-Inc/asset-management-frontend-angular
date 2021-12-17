import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { IAssignment } from "./assignment.types";

@Injectable({
  providedIn: "root",
})
export class AssignmentService {
  private _baseUrl = environment.baseUrl;
  private _assignments: BehaviorSubject<IAssignment[] | null> = new BehaviorSubject<IAssignment[] | null>(
    null
  );
  private _assignment: BehaviorSubject<IAssignment | null> = new BehaviorSubject<IAssignment | null>(null);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  get assignments$(): Observable<IAssignment[]> {
    return this._assignments.asObservable();
  }

  get assignment$(): Observable<IAssignment> {
    return this._assignment.asObservable();
  }

  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }

  createAssignment(assignment: IAssignment) {
    delete assignment._id; //@Badal
    return this._assignments.pipe(
      take(1),
      switchMap((assignments) =>
        this._httpClient.post(`${this._baseUrl}/assignment`, assignment).pipe(
          map((newAssignment: IDTO) => {
            this._assignments.next([...assignments, newAssignment.data]);
            return newAssignment.data;
          })
        )
      )
    );
  }

  /**
   * Update assignment
   *
   * @param _id
   * @param asgmnt
   */
  updateAssignment(_id: string, asgmnt: IAssignment): Observable<IAssignment> {
    delete asgmnt._id; //Badal
    return this.assignments$.pipe(
      take(1),
      switchMap((assignments) =>
        this._httpClient.put<IAssignment>(`${this._baseUrl}/assignment/${_id}`, asgmnt).pipe(
          map((updatedAssignment) => {
            // Find the index of the updated assignment
            const index = assignments.findIndex((item) => item._id === _id);

            // Update the assignment
            assignments[index] = updatedAssignment;

            // Update the assignments
            this._assignments.next(assignments);

            // Return the updated assignment
            return updatedAssignment;
          }),
          switchMap((updatedAssignment) =>
            this.assignment$.pipe(
              take(1),
              filter((asmnt) => asmnt && asmnt._id === _id),
              tap(() => {
                // Update the assignment if it's selected
                this._assignment.next(updatedAssignment);

                // Return the updated assignment
                return updatedAssignment;
              })
            )
          )
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
  getAssignments(
    page: number = 1,
    limit: number = 10,
    searchText: string = "",
    type: string = "",
    allocationStatus: string = ""
    // order: "asc" | "desc" | "" = "desc"
    // sort: string = "name"
  ): Observable<IDTO> {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/assignment/paginate`, {
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
          this._assignments.next(response.data);

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

  getAssignmentById(id: string): Observable<IAssignment> {
    return this._assignments.pipe(
      take(1),
      map((assignments) => {
        const ast = assignments.find((asg) => asg._id == id || null);

        this._assignment.next(ast);

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
