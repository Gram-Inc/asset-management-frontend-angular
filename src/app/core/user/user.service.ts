import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, of, BehaviorSubject } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IPagination } from "../asset/asset.types";
import { IDTO } from "../dto/dto.types";
import { IUser } from "./user.types";
@Injectable({
  providedIn: "root",
})
export class UserService {
  private _baseUrl = environment.baseUrl;

  private _user: ReplaySubject<IUser> = new ReplaySubject<IUser>(1);
  private _users: BehaviorSubject<IUser[] | null> = new BehaviorSubject<IUser[] | null>(null);
  private _pagination: BehaviorSubject<IPagination | null> = new BehaviorSubject<IPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
   *   @param value
   **/
  set user(value: IUser) {
    this._user.next(value);
  }

  get user$(): Observable<IUser> {
    return this._user.asObservable();
  }

  get users$(): Observable<IUser[]> {
    return this._users.asObservable();
  }

  get pagination$(): Observable<IPagination> {
    return this._pagination.asObservable();
  }
  // /* Get current logged in user data */
  /**
   * Get the current logged in user data
   */
  get(): Observable<IUser> {
    return this._httpClient.get<any>(this._baseUrl + "/users/current-user").pipe(
      tap((res) => {
        this._user.next(res.data);
      })
    );
  }

  getUsers(page: number = 1, limit: number = 10, searchText: string = "") {
    return this._httpClient
      .get<IDTO>(`${this._baseUrl}/users/paginate`, {
        params: {
          searchText: searchText,
          limit: limit,
          page: page,
        },
      })
      .pipe(
        tap((response: IDTO) => {
          this._users.next(response.data);

          let _pg: IPagination = {
            limit: response.limit,
            page: response.page - 1, //@badalkhatri
            totalPage: response.totalPage,
            totalData: response.totaldata,
          };
          console.log(response);
          this._pagination.next(_pg);
        })
      );
  }

  /**
   * Create tag
   *
   * @param user
   */
  createUser(user: IUser): Observable<IUser> {
    delete user._id;
    return this.users$.pipe(
      take(1),
      switchMap((users) =>
        this._httpClient.post<IDTO>(`${this._baseUrl}/auth/sign-up`, user).pipe(
          map((response) => {
            // Update the tags with the new tag
            this._users.next([...users, response.data]);
            // Return new tag from observable
            return response.data;
          })
        )
      )
    );
  }

  /**
   * Update user
   *
   * @param _id
   * @param ast
   */
  updateUser(_id: string, ast: IUser): Observable<IUser> {
    delete ast._id;
    return this.users$.pipe(
      take(1),
      switchMap((users) =>
        this._httpClient.put<IUser>(`${this._baseUrl}/users/${_id}`, ast).pipe(
          map((updatedUser) => {
            // Find the index of the updated user
            const index = users.findIndex((item) => item._id === _id);

            // Update the user
            users[index] = updatedUser;

            // Update the users
            this._users.next(users);

            // Return the updated user
            return updatedUser;
          }),
          switchMap((updatedUser) =>
            this.user$.pipe(
              take(1),
              filter((asmnt) => asmnt && asmnt._id === _id),
              tap(() => {
                // Update the user if it's selected
                this._user.next(updatedUser);

                // Return the updated user
                return updatedUser;
              })
            )
          )
        )
      )
    );
  }
}
