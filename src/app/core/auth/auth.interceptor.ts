import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { AuthService } from "./auth.service";
import { AuthUtils } from "./auth.utils";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private _loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Clone the HTTP Request
    let newReq = req.clone();

    //Check for Authorization and Token Expiry
    if (this.authService.accessToken) {
      const hde = new HttpHeaders({
        Authorization: "Bearer " + this.authService.accessToken,
      });
      newReq = req.clone({
        headers: hde,
      });
    }
    // Set the loading status to true
    this._loadingService._setLoadingStatus(true, req.url);

    // Response
    return next.handle(newReq).pipe(
      finalize(() => {
        // Set the status to false if there are any errors or the request is completed
        this._loadingService._setLoadingStatus(false, req.url);
      }),
      catchError((error) => {
        // Catch "401 Unauthorized" responses
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Sign out
          this.authService.signOut();
          // Reload the app
          location.reload();
        }

        return throwError(error);
      })
    );
  }
}
