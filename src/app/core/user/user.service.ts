import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, of } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "./user.types";
@Injectable({
  providedIn: "root",
})
export class UserService {
  private _baseUrl = "http://65.0.136.73/";

  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor(private _http: HttpClient) {}

  /**
   *   @param value
   **/
  set user(value: User) {
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  // /* Get current logged in user data */
  /**
   * Get the current logged in user data
   */
  get(): Observable<User> {
    // return of({
    //   firstName: "Govind",
    //   lastName: "ram",
    //   isActive: "true",
    //   _id: "61530841e0e17d60b3e8c0a3",
    //   email: "gram@gmail.com",
    // });
    return this._http.get<User>(this._baseUrl + "users/current-user").pipe(
      tap((user) => {
        this._user.next(user);
      })
    );
  }
}
