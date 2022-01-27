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
import { AuthService } from "./auth.service";
import { AuthUtils } from "./auth.utils";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

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

    // Response
    return next.handle(newReq).pipe(
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
