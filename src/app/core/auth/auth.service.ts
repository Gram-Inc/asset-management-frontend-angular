import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthUtils } from "./auth.utils";
import { IUser } from "../user/user.types";
import { UserService } from "../user/user.service";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {
  // private _authenticated: boolean = false;
  private _baseUrl = environment.baseUrl;
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient, private _userService: UserService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem("accessToken", token);
  }

  get accessToken(): string {
    return localStorage.getItem("accessToken") ?? "";
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post("api/auth/forgot-password", email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(data: { id: string; password: string }): Observable<any> {
    return this._httpClient.put(this._baseUrl + "/auth/reset-password", data);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this.accessToken) {
      return throwError("User is already logged in.");
    }

    return this._httpClient.post(this._baseUrl + "/auth/login", credentials).pipe(
      switchMap((response: any) => {
        // Store the access token in the local storage
        this.accessToken = response.data.accessToken;

        // Set the authenticated flag to true
        // this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.data.user;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Renew token
    return this._httpClient.get<IUser>(this._baseUrl + "/users/current-user").pipe(
      catchError(() =>
        // Return false
        of(false)
      ),
      switchMap((response: any) => {
        // Store the user on the user service
        this._userService.user = response.data;

        // Return true
        return of(true);
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem("accessToken");
    this._userService.user = null;
    // Set the authenticated flag to false
    // this._authenticated = false;
    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    departmentId: string;
  }): Observable<any> {
    return this._httpClient.post(this._baseUrl + "/auth/sign-up", user);
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post("api/auth/unlock-session", credentials);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this.accessToken) {
      return this.signInUsingToken();
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    // if (AuthUtils.isTokenExpired(this.accessToken)) {
    //   return of(false);
    // }

    // If the access token exists and it didn't expire, sign in using it
    // return this.signInUsingToken();
    return of(false);
  }

  // Check for accessing Ticket Section
  checkTicket(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }

  // Check for accessing Asset Section
  checkAsset(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }

  // Check for accessing Ticket Section
  checkUser(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }
  // Check for accessing UAM Section
  checkUAM(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }

  // Check for accessing Vendor Section
  checkVendor(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }

  // Check for accessing Branch Section
  checkBranch(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }

  // Check for accessing Report Section
  checkReport(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }

  // Check for accessing Setting Section
  checkSetting(): Observable<boolean> {
    return this._userService.user$.pipe(
      switchMap((value) => {
        if (value.role == "level1" || value.role == "level2") return of(true);
        return of(false);
      })
    );
  }
}
